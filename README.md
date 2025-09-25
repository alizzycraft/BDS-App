# BDS-App

BDS App — Basic Distributed Syndication Application. 

Simple rules. Distributed power. Evidence in, signals out.

BDS App is open-source software that helps communities run simple, distributed decision cycles. It provides structured discussion, quality-focused reactions, ranked-choice voting (single or multi-winner), and optional supermajority “announcement gates.” Deploy an instance for audience programming, team prioritization, meetups, accountability scorecards, and more.

BDS App is a tool. It doesn’t prescribe issues, targets, or actions. Instance operators configure cadence, tracks, criteria, and rules to fit their community.

What BDS App enables
- Deliberate: Structured forums for Arguments, Evidence (with citations), and Synthesis.
- Decide: Ranked-choice voting (IRV/STV) for one or more winners per cycle.
- Announce/Act (optional): A supermajority referendum gates notifications or calls-to-action.
- Syndicate: Publish clear results with rationale so others can follow or mirror.

Examples
- Creators/streamers:
  - Audience programming: “Vote on next month’s topics.” Run three parallel slots, combine discussions across the same criterion, select top 3 via STV, and broadcast only if a supermajority is excited.
  - Feature shaping: “Which feature should I build next?” Require brief nominations, let patrons rank, publish roadmap.
- Teams/clubs:
  - Project prioritization: Collect short evidence and impact notes; pick 2–3 winners for the next cycle.
  - Monthly meetup: Nominate venues (accessibility, price); select winners for multiple dates.
- Accountability/scorecards:
  - Standards reviews: One issue per cycle, evidence-first discussion, rank services by compliance, optionally coordinate a time-boxed, opt-in action if a supermajority supports it.

Key ideas and terms
- Cadence: Your repeating decision cycle (monthly by default; configurable).
- Criterion: The type/schema for options (e.g., Topic, FeatureRequest, Venue). Instances maintain the list of criteria in configuration.
- Track: A focus area that runs within a cadence, bound to a criterion (e.g., “Next Topics,” “Feature Requests,” “Meetup Venues,” “Accessibility Review”).
- Slot: Capacity per track (e.g., selecting 3 topics = 3 slots). Tracks can have one or more slots.
- Combined forum: If multiple tracks share the same criterion, you may merge their discussions while still selecting multiple winners (one per slot) via multi-winner voting.

Participation model: pick a criterion first
- At the start of each cadence, users choose exactly one criterion they will advocate for.
- Forums are split by criterion. Only users who picked a criterion can create new posts in that criterion’s forum.
- Anyone can still read, comment on, and react to posts across all criteria.
- Rationale: Encourage focused advocacy and higher-quality proposals; reduce off-topic posting; keep cross-criterion critique and questions open.

How a cycle works (typical flow)
- Week 1–2: Deliberation
  - Users pick their criterion (once per cadence, unless the operator allows a limited switch).
  - In each criterion forum, advocates create Arguments, Evidence, and Synthesis posts.
  - Reactions are two-axis:
    - Quality: Well said | Needs work
    - Stance: Agree | Disagree | Undecided
  - Views surface “Most well said,” “Most agreed/disagreed,” “Most engagement,” “Controversial,” and “Hidden gems.”
  - Auto-collapse for low-quality content; optional author-only replies on very low-quality sub-threads to reduce dogpiles. Anyone can still comment/react across criteria.
- Week 3: Ranked-choice vote
  - Single-winner IRV or multi-winner STV (winners = number of slots in each track).
  - If multiple tracks share a criterion and combine forums, deliberation is unified; voting still yields distinct winners for each track/slot set.
- Week 4: Optional referendum
  - Supermajority gate (e.g., two-thirds yes) controls whether a notification or action is broadcast.
  - Creators might ask: “Are you looking forward to these selected topics?”
  - Teams might ask: “Should we proceed with these projects now?”
  - If passed, the system syndicates a concise summary and plan; if not, results remain visible without broadcast.

