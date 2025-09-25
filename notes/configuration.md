# Configuration Guide — BDS App (Basic Distributed Syndication Application)

This document helps instance operators configure cadence, criteria, tracks, forums,
voting, referenda, integrity, and privacy settings for BDS App.

BDS App is a tool. It does not prescribe issues, targets, or actions. You
configure it for your community’s goals: audience programming, project
prioritization, meetups, or accountability scorecards.

---

## Quick start

- Cadence: monthly
- Criterion pick: required at cadence start; no switching mid-cadence
- Tracks: 1–3 tracks per cadence; each bound to a criterion
- Voting: IRV (single-winner) or STV (multi-winner)
- Referendum: optional, two-thirds yes to trigger notifications
- Moderation: collapse content with net quality < 0; author-only replies < -3
- Integrity: rate limits, new-account weighting
- Privacy: email magic links; pseudonyms allowed; minimal logs

---

## Concepts and Config Keys

- cadence: Defines the cycle window and timing.
- criteria: Registry of option types and their schemas.
- tracks: Decision tracks tied to a criterion; each has one or more slots.
- forums: Deliberation spaces; split by criterion with optional combining.
- voting: IRV/STV with quotas and tie-break rules.
- referendum: Optional supermajority gate for announcements/actions.
- participation: Criterion pick rules, posting permissions, switching policy.
- moderation: Collapse thresholds, reason chips, author-only replies.
- integrity: Rate limits, new-account weighting, surge detection.
- identity & privacy: Auth method, proof-of-personhood, retention.

---

## Example: Base Configuration (YAML)

```yaml
cadence:
  name: "Monthly"
  frequency: "monthly"            # weekly | monthly | custom
  startDay: 1                     # first day of month
  durationDays: 28                # or end-of-month logic

participation:
  requireCriterionPick: true
  allowSwitchCriterion: false     # or number (e.g., 1) to allow one switch per cadence
  postingPermission:              # who can create posts in a criterion forum
    advocatesOnly: true           # only users who picked that criterion
  crossForumInteractions:
    allowComments: true
    allowReactions: true

criteria:
  - id: "topic"
    name: "Topic"
    schema:
      fields:
        - key: "title"
          type: "string"
          required: true
        - key: "sourceUrl"
          type: "url"
          required: false
        - key: "summary"
          type: "text"
          required: false
  - id: "feature"
    name: "FeatureRequest"
    schema:
      fields:
        - key: "title"
          type: "string"
          required: true
        - key: "description"
          type: "text"
          required: true
        - key: "complexity"
          type: "enum"
          values: ["S", "M", "L"]
          required: false
  - id: "venue"
    name: "Venue"
    schema:
      fields:
        - key: "name"
          type: "string"
          required: true
        - key: "address"
          type: "string"
          required: false
        - key: "accessibilityNotes"
          type: "text"
          required: false
        - key: "priceRange"
          type: "enum"
          values: ["$", "$$", "$$$"]
          required: false

tracks:
  - id: "next-topics"
    name: "Next Topics"
    criterionId: "topic"
    slots: 3
    combineForum: true            # merge forum with other tracks sharing "topic"
    nomination:
      open: true
      maxPerUser: 3
      requireFields: ["title"]
    voting:
      method: "STV"               # IRV | STV
      quota: "Droop"              # Droop | Hare
      winners: 3                  # auto-derived from slots; can override
      tieBreaker: "deterministic" # deterministic | random
      randomSeed: ""              # set if tieBreaker=random
    referendum:
      enabled: true
      question: "Are you looking forward to these selected topics?"
      threshold: "twoThirds"      # twoThirds | threeFifths | custom
      customThreshold: 0.66       # used if threshold=custom

  - id: "feature-priorities"
    name: "Feature Priorities"
    criterionId: "feature"
    slots: 2
    combineForum: false
    nomination:
      open: true
      maxPerUser: 2
      requireFields: ["title", "description"]
    voting:
      method: "STV"
      quota: "Droop"
      winners: 2
      tieBreaker: "deterministic"
    referendum:
      enabled: false

  - id: "meetup-venues"
    name: "Meetup Venues"
    criterionId: "venue"
    slots: 2
    combineForum: false
    nomination:
      open: true
      maxPerUser: 2
      requireFields: ["name", "accessibilityNotes"]
    voting:
      method: "IRV"
      winners: 1                     # selects one venue per ballot; run twice or clone track
      runOncePerSlot: true           # auto-run ballot per slot
    referendum:
      enabled: true
      question: "Should we schedule events at these venues?"
      threshold: "twoThirds"

forums:
  collapseThreshold:
    post: 0
    comment: 0
  authorOnlyReplyThreshold:
    post: -3
    comment: -3
  reasonChips:
    enabled: true
    options: ["Missing sources", "Off-topic", "Rude", "Duplicate"]

moderation:
  helpfulness:
    lockBelow: 0
    ratings: { helpful: 3, trying: 2, offTopic: -1, meanSpirited: -3 }
  editWindowMinutes: 10
  archiveVisibility:
    visibleToPriorViewers: true
    hiddenFromNewViewers: true

integrity:
  rateLimits:
    reactionsPerMinute: 20
    commentsPerMinute: 5
    postsPerHour: 3
  newAccountWeighting:
    durationDays: 30
    qualityWeight: 0.5
    stanceWeight: 0.5
  surgeDetection:
    enabled: true
    thresholdStdDevs: 4
    actions: ["throttleThread", "flagModeration"]

identity:
  authMethod: "emailMagicLink"      # nextAuthEmail | custom | webauthnOnly
  allowPseudonyms: true
  proofOfPersonhood:
    enabled: false
    provider: ""
  coiDisclosures:
    enabled: true
    promptOnPost: true

privacy:
  contentRetentionDays: 365
  deleteRequests:
    allowUserDelete: true
    archivalForEngagedViewers: true

notifications:
  channels: ["email", "rss", "webpush", "webhook"]
  webhooks:
    discord: ""
    slack: ""
```

