import type { JsonApiResponse } from '../types/jsonapi.js';

/**
 * Realistic mock JSON:API response for an article listing.
 * Mirrors the shape returned by a Drupal 10/11 site with:
 *   - jsonapi/node/article?include=field_image&fields[node--article]=title,body,path,created,field_image
 */
export const mockArticlesResponse: JsonApiResponse = {
  data: [
    {
      type: 'node--article',
      id: '1f2a3b4c-0001-0000-0000-000000000001',
      attributes: {
        title: 'Building accessible digital services for local government',
        body: {
          value: '<p>Local councils are under increasing pressure to deliver digital services that work for everyone. This article explores how modern web technologies can help.</p>',
          summary: 'Exploring how modern web technologies help councils deliver inclusive digital services.',
          format: 'basic_html',
        },
        path: { alias: '/news/building-accessible-digital-services' },
        created: '2024-03-15T09:00:00+00:00',
        changed: '2024-03-16T14:30:00+00:00',
        status: true,
      },
      relationships: {
        field_image: {
          data: { type: 'file--file', id: 'img-0001' },
        },
      },
    },
    {
      type: 'node--article',
      id: '1f2a3b4c-0002-0000-0000-000000000002',
      attributes: {
        title: 'JSON:API and decoupled Drupal: a practical guide',
        body: {
          value: '<p>Drupal\'s JSON:API module provides a standards-compliant REST API out of the box. Here\'s how to use it effectively with modern front-end tooling.</p>',
          summary: 'A practical guide to consuming Drupal\'s JSON:API with modern JavaScript tooling.',
          format: 'basic_html',
        },
        path: { alias: '/dev/jsonapi-decoupled-drupal' },
        created: '2024-02-28T11:15:00+00:00',
        changed: '2024-03-01T09:00:00+00:00',
        status: true,
      },
      relationships: {
        field_image: {
          data: { type: 'file--file', id: 'img-0002' },
        },
      },
    },
    {
      type: 'node--article',
      id: '1f2a3b4c-0003-0000-0000-000000000003',
      attributes: {
        title: 'Web Components vs. React: choosing the right tool',
        body: {
          value: '<p>When building reusable UI components for a CMS-driven site, native Web Components offer genuine advantages over framework-based solutions. We explore the trade-offs.</p>',
          summary: 'Why native Web Components can be a better fit than React for CMS-driven projects.',
          format: 'basic_html',
        },
        path: { alias: '/dev/web-components-vs-react' },
        created: '2024-02-10T08:00:00+00:00',
        changed: '2024-02-11T16:00:00+00:00',
        status: true,
      },
      relationships: {
        field_image: {
          data: { type: 'file--file', id: 'img-0003' },
        },
      },
    },
    {
      type: 'node--article',
      id: '1f2a3b4c-0004-0000-0000-000000000004',
      attributes: {
        title: 'Progressive enhancement in 2024',
        body: {
          value: '<p>Progressive enhancement remains as relevant as ever. With modern CSS and vanilla JavaScript, we can build resilient experiences that work everywhere.</p>',
          summary: 'How progressive enhancement principles apply to modern CSS and vanilla JavaScript development.',
          format: 'basic_html',
        },
        path: { alias: '/dev/progressive-enhancement-2024' },
        created: '2024-01-22T10:30:00+00:00',
        changed: '2024-01-23T08:15:00+00:00',
        status: true,
      },
      relationships: {
        field_image: {
          data: { type: 'file--file', id: 'img-0004' },
        },
      },
    },
    {
      type: 'node--article',
      id: '1f2a3b4c-0005-0000-0000-000000000005',
      attributes: {
        title: 'WCAG 2.1 AA compliance checklist for Drupal themes',
        body: {
          value: '<p>Meeting WCAG 2.1 AA in a Drupal theme involves more than automated testing. This checklist covers the manual checks that automated tools miss.</p>',
          summary: 'A practical WCAG 2.1 AA checklist for Drupal theme developers, covering manual checks that automated tools miss.',
          format: 'basic_html',
        },
        path: { alias: '/accessibility/wcag-21-drupal-checklist' },
        created: '2024-01-08T14:00:00+00:00',
        changed: '2024-01-09T09:30:00+00:00',
        status: true,
      },
      relationships: {
        field_image: {
          data: { type: 'file--file', id: 'img-0005' },
        },
      },
    },
    {
      type: 'node--article',
      id: '1f2a3b4c-0006-0000-0000-000000000006',
      attributes: {
        title: 'Deploying Drupal with GitHub Actions',
        body: {
          value: '<p>A complete CI/CD pipeline for a Drupal project using GitHub Actions, including automated testing, code quality checks, and zero-downtime deployment.</p>',
          summary: 'Setting up a complete CI/CD pipeline for Drupal using GitHub Actions with zero-downtime deployment.',
          format: 'basic_html',
        },
        path: { alias: '/devops/drupal-github-actions' },
        created: '2023-12-18T08:30:00+00:00',
        changed: '2023-12-19T11:00:00+00:00',
        status: true,
      },
      relationships: {
        field_image: {
          data: { type: 'file--file', id: 'img-0006' },
        },
      },
    },
  ],
  included: [
    {
      type: 'file--file',
      id: 'img-0001',
      attributes: {
        uri: { url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80' },
        alt: 'People collaborating around a laptop in a bright office',
        width: 800,
        height: 533,
      },
    },
    {
      type: 'file--file',
      id: 'img-0002',
      attributes: {
        uri: { url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80' },
        alt: 'Code on a screen showing a JSON structure',
        width: 800,
        height: 533,
      },
    },
    {
      type: 'file--file',
      id: 'img-0003',
      attributes: {
        uri: { url: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=800&q=80' },
        alt: 'Abstract comparison showing two different pathways',
        width: 800,
        height: 533,
      },
    },
    {
      type: 'file--file',
      id: 'img-0004',
      attributes: {
        uri: { url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&q=80' },
        alt: 'Layered architecture diagram on a whiteboard',
        width: 800,
        height: 533,
      },
    },
    {
      type: 'file--file',
      id: 'img-0005',
      attributes: {
        uri: { url: 'https://images.unsplash.com/photo-1586953208270-bc4b8a55e9bb?w=800&q=80' },
        alt: 'Checklist on paper with a pen',
        width: 800,
        height: 533,
      },
    },
    {
      type: 'file--file',
      id: 'img-0006',
      attributes: {
        uri: { url: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80' },
        alt: 'Terminal window showing a deployment pipeline',
        width: 800,
        height: 533,
      },
    },
  ],
  links: {
    self: { href: '/jsonapi/node/article' },
  },
  meta: {
    count: 6,
  },
};
