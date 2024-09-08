import { newSpecPage } from '@stencil/core/testing';
import { FlowyCanvas } from '../flowy-canvas';

describe('flowy-canvas', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [FlowyCanvas],
      html: `<flowy-canvas></flowy-canvas>`,
    });
    expect(page.root).toEqualHtml(`
      <flowy-canvas>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </flowy-canvas>
    `);
  });
});
