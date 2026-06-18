import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { ContentItem } from '../types/jsonapi.js';

/**
 * <drupal-content-card>
 *
 * Displays a single content item: title, summary, image, and a link.
 *
 * Attributes / properties
 * -----------------------
 * item        ContentItem object (set programmatically)
 * href        URL for the card link (overrides item.url)
 * heading-level  h2|h3|h4 — default h2
 * image-loading  eager|lazy — default lazy
 *
 * Named slots
 * -----------
 * (default)  replaces the summary paragraph
 * footer     appended after the link button
 *
 * Events
 * ------
 * dwc-card-click  { detail: { id, title, url } } — fired on link click
 *
 * CSS custom properties
 * ---------------------
 * --dwc-card-bg              card background (default white)
 * --dwc-card-border          border shorthand
 * --dwc-card-border-radius   corner radius
 * --dwc-card-padding         inner padding
 * --dwc-card-shadow          box-shadow
 * --dwc-card-title-color     heading colour
 * --dwc-card-link-color      CTA link colour
 * --dwc-card-link-bg         CTA link background
 * --dwc-card-link-bg-hover   CTA link hover background
 * --dwc-card-focus-ring      custom focus-visible outline
 * --dwc-card-img-ratio       aspect ratio for image slot (default 16/9)
 */
@customElement('drupal-content-card')
export class DrupalContentCard extends LitElement {
  static override styles = css`
    :host {
      display: flex;
      flex-direction: column;
    }

    .card {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: var(--dwc-card-bg, #ffffff);
      border: var(--dwc-card-border, 1px solid #e0e0e0);
      border-radius: var(--dwc-card-border-radius, 0.5rem);
      box-shadow: var(--dwc-card-shadow, 0 1px 3px rgb(0 0 0 / 0.08));
      overflow: hidden;
      transition: box-shadow 0.2s ease;
    }

    @media (prefers-reduced-motion: reduce) {
      .card {
        transition: none;
      }
    }

    .card:hover {
      box-shadow: var(--dwc-card-shadow-hover, 0 4px 12px rgb(0 0 0 / 0.15));
    }

    .card__image-wrap {
      aspect-ratio: var(--dwc-card-img-ratio, 16 / 9);
      overflow: hidden;
      background: #f0f0f0;
    }

    .card__image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .card__image-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
      background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
    }

    .card__image-placeholder svg {
      width: 3rem;
      height: 3rem;
      opacity: 0.4;
    }

    .card__body {
      display: flex;
      flex-direction: column;
      flex: 1;
      padding: var(--dwc-card-padding, 1.25rem);
      gap: 0.75rem;
    }

    .card__title {
      margin: 0;
      font-size: var(--dwc-card-title-size, 1.125rem);
      font-weight: var(--dwc-card-title-weight, 600);
      line-height: 1.3;
      color: var(--dwc-card-title-color, inherit);
    }

    .card__summary {
      margin: 0;
      flex: 1;
      font-size: 0.9375rem;
      line-height: 1.6;
      color: var(--dwc-card-summary-color, #555);
    }

    .card__footer {
      margin-top: auto;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .card__link {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      font-weight: 600;
      text-decoration: none;
      color: var(--dwc-card-link-color, #ffffff);
      background: var(--dwc-card-link-bg, #0057a8);
      border-radius: 0.25rem;
      align-self: flex-start;
      transition: background 0.15s ease;
    }

    @media (prefers-reduced-motion: reduce) {
      .card__link {
        transition: none;
      }
    }

    .card__link:hover {
      background: var(--dwc-card-link-bg-hover, #003f7d);
    }

    .card__link:focus-visible {
      outline: var(--dwc-card-focus-ring, 3px solid #f4a100);
      outline-offset: 2px;
    }

    .card__link svg {
      flex-shrink: 0;
    }

    /* Light / dark preference */
    @media (prefers-color-scheme: dark) {
      :host(:not([theme])) .card {
        background: var(--dwc-card-bg, #1e2030);
        border-color: #3a3d52;
        color: #e0e0e0;
      }
      :host(:not([theme])) .card__summary {
        color: #a0a0b0;
      }
    }
  `;

  @property({ type: Object }) item: ContentItem | null = null;
  @property() href = '';
  @property({ attribute: 'heading-level' }) headingLevel: 'h2' | 'h3' | 'h4' =
    'h2';
  @property({ attribute: 'image-loading' }) imageLoading: 'lazy' | 'eager' =
    'lazy';

  private _handleClick(e: MouseEvent) {
    if (!this.item) return;
    this.dispatchEvent(
      new CustomEvent('dwc-card-click', {
        detail: {
          id: this.item.id,
          title: this.item.title,
          url: this.href || this.item.url,
        },
        bubbles: true,
        composed: true,
      }),
    );
    // Don't prevent default — the link still navigates
    void e;
  }

  private _renderHeading(title: string) {
    if (this.headingLevel === 'h4')
      return html`<h4 class="card__title" part="title">${title}</h4>`;
    if (this.headingLevel === 'h3')
      return html`<h3 class="card__title" part="title">${title}</h3>`;
    return html`<h2 class="card__title" part="title">${title}</h2>`;
  }

  override render() {
    const { item } = this;
    if (!item) return nothing;

    const linkHref = this.href || item.url;
    const arrowIcon = html`
      <svg
        aria-hidden="true"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="currentColor"
      >
        <path
          d="M8 1L15 8L8 15M15 8H1"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
        />
      </svg>
    `;

    const placeholderIcon = html`
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    `;

    return html`
      <article class="card" part="card">
        <div class="card__image-wrap" part="image-wrap">
          ${item.imageUrl ?
            html`<img
              class="card__image"
              part="image"
              src=${item.imageUrl}
              alt=${item.imageAlt}
              loading=${this.imageLoading}
              width="800"
              height="450"
            />`
          : html`<div class="card__image-placeholder" role="presentation">
              ${placeholderIcon}
            </div>`}
        </div>
        <div class="card__body" part="body">
          ${this._renderHeading(item.title)}
          <p class="card__summary" part="summary">
            <slot>${item.summary}</slot>
          </p>
          <footer class="card__footer" part="footer">
            <a
              class="card__link"
              part="link"
              href=${linkHref}
              @click=${this._handleClick}
            >
              Read more about ${item.title} ${arrowIcon}
            </a>
            <slot name="footer"></slot>
          </footer>
        </div>
      </article>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'drupal-content-card': DrupalContentCard;
  }
}