Why separate quality from agreement
- Quality reactions elevate strong reasoning even when there’s disagreement.
- Agreement reactions show consensus/polarization without burying minority-but-good arguments.

Community integrity
- Helpfulness score:
  - In profile audit trails, community can rate past items:
    - Actually helpful (+3)
    - Trying to be helpful (+2)
    - Unhelpful (off-topic −1)
    - Unhelpful (mean-spirited −3)
  - If cumulative helpfulness < 0, posting/commenting/reacting is paused.
  - “Unlock me” forum: one petition thread to recover via positive contributions.
- Safety and fairness:
  - Auto-collapse below a quality threshold; optional author-only replies for very low-quality branches
  - Optional reason chips on “Needs work” (Missing sources, Off-topic, Rude, Duplicate)
  - Rate limits, new-account weighting, surge detection
  - Optional proof-of-personhood; simple COI disclosures

Multi-track and parallel slots
- Operators can run multiple tracks per cadence, each bound to a criterion and with a defined number of slots.
- When several tracks share a criterion, operators can:
  - Combine their forums into one discussion space (less duplication)
  - Run multi-winner STV to select as many winners as the total number of slots across those tracks
  - Allocate top winners to each track as configured

Voting methods
- Single-winner: IRV (instant-runoff)
- Multi-winner: STV (single transferable vote)
  - Quota: Droop (default) or Hare
  - Tie-breakers: deterministic (timestamp) or random with a published seed
- Results pages disclose method, quota, transfers (for STV), and link to top Synthesis posts

Notifications and syndication
- Channels: email, web push, RSS/Atom, webhooks (Discord, Slack)
- Gate: optional supermajority referendum to prevent noisy broadcasts
- Output: “Selected options,” schedule/plan, and rationale links

Tech overview
- Frontend: Next.js (App Router), React Server Components, TypeScript
- Styling: Tailwind CSS
- Data: Prisma ORM with SQLite (dev) or Postgres (prod)
- Validation: Zod
- Actions: Next.js Server Actions
- Background jobs: scoring recompute, archival, anomaly detection (Node/tsx or hosted cron)
- Caching: incremental revalidation; optional Redis for ranking caches
- Evidence snapshots (optional): archived copies to prevent link rot

Monorepo layout
- app/
  - tracks/ — list and manage active tracks
  - track/[id]/ — forum (by criterion), options, ballots, results
  - unlock/ — “Unlock me” petitions
  - (marketing)/ — About, FAQ, Principles
  - api/ — helpfulness, snapshots, webhooks
- prisma/ — schema and migrations
- src/
  - lib/ — db client, auth, scoring, snapshots
  - components/ — UI
  - workers/ — recompute, anomaly, archival
- docs/ — configuration, governance, voting
- scripts/ — seed and maintenance

Data model (simplified)
- User(id, email, displayName, helpfulnessTotal, isLocked, createdAt, chosenCriterionId for current cadence)
- Cadence(id, name, windowStart, windowEnd, config)
- Criterion(id, key, name, schemaJson)
- Track(id, cadenceId, name, criterionId, slots, combineWithCriterionIds?, config)
- Post(id, authorId, trackId?, criterionId?, type: Argument|Evidence|Synthesis|Petition, content, netQuality, netStance, engagement, isArchived, createdAt)
- Comment(id, postId, authorId, content, netQuality, netStance, isArchived, createdAt)
- Reaction(id, userId, targetType Post|Comment, quality −1/0/+1, stance −1/0/+1)
- Option(id, trackId, criterionId, authorId, payloadJson, createdAt)
- Ballot(id, trackId, userId, rankings Json, createdAt)
- Result(id, trackId, winners Json, method, quota, seed, createdAt)
- Referendum(id, trackId, question, threshold, yes/no/abstain, passed, createdAt)
- HelpfulnessRating(id, raterId, targetType, postId?/commentId?, score −3/−1/+2/+3)

