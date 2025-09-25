Below are three examples:

1) Sample JSON config file (covering creator programming, team prioritization, and meetup planning via toggles)
2) TypeScript Zod schema to validate the config at boot
3) Example seed script outline to bootstrap criteria, tracks, and a cadence

All examples keep the “pick-your-criterion-first” rule and combined-forum behavior for shared criteria.

1) config.json (sample)
```json
{
  "configVersion": 1,
  "cadence": {
    "name": "Monthly",
    "frequency": "monthly",
    "startDay": 1,
    "durationDays": 30
  },
  "participation": {
    "requireCriterionPick": true,
    "allowSwitchCriterion": 0,
    "postingPermission": {
      "advocatesOnly": true
    },
    "crossForumInteractions": {
      "allowComments": true,
      "allowReactions": true
    }
  },
  "criteria": [
    {
      "id": "topic",
      "name": "Topic",
      "schema": {
        "fields": [
          { "key": "title", "type": "string", "required": true },
          { "key": "sourceUrl", "type": "url", "required": false },
          { "key": "summary", "type": "text", "required": false }
        ]
      }
    },
    {
      "id": "feature",
      "name": "FeatureRequest",
      "schema": {
        "fields": [
          { "key": "title", "type": "string", "required": true },
          { "key": "description", "type": "text", "required": true },
          {
            "key": "complexity",
            "type": "enum",
            "values": ["S", "M", "L"],
            "required": false
          }
        ]
      }
    },
    {
      "id": "venue",
      "name": "Venue",
      "schema": {
        "fields": [
          { "key": "name", "type": "string", "required": true },
          { "key": "address", "type": "string", "required": false },
          { "key": "accessibilityNotes", "type": "text", "required": false },
          {
            "key": "priceRange",
            "type": "enum",
            "values": ["$", "$$", "$$$"],
            "required": false
          }
        ]
      }
    }
  ],
  "tracks": [
    {
      "id": "next-topics",
      "name": "Next Topics",
      "criterionId": "topic",
      "slots": 3,
      "combineForum": true,
      "nomination": {
        "open": true,
        "maxPerUser": 3,
        "requireFields": ["title"]
      },
      "voting": {
        "method": "STV",
        "quota": "Droop",
        "winners": 3,
        "tieBreaker": "deterministic",
        "randomSeed": ""
      },
      "referendum": {
        "enabled": true,
        "question": "Are you looking forward to these selected topics?",
        "threshold": "twoThirds",
        "customThreshold": 0.66
      }
    },
    {
      "id": "feature-priorities",
      "name": "Feature Priorities",
      "criterionId": "feature",
      "slots": 2,
      "combineForum": false,
      "nomination": {
        "open": true,
        "maxPerUser": 2,
        "requireFields": ["title", "description"]
      },
      "voting": {
        "method": "STV",
        "quota": "Droop",
        "winners": 2,
        "tieBreaker": "deterministic",
        "randomSeed": ""
      },
      "referendum": {
        "enabled": false,
        "question": "",
        "threshold": "twoThirds",
        "customThreshold": 0.66
      }
    },
    {
      "id": "friday-venue",
      "name": "Friday Venue",
      "criterionId": "venue",
      "slots": 1,
      "combineForum": false,
      "nomination": {
        "open": true,
        "maxPerUser": 2,
        "requireFields": ["name", "accessibilityNotes"]
      },
      "voting": {
        "method": "IRV",
        "winners": 1,
        "runOncePerSlot": true,
        "tieBreaker": "deterministic",
        "randomSeed": ""
      },
      "referendum": {
        "enabled": true,
        "question": "Should we schedule at this venue?",
        "threshold": "twoThirds",
        "customThreshold": 0.66
      }
    },
    {
      "id": "saturday-venue",
      "name": "Saturday Venue",
      "criterionId": "venue",
      "slots": 1,
      "combineForum": false,
      "nomination": {
        "open": true,
        "maxPerUser": 2,
        "requireFields": ["name", "accessibilityNotes"]
      },
      "voting": {
        "method": "IRV",
        "winners": 1,
        "runOncePerSlot": true,
        "tieBreaker": "deterministic",
        "randomSeed": ""
      },
      "referendum": {
        "enabled": true,
        "question": "Should we schedule at this venue?",
        "threshold": "twoThirds",
        "customThreshold": 0.66
      }
    }
  ],
  "forums": {
    "collapseThreshold": { "post": 0, "comment": 0 },
    "authorOnlyReplyThreshold": { "post": -3, "comment": -3 },
    "reasonChips": {
      "enabled": true,
      "options": ["Missing sources", "Off-topic", "Rude", "Duplicate"]
    }
  },
  "moderation": {
    "helpfulness": {
      "lockBelow": 0,
      "ratings": { "helpful": 3, "trying": 2, "offTopic": -1, "meanSpirited": -3 }
    },
    "editWindowMinutes": 10,
    "archiveVisibility": {
      "visibleToPriorViewers": true,
      "hiddenFromNewViewers": true
    }
  },
  "integrity": {
    "rateLimits": { "reactionsPerMinute": 20, "commentsPerMinute": 5, "postsPerHour": 3 },
    "newAccountWeighting": { "durationDays": 30, "qualityWeight": 0.5, "stanceWeight": 0.5 },
    "surgeDetection": { "enabled": true, "thresholdStdDevs": 4, "actions": ["throttleThread", "flagModeration"] }
  },
  "identity": {
    "authMethod": "emailMagicLink",
    "allowPseudonyms": true,
    "proofOfPersonhood": { "enabled": false, "provider": "" },
    "coiDisclosures": { "enabled": true, "promptOnPost": true }
  },
  "privacy": {
    "contentRetentionDays": 365,
    "deleteRequests": { "allowUserDelete": true, "archivalForEngagedViewers": true }
  },
  "notifications": {
    "channels": ["email", "rss", "webpush", "webhook"],
    "webhooks": { "discord": "", "slack": "" }
  }
}
```

