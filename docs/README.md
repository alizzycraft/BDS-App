# BDS-App Documentation

This folder contains documentation for the BDS-App project, including specifications, technical architecture, development roadmap, and UX design guidelines. The implementation follows a domain-driven design with an onion layer architecture that forces domain logic to the bottom of the stack.

## Documents

### [MVP_SPEC.md](MVP_SPEC.md)
**MVP Specification** - Outlines the Minimum Viable Product requirements for BDS-App, including core features, technical requirements, user flows, and success criteria. The implementation follows a domain-driven design with onion layer architecture.

### [TECHNICAL_ARCHITECTURE.md](TECHNICAL_ARCHITECTURE.md)
**Technical Architecture** - Details the system architecture following a domain-driven design with onion layer approach, technology stack, data model, core services, and technical considerations for the BDS-App implementation.

### [DEVELOPMENT_ROADMAP.md](DEVELOPMENT_ROADMAP.md)
**Development Roadmap** - Provides a phased approach to implementing the BDS-App MVP with timeline, tasks, milestones, and risk management strategies, organized around the onion layer architecture.

### [UX_DESIGN.md](UX_DESIGN.md)
**User Experience Design** - Specifies the user experience design principles, interface components, user flows, and accessibility considerations for the application, aligned with the architectural approach.

## Project Overview

BDS-App (Basic Distributed Syndication Application) is open-source software that helps communities run structured decision cycles. It provides:

- **Structured Deliberation**: Forums segmented by criteria where users advocate for one focus area per cycle
- **Quality-Centric Reactions**: Dual-axis reactions (quality: "Well said"/"Needs work"; stance: Agree/Disagree)
- **Ranked-Choice Voting**: Support for Instant Runoff Voting (IRV) and Single Transferable Vote (STV) with configurable quotas
- **Optional Referendum Gate**: Supermajority approval required before broadcasting results or triggering actions
- **Syndication**: Publish clear summaries with rationale via email, RSS, webhooks (e.g., Discord, Slack)

## Architecture Approach

The BDS-App follows a domain-driven design with an onion layer architecture:

1. **Common Layer** (innermost) - Generic types, utilities, and value objects (cannot import from any other layer)
2. **Domain Layer** - Pure business entities and rules (imports from common only)
3. **Enactment Layer** - Service interfaces for business operations (imports from common and domain)
4. **Infrastructure Layer** - External adapters (database, APIs) (imports from common, domain and enactment)
5. **Integration Layer** - Internal coordination logic (imports from common, domain, enactment, infrastructure)
6. **Presentation Layer** (outermost) - UI components and pages (imports from common and integration)

This approach ensures that core business logic remains independent of technical concerns and external dependencies, making the system highly maintainable and testable. The common layer provides shared utilities and types that can be used across all other layers without creating dependencies.

## Getting Started

For information on setting up the development environment, see the main [README.md](../README.md) in the project root.

## Contributing

Please read the documentation before contributing to the project. If you have suggestions for improvements to any of these documents, please open an issue or submit a pull request.