# BDS-App MVP Specification

## Overview
This document outlines the Minimum Viable Product (MVP) requirements for the BDS-App (Basic Distributed Syndication Application). The MVP will focus on delivering core functionality that enables communities to run structured decision cycles with deliberation, voting, and optional referendums. The implementation follows a domain-driven design with an onion layer architecture that forces domain logic to the bottom of the stack.

## Core Features for MVP

### 1. User Management & Authentication
- [ ] Email-based authentication (magic links)
- [ ] User profiles with display names
- [ ] Helpfulness scoring system
- [ ] Account locking mechanism for users with negative helpfulness scores
- [ ] "Unlock me" petition functionality

### 2. Configuration System
- [ ] Load and validate configuration from JSON/YAML
- [ ] Support for criteria definitions with schemas
- [ ] Track configuration with slots and voting methods
- [ ] Cadence definition (timing, duration)
- [ ] Forum behavior settings (collapse thresholds, author-only replies)

### 3. Content Management
- [ ] Create and display posts in criterion-based forums
- [ ] Support for different post types (Argument, Evidence, Synthesis, Petition)
- [ ] Comment system on posts
- [ ] Two-axis reaction system (Quality: Well said/Needs work; Stance: Agree/Disagree/Undecided)
- [ ] Auto-collapse of low-quality content
- [ ] Author-only replies for very low-quality threads

### 4. Decision Framework
- [ ] Criterion selection at cadence start
- [ ] Track-based nomination system
- [ ] Option creation with criterion-specific fields
- [ ] Combined forum support for tracks sharing criteria

### 5. Voting System
- [ ] Ranked-choice voting implementation
- [ ] Single Transferable Vote (STV) for multi-winner selections
- [ ] Instant Runoff Voting (IRV) for single-winner selections
- [ ] Configurable quotas (Droop/Hare)
- [ ] Tie-breaking mechanisms (deterministic/random)
- [ ] Ballot creation and submission

### 6. Results & Referendum
- [ ] Vote tallying and result calculation
- [ ] Results display with method, quota, and transfer information
- [ ] Optional supermajority referendum system
- [ ] Notification gating based on referendum results

### 7. Syndication
- [ ] RSS/Atom feed generation
- [ ] Basic webhook support (Discord, Slack)
- [ ] Email notification system

## Technical Requirements

### Architecture
The system follows a domain-driven design with an onion layer architecture:
- **Common Layer**: Generic types, utilities, and value objects (cannot import from any other layer)
- **Domain Layer**: Pure business entities and rules (imports from common only)
- **Enactment Layer**: Service interfaces for business operations (imports from common and domain)
- **Infrastructure Layer**: External adapters (database, APIs) (imports from common, domain and enactment)
- **Integration Layer**: Internal coordination logic (imports from common, domain, enactment, infrastructure)
- **Presentation Layer**: UI components and pages (imports from common and integration)

### Frontend
- [ ] Next.js with App Router
- [ ] React Server Components
- [ ] TypeScript
- [ ] Tailwind CSS for styling
- [ ] Responsive design

### Backend
- [ ] Next.js API Routes and Server Actions
- [ ] Prisma ORM
- [ ] SQLite for development, PostgreSQL for production
- [ ] Zod for validation
- [ ] Background job processing (Node.js scripts)

### Data Model (Core Entities)
- [ ] User (id, email, displayName, helpfulnessTotal, isLocked, createdAt)
- [ ] Cadence (id, name, windowStart, windowEnd, config)
- [ ] Criterion (id, key, name, schemaJson)
- [ ] Track (id, cadenceId, name, criterionId, slots, config)
- [ ] Post (id, authorId, trackId, criterionId, type, content, netQuality, netStance, engagement, isArchived, createdAt)
- [ ] Comment (id, postId, authorId, content, netQuality, netStance, isArchived, createdAt)
- [ ] Reaction (id, userId, targetType, quality, stance)
- [ ] Option (id, trackId, criterionId, authorId, payloadJson, createdAt)
- [ ] Ballot (id, trackId, userId, rankings, createdAt)
- [ ] Result (id, trackId, winners, method, quota, seed, createdAt)
- [ ] Referendum (id, trackId, question, threshold, votes, passed, createdAt)
- [ ] HelpfulnessRating (id, raterId, targetType, targetId, score)

