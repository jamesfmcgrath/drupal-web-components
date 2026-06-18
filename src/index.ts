// Component registrations — import this single file to register all elements.
export { DrupalContentCard } from './components/drupal-content-card.js';
export { DrupalContentList } from './components/drupal-content-list.js';
export { DrupalContentSearch } from './components/drupal-content-search.js';
export { UiAccordion, UiAccordionItem } from './components/ui-accordion.js';

// Types
export type { ContentItem, JsonApiResponse } from './types/jsonapi.js';

// Data utilities — useful when consuming this library in a custom integration
export { normaliseJsonApiResponse } from './data/normalise.js';
export { mockArticlesResponse } from './data/mock.js';
