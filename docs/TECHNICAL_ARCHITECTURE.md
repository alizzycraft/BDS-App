# BDS-App Technical Architecture

## Overview
This document describes the technical architecture for the BDS-App MVP. The system follows a domain-driven design with an onion layer architecture that forces domain logic to the bottom of the stack, ensuring clean separation of concerns and maintainability.

## System Architecture

### Onion Layer Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  (UI Components, HTML/CSS, Frontend Logic)                 │
├─────────────────────────────────────────────────────────────┤
│                    Integration Layer                        │
│  (Internal Logic Implementations, Request/Response Handling)│
├─────────────────────────────────────────────────────────────┤
│                    Infrastructure Layer                     │
│  (External Adapters: Database, APIs, External Services)    │
├─────────────────────────────────────────────────────────────┤
│                    Enactment Layer                          │
│  (Service Interfaces, Business Logic Contracts)            │
├─────────────────────────────────────────────────────────────┤
│                    Domain Layer                             │
│  (Core Entities, Business Rules, Domain Services)          │
├─────────────────────────────────────────────────────────────┤
│                    Common Layer                             │
│  (Generic Types, Utilities, Value Objects, Fundamentals)    │
└─────────────────────────────────────────────────────────────┘
```

### Layer Dependencies
- **Common Layer**: Cannot import from any other layer (pure utilities and generics)
- **Domain Layer**: Can import from common layer only (pure business logic)
- **Enactment Layer**: Can import from common and domain layers (service interfaces)
- **Infrastructure Layer**: Can import from common, domain and enactment layers (external implementations)
- **Integration Layer**: Can import from common, domain, enactment, and infrastructure layers (internal coordination)
- **Presentation Layer**: Can import from common and integration layers (UI implementations)

## Technology Stack

### Frontend
- **Framework**: Next.js (App Router)
- **Components**: React Server Components
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React built-in hooks and context

### Backend
- **Framework**: Next.js API Routes and Server Actions
- **Language**: TypeScript
- **Validation**: Zod
- **Authentication**: NextAuth.js (email magic links)
- **Caching**: Incremental Static Regeneration (ISR)

### Data Layer
- **ORM**: Prisma
- **Database**: SQLite (development), PostgreSQL (production)
- **Migrations**: Prisma Migrate

### Infrastructure
- **Hosting**: Vercel (application), Railway/Neon/Fly.io (database)
- **Background Jobs**: Node.js scripts with cron scheduling
- **Environment Management**: .env files

## Core Modules and Directory Structure

### Onion Architecture Structure
```
app/                    # Presentation Layer
├── tracks/            # Track UI components and pages
├── track/[id]/        # Individual track pages
├── unlock/            # Unlock petition UI
├── api/               # API endpoints (integration layer boundary)
├── ...                # Marketing pages

src/                    # Core application logic
├── common/            # Common Layer
│   ├── types/         # Generic types and interfaces
│   ├── utilities/     # Utility functions
│   └── value-objects/ # Fundamental value objects
├── domain/            # Domain Layer
│   ├── entities/      # Core business entities
│   ├── services/      # Domain services and business rules
│   └── repositories/  # Domain repository interfaces
├── enactment/         # Enactment Layer
│   ├── services/      # Service interfaces for business operations
│   └── dtos/          # Data Transfer Objects
├── infrastructure/    # Infrastructure Layer
│   ├── persistence/   # Database implementations
│   ├── external/      # External API clients
│   └── config/        # Configuration adapters
├── integration/       # Integration Layer
│   ├── services/      # Service implementations
│   ├── controllers/    # Request/response handlers
│   └── mappers/       # Data mapping between layers
├── presentation/      # Presentation Layer (additional UI utilities)
│   └── components/    # Shared UI components
└── workers/           # Background tasks

prisma/                # Database schema and migration files
docs/                  # Documentation
scripts/               # Maintenance and seeding scripts
notes/                 # Internal documentation
```

## Common Layer

### Generic Types
```typescript
// src/common/types/GenericTypes.ts
type EntityId = string;
type EmailAddress = string;
type UrlString = string;
type DateTime = Date;

interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };
```

### Utility Functions
```typescript
// src/common/utilities/ArrayUtils.ts
function groupBy<T, K extends string | number>(array: T[], keyFn: (item: T) => K): Record<K, T[]> {
  return array.reduce((groups, item) => {
    const key = keyFn(item);
    (groups[key] = groups[key] || []).push(item);
    return groups;
  }, {} as Record<K, T[]>);
}

// src/common/utilities/StringUtils.ts
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
```

### Value Objects
```typescript
// src/common/value-objects/Identifier.ts
class Identifier {
  private readonly value: string;
  
  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Identifier cannot be empty');
    }
    this.value = value;
  }
  
  toString(): string {
    return this.value;
  }
  
  equals(other: Identifier): boolean {
    return this.value === other.value;
  }
}