---

## Criterion Pick Flow

- requireCriterionPick: true ensures users choose exactly one criterion at the
  start of each cadence before posting in any forum.
- advocatesOnly: true limits new post creation in a forum to users who picked
  that forum’s criterion.
- Comments and reactions remain open across forums (cross-critique and questions
  are encouraged).
- allowSwitchCriterion:
  - false: users cannot switch mid-cadence.
  - number (e.g., 1): users can switch up to that many times per cadence; a
    profile note records the switch to discourage tactical swaps.

Recommendations:
- Most communities set allowSwitchCriterion: false or 1.
- Display the user’s chosen criterion in their profile and on their new posts for
  the current cadence.

---

## Forum Behavior

- Split forums by criterion to keep discussions focused.
- combineForum: true merges forums for tracks sharing a criterion. This reduces
  duplication when you have multiple slots for the same type (e.g., Topics).
- Visibility:
  - Auto-collapse items with net quality below forums.collapseThreshold.
  - Author-only replies for items below authorOnlyReplyThreshold to reduce
    dogpiles while allowing the author to clarify.
- Reason chips:
  - If enabled, downvoters can optionally select a reason (Missing sources,
    Off-topic, Rude, Duplicate). Use these to guide improvement and moderation.

---

## Nominations and Options

- Each track can accept nominations with criterion-specific fields (schema).
- nomination.requireFields guards against low-effort options.
- nomination.maxPerUser prevents spammy flooding.
- Consider requiring citations/links for Evidence-style nominations.

---

## Voting Configuration

- Single-winner: IRV is simple and fits “pick one” use cases (e.g., a single
  venue).
- Multi-winner: STV selects multiple distinct options, ideal when your track has
  multiple slots (e.g., 3 topics). Winners = slots by default.
- Quota:
  - Droop (default) tends to be more proportional with fewer exhausted ballots.
  - Hare can be configured for different proportionality characteristics.
- Tie-breaker:
  - deterministic (timestamp/ID): predictable but can privilege earlier
    nominations.
  - random: supply a public seed; store it in the Result for auditability.

Display:
- Results pages should show method, quota, transfers (STV), the random seed if
  used, and links to top Synthesis posts that informed the outcome.

---

## Referendum (Announcement/Action Gate)

- Optional supermajority check after voting.
- If passed, the system broadcasts via configured channels (email, web push,
  RSS, webhooks).
- If not passed, results remain visible but no broadcast is sent (reduces noise).
- Typical thresholds:
  - twoThirds (0.666…)
  - threeFifths (0.6)
  - custom (e.g., 0.7)
- Question templates:
  - Creators: “Are you looking forward to these selected topics?”
  - Teams: “Should we proceed with these projects this cycle?”
  - Accountability: “Should we coordinate a one-month pause for X on Y issue?”

---

## Moderation and Helpfulness

- Helpfulness scoring:
  - actually helpful: +3
  - trying to be helpful: +2
  - unhelpful (off-topic): -1
  - unhelpful (mean-spirited): -3
