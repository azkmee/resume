#!/usr/bin/env node
/**
 * Idempotently load db/seed/*.seed.json into MongoDB via upserts.
 * Re-running updates documents in place instead of duplicating — the same
 * pattern Claude uses when writing through the MCP server.
 *
 * Usage:
 *   MONGODB_URI="mongodb+srv://…" MONGODB_DB="resume" node db/scripts/seed.mjs
 *   # optionally limit to some collections:
 *   node db/scripts/seed.mjs profile experiences accomplishments
 *
 * Requires:  npm i mongodb   (see db/package.json)
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { MongoClient } from "mongodb";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SEED_DIR = join(__dirname, "..", "seed");

// collection -> the field(s) used as the idempotency key for upserts
const KEYS = {
  profile: ["_id"],
  now: ["_id"],
  site_settings: ["_id"],
  experiences: ["slug"],
  accomplishments: ["slug"],
  case_studies: ["slug"],
  projects: ["slug"],
  teardowns: ["slug"],
  feed: ["slug"],
  skills: ["category", "name"],
  education: ["slug"],
  blog_posts: ["slug"],
  media: ["key"],
  pages: ["slug"],
  testimonials: ["slug"],
};

// singletons & timestamp-only collections that should not get a content envelope
const NO_ENVELOPE = new Set(["profile", "now", "site_settings", "skills", "media"]);

// field names whose string values should be coerced to BSON Date
const DATE_FIELDS = new Set([
  "createdAt", "updatedAt", "publishedAt", "generatedAt",
  "reviewedAt", "lastUpdated",
]);

function coerceDates(v) {
  if (Array.isArray(v)) return v.map(coerceDates);
  if (v && typeof v === "object") {
    for (const [k, val] of Object.entries(v)) {
      if (DATE_FIELDS.has(k) && typeof val === "string") v[k] = new Date(val);
      else v[k] = coerceDates(val);
    }
  }
  return v;
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "resume";
if (!uri) {
  console.error("Set MONGODB_URI (and optionally MONGODB_DB, default 'resume').");
  process.exit(1);
}

const only = process.argv.slice(2);
const targets = (only.length ? only : Object.keys(KEYS)).filter((c) => KEYS[c]);

const client = new MongoClient(uri);
try {
  await client.connect();
  const db = client.db(dbName);
  const now = new Date();

  for (const coll of targets) {
    const file = join(SEED_DIR, `${coll}.seed.json`);
    if (!existsSync(file)) { console.log(`– skip ${coll} (no seed file)`); continue; }

    const raw = JSON.parse(readFileSync(file, "utf8"));
    const docs = (Array.isArray(raw) ? raw : [raw]).map(coerceDates);
    const keyFields = KEYS[coll];

    let upserts = 0;
    for (const doc of docs) {
      // ensure timestamps exist
      if (!NO_ENVELOPE.has(coll)) {
        doc.createdAt ??= now;
        doc.updatedAt = now;
      } else {
        doc.updatedAt ??= now;
      }
      const filter = Object.fromEntries(keyFields.map((k) => [k, doc[k]]));
      const { createdAt, ...rest } = doc;
      await db.collection(coll).updateOne(
        filter,
        { $setOnInsert: { createdAt: createdAt ?? now }, $set: rest },
        { upsert: true },
      );
      upserts++;
    }
    console.log(`✓ ${coll}: upserted ${upserts}`);
  }
  console.log("\nSeeding complete.");
} finally {
  await client.close();
}
