import test from 'node:test';
import assert from 'node:assert/strict';
import { highlightParts } from '../src/lib/highlight.ts';
const matched = (text, query) => highlightParts(text, query).filter(p => p.matched).map(p => p.text);

test('matches accents and case while preserving original writing', () => {
  assert.deepEqual(matched('Código de ética 2025', 'CODIGO'), ['Código']);
  assert.deepEqual(matched('Código de ética 2025', 'etica'), ['ética']);
  assert.deepEqual(matched('Arbitraje y JPRD', 'jprd'), ['JPRD']);
});
test('empty and absent queries do not mark text', () => {
  assert.deepEqual(matched('Reglamento', ''), []);
  assert.deepEqual(matched('Reglamento', '   '), []);
  assert.deepEqual(matched('Reglamento', 'inexistente'), []);
});
test('search metacharacters and HTML-like input are literal text', () => {
  for (const query of ['[', '.*', '(a)', '<script>', '$']) {
    assert.deepEqual(matched(`Antes ${query} después`, query), [query]);
  }
  assert.deepEqual(matched('Reglamento de JPRD', '.*'), []);
});
test('all occurrences are highlighted, ignoring surrounding query whitespace', () => {
  assert.deepEqual(matched('Ética y ética', ' etica '), ['Ética', 'ética']);
});
test('combining marks and supplementary characters preserve exact text', () => {
  const text = '📄 Co\u0301digo de ética';
  const parts = highlightParts(text, 'codigo');
  assert.deepEqual(parts.filter(p => p.matched).map(p => p.text), ['Co\u0301digo']);
  assert.equal(parts.map(p => p.text).join(''), text);
  assert.deepEqual(matched('Ética 📄 Ética', '📄'), ['📄']);
});
test('partial matches retain the entire original text', () => {
  for (const [text, query] of [['Resolución', 'solu'], ['Código de ética', 'ética'], ['JPRD', 'jpr'], ['A.*B', '.*']]) {
    assert.equal(highlightParts(text, query).map(p => p.text).join(''), text);
  }
});
