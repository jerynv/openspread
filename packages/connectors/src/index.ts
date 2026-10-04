// Every broker adapter implements this. Adapters are read-only: no order placement.
// Credentials stay with the caller (the user's own device); adapters never persist or transmit them elsewhere.

import type { BrokerId, Fill, Position } from "../../schema/src/index.ts";

export interface Connector {
  readonly broker: BrokerId;
  listAccounts(): Promise<string[]>;
  positions(accountId: string): Promise<Position[]>;
  fills(accountId: string, since: Date): Promise<Fill[]>;
}
