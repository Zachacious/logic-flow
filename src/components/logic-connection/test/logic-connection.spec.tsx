import { newSpecPage } from '@stencil/core/testing';
import { LogicConnection } from '../logic-connection';

describe('logic-connection', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LogicConnection],
      html: `<logic-connection></logic-connection>`,
    });
    expect(page.root).toEqualHtml(`
      <logic-connection>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </logic-connection>
    `);
  });
});
