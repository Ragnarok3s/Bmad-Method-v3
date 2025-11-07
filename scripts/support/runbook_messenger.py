"""Runbook-driven messaging orchestrator for Slack and Microsoft Teams."""
from __future__ import annotations

import argparse
import json
import logging
import pathlib
import sys
import textwrap
import urllib.error
import urllib.request
from dataclasses import dataclass, field
from typing import Dict, Mapping, MutableMapping, Optional

logger = logging.getLogger("runbook_messenger")


def load_template_block(runbook_path: pathlib.Path) -> Dict[str, Dict[str, str]]:
    """Extract the structured template block from a runbook file."""
    data = runbook_path.read_text(encoding="utf-8")
    block_lines = []
    capturing = False
    for line in data.splitlines():
        stripped = line.strip()
        if not capturing and stripped.startswith("```json") and "runbook_templates" in stripped:
            capturing = True
            continue
        if capturing and stripped.startswith("```"):
            break
        if capturing:
            block_lines.append(line)

    if not block_lines:
        raise ValueError(
            f"Runbook '{runbook_path}' does not contain a JSON block named 'runbook_templates'."
        )

    block = "\n".join(block_lines)
    try:
        payload = json.loads(block)
    except json.JSONDecodeError as exc:
        raise ValueError(
            f"Unable to parse JSON templates from runbook '{runbook_path}': {exc}"
        ) from exc

    templates = payload.get("templates")
    if not isinstance(templates, dict):
        raise ValueError(
            f"Runbook '{runbook_path}' must define a 'templates' object with channel-specific messages."
        )

    # Normalise keys so we can accept `Slack` or `slack` etc.
    normalised: Dict[str, Dict[str, str]] = {}
    for stage, stage_templates in templates.items():
        if not isinstance(stage_templates, Mapping):
            raise ValueError(
                f"Stage '{stage}' in runbook '{runbook_path}' must map to a dictionary of channel templates."
            )
        normalised[stage.lower()] = {
            channel.lower(): str(message)
            for channel, message in stage_templates.items()
        }

    return normalised


@dataclass
class MessengerConfig:
    runbook: pathlib.Path
    channel: str
    stage: str
    context: Dict[str, str] = field(default_factory=dict)
    webhook_url: Optional[str] = None
    dry_run: bool = False

    @classmethod
    def from_args(cls, argv: Optional[Mapping[str, str]] = None) -> "MessengerConfig":
        parser = argparse.ArgumentParser(
            description=(
                "Render and optionally dispatch incident communications based on the communication "
                "runbook templates."
            )
        )
        parser.add_argument(
            "--runbook",
            type=pathlib.Path,
            default=pathlib.Path("quality/observability/runbooks/communication-post-incident.md"),
            help="Path to the markdown runbook that contains the communication templates.",
        )
        parser.add_argument(
            "--channel",
            choices=["slack", "teams"],
            required=True,
            help="Target collaboration channel for the message.",
        )
        parser.add_argument(
            "--stage",
            required=True,
            help="Runbook stage to render (e.g. initial_update, resolution, follow_up).",
        )
        parser.add_argument(
            "--context",
            type=pathlib.Path,
            help="Optional path to a JSON file containing merge fields for the template.",
        )
        parser.add_argument(
            "--var",
            action="append",
            default=[],
            metavar="KEY=VALUE",
            help="Inline key/value pairs to include in the template context.",
        )
        parser.add_argument(
            "--webhook-url",
            dest="webhook_url",
            help="Optional incoming webhook URL to deliver the rendered message.",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Render the message without invoking any webhook.",
        )
        parser.add_argument(
            "--verbose",
            action="store_true",
            help="Enable debug logging output.",
        )

        args = parser.parse_args(argv)

        logging.basicConfig(level=logging.DEBUG if args.verbose else logging.INFO)
        logger.debug("Parsed CLI arguments: %s", args)

        context: MutableMapping[str, str] = {}
        if args.context:
            try:
                with args.context.open("r", encoding="utf-8") as handle:
                    context_data = json.load(handle)
                if not isinstance(context_data, Mapping):
                    raise ValueError("Context JSON must be an object with key/value pairs.")
                context.update({str(k): str(v) for k, v in context_data.items()})
            except OSError as exc:
                raise RuntimeError(f"Unable to read context file '{args.context}': {exc}") from exc

        for item in args.var:
            if "=" not in item:
                raise ValueError(f"Invalid --var entry '{item}'. Expected format KEY=VALUE.")
            key, value = item.split("=", 1)
            context[key.strip()] = value.strip()

        return cls(
            runbook=args.runbook,
            channel=args.channel.lower(),
            stage=args.stage.lower(),
            context=dict(context),
            webhook_url=args.webhook_url,
            dry_run=bool(args.dry_run),
        )


