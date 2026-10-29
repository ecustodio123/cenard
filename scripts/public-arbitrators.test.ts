import test from 'node:test';
import assert from 'node:assert/strict';
import { createClient } from '@supabase/supabase-js';
import { adaptPublicArbitrators, publicArbitratorFacets, publicArbitratorResults } from '../src/lib/public-arbitrators.ts';
import { publicSupabaseConfig } from '../src/lib/supabase-config.ts';
import { fetchVisibleArbitrators, publicArbitratorColumns } from '../src/lib/api/public-arbitrators.ts';

const row = (index = 1, patch: Record<string, unknown> = {}) => ({
  id: `00000000-0000-4000-8000-${String(index).padStart(12, '0')}`,
  apellidos_nombres: `Registro ${String(index).padStart(3, '0')}`,
  profesion_publicada: null,
  grupos: ['Nacionales'],
  especialidad_publicada: null,
  habilitaciones: [],
  ...patch,
});
const criteria = { query: '', group: '', profession: '', letter: '' };
const fixture = adaptPublicArbitrators([
  row(1, { apellidos_nombres: 'Álvarez Núñez, Ejemplo', grupos: ['Nacionales', 'Contratación pública'], profesion_publicada: 'Abogado', habilitaciones: ['Árbitro único', 'Árbitro de parte'] }),
  row(2, { apellidos_nombres: 'Álvarez Núñez, Ejemplo' }),
  row(3, { apellidos_nombres: 'Benítez, Ejemplo', grupos: ['Contratación pública'], profesion_publicada: 'Ingeniero', especialidad_publicada: 'Ingeniería de prueba' }),
]);
const run = (patch = {}, page = '') => publicArbitratorResults(fixture, { ...criteria, ...patch }, page);
const clientFor = (fetcher: typeof fetch) => createClient('https://example.supabase.co', 'sb_publishable_unit_test', { global: { fetch: fetcher }, auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });

