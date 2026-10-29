import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateCosts, regularScale } from '../src/lib/costs/engine.ts';
import { formatCents, fraction, positiveCents, roundHalfUp } from '../src/lib/costs/decimal.ts';
import { refundStages } from '../src/lib/costs/tables.ts';
import type { CostInputs, CostMode, CostResult } from '../src/lib/costs/types.ts';

const defaults: CostInputs = { amount: '50000', reconvention: 'no', arbitrators: '1', hasAmount: '', contractAmount: '50000000', claims: '', service: '', paid: '1000', stage: 'demanda', periods: '1', pages: '1', adjudicators: '1' };
const calc = (mode: CostMode, patch: Partial<CostInputs> = {}) => calculateCosts(mode, { ...defaults, ...patch }, 'PEN');
function sum(result: CostResult) {
  assert.ok(result.status === 'calculated' || result.status === 'referenceOnly');
  return result.sum.cents;
}
function base(q: string) { return roundHalfUp(regularScale(positiveCents(q)!)).toString(); }

test('decimal parsing is exact and never infers thousands separators', () => {
  assert.equal(positiveCents('50000,50'), 5000050n);
  assert.equal(positiveCents('50000.50'), 5000050n);
  assert.equal(positiveCents(' 0.01 '), 1n);
  for (const input of ['', '0', '-1', '+1', 'Infinity', 'NaN', '1e6', '1,000', '1.000', '1,000.00', '1.000,00', '1 000', '.5', '1.', '0.001']) assert.equal(positiveCents(input), null, input);
  assert.equal(positiveCents('9007199254740993.01'), 900719925474099301n);
});
test('half-up and formatting preserve cents without binary floating point', () => {
  assert.equal(roundHalfUp(fraction(1004n, 10n)), 100n);
  assert.equal(roundHalfUp(fraction(1005n, 10n)), 101n);
  assert.equal(roundHalfUp(fraction(1006n, 10n)), 101n);
  assert.equal(roundHalfUp(fraction(1n, 2n)), 1n);
  assert.equal(formatCents('900719925474099301'), 'S/ 9 007 199 254 740 993.01');
});
test('regular scale preserves literal endpoints and discontinuities on total quantity', () => {
  const cases = [
    ['0.01', '760000'], ['50000', '760000'], ['50001', '810001'],
    ['200000', '960000'], ['200001', '960001'], ['500000', '1260000'],
    ['500001', '1160001'], ['2000000', '2360000'],
    ['10000001', '4760000'], ['50000000', '20760000'],
    ['50000001', '15760000'], ['150000000', '45760000'],
    ['150000001', '46000000'], ['9007199254740993.01', '46000000'],
  ];
  for (const [q, expected] of cases) assert.equal(base(q), expected, q);
});
test('regular decimal gaps and malformed band never infer a range', () => {
  const gaps = ['50000.01', '50000.50', '50000.99', '200000.50', '500000.50', '2000000.50', '2000001', '5000000', '10000000', '10000000.50', '50000000.50', '150000000.50'];
  for (const amount of gaps) {
    const result = calc('regular', { amount });
    assert.equal(result.status, 'requiresReview', amount);
    assert.ok(!('sum' in result), amount);
    assert.equal(result.lines.length, 1, 'Only the known request charge remains');
  }
});
test('regular request is IGV-inclusive and each arbitrator has its own rounded concept', () => {
  const single = calc('regular');
  assert.equal(sum(single), '1893600');
  assert.equal(single.lines[0].amountCents, '100000');
  assert.equal(single.lines[0].igvCents, null);
  assert.equal(single.lines[1].baseCents, '760000');
  assert.equal(single.lines[1].igvCents, '136800');
  assert.equal(sum(calc('regular', { arbitrators: '3' })), '3687200');
  const fractional = calc('regular', { amount: '50001.10', arbitrators: '3' });
  assert.equal(fractional.lines.length, 5);
  assert.equal(fractional.lines[1].baseCents, '810001');
  assert.equal(sum(fractional), '3923204');
});
test('reconvention shows known charges but never a combined total', () => {
  const result = calc('regular', { reconvention: 'si' });
  assert.equal(result.status, 'requiresReview');
  assert.ok(!('sum' in result));
  assert.equal(result.lines.length, 4);
  assert.equal(result.lines[1].amountCents, '100000');
  const blocked = calc('regular', { reconvention: 'si', amount: '50000.50' });
  assert.equal(blocked.status, 'requiresReview');
  assert.equal(blocked.lines.length, 2);
});
test('emergency uses 20000 per concept and never adds a regular request', () => {
  const result = calc('emergencia');
  assert.equal(result.status, 'calculated');
  assert.equal(result.lines.length, 2);
  for (const line of result.lines) {
    assert.equal(line.baseCents, '2000000');
    assert.equal(line.igvCents, '360000');
    assert.equal(line.amountCents, '2360000');
    assert.deepEqual(line.source.printedPages, [3]);
  }
  assert.equal(sum(result), '4720000');
});
test('additional services preserve inclusive taxes and charge integer quantities only', () => {
  for (const service of ['appointment', 'recusation']) {
    const result = calc('adicionales', { service });
    assert.equal(sum(result), '200000');
    assert.equal(result.lines[0].tax, 'included');
    assert.equal(result.lines[0].igvCents, null);
  }
  assert.equal(sum(calc('adicionales', { service: 'custody', periods: '3' })), '708000');
  assert.equal(sum(calc('adicionales', { service: 'copy', pages: '3' })), '2100');
  for (const invalid of ['0', '-1', '1.5', '1,0', 'NaN', '1e3', 'Infinity', '']) {
    assert.equal(calc('adicionales', { service: 'custody', periods: invalid }).status, 'invalidInput', invalid);
    assert.equal(calc('adicionales', { service: 'copy', pages: invalid }).status, 'invalidInput', invalid);
  }
});
test('ad hoc is half the exact scale, rounded half-up before configured tax', () => {
  assert.equal(sum(calc('adicionales', { service: 'secretary', amount: '50000' })), '448400');
  const result = calc('adicionales', { service: 'secretary', amount: '50001' });
  assert.equal(result.lines[0].baseCents, '405001');
  assert.equal(result.lines[0].igvCents, '72900');
  assert.equal(sum(result), '477901');
  for (const amount of ['50000.50', '2000001', '10000000']) assert.equal(calc('adicionales', { service: 'secretary', amount }).status, 'requiresReview');
});
test('JPRD uses full tribunal amounts, stays net, and distributes 50% by party only', () => {
  const rows = [
    ['50000000', '520000', '800000', '1700000'],
    ['50000001', '620000', '1000000', '1980000'],
    ['70000000', '620000', '1000000', '1980000'],
    ['70000001', '720000', '1200000', '2280000'],
    ['99999999.99', '720000', '1200000', '2280000'],
    ['100000001', '820000', '1400000', '2580000'],
    ['150000000', '820000', '1400000', '2580000'],
    ['150000001', '920000', '1600000', '2880000'],
  ];
  for (const [contractAmount, centre, single, tribunal] of rows) {
    for (const adjudicators of ['1', '3']) {
      const result = calc('junta', { contractAmount, adjudicators });
      assert.equal(result.status, 'referenceOnly');
      if (result.status !== 'referenceOnly') continue;
      const selected = adjudicators === '1' ? single : tribunal;
      assert.equal(result.lines[0].baseCents, centre);
      assert.equal(result.lines[1].baseCents, selected);
      assert.equal(result.lines[1].igvCents, null);
      assert.equal(sum(result), (BigInt(centre) + BigInt(selected)).toString());
      assert.equal(result.perPartyCents, ((BigInt(centre) + BigInt(selected)) / 2n).toString());
    }
  }
});
test('JPRD blocks overlapping 100 million and all decimal gaps', () => {
  for (const contractAmount of ['50000000.50', '70000000.50', '100000000', '100000000.50', '150000000.50']) {
    const result = calc('junta', { contractAmount });
    assert.equal(result.status, 'requiresReview', contractAmount);
    assert.equal(result.lines.length, 0);
    assert.ok(!('sum' in result));
  }
});
test('indeterminate quantity always requires article 3 evaluation and never outputs zero', () => {
  const result = calc('indeterminada', { contractAmount: '100000', hasAmount: 'si', claims: '1' });
  assert.equal(result.status, 'requiresReview');
  assert.equal(result.lines.length, 0);
  assert.ok(!('sum' in result));
  assert.ok(result.sources.some(source => source.article === 'Artículo 3'));
});
test('every refund percentage is conditional, exact, and not taxed again', () => {
  const expected = ['97100', '94200', '91300', '88400', '79700', '67100', '54500', '41900', '26400', '0'];
  refundStages.forEach((stage, index) => {
    const result = calc('devolucion', { stage: stage.value });
    assert.equal(result.status, 'referenceOnly');
    assert.equal(sum(result), expected[index]);
    assert.equal(result.lines[0].igvCents, null);
    assert.ok(result.notes.some(note => note.includes('normativa especial')));
  });
  assert.equal(sum(calc('devolucion', { paid: '0.02', stage: 'informes' })), '1');
  assert.equal(calc('devolucion', { paid: '0' }).status, 'invalidInput');
  assert.equal(calc('devolucion', { stage: 'alegatos' }).status, 'invalidInput');
});
test('IGV is configurable, unknown IGV blocks taxable concepts only', () => {
  const result = calculateCosts('emergencia', defaults, 'PEN', { igvRate: '0.10', igvAssumption: false });
  assert.equal(sum(result), '4400000');
  assert.equal(sum(calculateCosts('emergencia', defaults, 'PEN', { igvRate: '0', igvAssumption: false })), '4000000');
  for (const igvRate of [null, 'Infinity', '-0.18', '18', '0,18', '1e-1']) assert.equal(calculateCosts('emergencia', defaults, 'PEN', { igvRate, igvAssumption: true }).status, 'requiresReview');
  assert.equal(calculateCosts('adicionales', { ...defaults, service: 'copy' }, 'PEN', { igvRate: null, igvAssumption: true }).status, 'calculated');
  assert.ok(calc('emergencia').notes.some(note => note.includes('18%') && note.includes('PDF no fija')));
});
test('invalid money and choices return errors, never monetary fallbacks', () => {
  for (const amount of ['', '0', 'NaN', 'Infinity', '1e4', '1,000', '-100', '0.001']) {
    const result = calc('regular', { amount });
    assert.equal(result.status, 'invalidInput', amount);
    assert.equal(result.lines.length, 0);
    assert.ok(!('sum' in result));
  }
  assert.equal(calc('regular', { arbitrators: '2' }).status, 'invalidInput');
  assert.equal(calc('regular', { reconvention: '' }).status, 'invalidInput');
  assert.equal(calc('junta', { adjudicators: '' }).status, 'invalidInput');
  assert.equal(calc('adicionales', { service: '' }).status, 'invalidInput');
});
test('dollars do not convert or return amounts', () => {
  const result = calculateCosts('regular', defaults, 'USD');
  assert.equal(result.status, 'requiresReview');
  assert.equal(result.lines.length, 0);
  assert.ok(!('sum' in result));
  assert.equal(calculateCosts('regular', defaults, 'EUR').status, 'invalidInput');
});
test('all calculated sums equal displayed rounded concepts and every rule cites printed pages', () => {
  const results = [calc('regular', { amount: '50001.50', arbitrators: '3' }), calc('emergencia'), calc('adicionales', { service: 'custody', periods: '7' }), calc('adicionales', { service: 'secretary', amount: '50001.50' }), calc('junta', { adjudicators: '3' }), calc('devolucion')];
  for (const result of results) {
    assert.equal(sum(result), result.lines.reduce((total, line) => total + BigInt(line.amountCents), 0n).toString());
    for (const line of result.lines) {
      assert.ok(line.source.article);
      assert.ok(line.source.printedPages.length);
      if (line.tax === 'plusIgv') assert.equal(BigInt(line.baseCents) + BigInt(line.igvCents!), BigInt(line.amountCents));
    }
  }
});

test('IGV half-cent rounds up independently for each arbitrator and centre', () => {
  const result = calc('regular', { amount: '50025', arbitrators: '3' });
  assert.equal(result.lines.length, 5);
  for (const line of result.lines.slice(1)) {
    assert.equal(line.baseCents, '810025');
    assert.equal(line.igvCents, '145805');
    assert.equal(line.amountCents, '955830');
  }
  assert.equal(sum(result), '3923320');
});
