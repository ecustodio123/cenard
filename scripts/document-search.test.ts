import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { filterDocuments } from '../src/lib/document-search.ts';
const documents = JSON.parse(readFileSync(new URL('../src/data/documents.json', import.meta.url), 'utf8'));
const run = (criteria = {}) => filterDocuments(documents, { query: '', service: '', type: '', status: '', ...criteria });

test('catalogue keeps 16 distinct records and 21 service references', () => {
  assert.equal(run().length, 16);
  assert.equal(new Set(run().map(d => d.urlPublic)).size, 16);
  assert.equal(documents.reduce((sum, d) => sum + d.references.length, 0), 21);
});
test('service association includes shared documents', () => {
  assert.equal(run({ service: 'Arbitraje' }).length, 14);
  assert.equal(run({ service: 'JPRD' }).length, 7);
});
test('JPRD combined with Reglamento returns exactly its three regulations', () => {
  assert.deepEqual(run({ service: 'JPRD', type: 'Reglamento' }).map(d => d.id).sort(), ['reglamento-costos-2025', 'reglamento-interno-2025', 'reglamento-jprd-2025']);
});
test('search finds services and types, ignoring case, accents and surrounding spaces', () => {
  assert.equal(run({ query: ' jPrD ' }).length, 7);
  assert.equal(run({ query: 'CODIGO DE ETICA' }).length, 2);
  assert.equal(run({ query: 'ficha' }).length, 2);
});
test('search and all filters intersect, without importing arbitration histories to JPRD', () => {
  assert.equal(run({ query: 'costos', service: 'JPRD', type: 'Reglamento', status: 'reciente' }).length, 1);
  assert.equal(run({ service: 'JPRD', status: 'historico' }).length, 0);
  assert.equal(run({ service: 'Arbitraje', status: 'historico' }).length, 7);
});
test('no matches returns an empty collection and empty criteria restore all documents', () => {
  assert.equal(run({ query: 'zzsincoincidenciaszz' }).length, 0);
  assert.equal(run().length, 16);
});
test('same-title directives remain distinct with their original URLs and services', () => {
  const directives = run({ query: 'Directiva 01' });
  assert.equal(directives.length, 2);
  assert.ok(directives.find(d => d.services.includes('Arbitraje'))?.urlPublic.includes('/2026/07/'));
  assert.ok(directives.find(d => d.services.includes('JPRD'))?.urlPublic.includes('/2025/08/'));
});
