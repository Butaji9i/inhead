import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DAY, GAP, BASE, PER_LEVEL, levelAt, yAt, frame, hillShape, HILLS, painColor, eventLabel } from '../src/lib/liveline.mjs';

const readings = DAY.map((e, n) => ({ ...e, n })).filter((e) => e.kind === 'pain' || e.kind === 'end');

test('the line passes exactly through every pain reading, in every lap of the day', () => {
  for (const lap of [0, 1, 5]) {
    for (const r of readings) {
      const u = (lap * DAY.length + r.n) * GAP;
      assert.equal(levelAt(u), r.level, `${r.time} lap ${lap}`);
    }
  }
});

test('a pain dot sits on the line at its own height: higher pain, higher on screen', () => {
  const y = (level) => readings.find((r) => r.level === level).n * GAP;
  assert.ok(Math.abs(yAt(y(8)) - (BASE - 8 * PER_LEVEL)) <= 3);
  assert.ok(yAt(y(8)) < yAt(y(4)) && yAt(y(4)) < yAt(y(3)) && yAt(y(3)) < yAt(y(2)));
});

test('between readings the level stays between them; outside a headache it is 0', () => {
  for (let i = 1; i < readings.length; i++) {
    const [a, b] = [readings[i - 1], readings[i]];
    for (let k = 1; k < 10; k++) {
      const l = levelAt((a.n + ((b.n - a.n) * k) / 10) * GAP);
      assert.ok(l >= Math.min(a.level, b.level) - 1e-9 && l <= Math.max(a.level, b.level) + 1e-9, `${a.time}→${b.time}`);
    }
  }
  const end = readings.find((r) => r.kind === 'end').n;
  assert.equal(levelAt((end + 1) * GAP), 0, 'evening after the episode');
});

test('a frame: the sun draws the newest point, events are on screen and on the line', () => {
  const f = frame({ t: 3, width: 1200 });
  assert.equal(f.pen.x, Math.round(1200 * 0.82));
  assert.ok(f.events.length >= 4);
  for (const e of f.events) {
    assert.ok(e.x <= f.pen.x && e.x >= -60, `event at ${e.x}`);
    assert.ok(e.age >= 0);
  }
  assert.match(f.path, /^M[\d. L-]+$/);
  assert.ok(f.path.endsWith(`${f.pen.x} ${f.pen.y.toFixed(1)}`));
});

test('a narrow screen shows fewer events than a wide one', () => {
  assert.ok(frame({ width: 390 }).events.length < frame({ width: 1440 }).events.length);
});

test('hills are closed shapes that move with time', () => {
  const h = HILLS.day.layers[0];
  const a = hillShape(h, 0, 1440, 240);
  assert.match(a, /Z$/);
  assert.notEqual(a, hillShape(h, 2, 1440, 240));
});

test('labels and colours', () => {
  assert.equal(eventLabel({ kind: 'pain', level: 8 }, {}, 'Pain'), 'Pain 8/10');
  assert.equal(eventLabel({ kind: 'med' }, { med: 'Ibuprofen' }, 'Pain'), 'Ibuprofen');
  assert.notEqual(painColor(8), painColor(3));
});
