import test from 'node:test';
import assert from 'node:assert/strict';
import { rooms } from '../src/data/rooms.js';
import { filterRooms } from '../src/domain/roomFilters.js';

test('F1: capacity equal to requested attendees is accepted', () => {
  assert.ok(filterRooms(rooms, 30, []).some((room) => room.id === 'A101'));
});
test('F1: rooms below requested capacity are excluded', () => {
  assert.ok(!filterRooms(rooms, 31, []).some((room) => room.id === 'A101'));
});
test('F2: every selected equipment item is required', () => {
  const matches = filterRooms(rooms, 20, ['projector', 'whiteboard']);
  assert.ok(matches.length > 0);
  assert.ok(matches.every((room) => room.equipment.includes('projector') && room.equipment.includes('whiteboard')));
});
test('F2: a room missing one required item is excluded', () => {
  assert.ok(!filterRooms(rooms, 20, ['computers', 'microphone']).some((room) => room.id === 'B202'));
});
test('F4: no matches returns an empty list', () => assert.deepEqual(filterRooms(rooms, 500, []), []));
test('invalid attendee count returns no matches', () => assert.deepEqual(filterRooms(rooms, 0, []), []));
