# openspread

Open-source, read-only connectors and analytics for your own brokerage accounts. You bring your own broker credentials; everything runs on your machine.

- **Connectors**: one read-only adapter per broker, mapped into a shared schema. No order placement.
- **Analytics**: option pricing and Greeks, multi-leg position grouping, cross-account wash-sale tracking.
- **Your keys stay with you**: the code never sends credentials or account data anywhere you did not point it.

> Status: early. The schema and the Black-Scholes Greeks are in place; broker adapters are next.

## Packages

| Package | What it does |
|---|---|
| `packages/schema` | Broker-neutral types: positions, fills, option contracts |
| `packages/analytics` | Pricing and Greeks (Black-Scholes-Merton), more to come |
| `packages/connectors` | The `Connector` interface; adapters land here |

## Planned brokers

Each adapter uses the broker's official API with credentials you create yourself (a personal API app or key), read-only where the broker offers it.

| Broker | Route | Status |
|---|---|---|
| Alpaca | OAuth, read-only by default | Planned first |
| Tradier | Personal API token | Planned |
| tastytrade | Personal OAuth app | Planned |
| Schwab | Personal Trader API app | Planned |
| Interactive Brokers | Client Portal API | Planned |
| Kraken | Read-only API key | Planned |

You are responsible for using your broker's API within its terms.

## Develop

Requires Node 23.6+ (TypeScript runs natively) and pnpm.

```sh
pnpm install
pnpm test        # node --test on the .ts sources
pnpm typecheck
```

## Not investment advice

This software computes numbers from your own data. It does not recommend trades, and nothing it outputs is investment, tax or legal advice. Check anything that matters (especially tax figures) against your broker's official statements.

## License

Apache-2.0. See [LICENSE](LICENSE).
