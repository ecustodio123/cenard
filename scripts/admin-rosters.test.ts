import test from 'node:test';
import assert from 'node:assert/strict';
import { arbitratorProfessions, adjudicatorProfessions, draftFromRecord, emptyRosterDraft, groupOptions, qualificationOptions, searchRoster, validateRosterDraft } from '../src/lib/admin/rosters.ts';
import { deleteRosterRecord, saveRosterRecord, setRosterVisibility } from '../src/lib/admin/memory-rosters.ts';
import type { RosterDraft, RosterKind, RosterRecord } from '../src/lib/admin/rosters.ts';

const draft = (patch: Partial<RosterDraft> = {}): RosterDraft => ({ name: ' Persona ficticia Álvarez ', profession: 'Abogado', specialty: ' Especialidad de prueba ', groups: ['Nacionales'], qualifications: ['Árbitro único'], ...patch });
let nextId = 0;
function save(records: readonly RosterRecord[], kind: RosterKind, values: RosterDraft, editingId: string | null = null) {
  const result = saveRosterRecord(records, kind, values, editingId, () => `demo-test-${++nextId}`);
  if (!result.ok) assert.fail(JSON.stringify(result.errors));
  return result;
}

test('arbitrators allow one or both groups and all 1/2/3 qualification combinations', () => {
  const groups = [[groupOptions[0]], [groupOptions[1]], [...groupOptions]];
  for (const selectedGroups of groups) {
    for (let mask = 1; mask < 8; mask++) {
      const qualifications = qualificationOptions.filter((_, index) => mask & (1 << index));
      const result = save([], 'arbitrators', draft({ groups: selectedGroups, qualifications }));
      assert.equal(result.record.visible, true);
      assert.equal(result.record.kind, 'arbitrators');
      if (result.record.kind !== 'arbitrators') assert.fail();
      assert.deepEqual(result.record.groups, selectedGroups);
      assert.deepEqual(result.record.qualifications, qualifications);
    }
  }
});
test('profession restrictions are exact and independent for both rosters', () => {
  assert.deepEqual([...arbitratorProfessions], ['Abogado', 'Ingeniero']);
  assert.deepEqual([...adjudicatorProfessions], ['Abogado', 'Ingeniero Electrónico', 'Ingeniero Civil']);
  for (const profession of arbitratorProfessions) assert.equal(validateRosterDraft('arbitrators', draft({ profession })).ok, true);
  for (const profession of adjudicatorProfessions) assert.equal(validateRosterDraft('adjudicators', draft({ profession })).ok, true);
  for (const profession of ['Ingeniero Civil', 'Ingeniero Electrónico', 'Médico', '']) assert.equal(validateRosterDraft('arbitrators', draft({ profession })).ok, false);
  for (const profession of ['Ingeniero', 'Médico', '']) assert.equal(validateRosterDraft('adjudicators', draft({ profession })).ok, false);
});
test('missing and whitespace-only fields return concrete field errors', () => {
  for (const kind of ['arbitrators', 'adjudicators'] as const) {
    const empty = validateRosterDraft(kind, emptyRosterDraft());
    assert.equal(empty.ok, false);
    if (empty.ok) assert.fail();
    assert.ok(empty.errors.name && empty.errors.profession && empty.errors.specialty);
    for (const field of ['name', 'specialty'] as const) {
      const result = validateRosterDraft(kind, draft({ [field]: ' \t\n ' }));
      assert.equal(result.ok, false);
      if (!result.ok) assert.ok(result.errors[field]);
    }
  }
  for (const field of ['groups', 'qualifications'] as const) {
    for (const value of [[], ['unsupported'], ['Nacionales', 'unsupported']]) {
      assert.equal(validateRosterDraft('arbitrators', draft({ [field]: value })).ok, false);
    }
  }
});
test('saving trims only surrounding spaces, keeps accents and legitimate internal text', () => {
  const result = save([], 'arbitrators', draft({ name: '  García  Núñez, María-José  ', specialty: '  Ingeniería, arbitraje y «contratos»\nSegunda línea  ' }));
  assert.equal(result.record.name, 'García  Núñez, María-José');
  assert.equal(result.record.specialty, 'Ingeniería, arbitraje y «contratos»\nSegunda línea');
});
test('adjudicator records never gain arbitrator groups or qualifications', () => {
  const result = save([], 'adjudicators', draft({ profession: 'Ingeniero Civil', groups: [], qualifications: [] }));
  assert.equal(result.record.kind, 'adjudicators');
  assert.ok(!('groups' in result.record));
  assert.ok(!('qualifications' in result.record));
});
test('editing updates in place, retains stable ID and preserves hidden status', () => {
  const initial = save([], 'arbitrators', draft());
  const hidden = setRosterVisibility(initial.records, 'arbitrators', initial.record.id, false);
  const edited = save(hidden, 'arbitrators', draft({ name: 'Nombre editado', groups: [...groupOptions] }), initial.record.id);
  assert.equal(edited.records.length, 1);
  assert.equal(edited.record.id, initial.record.id);
  assert.equal(edited.record.visible, false);
  assert.equal(edited.record.name, 'Nombre editado');
  assert.equal(initial.record.name, 'Persona ficticia Álvarez');
});
test('editing cannot create a missing record or cross into the other section', () => {
  const initial = save([], 'arbitrators', draft());
  const missing = saveRosterRecord(initial.records, 'arbitrators', draft(), 'missing');
  const wrongSection = saveRosterRecord(initial.records, 'adjudicators', draft(), initial.record.id);
  assert.equal(missing.ok, false);
  assert.equal(wrongSection.ok, false);
});
test('homonyms have distinct identifiers; deletion removes only the selected record', () => {
  const one = save([], 'arbitrators', draft());
  const two = save(one.records, 'arbitrators', draft());
  const three = save(two.records, 'adjudicators', draft());
  assert.notEqual(one.record.id, two.record.id);
  const remaining = deleteRosterRecord(three.records, 'arbitrators', one.record.id);
  assert.equal(remaining.length, 2);
  assert.ok(remaining.some(record => record.id === two.record.id));
  assert.ok(remaining.some(record => record.id === three.record.id));
  assert.equal(deleteRosterRecord(three.records, 'adjudicators', one.record.id).length, 3);
});
test('visibility is reversible and independent from filtering and the other roster', () => {
  const one = save([], 'arbitrators', draft());
  const two = save(one.records, 'adjudicators', draft());
  const hidden = setRosterVisibility(two.records, 'arbitrators', one.record.id, false);
  assert.equal(hidden[0].visible, false);
  assert.equal(hidden[1].visible, true);
  assert.equal(searchRoster(hidden, 'arbitrators', '').length, 1);
  const shown = setRosterVisibility(hidden, 'arbitrators', one.record.id, true);
  assert.equal(shown[0].visible, true);
});
test('search matches names only, ignores accents and case, includes hidden records', () => {
  const one = save([], 'arbitrators', draft({ name: 'Álvarez Núñez', specialty: 'Otra especialidad' }));
  const two = save(one.records, 'adjudicators', draft({ name: 'Persona de otra nómina' }));
  const hidden = setRosterVisibility(two.records, 'arbitrators', one.record.id, false);
  assert.equal(searchRoster(hidden, 'arbitrators', ' ALVAREZ ').length, 1);
  assert.equal(searchRoster(hidden, 'arbitrators', 'especialidad').length, 0);
  assert.equal(searchRoster(hidden, 'adjudicators', 'ALVAREZ').length, 0);
  assert.equal(searchRoster([], 'arbitrators', '').length, 0);
});
test('operations and form editing never mutate input records or selection arrays', () => {
  const values = draft();
  const one = save([], 'arbitrators', values);
  values.groups.push('Contratación pública');
  if (one.record.kind !== 'arbitrators') assert.fail();
  assert.deepEqual(one.record.groups, ['Nacionales']);
  const editDraft = draftFromRecord(one.record);
  editDraft.groups.push('Contratación pública');
  assert.deepEqual(one.record.groups, ['Nacionales']);
  const snapshot = JSON.stringify(one.records);
  setRosterVisibility(one.records, 'arbitrators', one.record.id, false);
  deleteRosterRecord(one.records, 'arbitrators', one.record.id);
  assert.equal(JSON.stringify(one.records), snapshot);
});
test('new records cannot overwrite IDs; edits do not generate a new identifier', () => {
  const one = save([], 'arbitrators', draft());
  assert.throws(() => saveRosterRecord(one.records, 'arbitrators', draft(), null, () => one.record.id));
  const edited = saveRosterRecord(one.records, 'arbitrators', draft(), one.record.id, () => { throw new Error('must not generate'); });
  assert.equal(edited.ok, true);
});
