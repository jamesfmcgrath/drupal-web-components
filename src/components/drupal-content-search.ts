import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import type { DrupalContentList } from './drupal-content-list.js';
import type { ContentItem } from '../types/jsonapi.js';

/**
 * <drupal-content-search>
 *
 * An accessible search/filter input that works in tandem with a sibling
 * <drupal-content-list>. Debounces input and announces result counts to
 * screen readers via an aria-live region.
 *
 * Usage
 * -----
 * Place this element before or after a <drupal-content-list> that has a
 * matching `id`. Connect them via the `list-id` attribute:
 *
 *   <drupal-content-search list-id="articles"></drupal-content-search>
 *   <drupal-content-list id="articles" use-mock></drupal-content-list>
 *
 * Attributes / properties
 * -----------------------
 * list-id       id of the associated <drupal-content-list>
 * label         Visible label text (default "Search articles")
 * placeholder   Input placeholder (default "Type to filter…")
 * debounce-ms   Debounce delay in ms (default 300)
 *
 * Events
 * ------
 * dwc-search   { detail: { query, count } } — on each filtered result
 *
 * CSS custom properties
 * ---------------------
 * --dwc-search-border       input border
 * --dwc-search-border-radius
 * --dwc-search-focus-ring
 * --dwc-search-btn-bg       search icon button background
 * --dwc-search-btn-color
 */
@customElement('drupal-content-search')
export class DrupalContentSearch extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }

    .search {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .search__label {
      font-weight: 600;
      font-size: 0.9375rem;
    }

    .search__field {
      display: flex;
      border: var(--dwc-search-border, 2px solid #767676);
      border-radius: var(--dwc-search-border-radius, 0.375rem);
      overflow: hidden;
      background: #fff;
    }

    .search__field:focus-within {
      outline: var(--dwc-search-focus-ring, 3px solid #f4a100);
      outline-offset: 0;
    }

    .search__input {
      flex: 1;
      padding: 0.625rem 0.75rem;
      font-size: 1rem;
      border: none;
      outline: none;
      background: transparent;
      color: inherit;
      min-width: 0;
    }

    .search__clear {
      display: none;
      align-items: center;
      justify-content: center;
      padding: 0 0.5rem;
      background: transparent;
      border: none;
      cursor: pointer;
      color: #666;
      font-size: 1.25rem;
      line-height: 1;
    }

    .search__clear:focus-visible {
      outline: var(--dwc-search-focus-ring, 3px solid #f4a100);
      outline-offset: -2px;
    }

    .search__clear[data-visible] {
      display: flex;
    }

    .search__btn {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 0.875rem;
      background: var(--dwc-search-btn-bg, #0057a8);
      color: var(--dwc-search-btn-color, #fff);
      border: none;
      cursor: pointer;
    }

    .search__btn:focus-visible {
      outline: var(--dwc-search-focus-ring, 3px solid #f4a100);
      outline-offset: -3px;
    }

    .search__status {
      font-size: 0.875rem;
      color: #555;
      min-height: 1.4em;
    }

    @media (prefers-color-scheme: dark) {
      :host(:not([theme])) .search__field {
        background: #1e2030;
        border-color: #4a4d62;
      }
      :host(:not([theme])) .search__input {
        color: #e0e0e0;
      }
      :host(:not([theme])) .search__clear {
        color: #a0a0b0;
      }
      :host(:not([theme])) .search__status {
        color: #a0a0b0;
      }
    }
  `;

  @property({ attribute: 'list-id' }) listId = '';
  @property() label = 'Search articles';
  @property() placeholder = 'Type to filter…';
  @property({ type: Number, attribute: 'debounce-ms' }) debounceMs = 300;

  @state() private _query = '';
  @state() private _resultCount: number | null = null;

  @query('.search__input') private _input!: HTMLInputElement;

  private _debounceTimer: ReturnType<typeof setTimeout> | null = null;

  private get _list(): DrupalContentList | null {
    if (!this.listId) return null;
    return document.getElementById(this.listId) as DrupalContentList | null;
  }

  private _handleInput(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    this._query = value;

    if (this._debounceTimer) clearTimeout(this._debounceTimer);
    this._debounceTimer = setTimeout(() => this._filter(value), this.debounceMs);
  }

  private _filter(query: string) {
    const list = this._list;
    if (!list) return;

    const trimmed = query.trim().toLowerCase();

    if (!trimmed) {
      list.setFilteredItems(null);
      this._resultCount = null;
      this._dispatchEvent(query, list.allItems.length);
      return;
    }

    const filtered: ContentItem[] = list.allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(trimmed) ||
        item.summary.toLowerCase().includes(trimmed),
    );

    list.setFilteredItems(filtered);
    this._resultCount = filtered.length;
    this._dispatchEvent(query, filtered.length);
  }

  private _dispatchEvent(query: string, count: number) {
    this.dispatchEvent(
      new CustomEvent('dwc-search', {
        detail: { query, count },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _handleClear() {
    this._query = '';
    if (this._debounceTimer) clearTimeout(this._debounceTimer);
    const list = this._list;
    if (list) list.setFilteredItems(null);
    this._resultCount = null;
    this._input?.focus();
  }

  private _handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && this._query) {
      this._handleClear();
    }
  }

  private get _statusMessage(): string {
    if (this._resultCount === null) return '';
    if (this._resultCount === 0) return 'No results found.';
    if (this._resultCount === 1) return '1 result found.';
    return `${this._resultCount} results found.`;
  }

  override render() {
    const searchIcon = html`
      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
      </svg>
    `;

    return html`
      <div class="search" role="search" part="search">
        <label class="search__label" part="label" for="dwc-search-input">
          ${this.label}
        </label>
        <div class="search__field" part="field">
          <input
            id="dwc-search-input"
            class="search__input"
            part="input"
            type="search"
            placeholder=${this.placeholder}
            .value=${this._query}
            aria-label=${this.label}
            aria-controls=${this.listId || nothing}
            autocomplete="off"
            spellcheck="false"
            @input=${this._handleInput}
            @keydown=${this._handleKeydown}
          />
          <button
            class="search__clear"
            part="clear"
            type="button"
            aria-label="Clear search"
            ?data-visible=${this._query.length > 0}
            @click=${this._handleClear}
          >×</button>
          <button
            class="search__btn"
            part="button"
            type="button"
            aria-label="Submit search"
            @click=${() => this._filter(this._query)}
          >
            ${searchIcon}
          </button>
        </div>
        <div
          class="search__status"
          part="status"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          ${this._statusMessage}
        </div>
      </div>
    `;
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    if (this._debounceTimer) clearTimeout(this._debounceTimer);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'drupal-content-search': DrupalContentSearch;
  }
}
