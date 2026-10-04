# Security

This project handles brokerage credentials on the user's own device. Please report vulnerabilities privately rather than in a public issue: use GitHub's "Report a vulnerability" button on this repository.

Rules the code follows:

- Adapters are read-only. No code path places, modifies or cancels orders.
- Credentials are passed in by the caller and never written to disk or sent anywhere by this code.
- No telemetry.
