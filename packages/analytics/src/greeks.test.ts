import { test } from "node:test";
import assert from "node:assert/strict";
import { blackScholes } from "./greeks.ts";

const base = { spot: 100, strike: 100, years: 1, rate: 0.05, dividendYield: 0, volatility: 0.2 };

// Reference values from Hull, Options, Futures and Other Derivatives (S=K=100, r=5%, sigma=20%, T=1).
test("call price and delta match the textbook values", () => {
  const g = blackScholes({ ...base, right: "call" });
  assert.ok(Math.abs(g.price - 10.4506) < 1e-3, `price ${g.price}`);
  assert.ok(Math.abs(g.delta - 0.6368) < 1e-3, `delta ${g.delta}`);
});

test("put price satisfies put-call parity", () => {
  const call = blackScholes({ ...base, right: "call" });
  const put = blackScholes({ ...base, right: "put" });
  const parity = call.price - put.price - (base.spot - base.strike * Math.exp(-base.rate * base.years));
  assert.ok(Math.abs(parity) < 1e-6, `parity gap ${parity}`);
  assert.ok(Math.abs(put.price - 5.5735) < 1e-3, `put ${put.price}`);
});

test("call and put share gamma and vega; theta is negative for an ATM call", () => {
  const call = blackScholes({ ...base, right: "call" });
  const put = blackScholes({ ...base, right: "put" });
  assert.ok(Math.abs(call.gamma - put.gamma) < 1e-12);
  assert.ok(Math.abs(call.vega - put.vega) < 1e-12);
  assert.ok(call.theta < 0);
});

test("rejects non-positive inputs", () => {
  assert.throws(() => blackScholes({ ...base, years: 0, right: "call" }), RangeError);
});
