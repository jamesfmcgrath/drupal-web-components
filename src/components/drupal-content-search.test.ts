import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import '../components/drupal-content-search.js';
import type { DrupalContentSearch } from '../components/drupal-content-search.js';
import type { DrupalContentList } from '../components/drupal-content-list.js';
import type { ContentItem } from '../types/jsonapi.js';

const LIST_ID = 'test-list';

const mockItems: ContentItem[] = [
  {
    id: '1',
    title: 'Drupal JSON:API Guide',
    summary: 'Learn about JSON:API in Drupal.',
    imageUrl: null,
    imageAlt: '',
    url: '/drupal-guide',
    created: new Date(),
  },
  {
    id: '2',
    title: 'Accessibility Best Practices',
    summary: 'WCAG 2.1 AA compliance tips.',
    imageUrl: null,
    imageAlt: '',
    url: '/accessibility',
    created: new Date(),
  },
];

function makeMockList(spy = vi.fn()): DrupalContentList {
  return {
    allItems: mockItems,
    setFilteredItems: spy,
  } as unknown as DrupalContentList;
}

async function renderSearch(listId = LIST_ID): Promise<DrupalContentSearch> {
  const el = document.createElement('drupal-content-search') as DrupalContentSearch;
  el.setAttribute('list-id', listId);
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe('<drupal-content-search>', () => {
  let el: DrupalContentSearch;
  let getByIdSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  afterEach(() => {
    getByIdSpy?.mockRestore();
    vi.useRealTimers();
  });

  it('registers as a custom element', () => {
    expect(customElements.get('drupal-content-search')).toBeDefined();
  });

  it('renders a labeled input', async () => {
    el = await renderSearch();
    el.label = 'Search posts';
    await el.updateComplete;
    const label = el.shadowRoot?.querySelector('label');
    expect(label?.textContent?.trim()).toBe('Search posts');
  });

  it('renders a role=search region', async () => {
    el = await renderSearch();
    const region = el.shadowRoot?.querySelector('[role="search"]');
    expect(region).not.toBeNull();
  });

  it('contains an aria-live status region', async () => {
    el = await renderSearch();
    const status = el.shadowRoot?.querySelector('[aria-live="polite"]');
    expect(status).not.toBeNull();
    expect(status?.getAttribute('role')).toBe('status');
  });

  it('calls setFilteredItems on the associated list after debounce', async () => {
    const mockList = makeMockList();
    getByIdSpy = vi.spyOn(document, 'getElementById').mockReturnValue(
      mockList as unknown as HTMLElement,
    );

    el = await renderSearch();

    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.value = 'drupal';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    vi.advanceTimersByTime(300);
    await el.updateComplete;

    expect(mockList.setFilteredItems).toHaveBeenCalled();
  });

  it('clears filter and resets status on clear button click', async () => {
    const setFilteredSpy = vi.fn();
    const mockList = makeMockList(setFilteredSpy);
    getByIdSpy = vi.spyOn(document, 'getElementById').mockReturnValue(
      mockList as unknown as HTMLElement,
    );

    el = await renderSearch();

    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.value = 'test';
    input.dispatchEvent(new Event('input'));
    vi.advanceTimersByTime(300);
    await el.updateComplete;

    const clearBtn = el.shadowRoot?.querySelector('.search__clear') as HTMLButtonElement;
    clearBtn.click();
    await el.updateComplete;

    expect(setFilteredSpy).toHaveBeenLastCalledWith(null);
  });

  it('dispatches dwc-search event with query and count', async () => {
    const mockList = makeMockList();
    getByIdSpy = vi.spyOn(document, 'getElementById').mockReturnValue(
      mockList as unknown as HTMLElement,
    );

    el = await renderSearch();
    const handler = vi.fn();
    el.addEventListener('dwc-search', handler);

    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.value = 'drupal';
    input.dispatchEvent(new Event('input'));
    vi.advanceTimersByTime(300);
    await el.updateComplete;

    expect(handler).toHaveBeenCalled();
    expect((handler.mock.calls[0][0] as CustomEvent).detail).toMatchObject({
      query: 'drupal',
    });
  });

  it('shows result count in status region after filter', async () => {
    const mockList = makeMockList();
    getByIdSpy = vi.spyOn(document, 'getElementById').mockReturnValue(
      mockList as unknown as HTMLElement,
    );

    el = await renderSearch();

    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.value = 'drupal';
    input.dispatchEvent(new Event('input'));
    vi.advanceTimersByTime(300);
    await el.updateComplete;

    const status = el.shadowRoot?.querySelector('[aria-live]');
    expect(status?.textContent).toMatch(/result/i);
  });
});