2) Zod schema (TypeScript)
```ts
// src/config/schema.ts
import { z } from "zod";

const ThresholdEnum = z.enum(["twoThirds", "threeFifths", "custom"]);
const FrequencyEnum = z.enum(["weekly", "monthly", "custom"]);
const FieldTypeEnum = z.enum(["string", "text", "url", "enum", "number", "boolean"]);
const VotingMethodEnum = z.enum(["IRV", "STV"]);
const QuotaEnum = z.enum(["Droop", "Hare"]);
const TieBreakerEnum = z.enum(["deterministic", "random"]);
const AuthMethodEnum = z.enum(["emailMagicLink", "nextAuthEmail", "custom", "webauthnOnly"]);

const FieldSchema = z.object({
  key: z.string().min(1),
  type: FieldTypeEnum,
  required: z.boolean().optional().default(false),
  values: z.array(z.string()).optional()
});

export const ConfigSchema = z.object({
  configVersion: z.number().int().min(1),

  cadence: z.object({
    name: z.string().min(1),
    frequency: FrequencyEnum,
    startDay: z.number().int().min(1).max(31).optional(),
    durationDays: z.number().int().min(1).max(366).optional()
  }),

  participation: z.object({
    requireCriterionPick: z.boolean().default(true),
    allowSwitchCriterion: z.union([z.boolean(), z.number().int().min(0)]).default(false),
    postingPermission: z.object({
      advocatesOnly: z.boolean().default(true)
    }),
    crossForumInteractions: z.object({
      allowComments: z.boolean().default(true),
      allowReactions: z.boolean().default(true)
    })
  }),

  criteria: z.array(
    z.object({
      id: z.string().min(1),
      name: z.string().min(1),
      schema: z.object({
        fields: z.array(FieldSchema).min(1)
      })
    })
  ).min(1),

  tracks: z.array(
    z.object({
      id: z.string().min(1),
      name: z.string().min(1),
      criterionId: z.string().min(1),
      slots: z.number().int().min(1),
      combineForum: z.boolean().default(false),
      nomination: z.object({
        open: z.boolean().default(true),
        maxPerUser: z.number().int().min(1).default(3),
        requireFields: z.array(z.string()).default([])
      }),
      voting: z.object({
        method: VotingMethodEnum,
        quota: QuotaEnum.optional(),
        winners: z.number().int().min(1).optional(),
        runOncePerSlot: z.boolean().optional(),
        tieBreaker: TieBreakerEnum.default("deterministic"),
        randomSeed: z.string().optional()
      }),
      referendum: z.object({
        enabled: z.boolean().default(false),
        question: z.string().optional(),
        threshold: ThresholdEnum.default("twoThirds"),
        customThreshold: z.number().min(0).max(1).optional()
      })
    })
  ).min(1),

  forums: z.object({
    collapseThreshold: z.object({ post: z.number(), comment: z.number() }),
    authorOnlyReplyThreshold: z.object({ post: z.number(), comment: z.number() }),
    reasonChips: z.object({
      enabled: z.boolean().default(true),
      options: z.array(z.string()).default([])
    })
  }),

  moderation: z.object({
    helpfulness: z.object({
      lockBelow: z.number().int().default(0),
      ratings: z.object({
        helpful: z.number().int(),
        trying: z.number().int(),
        offTopic: z.number().int(),
        meanSpirited: z.number().int()
      })
    }),
    editWindowMinutes: z.number().int().min(0).default(10),
    archiveVisibility: z.object({
      visibleToPriorViewers: z.boolean().default(true),
      hiddenFromNewViewers: z.boolean().default(true)
    })
  }),

  integrity: z.object({
    rateLimits: z.object({
      reactionsPerMinute: z.number().int().min(1),
      commentsPerMinute: z.number().int().min(1),
      postsPerHour: z.number().int().min(1)
    }),
    newAccountWeighting: z.object({
      durationDays: z.number().int().min(0),
      qualityWeight: z.number().min(0).max(1),
      stanceWeight: z.number().min(0).max(1)
    }),
    surgeDetection: z.object({
      enabled: z.boolean().default(true),
      thresholdStdDevs: z.number().min(1),
      actions: z.array(z.enum(["throttleThread", "flagModeration", "freezeVoting"])).default(["throttleThread", "flagModeration"])
    })
  }),

  identity: z.object({
    authMethod: AuthMethodEnum.default("emailMagicLink"),
    allowPseudonyms: z.boolean().default(true),
    proofOfPersonhood: z.object({
      enabled: z.boolean().default(false),
      provider: z.string().optional()
    }),
    coiDisclosures: z.object({
      enabled: z.boolean().default(true),
      promptOnPost: z.boolean().default(true)
    })
  }),

  privacy: z.object({
    contentRetentionDays: z.number().int().min(1),
    deleteRequests: z.object({
      allowUserDelete: z.boolean().default(true),
      archivalForEngagedViewers: z.boolean().default(true)
    })
  }),

  notifications: z.object({
    channels: z.array(z.enum(["email", "rss", "webpush", "webhook"])).default(["email"]),
    webhooks: z.object({
      discord: z.string().optional(),
      slack: z.string().optional()
    }).optional()
  })
})
.superRefine((cfg, ctx) => {
  // Validate tracks winners vs slots and method coherence
  for (const t of cfg.tracks) {
    // Winners default to slots
    const winners = t.voting.winners ?? t.slots;

    if (t.voting.method === "IRV" && winners !== 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Track ${t.id}: IRV requires winners=1 (got ${winners}).`
      });
    }
    if (t.voting.method === "STV" && winners < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Track ${t.id}: STV requires winners >= 1.`
      });
    }
    if (t.voting.tieBreaker === "random" && !t.voting.randomSeed) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Track ${t.id}: tieBreaker=random requires randomSeed.`
      });
    }
    if (t.referendum.enabled && (!t.referendum.question || t.referendum.question.trim() === "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Track ${t.id}: referendum enabled but no question provided.`
      });
    }
    if (t.referendum.threshold === "custom" && (t.referendum.customThreshold ?? -1) <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Track ${t.id}: custom referendum threshold must be > 0 and <= 1.`
      });
    }
  }

  // Validate that each track's criterionId exists in criteria
  const criterionIds = new Set(cfg.criteria.map(c => c.id));
  for (const t of cfg.tracks) {
    if (!criterionIds.has(t.criterionId)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Track ${t.id}: criterionId "${t.criterionId}" is not defined in criteria.`
      });
    }
  }
});
```

Usage at boot:
```ts
// src/config/load.ts
import { ConfigSchema } from "./schema";
import fs from "node:fs/promises";

