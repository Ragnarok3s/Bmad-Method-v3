# Compliance Evidence Versioning

This directory centralises the compliance evidence that must be attached to every production release. The goal is to provide a
repeatable routine where each deployment has a discoverable manifest, curated evidence bundle, and automated validation.

## Repository Structure

```
docs/compliance/releases/
  vYYYY.MM.DD/              # Release folder (example: v2024.08.15)
    release.toml            # Metadata describing the release
    evidence/               # Supporting artefacts (PDF, CSV, screenshots, exports)
      runbook-signoff.pdf
      change-approval.csv
```

## Workflow

1. **Create the release folder** using the semantic or calendar version adopted by the release train.
2. **Populate `release.toml`** with:
   - `version`: Matches the folder name.
   - `date`: ISO-8601 date (UTC).
   - `change_window`: Maintenance window reference.
   - `owner`: Squad or role responsible for the release.
   - `approvers`: List of reviewers that signed the change.
   - `tickets`: Incident/change ticket identifiers.
   - `evidence`: Array with relative paths to the artefacts stored in `./evidence`.
3. **Store evidence files** under the `evidence/` directory. Organise files to match the entries declared in `release.toml`.
4. **Run the validator** (`scripts/compliance/verify_evidence.py`) locally or in CI to ensure manifests are complete.
5. **Attach the summary** to the release notes referencing the manifest hash for auditing.

## Example `release.toml`

```toml
version = "v2024.08.15"
date = "2024-08-15"
change_window = "2024-08-15T01:00:00Z/2024-08-15T03:00:00Z"
owner = "Platform Engineering"
approvers = ["alice@example.com", "bob@example.com"]
tickets = ["CHG-1234", "JIRA-5678"]

[[evidence]]
path = "evidence/runbook-signoff.pdf"
description = "Runbook execution proof"

[[evidence]]
path = "evidence/change-approval.csv"
description = "CAB approvals exported from ServiceNow"
```

## Validation Script

The validator inspects every folder that matches the pattern `v*` and performs the following checks:

- `release.toml` exists and is parseable.
- All mandatory fields are present (`version`, `date`, `owner`, `approvers`, `tickets`, `evidence`).
- Each evidence entry references a file that exists on disk.
- Optional description fields are present for additional context.

Running the script locally:

```bash
python scripts/compliance/verify_evidence.py
```

A non-zero exit code indicates missing or inconsistent artefacts. Integrate the script in CI/CD to block releases without the
required documentation.
