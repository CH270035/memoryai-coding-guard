# Tích hợp Coding-Guard vào memoryai.vn (LadiPage)

> Hướng dẫn paste docs vào tab "Coding-Guard" trên landing page memoryai.vn.

---

## TL;DR

3 file đã chuẩn bị sẵn cho Cha:

| File | Dùng khi nào |
|---|---|
| `docs/landing-tab.html` | LadiPage cho phép HTML block (mặc định có) |
| `docs/landing-tab.md` | LadiPage chỉ cho text/markdown |
| `docs/quickstart.md` | Detail page nếu user click "Học thêm" |

---

## Cách 1 — LadiPage HTML Block (RECOMMEND)

LadiPage có widget "HTML / Embed Code" hoặc "Custom Code Block".

### Steps:

1. Mở landing memoryai.vn trong LadiPage editor
2. Tìm tab/section "Coding-Guard" (hoặc tạo mới nếu chưa có)
3. Drag widget **HTML / Custom Code** vào tab
4. Mở file [`docs/landing-tab.html`](./landing-tab.html) trong repo
5. Copy TOÀN BỘ nội dung file (Ctrl+A, Ctrl+C)
6. Paste vào widget HTML
7. Save + Preview
8. Publish

### Lưu ý:

- File `landing-tab.html` đã self-contained (CSS inline trong `style="..."`).
- Không cần load font/JS bên ngoài.
- Hoạt động trên mobile (responsive grid).
- Dark theme mặc định. Nếu landing memoryai.vn theme sáng, đổi `background: #0b0c0f` → `background: #fff` và đổi màu text tương ứng.

---

## Cách 2 — Markdown thuần

Nếu LadiPage không support HTML inline trong tab đó, dùng markdown:

1. Mở [`docs/landing-tab.md`](./landing-tab.md)
2. Copy toàn bộ
3. Paste vào widget Markdown của LadiPage

LadiPage sẽ tự render markdown → HTML.

---

## Cách 3 — Iframe (đơn giản nhất, chậm nhất)

Nếu Cha muốn đỡ phải maintain (khi update version, không phải copy lại):

```html
<iframe
  src="https://ch270035.github.io/memoryai-coding-guard/"
  width="100%"
  height="900"
  frameborder="0"
  style="border-radius: 12px;"
></iframe>
```

Setup:
1. Enable GitHub Pages cho repo (Settings → Pages → main / docs)
2. URL sẽ là `https://ch270035.github.io/memoryai-coding-guard/`
3. Paste iframe trên vào LadiPage

Update version chỉ cần push commit mới — landing tự refresh.

**Pros**: Auto-update, no maintenance.
**Cons**: Iframe SEO yếu, load chậm hơn 100ms.

---

## Khuyến nghị

**Cách 1** (HTML inline) — giữ SEO, load nhanh, tối đa control.

Khi nào update version:
1. Edit `docs/landing-tab.html` (vd đổi v1.1.0 → v1.2.0)
2. Re-paste vào LadiPage
3. Publish

Mỗi version mới mất 30 giây để update landing.

---

## Optional — Subdomain redirect

Nếu Cha muốn user gõ `coding-guard.memoryai.vn` đổ về tab cụ thể trên memoryai.vn:

DNS Cloudflare:
```
Type   Name             Target              Proxy   Setting
CNAME  coding-guard     memoryai.vn          On      Page Rule
```

Page Rule:
```
URL match: coding-guard.memoryai.vn/*
Forwarding URL: https://memoryai.vn/#coding-guard  (301 redirect)
```

Nhưng theo Cha đã chốt — không cần subdomain riêng, dùng thẳng tab trên memoryai.vn.

---

## Visual sanity check

Sau khi paste, kiểm tra:

- [ ] Hero "MemoryAI Coding-Guard" có gradient text
- [ ] Code block `npx @memoryai.dev/coding-guard install` hiển thị đúng monospace
- [ ] 4 cards principles có border màu khác nhau (cyan/green/yellow/pink)
- [ ] 11 platform tags hiển thị 1 hàng (responsive)
- [ ] CLI commands có comment `#` màu xám
- [ ] Mobile: text không tràn, layout tự stack

Nếu thiếu/lệch → check CSS inline trong `style="..."` của HTML.

---

## Tracking conversions (optional)

Thêm UTM params vào CTA:

```html
<a href="https://www.npmjs.com/package/@memoryai.dev/coding-guard?utm_source=memoryai_landing&utm_medium=tab&utm_campaign=coding_guard">npm</a>
```

Và setup Google Analytics trên LadiPage để đo:
- Click rate vào tab Coding-Guard
- CTR từ tab → npm/GitHub
- Bounce rate khỏi tab này

---

## Files trong repo

```
docs/
├── landing-tab.html        ← paste vào LadiPage HTML block (khuyến nghị)
├── landing-tab.md          ← phiên bản markdown nếu không support HTML
├── quickstart.md           ← link "Học thêm" point tới đây
├── index.html              ← standalone landing (cho GitHub Pages, nếu dùng iframe)
├── SETUP.md                ← DNS + GitHub Pages setup (nếu cần)
└── INTEGRATION.md          ← file này
```

---

## Câu hỏi → Cha bảo:

1. LadiPage có support HTML widget không? (99% có)
2. Theme landing memoryai.vn sáng hay tối? (để con tune màu)
3. Có muốn iframe auto-update hay manual paste?

Reply 1 câu, con adjust HTML cho khớp.
