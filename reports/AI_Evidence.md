# AI-use evidence — Assignment #04

- **Assistant:** ChatGPT, GPT-6
- **Date:** 6 November 2026
- **Project:** Smart Campus Room Availability Checker

## Context provided

The assignment PDF requirements; the uploaded Assignment #03 ZIP; the file inventory; the original `booking.py` and `test_booking.py`; and the limitation that the original frontend source export was not included in the archive.

## Prompt summaries

1. Inspect the existing project and identify what can be preserved for Assignment #04.
2. Propose a prioritized, incremental plan for the four-room catalogue, capacity/equipment filtering, refactoring and tests.
3. Implement separate room data, availability rules, room filtering, application orchestration and responsive UI modules.
4. Add executable regression, boundary, filtering and integration tests; run the original Python tests as well.
5. Review the results and prepare the report, README and evidence without inventing test results.

## Output used

- Five-room fictional catalogue with independent booking lists.
- Pure availability and filtering modules.
- Application service that resolves the selected room by ID.
- Responsive HTML/CSS/JavaScript interface.
- 26 Node tests and preservation of the original Python test suite.

## Problems or recommendations changed

- The archive did not contain the original frontend source, so the permitted equivalent minimal reconstruction was used rather than claiming to modify the missing source.
- Live system time was not used because the assignment specifies a fixed current time (09:00).
- Blocked rooms were not hidden; they remain visible and return an unavailable result.
- No test result was accepted from an AI-generated claim. Commands were executed in the project directory and output was saved under `evidence/`.

## Human verification

The room fixture fields, capacity predicate, all-items equipment predicate, time validation, overlap rule, immutable booking behavior, selected-room lookup and test outputs were reviewed. Full manual browser, physical-device, keyboard-only and screen-reader checks remain limitations.
