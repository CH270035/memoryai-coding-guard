// lib/index.js
// Public API for programmatic usage.

export { detectIDE } from "./detect-ide.js";
export { run as install } from "./installer.js";
export { sign, verify, genKeys } from "./signer.js";
export { build } from "./builder.js";
