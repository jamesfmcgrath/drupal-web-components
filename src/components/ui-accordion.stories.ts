import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './ui-accordion.js';

const meta: Meta = {
  title: 'Components/UiAccordion',
  component: 'ui-accordion',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## \`<ui-accordion>\` + \`<ui-accordion-item>\`

A fully accessible accordion built from scratch with zero third-party dependencies,
implementing the [WAI-ARIA Accordion pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/).

### Keyboard support
| Key          | Action                             |
|--------------|------------------------------------|
| Enter/Space  | Toggle focused panel open/closed   |
| Arrow Down   | Move focus to next header          |
| Arrow Up     | Move focus to previous header      |
| Home         | Move focus to first header         |
| End          | Move focus to last header          |

### Accessibility
- Trigger is a \`<button>\` inside an \`<h3>\` (override heading level with CSS \`font-size\` if needed).
- \`aria-expanded\` reflects open state on each trigger.
- \`aria-controls\` links each trigger to its panel \`id\`.
- Panel has \`role="region"\` + \`aria-labelledby\` pointing back to the trigger.
- Closed panels use the native \`hidden\` attribute (display:none — excluded from accessibility tree).
- Chevron icon is \`aria-hidden="true"\`.
- Focus ring: 3 px \`#f4a100\` outline on \`:focus-visible\`.
- Chevron rotation transition respects \`prefers-reduced-motion\`.

### Attributes on \`<ui-accordion>\`
| Attribute        | Type    | Default | Description                               |
|------------------|---------|---------|-------------------------------------------|
| \`allow-multiple\` | boolean | false | Allow more than one panel open at a time. |

### Attributes on \`<ui-accordion-item>\`
| Attribute | Type    | Default | Description              |
|-----------|---------|---------|--------------------------|
| \`heading\` | string  | —       | Panel heading text.      |
| \`open\`    | boolean | false   | Initially open.          |

### Events on \`<ui-accordion-item>\`
| Event                  | Detail               | Description            |
|------------------------|----------------------|------------------------|
| \`dwc-accordion-toggle\` | \`{ open: boolean }\` | Fired on each toggle. |

### CSS custom properties
| Property                        | Default              |
|---------------------------------|----------------------|
| \`--dwc-accordion-border\`        | \`1px solid #e0e0e0\` |
| \`--dwc-accordion-border-radius\` | \`0.5rem\`            |
| \`--dwc-accordion-header-bg\`     | \`transparent\`       |
| \`--dwc-accordion-header-bg-hover\` | \`#f5f5f5\`         |
| \`--dwc-accordion-header-color\`  | \`inherit\`           |
| \`--dwc-accordion-header-padding\`| \`1rem 1.25rem\`      |
| \`--dwc-accordion-panel-padding\` | \`0.25rem 1.25rem 1.25rem\` |
| \`--dwc-accordion-focus-ring\`    | \`3px solid #f4a100\` |
| \`--dwc-accordion-icon-color\`    | \`#0057a8\`           |
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <ui-accordion style="max-width: 48rem;">
      <ui-accordion-item heading="What is Drupal JSON:API?">
        <p>
          The JSON:API module ships with Drupal 8.7+ core. It exposes every entity type as a
          standards-compliant REST API with filtering, sparse fieldsets, and includes —
          no custom endpoint code required.
        </p>
      </ui-accordion-item>
      <ui-accordion-item heading="Why native Web Components?" open>
        <p>
          Web Components run in every modern browser without a framework runtime. For a
          Drupal-rendered page, that means zero JavaScript tax — just a
          <code>&lt;script type="module"&gt;</code> tag.
        </p>
      </ui-accordion-item>
      <ui-accordion-item heading="How do I point this at a real Drupal site?">
        <p>
          Set the <code>endpoint</code> attribute on
          <code>&lt;drupal-content-list&gt;</code> to your JSON:API URL and remove
          <code>use-mock</code>. See the README for CORS configuration details.
        </p>
      </ui-accordion-item>
    </ui-accordion>
  `,
  parameters: {
    docs: { description: { story: 'Default: only one panel open at a time.' } },
  },
};

export const AllowMultiple: Story = {
  render: () => html`
    <ui-accordion allow-multiple style="max-width: 48rem;">
      <ui-accordion-item heading="Panel One" open>
        <p>This panel starts open. With <code>allow-multiple</code>, other panels can also be opened.</p>
      </ui-accordion-item>
      <ui-accordion-item heading="Panel Two" open>
        <p>Multiple panels can be open simultaneously.</p>
      </ui-accordion-item>
      <ui-accordion-item heading="Panel Three">
        <p>Click to open without closing the others.</p>
      </ui-accordion-item>
    </ui-accordion>
  `,
  parameters: {
    docs: {
      description: { story: '`allow-multiple` attribute: many panels can be open at once.' },
    },
  },
};

export const CustomTheme: Story = {
  render: () => html`
    <ui-accordion
      style="
        max-width: 48rem;
        --dwc-accordion-border: 1px solid #2d2f44;
        --dwc-accordion-header-bg: #1e2030;
        --dwc-accordion-header-bg-hover: #252740;
        --dwc-accordion-header-color: #e0e0f0;
        --dwc-accordion-icon-color: #7c3aed;
        --dwc-accordion-focus-ring: 3px solid #f59e0b;
        --dwc-accordion-border-radius: 0.75rem;
        background: #1a1a2e;
        color: #e0e0f0;
        border-radius: 0.75rem;
        overflow: hidden;
      "
    >
      <ui-accordion-item heading="Dark theme panel one" open>
        <p style="color: #a0a0c0;">
          All colours are driven by CSS custom properties — the accordion itself has no
          hardcoded colours beyond accessible defaults.
        </p>
      </ui-accordion-item>
      <ui-accordion-item heading="Dark theme panel two">
        <p style="color: #a0a0c0;">Override any token from outside the Shadow DOM.</p>
      </ui-accordion-item>
    </ui-accordion>
  `,
  parameters: {
    backgrounds: { default: 'dark' },
    docs: { description: { story: 'Dark theme via CSS custom properties.' } },
  },
};

export const RichContent: Story = {
  render: () => html`
    <ui-accordion style="max-width: 48rem;">
      <ui-accordion-item heading="WCAG 2.1 AA compliance checklist">
        <ul>
          <li>1.4.3 — Text contrast ratio ≥ 4.5:1 (normal), ≥ 3:1 (large)</li>
          <li>1.4.4 — Text resizable to 200% without loss of content</li>
          <li>2.1.1 — All functionality available via keyboard</li>
          <li>2.4.7 — Focus indicator visible</li>
          <li>4.1.2 — Name, Role, Value for all UI components</li>
        </ul>
      </ui-accordion-item>
      <ui-accordion-item heading="Code snippet example" open>
        <pre style="background:#f5f5f5;padding:0.75rem;border-radius:0.375rem;overflow:auto;font-size:0.875rem"><code>&lt;drupal-content-list
  endpoint="/jsonapi/node/article"
  base-url="https://your-site.example"
  heading-level="h3"
  page-size="9"
&gt;&lt;/drupal-content-list&gt;</code></pre>
      </ui-accordion-item>
    </ui-accordion>
  `,
  parameters: {
    docs: { description: { story: 'Panels containing rich HTML content.' } },
  },
};
