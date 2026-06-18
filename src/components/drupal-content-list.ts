import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { ContentItem, JsonApiResponse } from '../types/jsonapi.js';
import { normaliseJsonApiResponse } from '../data/normalise.js';
import { mockArticlesResponse } from '../data/mock.js';
import './drupal-content-card.js';

/**
 * <drupal-content-list>
 *
 * Fetches a node listing from a JSON:API endpoint and renders a responsive grid
 * of <drupal-content-card> elements, with loading, empty, and error states.
 *
 * Attributes / properties
 * -----------------------
 * endpoint       JSON:API URL, e.g. /jsonapi/node/article
 *                Omit to use built-in mock data.
 * base-url       Prepended to relative paths in API responses
 * heading-level  h2|h3|h4 passed through to each card (default h3)
 * page-size      Max items to display (default 12)
 * use-mock       Force mock data even if endpoint is set
 *
 * Events
 * ------
 * dwc-list-loaded   { detail: { count } } — after items are rendered
 * dwc-list-error    { detail: { message } } — on fetch failure
 *
 * CSS custom properties
 * ---------------------
 * --dwc-list-gap        gap between cards (default 1.5rem)
 * --dwc-list-min-col    min column width for auto-fill grid (default 18rem)
 * --dwc-list-columns    explicit column count (overrides auto-fill)
 */
@customElement('drupal-content-list')
export class DrupalContentList extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }

    .list__status {
      padding: 3rem 1rem;
      text-align: center;
      color: #666;
    }

    .list__spinner {
      display: inline-block;
      width: 2.5rem;
      height: 2.5rem;
      border: 3px solid #e0e0e0;
      border-top-color: var(--dwc-card-link-bg, #0057a8);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: 1rem;
    }

    @media (prefers-reduced-motion: reduce) {
      .list__spinner { animation: none; border-top-color: var(--dwc-card-link-bg, #0057a8); }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .list__error {
      padding: 2rem;
      border-radius: 0.5rem;
      background: #fff3f3;
      border: 1px solid #f5c6c6;
      color: #c00;
    }

    .list__error-icon {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }

    .list__empty {
      padding: 3rem 1rem;
      text-align: center;
      color: #666;
    }

    .list__grid {
      display: grid;
      grid-template-columns: var(
        --dwc-list-columns,
        repeat(auto-fill, minmax(var(--dwc-list-min-col, 18rem), 1fr))
      );
      gap: var(--dwc-list-gap, 1.5rem);
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .list__grid > li {
      display: flex;
    }

    .list__grid > li > drupal-content-card {
      flex: 1;
    }
  `;

  @property() endpoint = '';
  @property({ attribute: 'base-url' }) baseUrl = '';
  @property({ attribute: 'heading-level' }) headingLevel: 'h2' | 'h3' | 'h4' = 'h3';
  @property({ type: Number, attribute: 'page-size' }) pageSize = 12;
  @property({ type: Boolean, attribute: 'use-mock' }) useMock = false;

  @state() private _items: ContentItem[] = [];
  @state() private _loading = false;
  @state() private _error: string | null = null;
  // Exposed so drupal-content-search can inject filtered items
  @state() _filtered: ContentItem[] | null = null;

  override connectedCallback() {
    super.connectedCallback();
    void this._load();
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has('endpoint') || changed.has('useMock')) {
      void this._load();
    }
  }

  private async _load() {
    this._loading = true;
    this._error = null;

    try {
      let response: JsonApiResponse;

      if (this.useMock || !this.endpoint) {
        // Simulate a small network delay for realistic demo behaviour
        await new Promise((r) => setTimeout(r, 350));
        response = mockArticlesResponse;
      } else {
        const res = await fetch(this.endpoint, {
          headers: { Accept: 'application/vnd.api+json' },
        });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        response = (await res.json()) as JsonApiResponse;
      }

      this._items = normaliseJsonApiResponse(response, this.baseUrl).slice(
        0,
        this.pageSize,
      );

      this.dispatchEvent(
        new CustomEvent('dwc-list-loaded', {
          detail: { count: this._items.length },
          bubbles: true,
          composed: true,
        }),
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      this._error = message;
      this.dispatchEvent(
        new CustomEvent('dwc-list-error', {
          detail: { message },
          bubbles: true,
          composed: true,
        }),
      );
    } finally {
      this._loading = false;
    }
  }

  /** Called by drupal-content-search with filtered item set. Pass null to show all. */
  setFilteredItems(items: ContentItem[] | null) {
    this._filtered = items;
  }

  get allItems(): ContentItem[] {
    return this._items;
  }

  override render() {
    if (this._loading) {
      return html`
        <div class="list__status" role="status" aria-live="polite" aria-label="Loading content">
          <div class="list__spinner" aria-hidden="true"></div>
          <p>Loading content…</p>
        </div>
      `;
    }

    if (this._error) {
      return html`
        <div class="list__error" role="alert">
          <div class="list__error-icon" aria-hidden="true">⚠️</div>
          <p><strong>Could not load content.</strong></p>
          <p>${this._error}</p>
        </div>
      `;
    }

    const items = this._filtered ?? this._items;

    if (items.length === 0) {
      return html`
        <div class="list__empty" role="status">
          ${this._filtered !== null
            ? html`<p>No results match your search.</p>`
            : html`<p>No content found.</p>`}
        </div>
      `;
    }

    return html`
      <ul class="list__grid" role="list" part="grid">
        ${items.map(
          (item) => html`
            <li part="grid-item">
              <drupal-content-card
                .item=${item}
                heading-level=${this.headingLevel}
              ></drupal-content-card>
            </li>
          `,
        )}
      </ul>
      ${nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'drupal-content-list': DrupalContentList;
  }
}