Sorting and views
- NetQuality = sum of quality reactions
- NetStance = sum of stance reactions
- Engagement = reactions + comments
- Views:
  - Most well said / Needs most work (quality)
  - Most agreed / Most disagreed (stance)
  - Most engagement / Least engagement
  - Controversial (high engagement, near-zero net stance)
  - Hidden gems (low engagement, high quality)

Configuration (operator-friendly)
- Cadence: frequency, open/close, allowSwitchCriterion: boolean/limit
- Criteria: registry and schemas; determine who can post in which forum
- Tracks: slots, nomination rules, combine-forum behavior for shared criteria
- Voting: IRV/STV, winners = slots, tie-break rules
- Referendum: on/off, question template, yes-threshold (default two-thirds)
- Moderation: quality collapse threshold, author-only reply threshold, reason chips
- Integrity: rate limits, new-account weighting, anomaly detection
- Identity & privacy: email magic links (default), optional WebAuthn/proof-of-personhood, retention policies, pseudonymous modes with uniqueness safeguards

Getting started (development)
- Requirements: Node 18+, npm, SQLite (dev) or Postgres (prod)
- Install
  - npm install
  - npx prisma migrate dev
  - npm run dev
- Dev sign-in
  - A simple dev sign-in page is included; replace with your auth provider before production.
- Seed (optional)
  - npm run seed to create example criteria, tracks, and posts

Deployment
- Hosting: Vercel (app), Railway/Neon/Fly (Postgres)
- Env vars: DATABASE_URL, auth secrets, optional REDIS_URL
- Migrations: prisma migrate deploy on boot
- Jobs: schedule recompute and archival cron tasks
- Observability: enable logging/monitoring for vote windows and surges

Governance templates (optional)
- docs/governance.md — norms, facilitator rotation, evidence standards
- docs/voting.md — ballot policies, verification, and tally transparency
- docs/moderation.md — reason chips, appeals, helpfulness guidance
- docs/configuration.md — sample configs for creators, teams, meetups

FAQ

Q: Is this connected to “boycott, divest, sanction”?
A: No. “BDS App” stands for “Basic Distributed Syndication Application.” It’s general-purpose software for distributed decision-making. Some communities use it for consumer signals; others for programming content, picking venues, or prioritizing projects.

Q: Why must users pick a criterion at the start of a cadence?
A: Focus improves quality. Advocates for a criterion can start posts in that forum; everyone else can still comment and react across forums. This encourages well-argued proposals while preserving open critique and questions.

Q: Can users switch their criterion mid-cadence?
A: Operators decide. Many instances disallow switching or allow one switch with a visible profile note, to prevent tactical posting.

Q: Can multiple decisions run in parallel?
A: Yes. Configure multiple tracks per cadence. If several tracks share a criterion, you may merge their forums and select multiple winners (one per slot) via multi-winner STV.

Q: Do we have to use voting or referenda?
A: No. You can use BDS App purely for structured deliberation. Voting and referenda are optional modules.

Q: How do you prevent brigading or bullying?
A: Separation of quality vs. agreement, auto-collapse for low-quality, author-only replies for heated branches, helpfulness-based participation gates, rate limits, new-account weighting, and surge detection. Operators can tune thresholds.

Q: What about privacy?
A: Minimal data collection by default. You can allow pseudonymous participation while enforcing uniqueness (with safeguards). See docs/privacy.md.

Q: How are votes verified?
A: The voting module provides verifiable tallies and public method details. Optional proof-of-personhood strengthens uniqueness. STV/IRV configuration and tie-breakers are disclosed on results pages.

Branding
- Public name: BDS App
- Full name: Basic Distributed Syndication Application
- First mention pattern: “BDS App (Basic Distributed Syndication Application) enables communities to…”

License
- Code: MIT
- Default content license: CC BY-SA 4.0 (configurable per instance)

Quick start (dev)
- npm install
- npx prisma migrate dev
- npm run dev
- Visit home, pick a criterion, create a track, and try posts, reactions, nominations, and a sample ballot.