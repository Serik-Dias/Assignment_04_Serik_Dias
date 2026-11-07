# Software Engineering — Assignment #04

**Student:** Serik Dias  
**Student ID:** 24B032021  
**Project:** Smart Campus Room Availability Checker

## Overview

A small responsive, client-side application that filters a fictional campus room catalogue by capacity and equipment, then checks a selected room's own bookings. The demo time is fixed at **09:00 (540 minutes)**. It checks availability only; it never creates a booking.

The supplied Assignment #03 archive contained the Python availability function and tests, but did not contain the original web source export. The assignment permits reconstructing an equivalent minimal prototype. This submission therefore keeps the original Python baseline and regression suite, and provides a modular HTML/CSS/JavaScript implementation for the new room-catalogue requirements.

## Requirements covered

- AC1–AC5: integer same-day times, future start, 120-minute inclusive limit, blocked-room rejection, half-open overlap rule, and immutable booking data.
- AC6: clear result/validation feedback, labelled controls, live status region, keyboard focus styles and a narrow-screen layout.
- F1–F5: capacity and all-selected-equipment filtering, blocked-room rejection, empty state, and recalculation when the selected room changes.
- Five fictional rooms are included. Every room has an ID, name, capacity, equipment, blocked status and its own bookings.

## Project structure

```text
Assignment_04_Serik_Dias/
├── index.html
├── styles.css
├── package.json
├── booking.py                 # preserved Python baseline rule
├── test_booking.py            # preserved Python regression tests
├── baseline/                  # unchanged copies of the original Python files
├── src/
│   ├── data/rooms.js           # room catalogue and fixed demo time
│   ├── domain/availability.js  # time/booking rules and time formatting
│   ├── domain/roomFilters.js   # capacity/equipment filtering
│   ├── application/roomChecker.js # connects filtering and selected-room checks
│   └── ui/app.js               # DOM rendering and event handling
├── tests/
│   ├── availability.test.js
│   ├── filter.test.js
│   ├── integration.test.js
│   └── ui.test.js              # jsdom UI-behavior tests
├── evidence/
│   ├── node_tests.txt
│   └── python_regression_tests.txt
└── reports/
    ├── Assignment_04_Report.md
    ├── AI_Evidence.md
    └── AI_Evidence.json
```

## Run the application

Requires Python 3 for the local static server. No install step is needed to run the app.

```bash
python -m http.server 8000
```

Open `http://localhost:8000` in a browser.

## Run automated tests

Requires Node.js 20+ and Python 3. `npm install` is needed once (installs jsdom for `tests/ui.test.js`).

```bash
npm install
npm test
python -m unittest -v test_booking.py
```

Recorded results in this submission:

- JavaScript: **34 tests passed, 0 failed** (`evidence/node_tests.txt`).
- Preserved Python regression suite: **4 unittest methods passed, 0 failed**; the acceptance test contains 36 subcases (`evidence/python_regression_tests.txt`).

## Test coverage summary

- AC1: valid future range, start-now rejection, reversed/zero-length ranges, day bounds and non-integer inputs.
- AC2: exactly 120 minutes accepted; 121 minutes rejected. The time parser accepts 24:00 as the end-of-day endpoint.
- AC3: blocked room rejected.
- AC4: touching before/after allowed; partial and contained overlaps rejected.
- AC5: source booking data remains unchanged.
- F1: exact capacity and insufficient capacity.
- F2: every selected equipment item must be present.
- F3: blocked room remains unavailable.
- F4: no-match result is an empty list and the UI has an explicit empty-state message.
- F5: switching room IDs checks the selected room's own booking list.
- Integration: application service resolves the selected room's own bookings.
- UI behavior (jsdom): initial render, room switching, empty state, equipment filtering, 120/121 minutes, HH:MM hint for malformed time. Plus a check that HTML/CSS contain the module entry point, live region and responsive breakpoint.

## Limitations

- All data are fictional and held in browser memory; there is no database, backend, login or live API.
- The demo time is intentionally fixed at 09:00.
- UI tests run in jsdom (simulated DOM), not a real browser. Real-device, keyboard-only and screen-reader testing have not been completed.
- The availability rules exist twice: `booking.py` (regression baseline) and `src/domain/availability.js` (used by the app).
- No original Assignment #03 web source export or project URL was present in the supplied archive, so the new frontend is a reconstructed equivalent rather than a patch to the missing original frontend.
