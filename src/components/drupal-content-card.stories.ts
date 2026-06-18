import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './drupal-content-card.js';
import type { ContentItem } from '../types/jsonapi.js';

const sampleItem: ContentItem = {
  id: 'story-1',
  title: 'Building accessible digital services for local government',
  summary:
    'Local councils are under increasing pressure to deliver digital services that work for everyone. This article explores how modern web technologies can help.',
  imageUrl:
    'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80',
  imageAlt: 'People collaborating around a laptop in a bright office',
  url: '#',
  created: new Date('2024-03-15'),
};

const meta: Meta = {
  title: 'Components/DrupalContentCard',
  component: 'drupal-content-card',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## \`<drupal-content-card>\`

Displays a single Drupal content item — title, summary, image, and a CTA link.

### Fundamentals demonstrated
- **Shadow DOM** style encapsulation: card styles cannot leak out or be accidentally overridden.
- **Reactive properties** (\`item\`, \`href\`, \`headingLevel\`): changes trigger re-render via Lit's reactive system.
- **Slots**: the default slot replaces the summary, \`footer\` slot appends below the CTA.
- **CSS custom properties**: all colour tokens are exposed so a Drupal theme can restyle from outside the Shadow DOM.
- **CustomEvent**: \`dwc-card-click\` bubbles through Shadow DOM (composed: true), so page-level analytics can listen.
- **Part attributes**: \`part="card"\`, \`part="image"\`, etc. enable \`::part()\` styling from the host page.

### Accessibility
- \`<article>\` landmark with descriptive heading inside.
- Link text includes a visually hidden "about <title>" suffix (e.g. "Read more about Building accessible…") to disambiguate multiple cards on the page.
- Focus ring: 3 px \`#f4a100\` outline on \`:focus-visible\`.
- \`prefers-reduced-motion\`: hover transition disabled.
- Placeholder shown (no visible alt text exposed) when image is absent.
        `,
      },
    },
  },
  argTypes: {
    headingLevel: { control: 'select', options: ['h2', 'h3', 'h4'] },
    imageLoading: { control: 'radio', options: ['lazy', 'eager'] },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const el = document.createElement('drupal-content-card') as HTMLElement & { item: ContentItem };
    el.setAttribute('heading-level', 'h3');
    el.item = sampleItem;
    return el;
  },
  parameters: {
    docs: { description: { story: 'Card with full content: title, summary, image, and link.' } },
  },
};

export const NoImage: Story = {
  render: () => {
    const el = document.createElement('drupal-content-card') as HTMLElement & { item: ContentItem };
    el.item = { ...sampleItem, imageUrl: null };
    return el;
  },
  parameters: {
    docs: {
      description: { story: 'Falls back to an SVG placeholder when imageUrl is null.' },
    },
  },
};

export const WithFooterSlot: Story = {
  render: () => html`
    <drupal-content-card
      .item=${sampleItem}
      heading-level="h3"
      style="max-width: 22rem;"
    >
      <span slot="footer" style="font-size:0.8rem;color:#666">
        ✓ Published 15 March 2024
      </span>
    </drupal-content-card>
  `,
  parameters: {
    docs: {
      description: { story: 'Using the `footer` named slot to inject metadata below the CTA.' },
    },
  },
};

export const CustomTheme: Story = {
  render: () => html`
    <drupal-content-card
      .item=${sampleItem}
      style="
        --dwc-card-bg: #1a1a2e;
        --dwc-card-border: 1px solid #2d2f44;
        --dwc-card-title-color: #e8e8f0;
        --dwc-card-summary-color: #a0a0b0;
        --dwc-card-link-bg: #7c3aed;
        --dwc-card-link-bg-hover: #5b21b6;
        --dwc-card-focus-ring: 3px solid #f59e0b;
        max-width: 22rem;
      "
    ></drupal-content-card>
  `,
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'Demonstrating CSS custom property theming — all tokens overridden inline.',
      },
    },
  },
};

export const GridOfCards: Story = {
  render: () => {
    const items: ContentItem[] = [
      sampleItem,
      {
        ...sampleItem,
        id: 'story-2',
        title: 'JSON:API and decoupled Drupal: a practical guide',
        summary: "Drupal's JSON:API module provides a standards-compliant REST API out of the box.",
        imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
        imageAlt: 'Code on a screen showing JSON',
      },
      {
        ...sampleItem,
        id: 'story-3',
        title: 'Web Components vs. React: choosing the right tool',
        summary: 'Native Web Components offer genuine advantages over framework-based solutions.',
        imageUrl: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=800&q=80',
        imageAlt: 'Abstract comparison diagram',
      },
    ];

    const wrapper = document.createElement('div');
    wrapper.style.cssText =
      'display:grid;grid-template-columns:repeat(auto-fill,minmax(18rem,1fr));gap:1.5rem;';

    items.forEach((item) => {
      const card = document.createElement('drupal-content-card') as HTMLElement & {
        item: ContentItem;
      };
      card.setAttribute('heading-level', 'h3');
      card.item = item;
      wrapper.appendChild(card);
    });

    return wrapper;
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: { story: 'Multiple cards in a CSS Grid layout.' },
    },
  },
};
