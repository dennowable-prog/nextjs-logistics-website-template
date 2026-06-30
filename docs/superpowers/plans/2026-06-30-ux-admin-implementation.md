# UX + Admin Implementation Plan

**Goal:** Implement design polish (fonts, animations, navigation, speed) + admin panel (Google Sheets + admin page) for New Line Cargo.

**Architecture:** All changes land on the existing Next.js 15 static export codebase. UX changes are CSS/component-only. Admin uses Google Sheets API (via Apps Script webhook) + Telegram for instant notifications. No framework migration.

**Deferred to later stage:** Spline 3D model on Hero (WebGL dependency, needs separate evaluation).

**Tech Stack:** Next.js 15 (Pages Router), Bootstrap 5.3, SCSS, scrollCue, next/font, Google Apps Script, Cloudflare Pages

---

### Task 1: Lighthouse baseline audit

**Files:** None (external measurement)

- [ ] **Step 1: Run Lighthouse on production-equivalent build**

```bash
npm run build
# Serve the out/ directory locally and test:
# npx serve out -l 3000
# Then run Lighthouse via Chrome DevTools or CLI
```

**Expected:** Record scores for Performance, Accessibility, SEO, Best Practices to compare post-implementation.

- [ ] **Step 2: Commit (empty — just note)**

---

### Task 2: Fonts — перевод на `next/font`

**Files:**
- Modify: `pages/_document.jsx`
- Create: `src/fonts.js`

- [ ] **Step 1: Create `src/fonts.js` with next/font config**

```jsx
import { Inter, JetBrains_Mono } from 'next/font/google';

export const inter = Inter({
  subsets: ['cyrillic', 'latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['cyrillic', 'latin'],
  display: 'swap',
  variable: '--font-mono',
  weight: ['400', '500', '700'],
});
```

- [ ] **Step 2: Update `pages/_document.jsx` — remove Google Fonts `<link>`, add font classes**

```jsx
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="ru">
        <Head>
          <link rel="icon" type="image/svg+xml" href="/images/logo.svg" />
          <link rel="icon" type="image/webp" href="/images/favicon.webp" sizes="32x32" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
```

- [ ] **Step 3: Update `pages/_app.jsx` — apply font classes to root element**

```jsx
import { inter, jetbrainsMono } from 'src/fonts';

// In the component:
<div className={`${inter.variable} ${jetbrainsMono.variable}`}>
  {/* ... rest of app ... */}
</div>
```

- [ ] **Step 4: Update CSS variables**

Find in `src/styles/style.css` and `src/assets/scss/_variables.scss` where `Inter` / `Manrope` are referenced. Set `font-family` to use `var(--font-inter)` and `var(--font-mono)`.

Key files to check:
- `src/styles/style.css` (body font-family)
- `src/assets/scss/style.scss` (any font imports)
- `src/assets/scss/_variables.scss` ($font-family vars)

For SCSS:
```scss
$font-family-sans-serif: var(--font-inter), 'Inter', sans-serif;
$font-family-mono: var(--font-mono), 'JetBrains Mono', monospace;
```

For CSS:
```css
body {
  font-family: var(--font-inter), 'Inter', sans-serif;
}
```

- [ ] **Step 5: Build + lint check**

```bash
npm run lint && npm run build
```

**Expected:** 0 errors, fonts loaded locally, no external Google Fonts requests.

- [ ] **Step 6: Commit**

```bash
git add src/fonts.js pages/_document.jsx pages/_app.jsx src/styles/style.css src/assets/scss/
git commit -m "feat: migrate fonts to next/font (Inter + JetBrains Mono)"
```

---

### Task 3: Icons — удаление Unicons, миграция на Icons.jsx

**Files:**
- Modify: `src/components/Icons.jsx` — add missing icons currently using Unicons
- Modify: `src/components/SocialLinks.jsx` — migrate from Unicons CSS classes to Icon component
- Modify: `src/assets/scss/` — remove Unicons font imports
- Modify: `public/css/` — remove Unicons CSS files if present

- [ ] **Step 1: Add missing icons to Icons.jsx**