// src/common/value-objects/EmailAddress.ts
class EmailAddress {
  private readonly value: string;
  
  constructor(value: string) {
    if (!this.isValidEmail(value)) {
      throw new Error('Invalid email address');
    }
    this.value = value.toLowerCase();
  }
  
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  toString(): string {
    return this.value;
  }
}
```

## Domain Layer

### Core Entities

#### User
Represents a platform user with authentication and participation capabilities.
```typescript
// src/domain/entities/User.ts
import { EntityId, EmailAddress } from '../../common/types/GenericTypes';
import { Identifier } from '../../common/value-objects/Identifier';

interface User {
  id: Identifier;
  email: EmailAddress;
  displayName: string;
  helpfulnessTotal: number;
  isLocked: boolean;
  createdAt: Date;
  chosenCriterionId?: Identifier;
}
```

#### Cadence
Represents a decision cycle with timing and configuration.
```typescript
// src/domain/entities/Cadence.ts
interface Cadence {
  id: string;
  name: string;
  windowStart: Date;
  windowEnd: Date;
  config: CadenceConfig;
  createdAt: Date;
}
```

#### Criterion
Represents a type/schema for decision options.
```typescript
// src/domain/entities/Criterion.ts
interface Criterion {
  id: string;
  key: string;
  name: string;
  schema: CriterionSchema;
  createdAt: Date;
}
```

#### Track
Represents a decision stream within a cadence.
```typescript
// src/domain/entities/Track.ts
interface Track {
  id: string;
  name: string;
  cadenceId: string;
  criterionId: string;
  slots: number;
  combineForum: boolean;
  config: TrackConfig;
  createdAt: Date;
}
```

#### Post
Represents a piece of content in a forum.
```typescript
// src/domain/entities/Post.ts
interface Post {
  id: string;
  authorId: string;
  trackId?: string;
  criterionId?: string;
  type: PostType;
  content: string;
  netQuality: number;
  netStance: number;
  engagement: number;
  isArchived: boolean;
  createdAt: Date;
}
```

#### Comment
Represents a response to a post.
```typescript
// src/domain/entities/Comment.ts
interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  netQuality: number;
  netStance: number;
  isArchived: boolean;
  createdAt: Date;
}
```

#### Reaction
Represents a user's response to content.
```typescript
// src/domain/entities/Reaction.ts
interface Reaction {
  id: string;
  userId: string;
  targetType: TargetType;
  targetId: string;
  quality: QualityReaction;  // -1, 0, +1
  stance: StanceReaction;    // -1, 0, +1
  createdAt: Date;
}
```

#### Option
Represents a candidate for voting.
```typescript
// src/domain/entities/Option.ts
interface Option {
  id: string;
  trackId: string;
  criterionId: string;
  authorId: string;
  payload: Record<string, any>;
  createdAt: Date;
}
```

#### Ballot
Represents a user's vote in a track.
```typescript
// src/domain/entities/Ballot.ts
interface Ballot {
  id: string;
  trackId: string;
  userId: string;
  rankings: string[];  // Ordered list of option IDs
  createdAt: Date;
}
```

#### Result
Represents the outcome of a vote.
```typescript
// src/domain/entities/Result.ts
interface Result {
  id: string;
  trackId: string;
  winners: string[];  // Winning option IDs
  method: VotingMethod;  // "IRV" or "STV"
  quota?: QuotaType;    // "Droop" or "Hare"
  seed?: string;        // For random tie-breaking
  createdAt: Date;
}
```

#### Referendum
Represents a supermajority check.
```typescript
// src/domain/entities/Referendum.ts
interface Referendum {
  id: string;
  trackId: string;
  question: string;
  threshold: ThresholdType;  // "twoThirds", "threeFifths", "custom"
  votes: ReferendumVotes;    // { yes: number, no: number, abstain: number }
  passed?: boolean;
  createdAt: Date;
}
```

#### HelpfulnessRating
Represents a community rating of content quality.
```typescript
// src/domain/entities/HelpfulnessRating.ts
interface HelpfulnessRating {
  id: string;
  raterId: string;
  targetType: TargetType;
  targetId: string;
  score: HelpfulnessScore;  // -3, -1, +2, +3
  createdAt: Date;
}
```

### Domain Services
```typescript
// src/domain/services/VotingService.ts
interface VotingService {
  calculateIRV(options: Option[], ballots: Ballot[]): Result;
  calculateSTV(options: Option[], ballots: Ballot[], slots: number): Result;
}

// src/domain/services/ScoringService.ts
interface ScoringService {
  calculateHelpfulness(user: User): number;
  shouldLockUser(user: User): boolean;
  updateEngagementMetrics(post: Post): void;
}

