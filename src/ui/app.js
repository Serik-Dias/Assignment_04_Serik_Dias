import { rooms, DEMO_NOW_MINUTES } from '../data/rooms.js';
import { formatTime, parseTimeInput } from '../domain/availability.js';
import { getRoomOptions, checkSelectedRoom } from '../application/roomChecker.js';

const $ = (selector) => document.querySelector(selector);
const attendeesInput = $('#attendees');
const startInput = $('#start');
const endInput = $('#end');
const roomSelect = $('#room');
const equipmentInputs = [...document.querySelectorAll('[name="equipment"]')];
const roomList = $('#room-list');
const result = $('#availability-result');
const statusText = $('#status-text');
const resultIcon = $('.result-icon');

const selectedEquipment = () => equipmentInputs.filter((input) => input.checked).map((input) => input.value);
const timeValue = (input) => parseTimeInput(input.value);

function renderRooms() {
  const matches = getRoomOptions(rooms, Number(attendeesInput.value), selectedEquipment());
  const previous = roomSelect.value;
  roomSelect.replaceChildren();
  for (const room of matches) {
    const option = document.createElement('option');
    option.value = room.id;
    option.textContent = `${room.id} — ${room.name} (${room.capacity} seats)${room.blocked ? ' — BLOCKED' : ''}`;
    roomSelect.append(option);
  }
  roomList.replaceChildren();
  if (matches.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'No rooms match these requirements. Try fewer attendees or less equipment.';
    roomList.append(empty);
    roomSelect.disabled = true;
  } else {
    roomSelect.disabled = false;
    if (matches.some((room) => room.id === previous)) roomSelect.value = previous;
    for (const room of matches) {
      const card = document.createElement('article');
      card.className = `room-card${room.blocked ? ' room-card--blocked' : ''}`;
      const equipment = room.equipment.map((item) => item.replaceAll('-', ' ')).join(', ');
      card.innerHTML = `<div><strong>${room.id}</strong><span>${room.name}</span></div><p>${room.capacity} seats · ${equipment}</p><small>${room.blocked ? 'Blocked' : 'Not blocked'}</small>`;
      roomList.append(card);
    }
  }
  refreshAvailability();
}

function refreshAvailability() {
  if (!roomSelect.value) {
    showResult(false, 'No matching room is selected.');
    return;
  }
  const outcome = checkSelectedRoom({
    rooms, selectedRoomId: roomSelect.value,
    start: timeValue(startInput), end: timeValue(endInput), now: DEMO_NOW_MINUTES,
  });
  showResult(outcome.available, outcome.reason);
}

function showResult(available, message) {
  result.className = `result ${available ? 'result--available' : 'result--unavailable'}`;
  resultIcon.textContent = available ? '✓' : '✕';
  statusText.textContent = `${available ? 'Available' : 'Unavailable'} — ${message}`;
}

attendeesInput.addEventListener('input', renderRooms);
equipmentInputs.forEach((input) => input.addEventListener('change', renderRooms));
roomSelect.addEventListener('change', refreshAvailability);
startInput.addEventListener('input', refreshAvailability);
endInput.addEventListener('input', refreshAvailability);
$('#check-button').addEventListener('click', refreshAvailability);

$('#demo-time').textContent = formatTime(DEMO_NOW_MINUTES);
$('#hint-demo-time').textContent = formatTime(DEMO_NOW_MINUTES);
renderRooms();