Search codebase for Unicons usage (`uil uil-*` classes). Add needed icons to `src/components/Icons.jsx`:
- Facebook, Instagram, YouTube, Telegram icons (if used in SocialLinks)

```jsx
// Add to Icons.jsx
case 'facebook':
  return <svg ...>...</svg>;
case 'instagram':
  return <svg ...>...</svg>;
case 'youtube':
  return <svg ...>...</svg>;
case 'telegram':
  return <svg ...>...</svg>;
```

- [ ] **Step 2: Migrate SocialLinks.jsx from Unicons CSS to Icon component**

Replace `<i className="uil uil-facebook-f" />` with `<Icon name="facebook" size={18} color="#a3a3a3" />`.

- [ ] **Step 3: Remove Unicons font files + imports**

Search for Unicons references in SCSS:
- `src/assets/scss/style.scss` — remove `@import` or `@font-face` for Unicons
- Any `.css` or `.scss` file referencing Unicons classes (`.uil`, `.uil-*`)

- [ ] **Step 4: Build + lint**

```bash
npm run lint && npm run build
```

- [ ] **Step 5: Commit**

```bash
git add src/components/Icons.jsx src/components/SocialLinks.jsx src/assets/scss/
git commit -m "feat: remove Unicons font, migrate all icons to Icons.jsx"
```

---

### Task 4: Image optimization — lazy loading + aspect-ratio

**Files:**
- Modify: Various component files with images below the fold

- [ ] **Step 1: Add `loading="lazy"` and size attributes to all images below fold**

Components to check (from exploration):
- `src/components/About.jsx` — images
- `src/components/Services.jsx` — any images
- `src/components/Steps.jsx` — any images
- `src/components/Facts.jsx` — any images
- `src/components/CoordinatesMap.jsx` — map tiles
- Pages with images (blog cards, service cards)

Add to each `<img>` or `next/image`:
```jsx
loading="lazy"
width={...}
height={...}
// Or in CSS:
style={{ aspectRatio: '16/9' }}
```

For `next/image`:
```jsx
<Image loading="lazy" width={800} height={450} ... />
```

- [ ] **Step 2: Add aspect-ratio CSS for images to prevent CLS**

In `src/styles/style.css`:
```css
img {
  aspect-ratio: attr(width) / attr(height);
}
```

Or per-component CSS classes.

- [ ] **Step 3: Build + lint**

```bash
npm run lint && npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/components/ src/styles/
git commit -m "perf: add lazy loading and aspect-ratio to images"
```

---

### Task 5: Scroll animation diversity (scrollCue)

**Files:**
- Modify: `src/components/Hero.jsx`, `About.jsx`, `Services.jsx`, `Steps.jsx`, `Facts.jsx`, `Reviews.jsx`, `Contact.jsx`, `QuoteForm.jsx`, `CoordinatesMap.jsx`

- [ ] **Step 1: Replace `fadeIn` with varied animations in each component**

Map of changes:
| Component | Current | New | Notes |
|-----------|---------|-----|-------|
| Hero.jsx | `fadeIn` | `fadeIn` | Keep, hero should be simple |
| About.jsx image | `fadeIn` | `slideInLeft` | Image slides from left |
| About.jsx text | `fadeIn` | `slideInRight` | Text slides from right |
| Services.jsx cards | `fadeIn` | `zoomIn` | Cards zoom in gently |
| Steps.jsx | `fadeIn` | `fadeInUp` | Steps appear from below |
| Facts.jsx | `fadeIn` | `fadeInUp` | Numbers fade up |
| Reviews.jsx | `fadeIn` | `fadeInUp` | Reviews fade up |
| Contact.jsx map | `fadeIn` | `slideInLeft` | Map slides left |
| Contact.jsx form | `fadeIn` | `slideInRight` | Form slides right |
| QuoteForm.jsx | `fadeIn` | `fadeInUp` | Form sections fade up |

- [ ] **Step 2: Test in dev**

```bash
npm run dev
# Scroll through each section, verify animations play correctly
```

- [ ] **Step 3: Commit**

