#!/usr/bin/env node
/**
 * Parse ../accomplishments-log.md into seed documents:
 *   db/seed/experiences.seed.json
 *   db/seed/accomplishments.seed.json
 *
 * Best-effort: the log is semi-structured prose, so every produced document is
 * written with status "needs_review" and provenance.source "import" — a human
 * should read each one before publishing. Re-running regenerates the files.
 *
 * Usage:  node db/scripts/migrate-accomplishments.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOG = join(__dirname, "..", "..", "accomplishments-log.md");
const SEED_DIR = join(__dirname, "..", "seed");

const MONTHS = {
  jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
  jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
};

const slugify = (s) =>
  s.toLowerCase()
    .replace(/[''`*]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);

// Strip markdown emphasis/backticks but keep inner text.
const clean = (s) =>
  (s || "")
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/^\s*[-*]\s+/, "")
    .replace(/^\s*\d+\.\s+/, "")
    .trim();

const stripItalic = (s) => clean(s).replace(/^\*+|\*+$/g, "").trim();

// "Apr 2026" -> "2026-04"; "Present" -> null
function ym(token) {
  token = token.trim();
  if (/present/i.test(token)) return null;
  const m = token.match(/([A-Za-z]{3,})\.?\s+(\d{4})/);
  if (m) {
    const mon = MONTHS[m[1].slice(0, 3).toLowerCase()];
    if (mon) return `${m[2]}-${mon}`;
  }
  const y = token.match(/(\d{4})/);
  return y ? `${y[1]}-01` : null;
}

// Entry heading date token -> { raw, iso, approximate }
function parseEntryDate(token) {
  const raw = token.trim();
  const approximate = /~/.test(raw) || !/-\d{2}/.test(raw);
  const ymMatch = raw.match(/(\d{4})-(\d{2})/);
  if (ymMatch) return { raw, iso: `${ymMatch[1]}-${ymMatch[2]}-01`, approximate };
  const yMatch = raw.match(/(\d{4})/);
  return { raw, iso: yMatch ? `${yMatch[1]}-01-01` : null, approximate: true };
}

const md = readFileSync(LOG, "utf8");
const lines = md.split("\n");

// Split into top-level (##) sections.
const sections = [];
let cur = null;
for (const line of lines) {
  const h2 = line.match(/^##\s+(.+?)\s*$/);
  if (h2 && !line.startsWith("###")) {
    cur = { heading: h2[1], body: [] };
    sections.push(cur);
  } else if (cur) {
    cur.body.push(line);
  }
}

const experiences = [];
const accomplishments = [];
let roleOrder = 0;
const now = new Date().toISOString();

for (const sec of sections) {
  if (!/^Role:/.test(sec.heading)) continue;

  const title = clean(sec.heading.replace(/^Role:\s*/, "").split(" — ")[0]);
  const company = (sec.heading.split(" — ")[1] || "ESGpedia").trim();
  const body = sec.body.join("\n");

  // Dates line: first italic line like *Apr 2026 – Present · Hybrid · Singapore*
  const dateLine = (body.match(/^\*([^*]+)\*\s*$/m) || [])[1] || "";
  const [startTok, endTok] = dateLine.split(/[–-]/).map((s) => s && s.trim());
  const startDate = ym(startTok || "") || dateLine.match(/\d{4}/)?.[0] + "-01" || null;
  const endDate = endTok ? ym(endTok) : null;
  const current = /present/i.test(dateLine);
  const workMode = /hybrid/i.test(dateLine) ? "hybrid" : /remote/i.test(dateLine) ? "remote" : /onsite/i.test(dateLine) ? "onsite" : null;
  const employmentType = /apprenticeship/i.test(dateLine) || /internship/i.test(title)
    ? "apprenticeship"
    : "full_time";
  const location = /singapore/i.test(dateLine) ? { city: "Singapore", country: "SG" } : null;

  const expSlug = slugify(`${title}-${company}`);

  // Standing scope bullets, if a "### Standing scope" subsection exists.
  const scopeBlock = body.split(/^###\s+Standing scope[^\n]*$/m)[1];
  const standingScope = [];
  if (scopeBlock) {
    const stop = scopeBlock.split(/^###\s+/m)[0];
    for (const l of stop.split("\n")) {
      if (/^\s*-\s+/.test(l)) standingScope.push(clean(l));
    }
  }

  experiences.push({
    slug: expSlug,
    company,
    title,
    employmentType,
    location,
    workMode,
    startDate,
    endDate,
    current,
    summary: null,
    standingScope,
    highlights: [],
    skills: [],
    order: roleOrder++,
    featured: roleOrder === 1,
    visibility: "public",
    tags: [],
    status: "needs_review",
    provenance: {
      source: "import",
      sourceRef: `accomplishments-log.md#${slugify(sec.heading)}`,
      reviewedBy: null,
      reviewedAt: null,
    },
    createdAt: now,
    updatedAt: now,
    publishedAt: null,
    version: 1,
  });

  // Entries: split the role body on "### " headers, keep date-led ones.
  const chunks = body.split(/^###\s+/m).slice(1);
  for (const chunk of chunks) {
    const headLine = chunk.split("\n")[0].trim();
    // accomplishment headings start with a date token (digit or ~)
    if (!/^[~\d]/.test(headLine)) continue;

    const [dateTok, ...titleParts] = headLine.split(" — ");
    const entryTitle = clean(titleParts.join(" — "));
    if (!entryTitle) continue;
    const date = parseEntryDate(dateTok);

    const cl = chunk.split("\n");

    // tags
    const tagLine = cl.find((l) => /\*\*Tags:\*\*/.test(l)) || "";
    const tags = [...tagLine.matchAll(/`([^`]+)`/g)].map((m) => m[1]);

    // STAR extraction
    const star = { situation: "", task: "", action: [], result: [] };
    let mode = null;
    for (const l of cl) {
      const sit = l.match(/\*\*Situation:\*\*\s*(.*)/);
      const tsk = l.match(/\*\*Task:\*\*\s*(.*)/);
      const act = l.match(/\*\*Action:\*\*\s*(.*)/);
      const res = l.match(/\*\*Result:\*\*\s*(.*)/);
      const bullet = l.match(/\*\*Resume-bullet/);
      if (sit) { star.situation = clean(sit[1]); mode = "situation"; continue; }
      if (tsk) { star.task = clean(tsk[1]); mode = "task"; continue; }
      if (act) { mode = "action"; if (clean(act[1])) star.action.push(clean(act[1])); continue; }
      if (res) { mode = "result"; if (clean(res[1])) star.result.push(clean(res[1])); continue; }
      if (bullet) { mode = null; continue; }
      // continuation lines (sub-bullets / numbered) for action/result
      if ((mode === "action" || mode === "result") && /^\s+(?:[-*]|\d+\.)\s+/.test(l)) {
        const t = clean(l);
        if (t) star[mode].push(t);
      }
    }

    // resume bullets
    const resumeBullets = [];
    for (let i = 0; i < cl.length; i++) {
      const m = cl[i].match(/\*\*Resume-bullet draft(?:\s*\(([^)]+)\))?:\*\*\s*(.*)/);
      if (!m) continue;
      const variant = /split/i.test(m[1] || "") ? "split" : /combined/i.test(m[1] || "") ? "combined" : "default";
      const inline = stripItalic(m[2]);
      if (inline) resumeBullets.push({ variant, text: inline });
      // following "- *...*" bullet lines belong to this draft
      for (let j = i + 1; j < cl.length; j++) {
        if (/^\s*-\s+\*/.test(cl[j])) {
          const t = stripItalic(cl[j]);
          if (t) resumeBullets.push({ variant, text: t });
        } else if (cl[j].trim() === "" || /^\s*-\s+/.test(cl[j])) {
          continue;
        } else break;
      }
    }

    accomplishments.push({
      slug: slugify(`${date.raw}-${entryTitle}`),
      experienceSlug: expSlug,
      title: entryTitle,
      date,
      star,
      metrics: [],
      resumeBullets,
      tags,
      featured: false,
      order: 0,
      visibility: "public",
      status: "needs_review",
      provenance: {
        source: "import",
        sourceRef: `accomplishments-log.md#${slugify(headLine)}`,
        reviewedBy: null,
        reviewedAt: null,
      },
      createdAt: now,
      updatedAt: now,
      publishedAt: null,
      version: 1,
    });
  }
}

writeFileSync(join(SEED_DIR, "experiences.seed.json"), JSON.stringify(experiences, null, 2) + "\n");
writeFileSync(join(SEED_DIR, "accomplishments.seed.json"), JSON.stringify(accomplishments, null, 2) + "\n");

console.log(`Wrote ${experiences.length} experiences and ${accomplishments.length} accomplishments.`);
for (const e of experiences) console.log(`  role: ${e.title} (${e.startDate} → ${e.endDate || "present"})`);
