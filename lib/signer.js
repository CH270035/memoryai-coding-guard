// lib/signer.js
// Ed25519 sign/verify for constitution.toml
// Phase 1: skeleton with stdlib crypto. Full release flow in Phase 4.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash, generateKeyPairSync, sign as cryptoSign, verify as cryptoVerify } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import kleur from "kleur";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CONSTITUTION = join(ROOT, "rules", "constitution.toml");
const SIG_FILE = join(ROOT, "rules", "constitution.toml.sig");
const PUB_KEY = join(ROOT, "keys", "public.key");
const PRIV_KEY = join(ROOT, "keys", "private.key");

function hash(filePath) {
  const data = readFileSync(filePath);
  return createHash("sha256").update(data).digest("hex");
}

export async function sign() {
  if (!existsSync(PRIV_KEY)) {
    console.log(kleur.red("  No private key found at keys/private.key"));
    console.log(kleur.gray("  Generate one with: node lib/signer.js gen-keys"));
    return;
  }
  const privateKey = readFileSync(PRIV_KEY);
  const data = readFileSync(CONSTITUTION);
  const signature = cryptoSign(null, data, privateKey);
  writeFileSync(SIG_FILE, signature.toString("base64"));
  console.log(kleur.green("  Signed constitution.toml"));
  console.log(kleur.gray(`  Hash: sha256:${hash(CONSTITUTION)}`));
  console.log(kleur.gray(`  Signature: ${SIG_FILE}`));
}

export async function verify() {
  if (!existsSync(SIG_FILE)) {
    console.log(kleur.yellow("  No signature file found — skipping verify."));
    console.log(kleur.gray("  This is expected for unreleased dev builds."));
    return;
  }
  if (!existsSync(PUB_KEY)) {
    console.log(kleur.red("  No public key found at keys/public.key"));
    return;
  }
  const publicKey = readFileSync(PUB_KEY);
  const data = readFileSync(CONSTITUTION);
  const sig = Buffer.from(readFileSync(SIG_FILE, "utf8"), "base64");
  const ok = cryptoVerify(null, data, publicKey, sig);
  if (ok) {
    console.log(kleur.green("  Signature valid"));
    console.log(kleur.gray(`  Hash: sha256:${hash(CONSTITUTION)}`));
  } else {
    console.log(kleur.red("  Signature INVALID — file may have been tampered."));
    process.exit(1);
  }
}

export async function genKeys() {
  const { publicKey, privateKey } = generateKeyPairSync("ed25519");
  writeFileSync(
    PUB_KEY,
    publicKey.export({ type: "spki", format: "pem" }),
  );
  writeFileSync(
    PRIV_KEY,
    privateKey.export({ type: "pkcs8", format: "pem" }),
  );
  console.log(kleur.green("  Generated Ed25519 keypair"));
  console.log(kleur.gray(`  Public:  ${PUB_KEY}`));
  console.log(kleur.gray(`  Private: ${PRIV_KEY} (gitignored)`));
}

// Allow direct CLI: node lib/signer.js [sign|verify|gen-keys]
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, "/")}`) {
  const cmd = process.argv[2];
  if (cmd === "sign") await sign();
  else if (cmd === "verify") await verify();
  else if (cmd === "gen-keys") await genKeys();
  else console.log("Usage: node lib/signer.js [sign|verify|gen-keys]");
}