```bash
git add src/components/
git commit -m "feat: diversify scroll animations (slideIn, zoomIn, fadeInUp)"
```

---

### Task 6: Page transitions (fade on mount)

**Files:**
- Modify: `src/styles/style.css` — add fade-in animation
- Modify: `pages/_app.jsx` — remove/update loading state, apply mount animation

- [ ] **Step 1: Add CSS animation**

In `src/styles/style.css`:
```css
@keyframes page-fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.page-fade-in {
  animation: page-fade-in 0.3s ease-out;
}
```

- [ ] **Step 2: Apply to page content in `_app.jsx`**

Wrap `<Component>` with the animation class. The page loader already handles a brief loading state — replace with the fade-in:

```jsx
<div className="page-fade-in" key={pathname}>
  <Component {...pageProps} />
</div>
```

Note: `key={pathname}` forces re-mount on route change, triggering the CSS animation.

- [ ] **Step 3: Build + lint**

```bash
npm run lint && npm run build
```

- [ ] **Step 4: Commit**

```bash
git add pages/_app.jsx src/styles/style.css
git commit -m "feat: add page fade-in transition on mount"
```

---

### Task 7: Breadcrumbs + JSON-LD на внутренних страницах

**Files:**
- Create: `src/components/Breadcrumbs.jsx`
- Modify: `pages/services/[slug].jsx`, `pages/blog/[slug].jsx`, `pages/tariffs.jsx`, `pages/faq.jsx`

- [ ] **Step 1: Create Breadcrumbs component**

