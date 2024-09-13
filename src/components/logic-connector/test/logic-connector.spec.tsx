import { newSpecPage } from '@stencil/core/testing';
import { LogicConnector } from '../logic-connector';

describe('logic-connector', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LogicConnector],
      html: `<logic-connector></logic-connector>`,
    });
    expect(page.root).toEqualHtml(`
      <logic-connector>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </logic-connector>
    `);
  });
});
