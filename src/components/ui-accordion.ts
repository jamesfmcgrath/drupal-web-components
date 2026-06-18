import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * <ui-accordion> / <ui-accordion-item>
 *
 * A fully accessible accordion built from scratch, implementing the
 * APG Accordion pattern (https://www.w3.org/WAI/ARIA/apg/patterns/accordion/).
 *
 * Usage
 * -----
 *   <ui-accordion allow-multiple>
 *     <ui-accordion-item heading="First panel">
 *       <p>Panel content</p>
 *     </ui-accordion-item>
 *     <ui-accordion-item heading="Second panel" open>
 *       <p>Initially open panel</p>
 *     </ui-accordion-item>
 *   </ui-accordion>
 *
 * Keyboard support
 * ----------------
 * Enter / Space  Toggle focused panel
 * Arrow Down     Move focus to next header
 * Arrow Up       Move focus to previous header
 * Home           Move focus to first header
 * End            Move focus to last header
 *
 * Attributes on <ui-accordion>
 * ----------------------------
 * allow-multiple   Allow more than one panel open at a time
 *
 * Attributes on <ui-accordion-item>
 * ----------------------------------
 * heading   Panel heading text (required)
 * open      Initially open
 *
 * Events on <ui-accordion-item>
 * ------------------------------
 * dwc-accordion-toggle   { detail: { open } } — on each toggle
 *
 * CSS custom properties (on <ui-accordion>)
 * ------------------------------------------
 * --dwc-accordion-border
 * --dwc-accordion-border-radius
 * --dwc-accordion-header-bg
 * --dwc-accordion-header-bg-hover
 * --dwc-accordion-header-color
 * --dwc-accordion-header-padding
 * --dwc-accordion-panel-padding
 * --dwc-accordion-focus-ring
 * --dwc-accordion-icon-color
 */

@customElement('ui-accordion-item')
export class UiAccordionItem extends LitElement {
  static override styles = css`
    :host {
      display: block;
      border-top: var(--dwc-accordion-border, 1px solid #e0e0e0);
    }

    :host(:last-child) {
      border-bottom: var(--dwc-accordion-border, 1px solid #e0e0e0);
    }

    .item__header {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: var(--dwc-accordion-header-padding, 1rem 1.25rem);
      font-size: 1rem;
      font-weight: 600;
      text-align: left;
      background: var(--dwc-accordion-header-bg, transparent);
      color: var(--dwc-accordion-header-color, inherit);
      border: none;
      cursor: pointer;
      line-height: 1.4;
    }

    .item__header:hover {
      background: var(--dwc-accordion-header-bg-hover, #f5f5f5);
    }

    .item__header:focus-visible {
      outline: var(--dwc-accordion-focus-ring, 3px solid #f4a100);
      outline-offset: -3px;
    }

    @media (prefers-reduced-motion: reduce) {
      .item__icon { transition: none; }
    }

    .item__icon {
      flex-shrink: 0;
      width: 1.25rem;
      height: 1.25rem;
      color: var(--dwc-accordion-icon-color, #0057a8);
      transition: transform 0.2s ease;
    }

    .item__icon--open {
      transform: rotate(180deg);
    }

    .item__panel {
      overflow: hidden;
    }

    .item__panel[hidden] {
      display: none;
    }

    .item__panel-inner {
      padding: var(--dwc-accordion-panel-padding, 0.25rem 1.25rem 1.25rem);
    }

    @media (prefers-color-scheme: dark) {
      :host(:not([theme])) {
        border-color: #3a3d52;
      }
      :host(:not([theme])) .item__header:hover {
        background: rgba(255 255 255 / 0.05);
      }
    }
  `;

  @property() heading = '';
  @property({ type: Boolean, reflect: true }) open = false;

  // Assigned by parent accordion so items can coordinate focus
  _index = 0;

  toggle() {
    this.open = !this.open;
    this.dispatchEvent(
      new CustomEvent('dwc-accordion-toggle', {
        detail: { open: this.open },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _handleKeydown(e: KeyboardEvent) {
    // Arrow keys are handled by the parent accordion via event delegation
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.toggle();
    }
  }

  override render() {
    const panelId = `accordion-panel-${this._index}`;
    const headerId = `accordion-header-${this._index}`;
    const chevron = html`
      <svg
        class="item__icon ${this.open ? 'item__icon--open' : ''}"
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    `;

    return html`
      <h3 class="item__heading" part="heading">
        <button
          id=${headerId}
          class="item__header"
          part="header"
          type="button"
          aria-expanded=${this.open ? 'true' : 'false'}
          aria-controls=${panelId}
          @click=${this.toggle}
          @keydown=${this._handleKeydown}
        >
          <span>${this.heading}</span>
          ${chevron}
        </button>
      </h3>
      <div
        id=${panelId}
        class="item__panel"
        part="panel"
        role="region"
        aria-labelledby=${headerId}
        ?hidden=${!this.open}
      >
        <div class="item__panel-inner" part="panel-inner">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

// ─────────────────────────────────────────────────────────────────────────────

@customElement('ui-accordion')
export class UiAccordion extends LitElement {
  static override styles = css`
    :host {
      display: block;
      border-radius: var(--dwc-accordion-border-radius, 0.5rem);
      overflow: hidden;
    }
  `;

  @property({ type: Boolean, attribute: 'allow-multiple' }) allowMultiple = false;

  /** Items are in the light DOM (slotted), so query the host, not shadowRoot. */
  private get _items(): UiAccordionItem[] {
    return Array.from(this.querySelectorAll<UiAccordionItem>('ui-accordion-item'));
  }

  override firstUpdated() {
    this._indexItems();
  }

  private _indexItems() {
    this._items.forEach((item, i) => {
      item._index = i;
    });
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('dwc-accordion-toggle', this._handleToggle as EventListener);
    this.addEventListener('keydown', this._handleKeydown);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('dwc-accordion-toggle', this._handleToggle as EventListener);
    this.removeEventListener('keydown', this._handleKeydown);
  }

  private _handleToggle(e: CustomEvent<{ open: boolean }>) {
    if (this.allowMultiple) return;
    if (!e.detail.open) return;

    // The event is dispatched by the UiAccordionItem host element itself.
    const openedItem = e.target as UiAccordionItem;

    this._items.forEach((item) => {
      if (item !== openedItem && item.open) {
        item.open = false;
      }
    });
  }

  private _handleKeydown = (e: KeyboardEvent) => {
    const items = this._items;
    const buttons = items.map(
      (item) => item.shadowRoot?.querySelector('button') as HTMLButtonElement | null,
    );

    const focused = document.activeElement?.shadowRoot?.activeElement as HTMLElement | null;
    const currentIndex = buttons.findIndex((btn) => btn === focused);

    if (currentIndex === -1) return;

    let nextIndex = currentIndex;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        nextIndex = (currentIndex + 1) % items.length;
        break;
      case 'ArrowUp':
        e.preventDefault();
        nextIndex = (currentIndex - 1 + items.length) % items.length;
        break;
      case 'Home':
        e.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        nextIndex = items.length - 1;
        break;
      default:
        return;
    }

    buttons[nextIndex]?.focus();
  };

  override render() {
    return html`<slot @slotchange=${this._indexItems}></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-accordion': UiAccordion;
    'ui-accordion-item': UiAccordionItem;
  }
}
