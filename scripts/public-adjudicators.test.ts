import test from 'node:test';
import assert from 'node:assert/strict';
import { createClient } from '@supabase/supabase-js';
import { adaptPublicAdjudicators, publicAdjudicatorFacets, publicAdjudicatorResults } from '../src/lib/public-adjudicators.ts';
import { fetchVisibleAdjudicators, publicAdjudicatorColumns } from '../src/lib/api/public-adjudicators.ts';

const row = (index = 1, patch: Record<string, unknown> = {}) => ({
  id: `00000000-0000-4000-8000-${String(index).padStart(12, '0')}`,
  apellidos_nombres: `Registro ${String(index).padStart(3, '0')}`,
  profesion_publicada: null,
  especialidad_publicada: null,
  ...patch,
});
const criteria = { query: '', profession: '', letter: '' };
const fixture = adaptPublicAdjudicators([
  row(1, { apellidos_nombres: 'Álvarez Núñez, Ejemplo', profesion_publicada: 'Abogado' }),
  row(2, { apellidos_nombres: 'Álvarez Núñez, Ejemplo', profesion_publicada: 'Ingeniero Civil', especialidad_publicada: 'Ingeniería civil de prueba' }),
  row(3, { apellidos_nombres: 'Benítez, Ejemplo', profesion_publicada: 'Ingeniero Electrónico' }),
  row(4, { apellidos_nombres: 'Castro, Ejemplo' }),
]);
const run = (patch = {}, page = '') => publicAdjudicatorResults(fixture, { ...criteria, ...patch }, page);
const clientFor = (fetcher: typeof fetch) => createClient('https://example.supabase.co', 'sb_publishable_unit_test', { global: { fetch: fetcher }, auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });

