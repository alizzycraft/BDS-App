# Source Code Structure

This directory follows a domain-driven design with an onion layer architecture:

## Layers

1. **common** - Generic types, utilities, and value objects (no dependencies)
2. **domain** - Pure business entities and rules (depends only on common)
3. **enactment** - Service interfaces for business operations (depends on common and domain)
4. **infrastructure** - External adapters (database, APIs) (depends on common, domain, and enactment)
5. **integration** - Internal coordination logic (depends on common, domain, enactment, and infrastructure)
6. **presentation** - UI components and pages (depends on common and integration)

## Dependency Rules

- Each layer can only import from inner layers
- Common layer cannot import from any other layer
- Domain layer can only import from common
- Enactment layer can import from common and domain
- Infrastructure layer can import from common, domain, and enactment
- Integration layer can import from common, domain, enactment, and infrastructure
- Presentation layer can import from common and integration

This architecture ensures that core business logic remains independent of technical concerns and external dependencies.