// src/domain/services/ModerationService.ts
interface ModerationService {
  shouldCollapseContent(netQuality: number): boolean;
  shouldAuthorOnlyReply(netQuality: number): boolean;
}
```

### Repository Interfaces
```typescript
// src/domain/repositories/UserRepository.ts
interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: Omit<User, 'id' | 'createdAt'>): Promise<User>;
  update(id: string, updates: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
}

// src/domain/repositories/PostRepository.ts
interface PostRepository {
  findById(id: string): Promise<Post | null>;
  findByTrack(trackId: string): Promise<Post[]>;
  findByCriterion(criterionId: string): Promise<Post[]>;
  create(post: Omit<Post, 'id' | 'createdAt' | 'netQuality' | 'netStance' | 'engagement'>): Promise<Post>;
  update(id: string, updates: Partial<Post>): Promise<Post>;
  delete(id: string): Promise<void>;
}
```

## Enactment Layer

### Service Interfaces
```typescript
// src/enactment/services/UserService.ts
interface UserService {
  registerUser(email: string, displayName: string): Promise<User>;
  authenticateUser(email: string, token: string): Promise<User>;
  selectCriterion(userId: string, criterionId: string): Promise<void>;
  getHelpfulnessScore(userId: string): Promise<number>;
}

// src/enactment/services/ContentService.ts
interface ContentService {
  createPost(authorId: string, trackId: string, criterionId: string, type: PostType, content: string): Promise<Post>;
  addComment(postId: string, authorId: string, content: string): Promise<Comment>;
  addReaction(userId: string, targetType: TargetType, targetId: string, quality: QualityReaction, stance: StanceReaction): Promise<Reaction>;
  updateEngagementMetrics(): Promise<void>;
}

// src/enactment/services/VotingService.ts
interface VotingService {
  nominateOption(trackId: string, criterionId: string, authorId: string, payload: Record<string, any>): Promise<Option>;
  submitBallot(trackId: string, userId: string, rankings: string[]): Promise<Ballot>;
  calculateResults(trackId: string): Promise<Result>;
}

// src/enactment/services/ReferendumService.ts
interface ReferendumService {
  createReferendum(trackId: string, question: string, threshold: ThresholdType): Promise<Referendum>;
  voteInReferendum(referendumId: string, userId: string, vote: ReferendumVote): Promise<void>;
  calculateResults(referendumId: string): Promise<boolean>;
}
```

## Infrastructure Layer

### Database Implementations
```typescript
// src/infrastructure/persistence/prisma/UserRepositoryImpl.ts
class UserRepositoryImpl implements UserRepository {
  constructor(private prisma: PrismaClient) {}
  
  async findById(id: string): Promise<User | null> {
    // Implementation using Prisma
  }
  
  async findByEmail(email: string): Promise<User | null> {
    // Implementation using Prisma
  }
  
  async create(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    // Implementation using Prisma
  }
  
  async update(id: string, updates: Partial<User>): Promise<User> {
    // Implementation using Prisma
  }
  
  async delete(id: string): Promise<void> {
    // Implementation using Prisma
  }
}
```

### External Service Adapters
```typescript
// src/infrastructure/external/email/EmailServiceAdapter.ts
class EmailServiceAdapter implements EmailService {
  constructor(private config: EmailConfig) {}
  
  async sendMagicLink(email: string, token: string): Promise<void> {
    // Implementation using external email service
  }
}
```

## Integration Layer

### Service Implementations
```typescript
// src/integration/services/UserServiceImpl.ts
class UserServiceImpl implements UserService {
  constructor(
    private userRepository: UserRepository,
    private emailService: EmailService
  ) {}
  
  async registerUser(email: string, displayName: string): Promise<User> {
    // Business logic implementation
    const user = await this.userRepository.create({ email, displayName, helpfulnessTotal: 0, isLocked: false });
    // Send magic link
    return user;
  }
  
  // ... other methods
}
```

### Controllers
```typescript
// src/integration/controllers/UserController.ts
class UserController {
  constructor(private userService: UserService) {}
  
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, displayName } = req.body;
      const user = await this.userService.registerUser(email, displayName);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
```

## Presentation Layer

### UI Components
```typescript
// app/components/PostCard.tsx
const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  // UI implementation
  return (
    <div className="post-card">
      {/* Post content */}
    </div>
  );
};
```

## Data Model

### Core Entities (Prisma Schema)
```prisma
model User {
  id                String     @id @default(uuid())
  email             String     @unique
  displayName       String
  helpfulnessTotal  Int        @default(0)
  isLocked          Boolean    @default(false)
  createdAt         DateTime   @default(now())
  chosenCriterionId String?
  // Relations
  posts             Post[]
  comments          Comment[]
  reactions         Reaction[]
  ballots           Ballot[]
  helpfulnessRatings HelpfulnessRating[] @relation("Rater")
  receivedHelpfulnessRatings HelpfulnessRating[] @relation("Target")
}