test('adapter preserves UUIDs, exact published names and NULL without adding groups, qualifications or period', () => {
  assert.equal(new Set(fixture.map(record => record.id)).size, 4);
  assert.equal(fixture[3].profession, null);
  assert.equal(fixture[3].specialty, null);
  const exact = adaptPublicAdjudicators([row(10, { apellidos_nombres: '  Núñez, María-José  ', especialidad_publicada: 'texto original · sin modificar' })])[0];
  assert.equal(exact.name, '  Núñez, María-José  ');
  assert.equal(exact.specialty, 'texto original · sin modificar');
  for (const record of fixture) assert.deepEqual(Object.keys(record).sort(), ['id', 'name', 'profession', 'specialty']);
});
test('search ignores case and accents while retaining homonyms by independent UUID', () => {
  assert.equal(run({ query: ' ALVAREZ NUNEZ ' }).filtered.length, 2);
  assert.equal(run({ query: '.*' }).filtered.length, 0);
  assert.equal(run({ query: 'no-such-record' }).filtered.length, 0);
  assert.equal(run({ letter: 'Á' }).filtered.length, 2);
  assert.equal(run({ query: 'civil de prueba' }).filtered.length, 0, 'Existing search is by name only');
});
test('profession, initial and search intersect with the received rows', () => {
  assert.equal(run({ profession: 'Ingeniero Civil' }).filtered.length, 1);
  assert.equal(run({ profession: 'Abogado', query: 'nunez', letter: 'A' }).filtered.length, 1);
  assert.equal(run({ profession: 'Ingeniero Electrónico', letter: 'A' }).filtered.length, 0);
  assert.equal(run({ profession: 'Ingeniero' }).filtered.length, 0);
});
test('profession and alphabet controls derive dynamically from current records', () => {
  const facets = publicAdjudicatorFacets(fixture);
  assert.deepEqual(facets.professions, ['Abogado', 'Ingeniero Civil', 'Ingeniero Electrónico']);
  assert.deepEqual(facets.letters, ['A', 'B', 'C']);
  assert.deepEqual(publicAdjudicatorFacets([]), { professions: [], letters: [] });
});
test('pagination, dynamic totals, stable name/UUID sort and invalid page bounds do not mutate records', () => {
  const records = adaptPublicAdjudicators(Array.from({ length: 45 }, (_, index) => row(index + 1))).reverse();
  const before = JSON.stringify(records);
  const result = publicAdjudicatorResults(records, criteria);
  assert.equal(result.filtered.length, 45);
  assert.equal(result.pageCount, 3);
  const ids = [];
  for (let page = 1; page <= result.pageCount; page++) {
    const part = publicAdjudicatorResults(records, criteria, String(page));
    assert.ok(part.items.length <= 20);
    ids.push(...part.items.map(record => record.id));
  }
  assert.equal(new Set(ids).size, 45);
  assert.deepEqual(ids, publicAdjudicatorResults([...records].reverse(), criteria).filtered.map(record => record.id));
  assert.equal(publicAdjudicatorResults(records, criteria, '999').page, 3);
  for (const page of ['0', '-1', 'abc', '1.5', 'Infinity']) assert.equal(publicAdjudicatorResults(records, criteria, page).page, 1);
  assert.equal(publicAdjudicatorResults(records, { ...criteria, query: 'Registro 001' }, '999').page, 1);
  assert.equal(JSON.stringify(records), before);
});
test('empty valid response is different from malformed data, repeated IDs or unsupported profession', () => {
  assert.deepEqual(adaptPublicAdjudicators([]), []);
  assert.equal(publicAdjudicatorResults([], criteria).filtered.length, 0);
  for (const data of [null, {}, [row(1, { id: 'bad' })], [row(1, { profesion_publicada: 'Ingeniero' })], [row(1), row(1)]]) assert.throws(() => adaptPublicAdjudicators(data));
});
test('query selects only four display columns from public.nomina_adjudicadores and filters visible=true', async () => {
  const requests: { url: URL; method: string; schema: string | null }[] = [];
  const client = clientFor(async (input, init) => {
    requests.push({ url: new URL(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url), method: init?.method ?? 'GET', schema: new Headers(init?.headers).get('Accept-Profile') });
    return new Response(JSON.stringify([row(1)]), { headers: { 'Content-Type': 'application/json' } });
  });
  assert.equal((await fetchVisibleAdjudicators(undefined, client)).length, 1);
  assert.equal(requests.length, 1);
  assert.equal(requests[0].method, 'GET');
  assert.equal(requests[0].schema, 'public');
  assert.equal(requests[0].url.pathname, '/rest/v1/nomina_adjudicadores');
  assert.equal(requests[0].url.searchParams.get('select'), publicAdjudicatorColumns);
  assert.equal(publicAdjudicatorColumns, 'id,apellidos_nombres,profesion_publicada,especialidad_publicada');
  assert.equal(requests[0].url.searchParams.get('visible'), 'eq.true');
  assert.equal(requests[0].url.searchParams.get('order'), 'apellidos_nombres.asc,id.asc');
});
test('errors reject without an empty/hardcoded fallback and a subsequent retry can return empty', async () => {
  let failing = true;
  const client = clientFor(async () => failing
    ? new Response(JSON.stringify({ message: 'fixture denied', code: '42501' }), { status: 403, headers: { 'Content-Type': 'application/json' } })
    : new Response('[]', { headers: { 'Content-Type': 'application/json' } }));
  await assert.rejects(fetchVisibleAdjudicators(undefined, client), /No pudimos cargar la nómina de adjudicadores/);
  failing = false;
  assert.deepEqual(await fetchVisibleAdjudicators(undefined, client), []);
});
test('ordered batches do not truncate a larger future list', async () => {
  const data = Array.from({ length: 501 }, (_, index) => row(index + 1));
  let calls = 0;
  const client = clientFor(async input => {
    calls++;
    const url = new URL(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url);
    const start = Number(url.searchParams.get('offset'));
    const limit = Number(url.searchParams.get('limit'));
    return new Response(JSON.stringify(data.slice(start, start + limit)), { headers: { 'Content-Type': 'application/json' } });
  });
  const result = await fetchVisibleAdjudicators(undefined, client);
  assert.equal(result.length, 501);
  assert.equal(new Set(result.map(record => record.id)).size, 501);
  assert.equal(calls, 2);
});