export async function loadConfig(path = process.env.BDS_CONFIG_PATH || "config.json") {
  const raw = await fs.readFile(path, "utf8");
  const json = JSON.parse(raw);
  const parsed = ConfigSchema.parse(json);
  return parsed;
}
```

3) Seed script outline (TypeScript + Prisma)
```ts
// scripts/seed.ts
import { prisma } from "@/lib/db"; // adjust path
import { loadConfig } from "@/config/load";

async function main() {
  const cfg = await loadConfig();

  // Create criteria
  for (const c of cfg.criteria) {
    await prisma.criterion.upsert({
      where: { id: c.id },
      update: { name: c.name, schemaJson: c.schema as any },
      create: { id: c.id, name: c.name, schemaJson: c.schema as any }
    });
  }

  // Create cadence
  const now = new Date();
  const cadence = await prisma.cadence.create({
    data: {
      name: cfg.cadence.name,
      windowStart: new Date(now.getFullYear(), now.getMonth(), cfg.cadence.startDay ?? 1),
      windowEnd: new Date(now.getFullYear(), now.getMonth(), (cfg.cadence.startDay ?? 1) + (cfg.cadence.durationDays ?? 30)),
      config: cfg as any
    }
  });

  // Create tracks
  for (const t of cfg.tracks) {
    await prisma.track.create({
      data: {
        id: t.id,
        name: t.name,
        cadenceId: cadence.id,
        criterionId: t.criterionId,
        slots: t.slots,
        combineForum: t.combineForum,
        config: {
          nomination: t.nomination,
          voting: t.voting,
          referendum: t.referendum
        } as any
      }
    });
  }

  // Optional: create a few demo users and posts
  const alice = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: { email: "alice@example.com", displayName: "Alice" }
  });
  const bob = await prisma.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: { email: "bob@example.com", displayName: "Bob" }
  });

  // Mark chosen criterion for this cadence (demo state)
  // You may store this in a join table like UserCadenceChoice(userId, cadenceId, criterionId)
  // For demo purposes only:
  // await prisma.userCadenceChoice.create({ data: { userId: alice.id, cadenceId: cadence.id, criterionId: "topic" } });

  // Create example posts under "topic" forum
  // Ensure your schema includes track/criterion forum linkage
  // await prisma.post.create({ ... });

  console.log("Seed complete.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

Notes and tips:
- Consider a UserCadenceChoice table: userId, cadenceId, criterionId, switchesUsed
- For combined forums, store posts at the criterion level (criterionId) and show them on all tracks that reference that criterion within the cadence.
- Ensure ballots reference trackId; for combined forums with multi-winner across multiple tracks, either:
  - Run one STV tally with winners = total slots across those tracks and then allocate winners to tracks, or
  - Run per-track STV with the same nomination set; both are valid but document your choice in results.