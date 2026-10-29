import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { professionalResults } from '../src/lib/arbitrator-directory.ts';
const records=JSON.parse(readFileSync(new URL('../src/data/professionals.json', import.meta.url),'utf8'));
const run=(criteria={},page='')=>professionalResults(records,{query:'',group:'',profession:'',letter:'',...criteria},page,'adjudicador');

test('preserves all 27 adjudicator records and their one published group',()=>{
  assert.equal(run().filtered.length,27);
  assert.deepEqual([...new Set(run().filtered.map(r=>r.group))],['Contratación pública']);
  assert.ok(run().filtered.every(r=>r.kind==='adjudicador'&&r.period==='2025'));
});
test('accent-insensitive search retains original Andia spelling',()=>{
  const result=run({query:'Andía'});
  assert.equal(result.filtered.length,1);
  assert.equal(result.items[0].name,'Andia Espinoza, Helmuth Aarón');
});
test('profession filter uses all records before pagination',()=>{
  const result=run({profession:'Ingeniero Electrónico'});
  assert.equal(result.filtered.length,1);
  assert.ok(result.items.every(r=>r.profession==='Ingeniero Electrónico'));
  assert.equal(run({query:'zzsincoincidenciaszz'}).filtered.length,0);
});
test('two pages cover the same 27 source ids, with 20 then 7',()=>{
  const first=run({},'1'),second=run({},'2');
  assert.equal(first.items.length,20);assert.equal(second.items.length,7);
  const ids=[...first.items,...second.items].map(r=>r.id);
  assert.equal(new Set(ids).size,27);assert.deepEqual(ids,run().filtered.map(r=>r.id));
});
test('empty fields and specialties matching group are preserved',()=>{
  const result=run().filtered;
  assert.ok(result.some(r=>r.profession===''));
  assert.ok(result.some(r=>r.specialty===''));
  assert.ok(result.some(r=>r.specialty==='Contratación Pública'));
  assert.deepEqual(result.find(r=>r.name==='Castillo Meza, Miguel'),records.find(r=>r.kind==='adjudicador'&&r.name==='Castillo Meza, Miguel'));
});
test('invalid page is bounded while preserving criteria and no source values mutate',()=>{
  const before=JSON.stringify(records);
  assert.equal(run({},'999').page,2);
  assert.equal(run({profession:'Ingeniero Electrónico'},'999').page,1);
  assert.equal(run({profession:'Ingeniero Electrónico'},'999').filtered.length,1);
  assert.equal(run({},'-4').page,1);
  assert.equal(JSON.stringify(records),before);
});
