# Infrastructure Review Overview

This document summarizes the key activities outlined in the infrastructure review operating instructions.

## Interaction Modes

Before beginning the review, confirm the user's preferred collaboration approach:

- **Incremental (recommended):** Work through each checklist section methodically, documenting findings per item.
- **YOLO:** Perform a rapid assessment of all components and present a consolidated findings report.

## Preparation Checklist

Gather the following inputs prior to analysis:

1. Current infrastructure documentation
2. Monitoring and logging data
3. Recent incident reports
4. Cost and performance metrics
5. The canonical `infrastructure-checklist.md`

## Systematic Review Workflow

For each section of the checklist:

1. Present the section's focus area.
2. Examine each checklist item against the current infrastructure.
3. Record compliance status and supporting evidence.
4. Capture remediation notes for non-compliant items.
5. Identify cross-component dependencies and potential platform impacts.

## Platform Validation Emphasis

Ensure alignment with broader platform engineering requirements, including:

- Container platform provisioning and developer experience needs
- GitOps deployment automation
- Service mesh integration and reliability expectations
- Security, scalability, and performance mandates from architecture and product stakeholders

## Reporting Expectations

The final deliverable should include:

- Architecture design review results and recommendations
- Compliance percentages for each checklist section
- Detailed findings for any non-compliant items
- Platform integration validation outcomes
- Prioritized remediation recommendations
- Assessment of impacts on other BMad agents and workflows
- A clear sign-off recommendation and next steps for remediation or deployment

## Follow-Up Actions

When the review reveals outstanding issues, document remediation priorities, risks, and scheduling needs. Confirm that the Infrastructure Change Request status reflects the latest validation outcome.
