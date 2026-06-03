# Database — MongoDB schema, validators, seeds & scripts

The full data-model rationale lives in [`../docs/nosql-schema.md`](../docs/nosql-schema.md).
This folder is the runnable scaffold.

```
db/
├── README.md                      ← you are here
├── package.json                   ← deps (mongodb driver) + npm scripts
├── indexes.json                   ← index definitions for every collection
├── schema/                        ← one $jsonSchema validator per collection
│   ├── profile.schema.json        skills.schema.json     media.schema.json
│   ├── experiences.schema.json    education.schema.json  pages.schema.json
│   ├── accomplishments.schema.json blog_posts.schema.json testimonials.schema.json
│   └── projects.schema.json
├── seed/                          ← example + migrated documents (ready to insert)
│   ├── profile.seed.json          accomplishments.seed.json (generated)
│   ├── experiences.seed.json (generated)  skills.seed.json
│   ├── education.seed.json         blog_posts.seed.json   media.seed.json
│   └── pages.seed.json             testimonials.seed.json
└── scripts/
    ├── setup.mjs                  ← create collections + validators + indexes
    ├── migrate-accomplishments.mjs ← accomplishments-log.md → experiences/accomplishments seed
    └── seed.mjs                   ← idempotently upsert seed files into MongoDB
```

## Collections

`profile` · `experiences` · `accomplishments` · `projects` · `skills` ·
`education` · `blog_posts` · `media` · `pages` · `testimonials`

## Quickstart

```bash
cd db
npm install                      # installs the mongodb driver

export MONGODB_URI="mongodb+srv://user:pass@cluster/…"
export MONGODB_DB="resume"

# 1. Create collections with validators + indexes
npm run setup

# 2. (Re)generate experiences/accomplishments from the markdown log
npm run migrate

# 3. Load all seed files (idempotent upserts)
npm run seed
# or a subset:
node scripts/seed.mjs profile experiences accomplishments
```

Everything is idempotent — `setup` uses `collMod` on existing collections, and `seed`
upserts by slug (or `_id`/`category+name`), so re-runs never duplicate.

## Validators

Each collection is created with `validationLevel: "moderate"` so a malformed write is
**rejected by the database**. This is the guardrail for AI-generated content — if Claude
produces a document of the wrong shape, the insert fails loudly instead of corrupting data.

To tighten or loosen, edit the relevant `schema/*.schema.json` and re-run `npm run setup`.

## The Claude → MCP authoring loop

1. Point the [MongoDB MCP server](https://github.com/mongodb-js/mongodb-mcp-server) at this
   database (connection string + restrict to `MONGODB_DB`).
2. Ask Claude to draft content. Claude writes a document that matches the schema with
   `status: "draft"` and `provenance.source: "claude"`, **upserting by `slug`**.
3. The website only ever renders `{ status: "published", visibility: "public" }`, so drafts
   never leak.
4. A human reviews, then sets `status: "published"`, `provenance.reviewedBy: "human"`,
   `reviewedAt`, and `publishedAt`.

See [`../docs/nosql-schema.md`](../docs/nosql-schema.md) §6 for the full workflow and rules.

## Media & cost

Raster images → object storage with zero egress (**Cloudflare R2** recommended); only the URL
+ metadata go in the `media` collection. Diagrams → store the Mermaid/SVG **source** inline
(it's just text). GridFS is supported via the `storage` discriminator but discouraged for a
public site (no CDN, eats your cluster's storage budget). See `../docs/nosql-schema.md` §4.8.
