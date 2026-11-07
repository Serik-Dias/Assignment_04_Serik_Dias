// Fictional room catalogue. Each room owns its own booking intervals.
export const rooms = [
  {
    id: 'A101', name: 'Lecture Room A101', capacity: 30,
    equipment: ['projector', 'whiteboard'], blocked: false,
    bookings: [{ start: 600, end: 660 }, { start: 780, end: 840 }],
  },
  {
    id: 'B202', name: 'Computer Lab B202', capacity: 25,
    equipment: ['computers', 'projector'], blocked: false,
    bookings: [{ start: 660, end: 720 }],
  },
  {
    id: 'C303', name: 'Lecture Hall C303', capacity: 100,
    equipment: ['projector', 'microphone', 'whiteboard'], blocked: false,
    bookings: [{ start: 720, end: 780 }],
  },
  {
    id: 'D404', name: 'Seminar Room D404', capacity: 15,
    equipment: ['whiteboard'], blocked: true,
    bookings: [],
  },
  {
    id: 'E505', name: 'Hybrid Room E505', capacity: 40,
    equipment: ['projector', 'video-conference', 'whiteboard'], blocked: false,
    bookings: [{ start: 900, end: 960 }],
  },
];

// Fixed demo time required by the assignment: 09:00.
export const DEMO_NOW_MINUTES = 540;
