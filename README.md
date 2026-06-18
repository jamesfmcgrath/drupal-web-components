# Drupal Web Components

A library of native Web Components built with **Lit 3 + TypeScript** that render content from a Drupal site via JSON:API. Drop them into any Drupal-rendered page or plain HTML — no framework runtime required.

[![CI](https://github.com/jfm-digital/drupal-web-components/actions/workflows/ci.yml/badge.svg)](https://github.com/jfm-digital/drupal-web-components/actions/workflows/ci.yml)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## Components

| Element | Description |
|---|---|
| `<drupal-content-card>` | Single content item — title, summary, image, CTA link |
| `<drupal-content-list>` | Fetches a JSON:API listing; renders a responsive card grid with loading/error/empty states |
| `<drupal-content-search>` | Debounced search/filter input; announces result counts via `aria-live` |
| `<ui-accordion>` | From-scratch accessible accordion with full keyboard support and correct ARIA |

---

## Quick start

```bash
npm install
npm run dev        # Vite dev server at http://localhost:5173
npm run storybook  # Storybook at http://localhost:6006
npm test           # Vitest unit tests
```

---

## Architecture

```
src/
├── components/
│   ├── drupal-content-card.ts      # LitElement component
│   ├── drupal-content-list.ts
│   ├── drupal-content-search.ts
│   └── ui-accordion.ts
├── data/
│   ├── mock.ts                     # Realistic mock JSON:API response
│   └── normalise.ts                # JSON:API → ContentItem normaliser
├── types/
│   └── jsonapi.ts                  # TypeScript interfaces for JSON:API spec
├── index.ts                        # Library entry point
└── test-setup.ts                   # Vitest global setup
```

### Web Components fundamentals — what this demonstrates

| Concept | Where |
|---|---|
| Custom Elements registration | `@customElement('drupal-content-card')` in every component |
| Shadow DOM encapsulation | `static styles = css\`…\`` — styles cannot leak |
| Slots (default + named) | `<slot>` and `<slot name="footer">` in `drupal-content-card` |
| Reactive properties/attributes | `@property()`, `@state()` with `updateComplete` |
| Lifecycle callbacks | `connectedCallback` triggers fetch in `drupal-content-list` |
| Custom events (composed) | `dwc-card-click`, `dwc-list-loaded`, `dwc-search`, `dwc-accordion-toggle` |
| CSS custom properties | All colour tokens exposed for external theming |
| `::part()` styling | `part="card"`, `part="image"`, etc. on all components |

### Data flow

```
JSON:API endpoint (or mock data)
        ↓  fetch()
normaliseJsonApiResponse()          ← single place that knows JSON:API shape
        ↓  ContentItem[]
drupal-content-list                 ← holds the canonical item array
        ↓  .setFilteredItems()      ← called by search
drupal-content-search               ← filters items, announces count
        ↓
drupal-content-card × N             ← stateless display component
```

---

## Connecting to a real Drupal 10/11 site

### 1. Enable JSON:API and CORS

In `sites/default/services.yml`, set:

```yaml
cors.config:
  enabled: true
  allowedHeaders: ['*']
  allowedMethods: ['GET']
  allowedOrigins:
    - 'https://your-frontend.example'
  exposedHeaders: false
  maxAge: false
  supportsCredentials: false
```

Then rebuild the container / clear the cache:

```bash
drush cr
```

### 2. Configure the component

Replace `use-mock` with your endpoint URL:

```html
<!-- Before (mock) -->
<drupal-content-list use-mock></drupal-content-list>

<!-- After (real Drupal) -->
<drupal-content-list
  endpoint="https://your-drupal-site.example/jsonapi/node/article?include=field_image&page[limit]=12"
  base-url="https://your-drupal-site.example"
></drupal-content-list>
```

### 3. Recommended JSON:API query parameters

```
/jsonapi/node/article
  ?include=field_image                  # embed file resource for image URL
  &fields[node--article]=title,body,path,created,field_image
  &fields[file--file]=uri,alt,width,height
  &filter[status][value]=1              # published only
  &sort=-created                        # newest first
  &page[limit]=12
```

### Mapping custom fields

If your content type uses different field names, update `src/data/normalise.ts` — specifically the `resolveImageUrl` function and the `summary` fallback logic in `normaliseJsonApiResponse`. The typed `JsonApiNodeAttributes` interface in `src/types/jsonapi.ts` uses an index signature (`[key: string]: unknown`) so additional fields are accessible without further changes.

---

## Theming

All components expose CSS custom properties. Apply them from your Drupal theme's CSS:

```css
/* In your theme's global stylesheet */
drupal-content-card {
  --dwc-card-link-bg: #d4380d;          /* red CTA */
  --dwc-card-link-bg-hover: #a61d05;
  --dwc-card-border-radius: 0;          /* sharp corners */
  --dwc-card-focus-ring: 3px solid #fadb14;
}

drupal-content-search {
  --dwc-search-btn-bg: #d4380d;
  --dwc-search-focus-ring: 3px solid #fadb14;
}

ui-accordion {
  --dwc-accordion-icon-color: #d4380d;
  --dwc-accordion-focus-ring: 3px solid #fadb14;
}
```

For structural overrides, use `::part()`:

```css
drupal-content-card::part(card) {
  border-top: 4px solid #d4380d;
}

drupal-content-card::part(link) {
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

---

## Accessibility

All components target **WCAG 2.1 AA**. Key commitments:

- Semantic HTML with correct ARIA roles and states
- Visible `:focus-visible` indicators (3 px accent ring, never removed)
- Full keyboard navigation (accordion: ↑↓ Home End; search: Escape to clear)
- `aria-live="polite"` regions for async content announcements (loading, search results)
- `role="alert"` for error states
- `prefers-reduced-motion` respected on all CSS transitions
- Light/dark colour scheme via CSS custom properties (no JavaScript)
- `::part()` API preserved for integrators needing custom focus styles

Run the Storybook accessibility addon (`@storybook/addon-a11y`) for automated axe checks against every story.

---

## Why native Web Components for Drupal?

Drupal renders HTML on the server. Shipping a framework runtime (React, Vue, Angular) alongside server-rendered markup adds kilobytes of JavaScript and a hydration step for components that may only need to enhance existing markup.

Native Web Components:

- **Work anywhere** — no framework version negotiation, no peer dependency conflicts
- **Compose with Drupal's render pipeline** — add a `<script type="module">` tag in your theme's `libraries.yml` and the elements just work
- **Upgrade gracefully** — browsers render the HTML before JavaScript loads; the component enhances it
- **Long-lived** — the Custom Elements spec is part of the HTML standard; no framework deprecation risk
- **Theming-friendly** — CSS custom properties and `::part()` give Drupal theme developers the same control they have with any other HTML element

This library demonstrates that "framework-agnostic components" is not a compromise — it is a feature.

---

## Scripts

```bash
npm run dev              # Vite dev server
npm run build            # Build library (dist/)
npm run storybook        # Storybook dev server
npm run build-storybook  # Build Storybook (storybook-static/)
npm test                 # Vitest unit tests
npm run test:coverage    # Tests with coverage report
npm run typecheck        # tsc --noEmit
```

---

## Deployment

Push to `main` to trigger the GitHub Actions [deploy workflow](.github/workflows/deploy.yml). It:

1. Runs type-check and unit tests
2. Builds the Vite demo and Storybook
3. Publishes the demo to GitHub Pages root and Storybook to `/storybook/`

Enable **GitHub Pages** in your repository settings (Source: GitHub Actions) before the first deploy.

---

## License

MIT © [JFM Digital Works](https://jfmdigital.works)