- lockBelow: 0 pauses posting/commenting/reacting for users with negative totals.
- “Unlock me”:
  - Locked users can open one petition thread.
  - If they gain net positive helpfulness there, they may recover above 0 and be
    restored automatically.
- Edit and archive:
  - Short edit windows reduce bait-and-switch edits.
  - Self-archive hides content from new viewers while preserving access for those
    who engaged (accountability).

---

## Integrity and Anti-Gaming

- Rate limits and burst caps per thread prevent floods.
- New-account weighting reduces early influence (gradually ramps up).
- Surge detection can throttle a thread or flag moderators when anomalous voting
  patterns occur.
- Optional proof-of-personhood (PoP) can be enabled for stronger uniqueness:
  - Keep PoP optional to preserve accessibility and privacy.
- COI disclosures:
  - Prompt users to disclose relevant affiliations when posting in sensitive
    tracks (e.g., vendor/platform topics).

---

## Identity and Privacy

- Default auth: email magic links (replaceable with NextAuth or WebAuthn).
- Pseudonyms are supported; pair with uniqueness safeguards (e.g., device
  attestations, PoP).
- Retention:
  - Consider a 6–12 month default for content; longer for governance records.
- Delete requests:
  - Allow user-initiated deletion with archival visibility for prior engagers.

---

## Notifications and Syndication

- Channels:
  - Email: bulk but permissioned
  - Web push: lightweight for opted-in browsers/devices
  - RSS/Atom: passive syndication for transparency
  - Webhooks: integrate with Discord/Slack/your systems
- Gate:
  - Use referenda thresholds to prevent spammy outputs.
  - Only push when a clear supermajority supports broadcasting.

---

## Example Setups

### 1) Creator Programming
- Cadence: monthly
- Criteria: Topic (shared), FeatureRequest (separate)
- Tracks:
  - Next Topics: criterion=topic, slots=3, combineForum=true, STV, referendum enabled (two-thirds)
  - Feature Priorities: criterion=feature, slots=2, STV, referendum disabled
- Participation: requireCriterionPick=true, allowSwitchCriterion=0
- Notes: Announce topics only if anticipation referendum passes.

### 2) Team Prioritization
- Cadence: monthly
- Criteria: Project
- Tracks:
  - Q Sprint Picks: criterion=project, slots=2, combineForum=false, STV, referendum enabled (“Proceed now?”)
- Participation: requireCriterionPick=true, allowSwitchCriterion=1
- Notes: Require brief with impact estimate; publish rationale with links.

### 3) Meetup Planning
- Cadence: monthly or biweekly
- Criteria: Venue
- Tracks:
  - Friday Venue: criterion=venue, slots=1, IRV, referendum enabled
  - Saturday Venue: criterion=venue, slots=1, IRV, referendum enabled
- Participation: requireCriterionPick=true
- Notes: Accessibility notes required; send RSVP link only if referendum passes.

---

## Operational Tips

- Make “pick-your-criterion” prominent at cadence start; show the user’s choice in the UI.
- Encourage Synthesis posts near the end of deliberation; they improve voter
  understanding.
- Lock comments 24 hours before a referendum to reduce last-minute pile-ons.
- Publish a post-mortem each cadence: what worked, what to tweak.

---

## Defaults (Recommended)

- Cadence: monthly (28–31 days)
- requireCriterionPick: true
- allowSwitchCriterion: 0
- combineForum: true for same-criterion multi-slot tracks
- Voting: IRV (single-winner), STV+Droop (multi-winner)
- Referendum: enabled for external notifications, two-thirds yes
- Collapse thresholds: net quality < 0 collapse; < -3 author-only replies
- Helpfulness lockBelow: 0
- New-account weighting for 30 days
- Pseudonyms allowed; no PoP by default

---

## Versioning Config

Include a configVersion and migrations for breaking changes in your instance’s
config. Store the active config snapshot with each cadence for auditability.

```yaml
configVersion: 1
```

---

## Appendix: Glossary

- Cadence: Repeating decision window.
- Criterion: Option type/schema (Topic, FeatureRequest, Venue, etc.).
- Track: A decision stream bound to a criterion with N slots.
- Slot: A winner/capacity unit for a track.
- Combined forum: Merged discussion for tracks that share a criterion.
- IRV: Instant-runoff voting (single winner).
- STV: Single transferable vote (multi-winner).
- Referendum: Supermajority check gating announcements/actions.