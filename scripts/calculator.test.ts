import test from "node:test";
import assert from "node:assert/strict";
import {
  amountSchema,
  getTariffAvailability,
  validateEstimate,
} from "../src/lib/calculator.ts";

test("decimal formats accept comma or dot without ambiguous grouping", () => {
  assert.equal(amountSchema.parse("15000,50"), 15000.5);
  assert.equal(amountSchema.parse("15000.50"), 15000.5);
  for (const v of [
    "",
    "0",
    "-1",
    "1,000.50",
    "1.000,50",
    "1e6",
    "Infinity",
    "10.999",
    "99999999999999999999",
  ])
    assert.equal(amountSchema.safeParse(v).success, false, v);
});
test("all six modes validate their required fields without calculating tariffs", () => {
  assert.deepEqual(
    validateEstimate("regular", {
      currency: "PEN",
      amount: "1",
      arbitrators: "1",
      reconvention: "no",
    }),
    {},
  );
  assert.deepEqual(
    validateEstimate("regular", {
      currency: "USD",
      amount: "1000000",
      arbitrators: "3",
      reconvention: "si",
    }),
    {},
  );
  assert.ok(validateEstimate("regular", { currency: "PEN" }).amount);
  assert.deepEqual(validateEstimate("emergencia", { currency: "PEN" }), {});
  assert.ok(
    validateEstimate("indeterminada", {
      currency: "PEN",
      hasAmount: "si",
      arbitrators: "1",
      claims: "0",
    }).claims,
  );
  assert.ok(
    validateEstimate("indeterminada", {
      currency: "PEN",
      hasAmount: "si",
      arbitrators: "1",
      claims: "1",
    }).contractAmount,
  );
  assert.deepEqual(
    validateEstimate("indeterminada", {
      currency: "PEN",
      hasAmount: "no",
      arbitrators: "3",
      claims: "2",
    }),
    {},
  );
  assert.ok(
    validateEstimate("adicionales", {
      currency: "PEN",
      service: "copy",
      pages: "1.5",
    }).pages,
  );
  assert.ok(
    validateEstimate("adicionales", {
      currency: "PEN",
      service: "custody",
      periods: "-2",
    }).periods,
  );
  assert.ok(
    validateEstimate("adicionales", { currency: "PEN", service: "secretary" })
      .amount,
  );
  assert.deepEqual(
    validateEstimate("adicionales", {
      currency: "PEN",
      service: "appointment",
    }),
    {},
  );
  assert.deepEqual(
    validateEstimate("adicionales", { currency: "USD", service: "recusation" }),
    {},
  );
  assert.deepEqual(
    validateEstimate("junta", { currency: "PEN", contractAmount: "" }),
    {},
  );
  assert.ok(
    validateEstimate("junta", { currency: "PEN", contractAmount: "-1" })
      .contractAmount,
  );
  assert.ok(
    validateEstimate("devolucion", {
      currency: "PEN",
      paid: "0",
      stage: "demanda",
    }).paid,
  );
  assert.deepEqual(
    validateEstimate("devolucion", {
      currency: "USD",
      paid: "200",
      stage: "alegatos",
    }),
    {},
  );
  assert.equal(getTariffAvailability().canCalculate, false);
});
