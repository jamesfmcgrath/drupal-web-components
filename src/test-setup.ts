// Vitest + jsdom global setup for Web Component tests.
// @open-wc/testing provides chai-a11y-axe matchers.
import { chai, expect } from '@open-wc/testing';

// Re-export for convenience in test files
export { chai, expect };
