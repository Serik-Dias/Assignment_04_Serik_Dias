import { checkAvailability } from '../domain/availability.js';
import { filterRooms } from '../domain/roomFilters.js';

/** Application service used by the UI and integration tests. */
export function getRoomOptions(rooms, attendees, equipment) {
  return filterRooms(rooms, attendees, equipment);
}

/** Always checks the selected room object, never a global/default room. */
export function checkSelectedRoom({ rooms, selectedRoomId, start, end, now }) {
  const selectedRoom = rooms.find((room) => room.id === selectedRoomId);
  if (!selectedRoom) return { available: false, reason: 'Choose a room.' };
  return checkAvailability({ start, end, now, room: selectedRoom });
}
