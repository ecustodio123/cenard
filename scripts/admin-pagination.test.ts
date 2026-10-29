import test from 'node:test';
import assert from 'node:assert/strict';
import { adminDirectoryPage } from '../src/lib/admin/pagination.ts';
const records = Array.from({ length: 41 }, (_, index) => ({ id: index, name: `Álvarez, Persona ${index + 1}` }));
test('administrative pages cover each UUID once and search totals apply before slicing', () => {
  const pages = [1, 2, 3].map(page => adminDirectoryPage(records, 'ALVAREZ', page));
  assert.deepEqual(pages.map(page => page.items.length), [20, 20, 1]);
  assert.equal(new Set(pages.flatMap(page => page.items.map(row => row.id))).size, 41);
  assert.deepEqual([pages[2].from, pages[2].to, pages[2].filtered.length], [41, 41, 41]);
});
test('deleting the last row of the final page adjusts to the preceding page', () => {
  const page = adminDirectoryPage(records.slice(0, -1), '', 3);
  assert.equal(page.page, 2); assert.equal(page.items.length, 20);
});
test('search and empty results clamp stale pages without mutating the records', () => {
  const before = JSON.stringify(records);
  const match = adminDirectoryPage(records, 'persona 41', 3);
  assert.equal(match.page, 1); assert.equal(match.items[0].id, 40);
  const empty = adminDirectoryPage(records, 'no existe', 3);
  assert.deepEqual([empty.page, empty.from, empty.to, empty.items.length], [1, 0, 0, 0]);
  assert.equal(JSON.stringify(records), before);
});