// ... other models as defined previously
```

## Core Services

### Domain Services Implementation
The domain services contain pure business logic without external dependencies.

### Enactment Services
Service interfaces that define contracts for business operations.

### Infrastructure Adapters
Concrete implementations that connect to external systems.

### Integration Services
Orchestrators that combine domain logic with infrastructure.

## Background Jobs

### Scoring Recomputation Worker
- Periodically recalculates helpfulness scores
- Updates engagement metrics
- Runs on a scheduled cron job

### Archival Worker
- Archives old content based on retention policies
- Handles content visibility rules
- Runs on a scheduled cron job

### Anomaly Detection Worker
- Detects unusual voting patterns
- Flags potential manipulation
- Runs on a scheduled cron job

## API Endpoints

### Authentication
- `POST /api/auth/login` - Initiate login flow
- `POST /api/auth/logout` - Logout user

### Content
- `GET /api/posts` - List posts
- `POST /api/posts` - Create post
- `GET /api/posts/[id]` - Get post details
- `PUT /api/posts/[id]` - Update post
- `DELETE /api/posts/[id]` - Delete post
- `POST /api/posts/[id]/comments` - Add comment to post
- `POST /api/posts/[id]/reactions` - Add reaction to post
- `POST /api/comments/[id]/reactions` - Add reaction to comment

### Voting
- `GET /api/tracks/[id]/options` - List options for a track
- `POST /api/tracks/[id]/options` - Create option for a track
- `POST /api/tracks/[id]/ballots` - Submit ballot for a track
- `GET /api/tracks/[id]/results` - Get voting results for a track

### Referendum
- `POST /api/tracks/[id]/referendums` - Create referendum for a track
- `POST /api/referendums/[id]/vote` - Vote in a referendum
- `GET /api/referendums/[id]/results` - Get referendum results

### Syndication
- `GET /api/feed/rss` - RSS feed
- `GET /api/feed/atom` - Atom feed

## Configuration Management

### Configuration Schema
The application uses a Zod schema to validate configuration at boot time.

### Configuration Loading
Configuration is loaded from a JSON/YAML file at application startup and validated against the Zod schema.

## Security Considerations

### Authentication
- Email-based authentication with magic links
- Session management with secure cookies
- Passwordless authentication flow

### Authorization
- Role-based access control
- Criterion-based posting permissions
- User-specific content access controls

### Data Protection
- Input validation with Zod
- SQL injection prevention through Prisma ORM
- XSS prevention through React's built-in escaping
- CSRF protection through Next.js built-in mechanisms

### Privacy
- Minimal data collection
- Configurable content retention policies
- User-initiated data deletion

## Performance Considerations

### Caching
- Incremental Static Regeneration (ISR) for static content
- Database query optimization through Prisma
- In-memory caching for frequently accessed data

### Database Optimization
- Proper indexing on frequently queried fields
- Pagination for large result sets
- Connection pooling for database access

### Frontend Optimization
- Code splitting through Next.js
- Image optimization through Next.js Image component
- Bundle size optimization

## Deployment Architecture

### Development Environment
- SQLite database
- Local development server
- Hot reloading for development

### Production Environment
- PostgreSQL database
- Vercel for application hosting
- Railway/Neon/Fly.io for database hosting
- CDN for static assets

### CI/CD Pipeline
- Automated testing on pull requests
- Automated deployment on merge to main branch
- Database migration on deployment

## Monitoring and Observability

### Logging
- Structured logging for all services
- Error logging with context
- Performance logging for critical operations

### Metrics
- Application performance metrics
- Database query performance
- User engagement metrics

### Error Tracking
- Error reporting for unhandled exceptions
- Error context for debugging
- Alerting for critical errors

## Testing Strategy

### Unit Testing
- Jest for JavaScript/TypeScript testing
- Testing of individual functions and components
- Mocking of external dependencies

### Integration Testing
- Testing of API endpoints
- Database integration testing
- End-to-end flow testing

### End-to-End Testing
- Playwright/Cypress for browser testing
- Testing of critical user flows
- Cross-browser compatibility testing

## Scalability Considerations

### Horizontal Scaling
- Stateless application architecture
- Database read replicas for scaling reads
- CDN for static asset delivery

### Vertical Scaling
- Database optimization for handling larger datasets
- Caching strategies for reducing database load
- Background job processing for long-running tasks

### Future Enhancements
- Redis caching for ranking computations
- Advanced background job processing systems
- Microservice architecture for high-scale deployments