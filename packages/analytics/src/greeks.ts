// Black-Scholes-Merton price and greeks for European options.
// Inputs: spot S, strike K, years to expiry t, risk-free rate r, dividend yield q, volatility sigma.

import type { OptionRight } from "../../schema/src/index.ts";

export interface GreekInputs {
  spot: number;
  strike: number;
  years: number;
  rate: number;
  dividendYield: number;
  volatility: number;
  right: OptionRight;
}

export interface Greeks {
  price: number;
  delta: number;
  gamma: number;
  theta: number; // per calendar day
  vega: number; // per 1 vol point (0.01)
}

// Abramowitz-Stegun 7.1.26 via erf; absolute error under 1.5e-7.
function normCdf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const z = Math.abs(x) / Math.SQRT2;
  const t = 1 / (1 + 0.3275911 * z);
  const poly = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
  const erf = 1 - poly * Math.exp(-z * z);
  return 0.5 * (1 + sign * erf);
}

function normPdf(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

export function blackScholes(input: GreekInputs): Greeks {
  const { spot: S, strike: K, years: t, rate: r, dividendYield: q, volatility: v, right } = input;
  if (!(S > 0 && K > 0 && t > 0 && v > 0)) {
    throw new RangeError("spot, strike, years and volatility must be positive");
  }

  const sqrtT = Math.sqrt(t);
  const d1 = (Math.log(S / K) + (r - q + 0.5 * v * v) * t) / (v * sqrtT);
  const d2 = d1 - v * sqrtT;
  const discQ = Math.exp(-q * t);
  const discR = Math.exp(-r * t);

  const gamma = (discQ * normPdf(d1)) / (S * v * sqrtT);
  const vega = (S * discQ * normPdf(d1) * sqrtT) / 100;
  const decay = -(S * discQ * normPdf(d1) * v) / (2 * sqrtT);

  if (right === "call") {
    return {
      price: S * discQ * normCdf(d1) - K * discR * normCdf(d2),
      delta: discQ * normCdf(d1),
      gamma,
      theta: (decay - r * K * discR * normCdf(d2) + q * S * discQ * normCdf(d1)) / 365,
      vega,
    };
  }
  return {
    price: K * discR * normCdf(-d2) - S * discQ * normCdf(-d1),
    delta: -discQ * normCdf(-d1),
    gamma,
    theta: (decay + r * K * discR * normCdf(-d2) - q * S * discQ * normCdf(-d1)) / 365,
    vega,
  };
}