```jsx
// src/components/Breadcrumbs.jsx
import NextLink from './NextLink';

export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-3">
      <ol className="d-flex flex-wrap align-items-center gap-2 m-0 p-0 list-unstyled fs-14" style={{ color: '#737373' }}>
        <li>
          <NextLink href="/" style={{ color: '#737373', textDecoration: 'none' }}>Главная</NextLink>
          <span className="ms-2">/</span>
        </li>
        {items.map((item, i) => (
          <li key={i}>
            {item.href ? (
              <>
                <NextLink href={item.href} style={{ color: '#737373', textDecoration: 'none' }}>{item.label}</NextLink>
                <span className="ms-2">/</span>
              </>
            ) : (
              <span style={{ color: '#a3a3a3' }}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

- [ ] **Step 2: Add JSON-LD BreadcrumbList generator**

In `src/seo-jsonld.js` or a new `src/breadcrumb-jsonld.js`:
```jsx
export function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: item.href ? `https://newlinecargo.ru${item.href}` : undefined,
    })),
  };
}
```

- [ ] **Step 3: Add breadcrumbs to service pages**

In `pages/services/[slug].jsx`:
```jsx
import Breadcrumbs from '../../src/components/Breadcrumbs';
// ...
<Breadcrumbs items={[
  { label: 'Услуги', href: '/services' },
  { label: service.h1 },
]} />
```

- [ ] **Step 4: Add breadcrumbs to blog pages**

```jsx
<Breadcrumbs items={[
  { label: 'Блог', href: '/blog' },
  { label: article.h1 },
]} />
```

- [ ] **Step 5: Add breadcrumbs to tariffs and FAQ**

- [ ] **Step 6: Build + lint**

```bash
npm run lint && npm run build
```

- [ ] **Step 7: Commit**

```bash
git add src/components/Breadcrumbs.jsx pages/services/ pages/blog/ pages/tariffs.jsx pages/faq.jsx
git commit -m "feat: add breadcrumbs + JSON-LD to inner pages"
```

---

### Task 8: Sticky header — прогресс-бар чтения для блога

**Files:**
- Modify: `src/components/Header.jsx` — smooth sticky transition
- Create: `src/components/ReadingProgress.jsx`
- Modify: `pages/blog/[slug].jsx` — add progress bar

- [ ] **Step 1: Create ReadingProgress component**

```jsx
// src/components/ReadingProgress.jsx
import { useState, useEffect } from 'react';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: 3, zIndex: 9999, background: '#222' }}>
      <div style={{ width: `${progress}%`, height: '100%', background: '#f59e0b', transition: 'width 0.1s linear' }} />
    </div>
  );
}
```

- [ ] **Step 2: Add to `pages/blog/[slug].jsx`**

```jsx
import ReadingProgress from '../../src/components/ReadingProgress';
// ...
<ReadingProgress />
```

- [ ] **Step 3: Build + lint**

- [ ] **Step 4: Commit**

```bash
git add src/components/ReadingProgress.jsx pages/blog/\[slug\].jsx
git commit -m "feat: add reading progress bar to blog pages"
```

---

### Task 9: Google Sheets webhook (Apps Script) + form integration

**Files:**
- Create: Google Apps Script (explain setup, no file to commit)
- Modify: `pages/api/send-email.js` — add POST to Sheets webhook
- Modify: `.env.local` — add SHEETS_WEBHOOK_URL

- [ ] **Step 1: Create Google Sheet and Apps Script**

Guide (user does in browser):
1. Create Google Sheet with sheets: `заявки`, `tracking`, `контакты`
2. Extensions → Apps Script → paste:

```javascript
function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const data = JSON.parse(e.postData.contents);
  
  if (data.type === 'quote') {
    const sheet = ss.getSheetByName('заявки');
    sheet.appendRow([
      new Date(), data.name, data.phone, data.email,
      data.transport || '', data.from || '', data.to || '',
      data.weight || '', data.message || ''
    ]);
  } else if (data.type === 'tracking') {
    const sheet = ss.getSheetByName('tracking');
    sheet.appendRow([new Date(), data.ticketId, data.inn, data.company || '']);
  } else if (data.type === 'contact') {
    const sheet = ss.getSheetByName('контакты');
    sheet.appendRow([new Date(), data.name, data.phone, data.email, data.message || '']);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Deploy → New deployment → Web app → Execute as: Me, Access: Anyone → copy URL

- [ ] **Step 2: Add SHEETS_WEBHOOK_URL to `.env.local`**

```
SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/xxx/exec
```

- [ ] **Step 3: Update `pages/api/send-email.js`**

Add POST to Sheets webhook alongside existing Telegram call:

```jsx
async function postToSheets(data) {
  const url = process.env.SHEETS_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (e) {
    console.error('Sheets webhook error:', e.message);
  }
}
```

Call `postToSheets()` in each handler with appropriate type.

- [ ] **Step 4: Build + lint**

- [ ] **Step 5: Commit**

```bash
git add pages/api/send-email.js .env.local
git commit -m "feat: add Google Sheets webhook to form submissions"
```

---

### Task 10: Admin page `/admin`

**Files:**
- Create: `pages/admin.jsx`

- [ ] **Step 1: Create admin page**

```jsx
import Head from 'next/head';
import { useState, useEffect } from 'react';

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('admin_auth')) {
      setAuthed(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', 'true');
      setAuthed(true);
      setError('');
    } else {
      setError('Неверный пароль');
    }
  };

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <form onSubmit={handleLogin} className="p-5" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, maxWidth: 400, width: '90%' }}>
          <h2 className="text-white mb-4 fs-20 fw-bold">Админ-панель</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            className="w-100 px-3 py-2 mb-3 fs-15 border-0"
            style={{ background: '#111', color: '#e5e5e5', borderRadius: 4, outline: '1px solid #333' }}
          />
          {error && <p className="fs-14 mb-2" style={{ color: '#ef4444' }}>{error}</p>}
          <button type="submit" className="btn btn-amber text-white w-100 py-2 fw-semibold">Войти</button>
        </form>
      </div>
    );
  }

  return (
    <>
      <Head><title>Админ-панель — New Line Cargo</title></Head>
      <section className="wrapper section-padding" style={{ background: '#111', minHeight: '100vh' }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-6">
            <h1 className="display-heading-2 text-white mb-0">Админ-панель</h1>
            <button onClick={() => { sessionStorage.removeItem('admin_auth'); setAuthed(false); }}
              className="btn px-3 py-1 fs-14 border-0"
              style={{ background: '#2a2a2a', color: '#a3a3a3' }}>
              Выйти
            </button>
          </div>

          <div className="row g-4 mb-6">
            <div className="col-md-4">
              <div className="p-4" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 6 }}>
                <h3 className="text-white fs-16 fw-semibold mb-1">Заявки на расчёт</h3>
                <p className="fs-14 mb-3" style={{ color: '#737373' }}>Просмотр и экспорт</p>
                <a href={process.env.NEXT_PUBLIC_SHEETS_URL || '#'} target="_blank" rel="noopener noreferrer"
                  className="btn btn-amber text-white px-3 py-1 fs-14">
                  Открыть Google Sheets
                </a>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 6 }}>
                <h3 className="text-white fs-16 fw-semibold mb-1">Яндекс.Метрика</h3>
                <p className="fs-14 mb-3" style={{ color: '#737373' }}>Посещаемость и поведение</p>
                <a href={`https://metrika.yandex.ru/dashboard?id=${process.env.NEXT_PUBLIC_YM_ID}`} target="_blank" rel="noopener noreferrer"
                  className="btn px-3 py-1 fs-14"
                  style={{ background: '#2a2a2a', color: '#a3a3a3', textDecoration: 'none' }}>
                  Открыть Метрику
                </a>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 6 }}>
                <h3 className="text-white fs-16 fw-semibold mb-1">Google Analytics</h3>
                <p className="fs-14 mb-3" style={{ color: '#737373' }}>Детальная аналитика</p>
                <a href={`https://analytics.google.com/analytics/web/#/p${process.env.NEXT_PUBLIC_GA_ID?.replace('G-', '')}/`} target="_blank" rel="noopener noreferrer"
                  className="btn px-3 py-1 fs-14"
                  style={{ background: '#2a2a2a', color: '#a3a3a3', textDecoration: 'none' }}>
                  Открыть GA
                </a>
              </div>
            </div>
          </div>

          <div className="p-4" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 6 }}>
            <h3 className="text-white fs-16 fw-semibold mb-2">Telegram-уведомления</h3>
            <p className="fs-14 mb-0" style={{ color: '#737373' }}>Новые заявки автоматически отправляются в Telegram-чат. Статус: <span style={{ color: '#22c55e' }}>активно</span></p>
          </div>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Add admin password to `.env.local`**