test('adapter retains one UUID per row, every group and all qualifications without period or singular group', () => {
  assert.equal(fixture.length, 3);
  assert.equal(new Set(fixture.map(record => record.id)).size, 3);
  assert.deepEqual(fixture[0].groups, ['Nacionales', 'Contratación pública']);
  assert.deepEqual(fixture[0].qualifications, ['Árbitro único', 'Árbitro de parte']);
  for (const record of fixture) { assert.ok(!('group' in record)); assert.ok(!('period' in record)); }
});
test('NULL fields and empty arrays are retained rather than filled with invented information', () => {
  assert.equal(fixture[1].profession, null);
  assert.equal(fixture[1].specialty, null);
  assert.deepEqual(fixture[1].qualifications, []);
});
test('each group includes the consolidated record once and combined filters intersect', () => {
  assert.equal(run().filtered.length, 3);
  assert.equal(run({ group: 'Nacionales' }).filtered.length, 2);
  assert.equal(run({ group: 'Contratación pública' }).filtered.length, 2);
  assert.equal(run({ group: 'Contratación pública', profession: 'Abogado', letter: 'A', query: 'nunez' }).filtered.length, 1);
  assert.equal(run({ group: 'Nacionales', profession: 'Ingeniero' }).filtered.length, 0);
});
test('search ignores accents and case, preserves homonyms and treats metacharacters literally', () => {
  assert.equal(run({ query: ' ALVAREZ ' }).filtered.length, 2);
  assert.equal(run({ query: '.*' }).filtered.length, 0);
  assert.equal(run({ query: 'missing' }).filtered.length, 0);
  assert.equal(run({ letter: 'Á' }).filtered.length, 2);
});
test('facets use all received groups, professions and normalized initials', () => {
  const facets = publicArbitratorFacets(fixture);
  assert.deepEqual(new Set(facets.groups), new Set(['Nacionales', 'Contratación pública']));
  assert.deepEqual(facets.professions, ['Abogado', 'Ingeniero']);
  assert.deepEqual(facets.letters, ['A', 'B']);
});
test('pagination covers records once, bounds invalid pages and preserves deterministic ordering', () => {
  const records = adaptPublicArbitrators(Array.from({ length: 45 }, (_, index) => row(index + 1))).reverse();
  const before = JSON.stringify(records);
  const total = publicArbitratorResults(records, criteria);
  const ids = [];
  for (let page = 1; page <= total.pageCount; page++) {
    const result = publicArbitratorResults(records, criteria, String(page));
    assert.ok(result.items.length <= 20);
    ids.push(...result.items.map(record => record.id));
  }
  assert.equal(total.pageCount, 3);
  assert.equal(ids.length, 45);
  assert.equal(new Set(ids).size, 45);
  assert.equal(publicArbitratorResults(records, criteria, '999').page, 3);
  for (const page of ['0', '-1', 'NaN', 'Infinity', '1.5']) assert.equal(publicArbitratorResults(records, criteria, page).page, 1);
  assert.deepEqual(ids, publicArbitratorResults([...records].reverse(), criteria).filtered.map(record => record.id));
  assert.equal(JSON.stringify(records), before);
});
test('empty successful responses remain distinct from invalid/malformed responses', () => {
  assert.deepEqual(adaptPublicArbitrators([]), []);
  assert.equal(publicArbitratorResults([], criteria).filtered.length, 0);
  for (const value of [null, undefined, {}, [row(1, { id: 'bad-id' })], [row(1, { grupos: ['unknown'] })], [row(1, { profesion_publicada: 'Inventada' })]]) assert.throws(() => adaptPublicArbitrators(value));
  assert.throws(() => adaptPublicArbitrators([row(1), row(1)]));
});
test('Supabase query uses public schema, necessary columns, visible=true and ascending name order', async () => {
  const requests: { url: URL; method: string; schema: string | null }[] = [];
  const client = clientFor(async (input, init) => {
    requests.push({ url: new URL(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url), method: init?.method ?? 'GET', schema: new Headers(init?.headers).get('Accept-Profile') });
    return new Response(JSON.stringify([row(1)]), { status: 200, headers: { 'Content-Type': 'application/json' } });
  });
  const result = await fetchVisibleArbitrators(undefined, client);
  assert.equal(result.length, 1);
  assert.equal(requests.length, 1);
  const request = requests[0];
  assert.equal(request.method, 'GET');
  assert.equal(request.schema, 'public');
  assert.equal(request.url.pathname, '/rest/v1/nomina_arbitros');
  assert.equal(request.url.searchParams.get('select'), publicArbitratorColumns);
  assert.equal(request.url.searchParams.get('visible'), 'eq.true');
  assert.equal(request.url.searchParams.get('order'), 'apellidos_nombres.asc,id.asc');
  assert.ok(!publicArbitratorColumns.includes('created_at') && !publicArbitratorColumns.includes('updated_at'));
});
test('query failure rejects instead of silently returning empty/hardcoded records; retry can succeed', async () => {
  let failing = true;
  const client = clientFor(async () => failing
    ? new Response(JSON.stringify({ message: 'fixture denied', code: '42501' }), { status: 403, headers: { 'Content-Type': 'application/json' } })
    : new Response('[]', { status: 200, headers: { 'Content-Type': 'application/json' } }));
  await assert.rejects(fetchVisibleArbitrators(undefined, client), /No pudimos cargar/);
  failing = false;
  assert.deepEqual(await fetchVisibleArbitrators(undefined, client), []);
});
test('larger responses are read in ordered batches without truncation or duplicated rows', async () => {
  const data = Array.from({ length: 501 }, (_, index) => row(index + 1));
  let calls = 0;
  const client = clientFor(async input => {
    calls++;
    const url = new URL(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url);
    const offset = Number(url.searchParams.get('offset'));
    const limit = Number(url.searchParams.get('limit'));
    return new Response(JSON.stringify(data.slice(offset, offset + limit)), { headers: { 'Content-Type': 'application/json' } });
  });
  const result = await fetchVisibleArbitrators(undefined, client);
  assert.equal(calls, 2);
  assert.equal(result.length, 501);
  assert.equal(new Set(result.map(record => record.id)).size, 501);
});
test('missing configuration and secret keys are rejected without echoing their values', () => {
  assert.throws(() => publicSupabaseConfig({}), /configurada/);
  assert.throws(() => publicSupabaseConfig({ VITE_SUPABASE_URL: 'https://example.supabase.co' }), /configurada/);
  for (const key of ['sb_secret_fake', 'service_role', 'invalid']) {
    assert.throws(() => publicSupabaseConfig({ VITE_SUPABASE_URL: 'https://example.supabase.co', VITE_SUPABASE_PUBLISHABLE_KEY: key }), /clave pública válida/);
  }
  for (const url of ['invalid', 'javascript:bad', 'https://user:password@example.test', 'https://example.test?secret=bad']) {
    assert.throws(() => publicSupabaseConfig({ VITE_SUPABASE_URL: url, VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_unit_test' }), /configurada correctamente/);
  }
});
