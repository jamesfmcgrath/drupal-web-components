import { describe, it, expect, beforeEach, vi } from 'vitest';
import '../components/drupal-content-card.js';
import type { DrupalContentCard } from '../components/drupal-content-card.js';
import type { ContentItem } from '../types/jsonapi.js';

const mockItem: ContentItem = {
  id: 'abc-123',
  title: 'Test Article',
  summary: 'A short summary of the test article.',
  imageUrl: 'https://example.com/image.jpg',
  imageAlt: 'A test image',
  url: '/test-article',
  created: new Date('2024-01-01'),
};

async function renderCard(item = mockItem): Promise<DrupalContentCard> {
  const el = document.createElement('drupal-content-card') as DrupalContentCard;
  el.item = item;
  document.body.appendChild(el);
  // Allow Lit's update cycle to complete
  await el.updateComplete;
  return el;
}

describe('<drupal-content-card>', () => {
  let el: DrupalContentCard;

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('registers as a custom element', () => {
    expect(customElements.get('drupal-content-card')).toBeDefined();
  });

  it('renders nothing when item is null', async () => {
    el = document.createElement('drupal-content-card') as DrupalContentCard;
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('.card')).toBeNull();
  });

  it('renders the article title', async () => {
    el = await renderCard();
    const heading = el.shadowRoot?.querySelector('.card__title');
    expect(heading?.textContent?.trim()).toBe('Test Article');
  });

  it('renders the image with correct src and alt', async () => {
    el = await renderCard();
    const img = el.shadowRoot?.querySelector('img') as HTMLImageElement | null;
    expect(img?.src).toContain('example.com/image.jpg');
    expect(img?.alt).toBe('A test image');
  });

  it('renders the placeholder when imageUrl is null', async () => {
    el = await renderCard({ ...mockItem, imageUrl: null });
    expect(el.shadowRoot?.querySelector('img')).toBeNull();
    expect(el.shadowRoot?.querySelector('.card__image-placeholder')).not.toBeNull();
  });

  it('renders a link with the correct href', async () => {
    el = await renderCard();
    const link = el.shadowRoot?.querySelector('.card__link') as HTMLAnchorElement | null;
    expect(link?.getAttribute('href')).toBe('/test-article');
  });

  it('uses the href attribute when set', async () => {
    el = await renderCard();
    el.href = '/override-url';
    await el.updateComplete;
    const link = el.shadowRoot?.querySelector('.card__link') as HTMLAnchorElement | null;
    expect(link?.getAttribute('href')).toBe('/override-url');
  });

  it('dispatches dwc-card-click event on link click', async () => {
    el = await renderCard();
    const handler = vi.fn();
    el.addEventListener('dwc-card-click', handler);
    const link = el.shadowRoot?.querySelector('.card__link') as HTMLAnchorElement | null;
    link?.click();
    expect(handler).toHaveBeenCalledOnce();
    expect(handler.mock.calls[0][0].detail).toMatchObject({
      id: 'abc-123',
      title: 'Test Article',
      url: '/test-article',
    });
  });

  it('renders the correct heading level', async () => {
    el = await renderCard();
    el.headingLevel = 'h4';
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('h4.card__title')).not.toBeNull();
    expect(el.shadowRoot?.querySelector('h2.card__title')).toBeNull();
  });

  it('sets lazy loading attribute on the image by default', async () => {
    el = await renderCard();
    const img = el.shadowRoot?.querySelector('img') as HTMLImageElement | null;
    expect(img?.getAttribute('loading')).toBe('lazy');
  });

  it('exposes a part attribute on the card for external styling', async () => {
    el = await renderCard();
    const article = el.shadowRoot?.querySelector('article');
    expect(article?.getAttribute('part')).toBe('card');
  });
});
