import test from 'node:test';
import assert from 'node:assert/strict';
import { rooms } from '../src/data/rooms.js';
import { getRoomOptions, checkSelectedRoom } from '../src/application/roomChecker.js';

test('F3: a blocked room remains unavailable even with a free time', () => {
  const result = checkSelectedRoom({ rooms, selectedRoomId: 'D404', start: 660, end: 720, now: 540 });
  assert.equal(result.available, false);
  assert.match(result.reason, /blocked/i);
});
test('F5/integration: switching rooms uses the newly selected room bookings', () => {
  const a = checkSelectedRoom({ rooms, selectedRoomId: 'A101', start: 660, end: 720, now: 540 });
  const b = checkSelectedRoom({ rooms, selectedRoomId: 'B202', start: 660, end: 720, now: 540 });
  assert.equal(a.available, true, 'A101 booking ends at 11:00');
  assert.equal(b.available, false, 'B202 has its own booking from 11:00 to 12:00');
});
test('F5: an unknown selected room cannot inherit another room result', () => {
  const result = checkSelectedRoom({ rooms, selectedRoomId: 'UNKNOWN', start: 660, end: 720, now: 540 });
  assert.equal(result.available, false);
});
test('catalogue contains at least four rooms with independent required fields', () => {
  assert.ok(rooms.length >= 4);
  for (const room of rooms) {
    assert.ok(room.id && room.name);
    assert.ok(Number.isInteger(room.capacity));
    assert.ok(Array.isArray(room.equipment));
    assert.equal(typeof room.blocked, 'boolean');
    assert.ok(Array.isArray(room.bookings));
  }
});
test('UI integration assets are wired as a responsive module application', async () => {
  const fs = await import('node:fs/promises');
  const html = await fs.readFile(new URL('../index.html', import.meta.url), 'utf8');
  const css = await fs.readFile(new URL('../styles.css', import.meta.url), 'utf8');
  assert.match(html, /type="module" src="src\/ui\/app\.js"/);
  assert.match(html, /name="equipment"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(css, /@media\s*\(max-width:\s*640px\)/);
});
