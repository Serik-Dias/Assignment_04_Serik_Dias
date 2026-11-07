import test from 'node:test';
import assert from 'node:assert/strict';
import { checkAvailability, formatTime, parseTimeInput } from '../src/domain/availability.js';
import { DEMO_NOW_MINUTES } from '../src/data/rooms.js';

const openRoom = { id: 'TEST', blocked: false, bookings: [{ start: 600, end: 660 }] };
const check = (start, end, room = openRoom) => checkAvailability({ start, end, now: 540, room });

test('AC1: accepts a valid future same-day interval', () => assert.equal(check(660, 720).available, true));
test('AC1: rejects start equal to now', () => assert.equal(check(540, 570).available, false));
test('AC1: rejects reversed and zero-length intervals', () => {
  assert.equal(check(720, 660).available, false);
  assert.equal(check(660, 660).available, false);
});
test('AC1: rejects values outside the day', () => {
  assert.equal(check(-1, 60).available, false);
  assert.equal(check(1430, 1441).available, false);
});
test('AC1: rejects non-integer values', () => {
  assert.equal(check(660.5, 720).available, false);
  assert.equal(check(660, '720').available, false);
});
test('AC2: exactly 120 minutes is allowed', () => assert.equal(check(720, 840).available, true));
test('AC2: 121 minutes is rejected', () => assert.equal(check(720, 841).available, false));
test('AC3: blocked rooms are unavailable', () => assert.equal(check(660, 720, { ...openRoom, blocked: true }).available, false));
test('AC4: touching the end of a booking is allowed', () => assert.equal(check(660, 720).available, true));
test('AC4: touching the start of a booking is allowed', () => assert.equal(check(570, 600).available, true));
test('AC4: partial and contained overlaps are rejected', () => {
  assert.equal(check(630, 690).available, false);
  assert.equal(check(610, 620).available, false);
});
test('AC5: checking never mutates the room booking data', () => {
  const source = structuredClone(openRoom);
  check(660, 720, openRoom);
  assert.deepEqual(openRoom, source);
});
test('AC1: end of day is valid and formatted as 24:00', () => {
  assert.equal(check(1320, 1440, { ...openRoom, bookings: [] }).available, true);
  assert.equal(formatTime(1440), '24:00');
});
test('fixed demo time remains 09:00', () => assert.equal(formatTime(DEMO_NOW_MINUTES), '09:00'));

test('time input parser accepts 24:00 and rejects malformed values', () => {
  assert.equal(parseTimeInput('24:00'), 1440);
  assert.equal(parseTimeInput('09:05'), 545);
  assert.ok(Number.isNaN(parseTimeInput('24:01')));
  assert.ok(Number.isNaN(parseTimeInput('')));
});

test('AC6: malformed time input gets an HH:MM hint, not a minutes message', () => {
  const parsed = parseTimeInput('9:00');
  const result = checkAvailability({ start: parsed, end: 720, now: 540, room: openRoom });
  assert.equal(result.available, false);
  assert.match(result.reason, /HH:MM/);
});
test('AC6: start-time message reports the configured current time', () => {
  const result = checkAvailability({ start: 540, end: 600, now: 540, room: openRoom });
  assert.match(result.reason, /09:00/);
});
