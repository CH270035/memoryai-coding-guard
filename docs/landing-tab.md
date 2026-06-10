# MemoryAI Coding-Guard — Landing Tab Content (Markdown)

> Phiên bản markdown thuần để paste vào landing page nào không support HTML inline.

---

## 🛡 MemoryAI Coding-Guard

**Stop AI coding agents from being sloppy.** Install once → 11 IDE/CLI follow the rules.

`v1.1.0` · `MIT` · `@memoryai.dev/coding-guard`

---

### Cài 1 lệnh

```bash
npx @memoryai.dev/coding-guard install
```

Tự động phát hiện AI agent đang dùng (Cursor, Claude Code, Aider, Copilot…) và copy đúng file rule vào đúng path.

---

### 4 nguyên tắc cốt lõi

| Nguyên tắc | Chống điều gì |
|---|---|
| **Think Before Coding** | Silent assumptions, đoán mò scope |
| **Simplicity First** | Over-engineering, abstraction thừa |
| **Surgical Changes** | Drive-by refactor, tự ý "improve" code |
| **Goal-Driven Execution** | Claim "done" mà không verify |

### + 5 lớp anti-ẩu

- **Anti-hallucinate** — buộc verify import vs lockfile, cite file:line
- **Anti-fake-verify** — paste exit code thật, không "looks good" suông
- **Anti-out-of-scope** — 5+ files → plan trước, ack sau
- **Anti-loop** — 2 fails giống nhau → STOP, diagnose root cause
- **Anti-destructive** — `rm -rf`, `git push --force` luôn cần confirm

---

### 11 platform hỗ trợ

```
Claude Code · Cursor · Windsurf · Cline · Roo Code · Kilo Code
GitHub Copilot · JetBrains Junie · Aider · OpenAI Codex · Gemini CLI
+ universal AGENTS.md (OpenCode/Continue/Crush)
```

---

### CLI commands

```bash
# Cài cho project hiện tại
npx @memoryai.dev/coding-guard install

# Cài cho mọi platform
npx @memoryai.dev/coding-guard install --all

# Chỉ 1 platform
npx @memoryai.dev/coding-guard install --only cursor

# Xem trước, không ghi file
npx @memoryai.dev/coding-guard install --dry-run

# Cài global + dùng tên ngắn 'cg'
npm i -g @memoryai.dev/coding-guard
coding-guard list           # 11 platforms
coding-guard doctor         # health check
coding-guard update         # lên latest
cg install                  # alias ngắn
```

---

### MemoryAI Guards Family

- 🛡 [`@memoryai.dev/context-guard`](https://github.com/CH270035/memoryai-context-guard) — bảo vệ context AI khỏi overflow
- 🛡 **`@memoryai.dev/coding-guard`** — bạn đang xem (chống AI ẩu khi viết code)

---

### Links

- 📦 [npm](https://www.npmjs.com/package/@memoryai.dev/coding-guard)
- ⚡ [GitHub](https://github.com/CH270035/memoryai-coding-guard)
- 📖 [Full Docs](https://github.com/CH270035/memoryai-coding-guard/blob/main/README.md)
- 🚀 [Quickstart](https://github.com/CH270035/memoryai-coding-guard/blob/main/docs/quickstart.md)
- 🐛 [Issues](https://github.com/CH270035/memoryai-coding-guard/issues)

---

> Built by [MemoryAI](https://memoryai.dev) · For developers who want their AI agents to think before they type.
