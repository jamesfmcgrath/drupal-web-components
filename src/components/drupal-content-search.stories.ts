import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './drupal-content-search.js';
import './drupal-content-list.js';

const meta: Meta = {
  title: 'Components/DrupalContentSearch',
  component: 'drupal-content-search',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## \`<drupal-content-search>\`

An accessible search/filter input that works alongside \`<drupal-content-list>\` to
filter the rendered card grid client-side.

### Connection pattern

Link the two elements via \`list-id\`:

\`\`\`html
<drupal-content-search list-id="my-list"></drupal-content-search>
<drupal-content-list  id="my-list" use-mock></drupal-content-list>
\`\`\`

The search component calls \`list.setFilteredItems()\` after each debounced input —
no custom events or shared state required.

### Accessibility
- Wrapped in \`<div role="search">\` landmark.
- \`<label>\` explicitly linked to input via \`for\`/\`id\`.
- \`aria-controls\` on the input references the list element \`id\`.
- Result count announced via \`role="status"\` + \`aria-live="polite"\` + \`aria-atomic="true"\`.
- Escape key clears the search and returns focus to the input.
- Clear button has explicit \`aria-label="Clear search"\`.
- Focus ring: 3 px \`#f4a100\` outline on \`:focus-visible\`.

### Attributes
| Attribute       | Type   | Default              | Description                              |
|-----------------|--------|----------------------|------------------------------------------|
| \`list-id\`     | string | —                    | \`id\` of the associated content list.   |
| \`label\`       | string | "Search articles"    | Visible and ARIA label for the input.    |
| \`placeholder\` | string | "Type to filter…"    | Input placeholder text.                  |
| \`debounce-ms\` | number | 300                  | Debounce delay for the filter callback.  |

### Events
| Event         | Detail                          | Description                     |
|---------------|---------------------------------|---------------------------------|
| \`dwc-search\` | \`{ query: string, count: number }\` | Fired after each filter. |
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Standalone: Story = {
  render: () => html`
    <drupal-content-search style="max-width: 36rem;"></drupal-content-search>
  `,
  parameters: {
    docs: { description: { story: 'Search component in isolation (no list connected).' } },
  },
};

export const ConnectedToList: Story = {
  render: () => html`
    <div style="max-width: 72rem; padding: 1.5rem;">
      <div style="max-width: 36rem; margin-bottom: 2rem;">
        <drupal-content-search
          list-id="story-list"
          label="Search articles"
          placeholder="e.g. JSON:API, accessibility…"
        ></drupal-content-search>
      </div>
      <drupal-content-list id="story-list" use-mock></drupal-content-list>
    </div>
  `,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Search and list wired together. Type to filter; the result count is announced to screen readers.',
      },
    },
  },
};

export const CustomLabel: Story = {
  render: () => html`
    <drupal-content-search
      list-id="another-list"
      label="Filter news items"
      placeholder="Search by keyword…"
      style="max-width: 36rem;"
    ></drupal-content-search>
  `,
  parameters: {
    docs: { description: { story: 'Custom label and placeholder text.' } },
  },
};
