# Requested task rows, 2026-11-13
Two most recently updated observed tasks across origins; collection time and status never promote tasks. Missing or future activity sorts last. Merge accepts every origin already present in authenticated feeds, without claiming full account coverage.
Ativos current draw.js reference 78c63b2ced0b0934b363e8c3c8940171789c52df: 26pt circular icon, two 13pt lines, 36x13pt capsule. Header unchanged. Graph/total removed only from compact task rows per latest two-line request; metrics remain available in source.
Unread observations support completed unopened results for ChatGPT/Codex and unread messages for Dots. No count inferred from ready state. No reliable producer for additional products or unread counts was found. Existing real collectors cover Codex local/cloud only.
Validated syntax/build, core TypeScript, simulated native row/header/badge geometry at four sizes, independent cache/failure tests and all-origin chronological fixtures. No native iOS device/render available. Historical tests that freeze the superseded row/priority layout require migration; full legacy suite is not claimed passing.

## Connector capability check
Read-only probes after publication confirmed:
- Account thread listing is updated-first but its returned rows have only identity, product and messaging capability, not activity timestamps/titles.
- A thread read provides last-turn outcome and messages, but no authoritative unread/opened state or dated task title metadata.
- ChatGPT search provides titles and update times for keyword matches, not an exhaustive newest-first activity feed. Search matches cannot establish the globally most recent two tasks.
- Dot room messages include sent time, but no owner read receipt; reading through the connector does not mark them read.
These are data-contract gaps, not permission failures. No new credentials, grants, synthetic production observations or cursor-derived timestamps were introduced. Additional products need a supported activity feed (stable ID, product, title, true updatedAt, optional state) and explicit unread/opened observations before automatic aggregation can be represented as complete.
