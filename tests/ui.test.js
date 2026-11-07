import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { JSDOM } from 'jsdom';

// Real UI behaviour check: load index.html in jsdom, run src/ui/app.js and
// drive the form with input/change events (no browser needed).
const root = new URL('../', import.meta.url);
const html = fs.readFileSync(new URL('index.html', root), 'utf8').replace(/<script[^>]*><\/script>/, '');
const dom = new JSDOM(html, { url: 'http://localhost/' });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
await import(new URL('src/ui/app.js', root).href);

const $ = (selector) => document.querySelector(selector);
const fire = (el, type) => el.dispatchEvent(new dom.window.Event(type, { bubbles: true }));
const setValue = (el, value, type = 'input') => { el.value = value; fire(el, type); };
const status = () => $('#status-text').textContent;
const roomIds = () => [...$('#room').options].map((o) => o.value);
const toggle = (name, checked) => {
  const box = document.querySelector(`[name="equipment"][value="${name}"]`);
  box.checked = checked; fire(box, 'change');
};

test('UI: initial render lists matching rooms and shows a result', () => {
  assert.deepEqual(roomIds(), ['A101', 'B202', 'C303', 'E505']);
  assert.match(status(), /^Available/);
  assert.equal($('.result-icon').textContent, '✓');
});
test('UI F5: switching the selected room refreshes the result', () => {
  setValue($('#room'), 'B202', 'change');
  assert.match(status(), /^Unavailable.*overlaps/);
  assert.equal($('.result-icon').textContent, '✕');
  setValue($('#room'), 'A101', 'change');
  assert.match(status(), /^Available/);
});
test('UI F4: no matching rooms shows the empty state and disables the selector', () => {
  setValue($('#attendees'), '500');
  assert.ok($('.empty-state'));
  assert.equal($('#room').disabled, true);
  assert.match(status(), /No matching room/);
  setValue($('#attendees'), '20');
  assert.equal($('.empty-state'), null);
});
test('UI F2: selecting equipment narrows the room list (all items required)', () => {
  toggle('microphone', true);
  assert.deepEqual(roomIds(), ['C303']);
  toggle('computers', true);
  assert.deepEqual(roomIds(), []);
  toggle('computers', false); toggle('microphone', false);
  assert.deepEqual(roomIds(), ['A101', 'B202', 'C303', 'E505']);
});
test('UI AC2: 120 minutes accepted, 121 minutes rejected', () => {
  setValue($('#room'), 'A101', 'change');
  setValue($('#start'), '11:00'); setValue($('#end'), '13:00');
  assert.match(status(), /^Available/);
  setValue($('#end'), '13:01');
  assert.match(status(), /longer than 120/);
  setValue($('#end'), '12:00');
});
test('UI AC6: malformed time shows an HH:MM hint', () => {
  setValue($('#start'), '9:00');
  assert.match(status(), /HH:MM/);
  setValue($('#start'), '11:00');
});
