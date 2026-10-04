// Broker-neutral shapes every connector maps into.

export type BrokerId = "alpaca" | "tastytrade" | "tradier" | "schwab" | "ibkr" | "kraken";

export type OptionRight = "call" | "put";

export interface OptionContract {
  underlying: string;
  expiry: string; // ISO date, YYYY-MM-DD
  strike: number;
  right: OptionRight;
  multiplier: number; // usually 100
}

export interface Instrument {
  symbol: string; // broker-neutral symbol, e.g. "AAPL" or OCC "AAPL  261218C00200000"
  kind: "equity" | "option" | "crypto";
  option?: OptionContract;
}

export interface Position {
  broker: BrokerId;
  accountId: string; // broker's id, never sent anywhere by the open-source code
  instrument: Instrument;
  quantity: number; // signed: negative is short
  averageCost: number; // per unit, in account currency
}

export interface Fill {
  broker: BrokerId;
  accountId: string;
  instrument: Instrument;
  side: "buy" | "sell";
  quantity: number; // always positive
  price: number;
  fees: number;
  executedAt: string; // ISO timestamp
  orderId?: string; // fills sharing an order id are legs of one multi-leg order
}
