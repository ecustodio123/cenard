import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { arbitratorResults, directoryPageNumbers } from '../src/lib/arbitrator-directory.ts';
const records = JSON.parse(readFileSync(new URL('../src/data/professionals.json', import.meta.url),'utf8'));
const run = (criteria = {}, page = '') => arbitratorResults(records, {query:'',group:'',profession:'',letter:'',...criteria}, page);

test('keeps every source registration and group', () => {
  assert.equal(run().filtered.length, 132);
  assert.equal(run({group:'Nacionales'}).filtered.length, 92);
  assert.equal(run({group:'Contratación pública'}).filtered.length, 40);
});
test('accent-independent name search preserves both Andía records and their different metadata', () => {
  const result=run({query:'Andia'}).items;
  assert.equal(result.length,2);
  assert.equal(new Set(result.map(r=>r.id)).size,2);
  assert.ok(result.every(r=>r.name==='Andía Espinoza, Helmuth Aarón'));
  assert.ok(result.some(r=>r.profession===''));
  assert.ok(result.some(r=>r.profession==='Abogado'));
});
test('filters intersect before pagination and unknown text remains literal', () => {
  assert.equal(run({group:'Contratación pública',profession:'Abogado',letter:'A'}).filtered.length,4);
  assert.equal(run({query:'zzsincoincidenciaszz'}).filtered.length,0);
  assert.equal(run({query:'.*'}).filtered.length,0);
});
test('pagination covers all registrations exactly once, max 20 per page', () => {
  const whole=run();const ids=[];
  for(let page=1;page<=whole.pageCount;page++){
    const result=run({},String(page));
    assert.ok(result.items.length<=20);ids.push(...result.items.map(r=>r.id));
  }
  assert.equal(ids.length,132);assert.equal(new Set(ids).size,132);
  assert.deepEqual(ids,whole.filtered.map(r=>r.id));
});
test('invalid pages are bounded without discarding filters', () => {
  assert.equal(run({},'999').page,7);
  for(const invalid of ['0','-1','abc','1.5']) assert.equal(run({},invalid).page,1);
  assert.equal(run({query:'Andia'},'999').items.length,2);
  assert.equal(run({query:'Andia'},'999').page,1);
});
test('ordering is deterministic regardless of input order, preserving source data', () => {
  const before=JSON.stringify(records);
  const reversed=arbitratorResults([...records].reverse(),{query:'',group:'',profession:'',letter:''});
  assert.deepEqual(reversed.filtered.map(r=>r.id),run().filtered.map(r=>r.id));
  assert.equal(JSON.stringify(records),before);
});
test('compact page navigation includes current, first and last without excessive controls', () => {
  for(let page=1;page<=7;page++){
    const result=directoryPageNumbers(page,7,true);
    assert.ok(result.includes(1)&&result.includes(7)&&result.includes(page));
    assert.ok(result.length<=5);
  }
});
