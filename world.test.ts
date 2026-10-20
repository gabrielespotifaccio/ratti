import test from 'node:test';
import assert from 'node:assert/strict';
import { Rat, places, walkable, accessible, pathfind, events, type Point } from '../src/world.ts';
import en from '../src/locales/en.ts';
import it from '../src/locales/it.ts';

function assertSafeRoute(start: Point, end: Point) {
  const route = pathfind(start, end);
  assert.ok(route.length > 0, `Unreachable destination ${JSON.stringify(end)}`);
  assert.deepEqual(route.at(-1), accessible(end));
  let previous = accessible(start);
  for (const point of route) {
    assert.ok(walkable(point), `Blocked path node ${JSON.stringify(point)}`);
    const samples = Math.max(1, Math.ceil(Math.hypot(point.x - previous.x, point.y - previous.y)));
    for (let i = 0; i <= samples; i++) {
      const p = { x: previous.x + (point.x - previous.x) * i / samples, y: previous.y + (point.y - previous.y) * i / samples };
      assert.ok(walkable(p), `Path cuts through furniture at ${JSON.stringify(p)}`);
    }
    previous = point;
  }
}

test('navigation routes around the book pile without crossing furniture', () => {
  const start = { x: 500, y: 710 }, end = { x: 900, y: 710 };
  assertSafeRoute(start, end);
  assert.ok(pathfind(start, end).some(p => p.y >= 755));
});

test('all room destinations and sampled floor cells are reachable', () => {
  for (const end of Object.values(places)) assertSafeRoute(places.home, end);
  for (let x = 100; x <= 1500; x += 70) {
    for (let y = 690; y <= 835; y += 35) {
      const end = { x, y };
      if (walkable(end)) assertSafeRoute(places.home, end);
    }
  }
});

test('precise obstacle boundaries and off-grid floor points remain reachable', () => {
  const edges = [{x:655,y:700},{x:755,y:700},{x:654,y:754},{x:756,y:754},{x:700,y:755},{x:700,y:756},{x:1500,y:835},{x:101,y:691}];
  for (const end of edges) {
    assertSafeRoute(places.home, end);
    assertSafeRoute(end, places.food);
  }
});

test('out-of-room clicks are projected to a safe destination', () => {
  for (const p of [{x:-500,y:0},{x:3000,y:2000},{x:700,y:700}]) {
    assert.ok(walkable(accessible(p)));
    assertSafeRoute(places.home, p);
  }
});

test('hunger chooses food and arrival is emitted after real movement', () => {
  const rat = new Rat();
  rat.hunger = .8;
  rat.act('idle', 0);
  let arrived = false;
  rat.onArrive = state => { if (state === 'eat') arrived = true; };
  rat.update(.1);
  assert.equal(rat.state, 'walk');
  assert.equal(rat.after, 'eat');
  assert.ok(rat.route.length > 0);
  assert.equal(arrived, false);
  for (let i = 0; i < 1500 && !arrived; i++) {
    rat.update(.05);
    assert.ok(walkable(rat));
  }
  assert.equal(arrived, true);
  assert.equal(rat.state, 'eat');
  assert.equal(rat.x, places.food.x);
  assert.equal(rat.y, places.food.y);
});

test('a tired rat returns home to sleep', () => {
  const rat = new Rat();
  rat.x = 1100; rat.y = 800; rat.energy = .1;
  rat.act('idle', 0);
  rat.update(.1);
  assert.equal(rat.after, 'sleep');
  assert.deepEqual(rat.route.at(-1), places.home);
});

test('sleep transitions through wake and stretch', () => {
  const rat = new Rat();
  assert.equal(rat.state, 'sleep');
  rat.update(5.1);
  assert.equal(rat.state, 'wake');
  rat.update(2.1);
  assert.equal(rat.state, 'stretch');
  assert.ok(rat.energy > .75);
});

test('English and Italian have matching complete thought banks and UI keys', () => {
  assert.deepEqual(Object.keys(en.ui).sort(), Object.keys(it.ui).sort());
  assert.deepEqual(Object.keys(en.thoughts).sort(), Object.keys(it.thoughts).sort());
  assert.equal(Object.keys(en.thoughts).length, 13);
  assert.ok(Object.values(en.thoughts).flat().length >= 100);
  for (const category of Object.keys(en.thoughts)) {
    assert.equal(en.thoughts[category].length, it.thoughts[category].length);
    for (const locale of [en, it]) assert.ok(locale.thoughts[category].every(thought => thought.trim().length > 0));
  }
});

test('twelve distinct events use reachable locations and valid thought categories', () => {
  assert.equal(events.length, 12);
  assert.equal(new Set(events.map(e => e.id)).size, 12);
  for (const event of events) {
    assert.ok(walkable(places[event.place]));
    assert.ok(en.thoughts[event.thought]);
  }
});