```
NEXT_PUBLIC_ADMIN_PASSWORD=changeme
NEXT_PUBLIC_SHEETS_URL=https://docs.google.com/spreadsheets/d/xxx
```

- [ ] **Step 3: Add `/admin` link in mobile-friendly place (Footer? Or just keep it private — owner will navigate directly)**

- [ ] **Step 4: Build + lint**

```bash
npm run lint && npm run build
```

**Expected:** 0 errors, `/admin` page accessible via direct URL

- [ ] **Step 5: Commit**

```bash
git add pages/admin.jsx .env.local
git commit -m "feat: add admin page with analytics links + Google Sheets"
```

---

### Task 11: Финальная сборка + Lighthouse сравнение

**Files:** None (verification)

- [ ] **Step 1: Run final lint + build**

```bash
npm run lint && npm run build
```

- [ ] **Step 2: Run Lighthouse again**

Compare with baseline from Task 1.

- [ ] **Step 3: Verify all pages render**

```bash
ls out/ | head -30
```

- [ ] **Step 4: Final commit**

```bash
git add -A && git commit -m "chore: final build checkpoint"
```

---

## Spec Coverage Check

| Spec Section | Task Coverage |
|---|---|
| 1. Visual style / typography | Task 2 (fonts), Task 3 (icons) |
| 2. Animations | Task 5 (scrollCue), Task 6 (page transitions) |
| 2. Hero 3D Spline model | **DEFERRED** — separate evaluation |
| 3. Navigation / breadcrumbs | Task 7 (breadcrumbs + JSON-LD) |
| 3. Sticky header / progress bar | Task 8 (progress bar) |
| 4. Speed optimization | Task 2 (next/font), Task 4 (images) |
| 5. Admin panel | Task 9 (Sheets webhook), Task 10 (admin page) |
| 6. Quality control | Task 1 + Task 11 (Lighthouse, build, lint) |
