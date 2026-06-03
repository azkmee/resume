#!/usr/bin/env node
/**
 * Create every collection with its $jsonSchema validator and indexes.
 * Idempotent: re-running updates validators (collMod) and ensures indexes.
 *
 * Usage:
 *   MONGODB_URI="mongodb+srv://…" MONGODB_DB="resume" node db/scripts/setup.mjs
 *
 * Requires the official driver:  npm i mongodb   (see db/package.json)
 */
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { MongoClient } from "mongodb";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCHEMA_DIR = join(__dirname, "..", "schema");
const INDEXES_FILE = join(__dirname, "..", "indexes.json");

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "resume";
if (!uri) {
  console.error("Set MONGODB_URI (and optionally MONGODB_DB, default 'resume').");
  process.exit(1);
}

const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));

const schemas = Object.fromEntries(
  readdirSync(SCHEMA_DIR)
    .filter((f) => f.endsWith(".schema.json"))
    .map((f) => [f.replace(".schema.json", ""), readJson(join(SCHEMA_DIR, f))]),
);
const indexes = readJson(INDEXES_FILE);

const client = new MongoClient(uri);
try {
  await client.connect();
  const db = client.db(dbName);
  const existing = new Set((await db.listCollections().toArray()).map((c) => c.name));

  for (const [name, $jsonSchema] of Object.entries(schemas)) {
    const validator = { $jsonSchema };
    if (existing.has(name)) {
      await db.command({ collMod: name, validator, validationLevel: "moderate" });
      console.log(`✓ collMod  ${name} (validator updated)`);
    } else {
      await db.createCollection(name, { validator, validationLevel: "moderate" });
      console.log(`✓ created  ${name}`);
    }

    const specs = indexes[name] || [];
    if (specs.length) {
      await db.collection(name).createIndexes(
        specs.map((s) => ({ key: s.keys, ...s.options })),
      );
      console.log(`  └─ ${specs.length} index(es)`);
    }
  }
  console.log("\nDone. Collections, validators, and indexes are in place.");
} finally {
  await client.close();
}
