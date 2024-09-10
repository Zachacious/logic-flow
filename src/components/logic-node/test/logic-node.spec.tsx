import { newSpecPage } from '@stencil/core/testing';
import { LogicNode } from '../logic-node';

describe('logic-node', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LogicNode],
      html: `<logic-node></logic-node>`,
    });
    expect(page.root).toEqualHtml(`
      <logic-node>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </logic-node>
    `);
  });
});
