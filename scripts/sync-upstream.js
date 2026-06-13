#!/usr/bin/env node
// scripts/sync-upstream.js
// Pull the latest agent-skills upstream and report what changed vs. our
// vendored skills. Does NOT auto-overwrite — outputs a diff summary so a
// maintainer can decide.
//
// Usage:
//   node scripts/sync-upstream.js          # report-only
//   node scripts/sync-upstream.js --pull   # also git-clone into .upstream/

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const UPSTREAM_REPO = "https://github.com/addyosmani/agent-skills.git";
const PINNED_SHA_FILE = join(ROOT, ".upstream-sha");
const UPSTREAM_DIR = join(ROOT, ".upstream", "agent-skills");

function sh(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { cwd: ROOT, encoding: "utf8", ...opts });
  if (r.status !== 0) {
    process.stderr.write(r.stderr || `${cmd} failed\n`);
    process.exit(r.status || 1);
  }
  return r.stdout.trim();
}

function clone() {
  if (existsSync(UPSTREAM_DIR)) {
    console.log(`[sync] fetching latest in ${UPSTREAM_DIR}`);
    sh("git", ["fetch", "origin"], { cwd: UPSTREAM_DIR });
    sh("git", ["pull", "--ff-only"], { cwd: UPSTREAM_DIR });
  } else {
    console.log(`[sync] cloning ${UPSTREAM_REPO} into ${UPSTREAM_DIR}`);
    sh("git", ["clone", UPSTREAM_REPO, UPSTREAM_DIR]);
  }
}

function head() {
  return sh("git", ["rev-parse", "HEAD"], { cwd: UPSTREAM_DIR });
}

function pinned() {
  return existsSync(PINNED_SHA_FILE) ? readFileSync(PINNED_SHA_FILE, "utf8").trim() : null;
}

function listSkills(dir) {
  const root = join(dir, "skills");
  if (!existsSync(root)) return [];
  return readdirSync(root).filter((f) => existsSync(join(root, f, "SKILL.md")));
}

function main() {
  const wantPull = process.argv.includes("--pull");
  if (wantPull) clone();
  if (!existsSync(UPSTREAM_DIR)) {
    console.error("[sync] no .upstream/ checkout found. Run with --pull first.");
    process.exit(1);
  }

  const upstreamHead = head();
  const pinnedSha = pinned();
  const upstreamSkills = listSkills(UPSTREAM_DIR);
  const ourSkills = readdirSync(join(ROOT, "rules", "skills"))
    .filter((f) => f.endsWith(".toml"))
    .map((f) => f.replace(/\.toml$/, ""));

  const newUpstream = upstreamSkills.filter((s) => !ourSkills.includes(s));
  const droppedUpstream = ourSkills.filter((s) => !upstreamSkills.includes(s));

  console.log(`\n[sync] upstream HEAD : ${upstreamHead}`);
  console.log(`[sync] our pinned SHA: ${pinnedSha || "(none — first sync)"}`);
  console.log(`[sync] our skills    : ${ourSkills.length}`);
  console.log(`[sync] upstream      : ${upstreamSkills.length}`);
  if (newUpstream.length) {
    console.log(`\n  new upstream skills not vendored:`);
    for (const s of newUpstream) console.log(`    + ${s}`);
  }
  if (droppedUpstream.length) {
    console.log(`\n  our skills not in upstream (custom or removed):`);
    for (const s of droppedUpstream) console.log(`    - ${s}`);
  }
  if (pinnedSha && pinnedSha !== upstreamHead) {
    console.log(`\n[sync] upstream has moved since last pin — review and bump .upstream-sha when ready.`);
  } else if (!pinnedSha) {
    console.log(`\n[sync] no .upstream-sha pin recorded — write the current HEAD if you accept this state.`);
  } else {
    console.log(`\n[sync] in sync.`);
  }
  console.log();
}

main();
