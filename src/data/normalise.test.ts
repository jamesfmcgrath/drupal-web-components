import { describe, it, expect } from 'vitest';
import { normaliseJsonApiResponse } from './normalise.js';
import { mockArticlesResponse } from './mock.js';
import type { JsonApiResponse } from '../types/jsonapi.js';

describe('normaliseJsonApiResponse', () => {
  it('returns a ContentItem for each data node', () => {
    const result = normaliseJsonApiResponse(mockArticlesResponse);
    expect(result).toHaveLength(mockArticlesResponse.data.length);
  });

  it('maps id, title, and summary correctly', () => {
    const result = normaliseJsonApiResponse(mockArticlesResponse);
    const first = result[0];
    expect(first.id).toBe(mockArticlesResponse.data[0].id);
    expect(first.title).toBe(mockArticlesResponse.data[0].attributes.title);
    expect(first.summary).toBe(mockArticlesResponse.data[0].attributes.body?.summary);
  });

  it('resolves image URL from included file--file resource', () => {
    const result = normaliseJsonApiResponse(mockArticlesResponse);
    expect(result[0].imageUrl).toContain('unsplash.com');
  });

  it('builds absolute URL when baseUrl is provided', () => {
    const result = normaliseJsonApiResponse(
      mockArticlesResponse,
      'https://example.drupal.site',
    );
    expect(result[0].url).toMatch(/^https:\/\/example\.drupal\.site/);
  });

  it('parses created date as a Date object', () => {
    const result = normaliseJsonApiResponse(mockArticlesResponse);
    expect(result[0].created).toBeInstanceOf(Date);
    expect(result[0].created.getFullYear()).toBe(2024);
  });

  it('returns null imageUrl when relationship is missing', () => {
    const bare: JsonApiResponse = {
      data: [
        {
          type: 'node--article',
          id: 'test-id',
          attributes: {
            title: 'No image',
            body: { value: '<p>Hello</p>', summary: 'Hello', format: 'basic_html' },
            path: { alias: '/test' },
            created: '2024-01-01T00:00:00+00:00',
            changed: '2024-01-01T00:00:00+00:00',
            status: true,
          },
        },
      ],
    };
    const result = normaliseJsonApiResponse(bare);
    expect(result[0].imageUrl).toBeNull();
  });

  it('falls back to body value summary when body.summary is empty', () => {
    const response: JsonApiResponse = {
      data: [
        {
          type: 'node--article',
          id: 'test-id-2',
          attributes: {
            title: 'Body only',
            body: {
              value: '<p>This is the body content without a summary.</p>',
              format: 'basic_html',
            },
            path: { alias: '/body-only' },
            created: '2024-01-01T00:00:00+00:00',
            changed: '2024-01-01T00:00:00+00:00',
            status: true,
          },
        },
      ],
    };
    const result = normaliseJsonApiResponse(response);
    expect(result[0].summary).toBe('This is the body content without a summary.');
  });
});