def render_message(config: MessengerConfig) -> str:
    templates = load_template_block(config.runbook)
    logger.debug("Available runbook stages: %s", list(templates))

    stage_templates = templates.get(config.stage)
    if not stage_templates:
        raise KeyError(
            f"Stage '{config.stage}' not found in runbook '{config.runbook}'. "
            f"Available stages: {', '.join(sorted(templates)) or 'none'}"
        )

    template = stage_templates.get(config.channel)
    if template is None:
        raise KeyError(
            f"Channel '{config.channel}' not defined for stage '{config.stage}' in runbook '{config.runbook}'."
        )

    try:
        rendered = template.format_map(DefaultDict(config.context))
    except KeyError as exc:
        missing_key = exc.args[0]
        raise KeyError(
            f"Missing context value '{missing_key}'. Provide it via --var or the context JSON file."
        ) from exc

    logger.debug("Rendered message: %s", rendered)
    return rendered.strip()


@dataclass
class DefaultDict(dict):
    data: Mapping[str, str]

    def __post_init__(self) -> None:
        super().__init__(self.data)

    def __missing__(self, key: str) -> str:
        return "{{" + key + "}}"


SLACK_HEADERS = {"Content-Type": "application/json"}
TEAMS_HEADERS = {"Content-Type": "application/json"}


def dispatch_message(config: MessengerConfig, message: str) -> None:
    if not config.webhook_url:
        logger.info("No webhook configured. Printing message to stdout.")
        print(message)
        return

    if config.dry_run:
        logger.info("Dry run enabled. Skipping webhook delivery.")
        print(message)
        return

    payload: Dict[str, str]
    headers: Dict[str, str]
    if config.channel == "slack":
        payload = {"text": message}
        headers = SLACK_HEADERS
    else:
        payload = {"type": "message", "text": message}
        headers = TEAMS_HEADERS

    request = urllib.request.Request(
        config.webhook_url,
        data=json.dumps(payload).encode("utf-8"),
        headers=headers,
    )

    try:
        with urllib.request.urlopen(request) as response:
            body = response.read().decode("utf-8")
            logger.debug("Webhook response status=%s body=%s", response.status, body)
            if 200 <= response.status < 300:
                logger.info("Message dispatched successfully to %s.", config.channel)
            else:
                raise RuntimeError(
                    f"Webhook returned unexpected status {response.status}: {body}"
                )
    except urllib.error.URLError as exc:
        raise RuntimeError(f"Failed to send webhook message: {exc}") from exc


def main(argv: Optional[list[str]] = None) -> int:
    try:
        config = MessengerConfig.from_args(argv)
        logger.debug("Messenger configuration: %s", config)
        message = render_message(config)
        dispatch_message(config, message)
        return 0
    except Exception as exc:  # pragma: no cover - CLI guardrail
        logger.error("Automation failed: %s", exc)
        logger.debug("", exc_info=exc)
        print(
            textwrap.dedent(
                f"""
                Error: {exc}

                Review the runbook at {pathlib.Path('quality/observability/runbooks/communication-post-incident.md').resolve()} \
                and ensure the requested stage/channel combination is defined. Use --verbose for more details.
                """
            ).strip()
        )
        return 1


if __name__ == "__main__":
    sys.exit(main())
