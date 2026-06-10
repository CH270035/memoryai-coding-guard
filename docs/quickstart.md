# Quickstart Guide

> 5 phút để AI agent của bạn hết ẩu.

## Bước 1 — Cài

```bash
npx @memoryai.dev/coding-guard install
```

Lệnh trên sẽ:

1. Quét folder hiện tại tìm dấu hiệu IDE/CLI (`.cursor/`, `.vscode/`, `CLAUDE.md`…)
2. Copy đúng rule file vào đúng path
3. Báo cho bạn biết platform nào đã cài

Ví dụ output:

```
  MemoryAI Coding-Guard installer

  Installing for:
    ✓ cursor             (1 file)
        coding-guard.mdc
    ✓ claude-code        (1 file)
        CLAUDE.md

  Installed 2 file(s).
```

## Bước 2 — Restart AI agent

- **Cursor**: Cmd+Shift+P → "Developer: Reload Window"
- **Claude Code**: bắt đầu session mới (`claude` lại)
- **Windsurf / Cline / Roo**: reload extension
- **Aider**: `aider` lại để load `CONVENTIONS.md`

## Bước 3 — Test

Hỏi AI: *"Fix the typo in README.md"*

Bạn sẽ thấy AI:
- ✅ Quote câu chính xác bạn yêu cầu
- ✅ Chỉ sửa file README.md
- ✅ Không tự ý "improve" file khác
- ✅ Show exit code sau khi sửa

Nếu AI vẫn ẩu → kiểm tra rule đã được load chưa: xem file `coding-guard.mdc` (Cursor) hoặc `CLAUDE.md` đã có nội dung 4 nguyên tắc.

---

## Cài cho specific platform

Bạn chỉ dùng 1 IDE? Cài đúng cái đó:

```bash
npx @memoryai.dev/coding-guard install --only cursor
npx @memoryai.dev/coding-guard install --only claude-code
npx @memoryai.dev/coding-guard install --only aider
```

## Cài hết 11 platform

Bạn mở project bằng nhiều tool? Cài hết:

```bash
npx @memoryai.dev/coding-guard install --all
```

## Xem trước, không ghi file

```bash
npx @memoryai.dev/coding-guard install --dry-run
```

## Cài global

```bash
npm i -g @memoryai.dev/coding-guard

coding-guard list           # xem 11 platform
coding-guard doctor         # health check
coding-guard install --all
cg install                  # alias 'cg' ngắn hơn
```

---

## FAQ

### "AI vẫn ẩu sau khi cài?"

3 lý do thường gặp:
1. Chưa restart AI session sau khi install
2. AI dùng global instructions (vd `~/.claude/CLAUDE.md`) override file project
3. Rule không đủ mạnh cho platform đó (vd Gemini hay paraphrase rule dài)

Fix: dùng `coding-guard doctor` để check, hoặc mở Issue trên GitHub.

### "Tôi muốn customize rule?"

Sau khi install, file rule là của bạn. Edit thoải mái. Nhưng nhớ:
- Không bỏ "anti-destructive" rule (block `rm -rf` v.v.)
- Không bỏ "anti-fake-verify" rule (force exit code)

### "Có conflict với rule cũ trong project?"

`coding-guard install` mặc định KHÔNG ghi đè file đã có. Nếu cần ghi đè, xóa file cũ trước.

### "Update lên version mới?"

```bash
coding-guard update
# hoặc
npx @memoryai.dev/coding-guard@latest install
```

### "Tắt tạm thời?"

Xóa file rule (vd `.cursor/rules/coding-guard.mdc`). Bật lại = chạy install lại.

---

## Family

- [`@memoryai.dev/context-guard`](https://github.com/CH270035/memoryai-context-guard) — bảo vệ AI context
- **`@memoryai.dev/coding-guard`** — bạn đang dùng
- (sắp ra) `@memoryai.dev/secret-guard` — block secret leak

---

## Help

- 📖 Full docs: [README.md](https://github.com/CH270035/memoryai-coding-guard/blob/main/README.md)
- 🐛 Bug report: [GitHub Issues](https://github.com/CH270035/memoryai-coding-guard/issues)
- 💬 Email: hello@memoryai.dev
