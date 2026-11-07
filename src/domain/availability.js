export const MAX_DURATION_MINUTES = 120;
export const END_OF_DAY_MINUTES = 1440;

/**
 * Pure availability rule. Intervals are half-open [start, end), so endpoints
 * may touch. The room and its bookings are read-only inputs.
 */
export function checkAvailability({ start, end, now, room }) {
  if (!room) return { available: false, reason: 'Choose a room.' };
  if (Number.isNaN(start) || Number.isNaN(end)) {
    return { available: false, reason: 'Enter start and end times as HH:MM (24-hour), for example 11:00.' };
  }
  if (!Number.isInteger(start) || !Number.isInteger(end)) {
    return { available: false, reason: 'Enter whole-number minutes for start and end.' };
  }
  if (!(0 <= start && start < end && end <= END_OF_DAY_MINUTES)) {
    return { available: false, reason: 'Use a valid same-day time range (00:00–24:00).' };
  }
  if (start <= now) {
    return { available: false, reason: `Start time must be later than the fixed current time (${formatTime(now)}).` };
  }
  if (end - start > MAX_DURATION_MINUTES) {
    return { available: false, reason: `A request cannot be longer than ${MAX_DURATION_MINUTES} minutes.` };
  }
  if (room.blocked) {
    return { available: false, reason: 'This room is blocked and cannot be used.' };
  }
  const overlaps = room.bookings.some(({ start: busyStart, end: busyEnd }) =>
    start < busyEnd && end > busyStart
  );
  if (overlaps) {
    return { available: false, reason: 'The selected time overlaps an existing booking.' };
  }
  return { available: true, reason: 'This room is available for the selected time.' };
}

export function formatTime(minutes) {
  if (!Number.isInteger(minutes) || minutes < 0 || minutes > END_OF_DAY_MINUTES) return '--:--';
  if (minutes === END_OF_DAY_MINUTES) return '24:00';
  const hours = Math.floor(minutes / 60).toString().padStart(2, '0');
  const mins = (minutes % 60).toString().padStart(2, '0');
  return `${hours}:${mins}`;
}

/** Parse a 24-hour HH:MM field, including the assignment's 24:00 endpoint. */
export function parseTimeInput(value) {
  if (typeof value !== 'string') return NaN;
  const trimmed = value.trim();
  if (trimmed === '24:00') return END_OF_DAY_MINUTES;
  if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(trimmed)) return NaN;
  const [hours, minutes] = trimmed.split(':').map(Number);
  return hours * 60 + minutes;
}
