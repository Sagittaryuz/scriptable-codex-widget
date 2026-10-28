# Passive token collector — 2026-10-28

Prepared on scripting commit 4251f4e289e3d951dcc6554ced2b296ba01ff824,
which includes the published 1.6.16 contract from b30f575. UI, version,
network/security settings, grants and executable/transport configuration are
unchanged. The active checkout a186a1d is an ancestor, not a conflicting branch.

The existing CodexReader now dispatches only thread/tokenUsage/updated to an
optional callback. No methods were added to its RPC allowlist. The collector
uses its existing independent stdio connection, with no extra subscription,
resume, start, model request or wait. This deliberately does not solve access
to the desktop/shared-runtime integration.

Only official-event thread identity, totalTokens, receipt times, observed
interval deltas, hashed deduplication/turn keys and ordering/reset metadata
are stored in the ignored private work/scripting-token-usage.json. Neither
chat contents nor the notification's arbitrary extra fields are persisted.
The original existing private snapshot publishing route receives the optional
Task.tokenUsage field. The public projection remains an explicit allowlist
with empty tasks/windows; no token metrics are exported there.

Semantics:

- No event means no newly invented total, observation time or zero sample.
- First event on a new connection is a baseline. Existing historical metrics
  retain their true time until a new event; reconnection never bridges a gap.
- Repeated turn+total fingerprints do not advance observation time. last is
  never added to total. All displayed intervals are differences of cumulative
  totalTokens within the same connection and turn.
- A new turn starts a new baseline and clears prior intervals. UUIDv7 turn
  timestamps reject older turns; distinct IDs at an indistinguishable timestamp
  are conservatively ignored rather than assigned an invented order.
- An unseen decrease breaks the series. Same-turn deltas stay suppressed until
  a new turn establishes a baseline: a reset cannot be distinguished from an
  out-of-order unseen event, so this sacrifices coverage rather than double
  counts. Replayed known events are ignored. Stored fingerprints are bounded
  at 128; old replays can break coverage, but cannot create a negative interval.
- At most 24 strictly ordered receipt-time intervals are exported. Same-time
  updates merge an existing interval or remain baseline-only; no fake times.
- Clock rollback rejects the event; future stored observations are not attached
  to earlier snapshots. Corrupt/oversized private ledgers fail closed.
- Persistence is atomic; failure prevents publication of a partial observation.

Tests in scripts/test-passive-token-usage.cjs are explicitly synthetic, run
only in memory or test-owned temporary workspace directories, and never enter
the production ledger. They cover real reader dispatch and collect integration
using fake RPCs, and verify the unchanged RPC set and public projection.

Local real read results from the preceding step: account/usage/read succeeded
outside the sandbox, but threadUsage was null for the authorized main task;
all summary counters were null. These are unavailable values, not zeros.
No real thread/tokenUsage/updated sample has been validated by these tests.

The official daemon version command attempts the existing control socket and
fails with Windows socket error 10050 even outside the sandbox. This identifies
failure of that shared-runtime integration path, not failure of the working
independent stdio connection, not proof of unavailable internet, and not proof
that changing security/network/grants would help. No further socket retries
or network/security changes are part of this patch.

Operational activation must use the existing clean checkout and preserve the
scheduled task's action, triggers, principal and settings. Confirm the exact
watch-scripting.cjs process before restarting only CodexWidget-Scripting-Collector.
There is no new service, task, runtime, credential, release or UI version.

Validation: full npm run test:scripting passed, including 11 new passive-token
tests. Syntax and git diff --check passed. Older UI regression tests now keep
watcher equality; exact publisher/RPC/transport invariants are checked in the
new collector test, since the collector change is explicitly authorized.

