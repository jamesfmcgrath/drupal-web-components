import { describe, it, expect, beforeEach } from 'vitest';
import '../components/ui-accordion.js';
import type { UiAccordion, UiAccordionItem } from '../components/ui-accordion.js';

async function renderAccordion(allowMultiple = false): Promise<UiAccordion> {
  const el = document.createElement('ui-accordion') as UiAccordion;
  if (allowMultiple) el.setAttribute('allow-multiple', '');

  for (let i = 0; i < 3; i++) {
    const item = document.createElement('ui-accordion-item') as UiAccordionItem;
    item.heading = `Panel ${i + 1}`;
    if (i === 1) item.open = true;
    el.appendChild(item);
  }

  document.body.appendChild(el);
  await el.updateComplete;
  // Wait for slotted children to update
  const items = Array.from(el.querySelectorAll('ui-accordion-item')) as UiAccordionItem[];
  await Promise.all(items.map((i) => i.updateComplete));
  return el;
}

describe('<ui-accordion>', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('registers as a custom element', () => {
    expect(customElements.get('ui-accordion')).toBeDefined();
    expect(customElements.get('ui-accordion-item')).toBeDefined();
  });

  it('renders slotted items', async () => {
    const el = await renderAccordion();
    const items = el.querySelectorAll('ui-accordion-item');
    expect(items).toHaveLength(3);
  });

  it('respects the initial open state', async () => {
    const el = await renderAccordion();
    const items = Array.from(el.querySelectorAll('ui-accordion-item')) as UiAccordionItem[];
    expect(items[0].open).toBe(false);
    expect(items[1].open).toBe(true);
  });

  it('toggles open on button click', async () => {
    const el = await renderAccordion();
    const item = el.querySelector('ui-accordion-item') as UiAccordionItem;
    expect(item.open).toBe(false);

    const btn = item.shadowRoot?.querySelector('button') as HTMLButtonElement;
    btn.click();
    await item.updateComplete;

    expect(item.open).toBe(true);
  });

  it('closes other items when allow-multiple is false', async () => {
    const el = await renderAccordion(false);
    const items = Array.from(el.querySelectorAll('ui-accordion-item')) as UiAccordionItem[];

    // items[1] is open. Open items[0].
    const btn0 = items[0].shadowRoot?.querySelector('button') as HTMLButtonElement;
    btn0.click();
    await items[0].updateComplete;
    await items[1].updateComplete;

    expect(items[0].open).toBe(true);
    expect(items[1].open).toBe(false);
  });

  it('allows multiple open items when allow-multiple is set', async () => {
    const el = await renderAccordion(true);
    const items = Array.from(el.querySelectorAll('ui-accordion-item')) as UiAccordionItem[];

    const btn0 = items[0].shadowRoot?.querySelector('button') as HTMLButtonElement;
    btn0.click();
    await items[0].updateComplete;

    expect(items[0].open).toBe(true);
    expect(items[1].open).toBe(true); // was already open
  });

  it('sets aria-expanded correctly', async () => {
    const el = await renderAccordion();
    const items = Array.from(el.querySelectorAll('ui-accordion-item')) as UiAccordionItem[];

    const btn1 = items[1].shadowRoot?.querySelector('button') as HTMLButtonElement;
    expect(btn1.getAttribute('aria-expanded')).toBe('true');

    const btn0 = items[0].shadowRoot?.querySelector('button') as HTMLButtonElement;
    expect(btn0.getAttribute('aria-expanded')).toBe('false');
  });

  it('hides panel with hidden attribute when closed', async () => {
    const el = await renderAccordion();
    const item = el.querySelector('ui-accordion-item') as UiAccordionItem;
    const panel = item.shadowRoot?.querySelector('[role="region"]');
    expect(panel?.hasAttribute('hidden')).toBe(true);
  });

  it('shows panel without hidden attribute when open', async () => {
    const el = await renderAccordion();
    const items = Array.from(el.querySelectorAll('ui-accordion-item')) as UiAccordionItem[];
    const panel = items[1].shadowRoot?.querySelector('[role="region"]');
    expect(panel?.hasAttribute('hidden')).toBe(false);
  });

  it('links aria-controls to the panel id', async () => {
    const el = await renderAccordion();
    const item = el.querySelectorAll('ui-accordion-item')[0] as UiAccordionItem;
    const btn = item.shadowRoot?.querySelector('button') as HTMLButtonElement;
    const panelId = btn.getAttribute('aria-controls');
    const panel = item.shadowRoot?.getElementById(panelId!);
    expect(panel).not.toBeNull();
  });

  it('dispatches dwc-accordion-toggle event', async () => {
    const el = await renderAccordion();
    const item = el.querySelector('ui-accordion-item') as UiAccordionItem;
    const events: CustomEvent[] = [];
    item.addEventListener('dwc-accordion-toggle', (e) => events.push(e as CustomEvent));

    const btn = item.shadowRoot?.querySelector('button') as HTMLButtonElement;
    btn.click();
    await item.updateComplete;

    expect(events).toHaveLength(1);
    expect(events[0].detail.open).toBe(true);
  });
});