## MVP User Flow

1. **Setup**
   - Instance operator configures criteria, tracks, and cadence
   - System initializes with configuration

2. **User Onboarding**
   - User registers/authenticates
   - User profile creation

3. **Cadence Start**
   - Users pick a criterion to advocate for
   - Access to criterion-specific forum is granted

4. **Deliberation Phase**
   - Users create posts (Arguments, Evidence, Synthesis)
   - Community reacts (quality and stance)
   - Users comment on posts
   - Low-quality content is auto-collapsed
   - Very low-quality threads are restricted to author replies

5. **Nomination Phase**
   - Users submit options for tracks
   - Options are validated against criterion schemas

6. **Voting Phase**
   - Users rank options in ballots
   - System collects and validates ballots

7. **Results Phase**
   - System calculates results using STV/IRV
   - Results are displayed with methodology
   - Optional referendum is conducted
   - If referendum passes, notifications are sent

## Success Criteria

### Functional Completeness
- [ ] Users can register and authenticate
- [ ] Users can select criteria and participate in forums
- [ ] Posts, comments, and reactions work correctly
- [ ] Voting system functions with both IRV and STV
- [ ] Results are calculated and displayed accurately
- [ ] Referendum system works as expected
- [ ] Syndication works (RSS, webhooks)

### Performance & Reliability
- [ ] Application loads within 2 seconds for basic pages
- [ ] Voting calculations complete within 30 seconds for moderate-sized communities (<1000 users)
- [ ] System handles concurrent users without data corruption
- [ ] Data is persisted correctly

### Quality Assurance
- [ ] Unit tests cover core functionality (>80% coverage)
- [ ] Integration tests for key user flows
- [ ] Configuration validation works correctly
- [ ] Error handling is implemented for all critical paths

## Out of Scope for MVP

### Advanced Features
- Proof-of-personhood integration
- Advanced moderation tools
- Complex notification systems
- Evidence snapshotting
- Detailed analytics
- Mobile app
- Advanced theming/customization

### Scaling Considerations
- Large-scale community support (>10,000 users)
- Advanced caching mechanisms (Redis)
- Multi-instance federation
- Complex scheduling systems

## Timeline Estimate

### Phase 1: Foundation (2-3 weeks)
- User authentication and profiles
- Configuration system
- Basic data model and database setup
- Core UI components
- Implementation of common layer utilities and types
- Implementation of domain layer entities

### Phase 2: Deliberation (2-3 weeks)
- Forum system with posts and comments
- Reaction system
- Content moderation features
- Helpfulness scoring
- Enactment layer interfaces
- Infrastructure layer implementations (database adapters)

### Phase 3: Decision Making (3-4 weeks)
- Nomination system
- Voting implementation (IRV/STV)
- Results calculation and display
- Integration layer coordination
- Complete integration of all layers

### Phase 4: Integration & Polish (1-2 weeks)
- Syndication features
- End-to-end testing
- Documentation
- Performance optimization

## Total Estimated Time: 8-12 weeks

## Key Assumptions
1. The development team has experience with Next.js, TypeScript, and Prisma
2. Hosting and deployment infrastructure will be handled separately
3. Basic UI/UX design will be sufficient for MVP
4. Community size for initial launch will be moderate (<1000 users)
5. Legal and compliance requirements are handled outside this scope

## Risks and Mitigations

### Technical Risks
- **Complexity of STV/IRV implementation**: Use established libraries where possible
- **Performance issues with voting calculations**: Implement efficient algorithms and consider pagination
- **Data consistency in concurrent environments**: Use proper database transactions

### Product Risks
- **User adoption of complex decision process**: Provide clear documentation and onboarding
- **Misuse of helpfulness scoring**: Implement safeguards and clear guidelines

### Mitigation Strategies
- Regular testing with sample data sets
- Incremental development with frequent validation
- Clear documentation for all features
- User feedback collection during development