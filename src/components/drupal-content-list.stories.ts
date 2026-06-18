import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './drupal-content-list.js';

const meta: Meta = {
  title: 'Components/DrupalContentList',
  component: 'drupal-content-list',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## \`<drupal-content-list>\`

Fetches a list of nodes from a JSON:API endpoint and renders a responsive grid
of \`<drupal-content-card>\` components.

### Fundamentals demonstrated
- **Lifecycle callback** (\`connectedCallback\`): fetch triggered when element is attached.
- **Reactive state**: internal \`_loading\`, \`_error\`, \`_items\` properties drive conditional rendering.
- **CustomEvents**: \`dwc-list-loaded\` and \`dwc-list-error\` bubble composed for page-level handling.
- **Public API** (\`allItems\`, \`setFilteredItems\`): allows \`<drupal-content-search>\` to inject filtered results without coupling through the DOM.

### Attributes
| Attribute       | Type    | Default | Description                                      |
|-----------------|---------|---------|--------------------------------------------------|
| \`endpoint\`    | string  | —       | JSON:API URL. Omit to use built-in mock data.    |
| \`base-url\`    | string  | —       | Prepended to relative paths in API responses.    |
| \`heading-level\`| h2/h3/h4 | h3   | Heading level passed to each card.               |
| \`page-size\`   | number  | 12      | Maximum items to display.                        |
| \`use-mock\`    | boolean | false   | Force mock data even if endpoint is set.         |

### Events
| Event             | Detail              | Description                        |
|-------------------|---------------------|------------------------------------|
| \`dwc-list-loaded\` | \`{ count: number }\` | Fired after items are rendered.  |
| \`dwc-list-error\` | \`{ message: string }\` | Fired on fetch failure.         |

### Accessibility
- Loading state uses \`role="status"\` with \`aria-live="polite"\` and \`aria-label\`.
- Error state uses \`role="alert"\` for immediate announcement.
- The grid is a \`<ul role="list">\` for correct list semantics.
- Spinner animation respects \`prefers-reduced-motion\`.
        `,
      },
    },
  },
  argTypes: {
    headingLevel: { control: 'select', options: ['h2', 'h3', 'h4'] },
    pageSize: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj;

export const WithMockData: Story = {
  render: () => html`<drupal-content-list use-mock></drupal-content-list>`,
  parameters: {
    docs: {
      description: { story: 'Using built-in mock data (simulates a 350 ms network delay).' },
    },
  },
};

export const LimitedPageSize: Story = {
  render: () => html`<drupal-content-list use-mock page-size="3"></drupal-content-list>`,
  parameters: {
    docs: { description: { story: 'Only the first 3 items are displayed via `page-size`.' } },
  },
};

export const TwoColumns: Story = {
  render: () => html`
    <drupal-content-list
      use-mock
      style="--dwc-list-columns: repeat(2, 1fr);"
    ></drupal-content-list>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'Override the grid layout with `--dwc-list-columns` to force exactly two columns.',
      },
    },
  },
};

export const ErrorState: Story = {
  render: () => html`
    <drupal-content-list
      endpoint="/jsonapi/this-does-not-exist-for-demo"
    ></drupal-content-list>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'Error state when the endpoint returns a non-OK response or the network request fails.',
      },
    },
  },
};

export const WithRealEndpoint: Story = {
  render: () => html`
    <!--
      Replace the endpoint attribute with your Drupal JSON:API URL.
      Ensure CORS is configured on your Drupal site to allow this origin.
    -->
    <drupal-content-list
      endpoint="https://your-drupal-site.example/jsonapi/node/article?include=field_image"
      base-url="https://your-drupal-site.example"
    ></drupal-content-list>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'Template for connecting to a real Drupal 10/11 JSON:API endpoint. ' +
          'See the README for CORS configuration details.',
      },
    },
  },
};
