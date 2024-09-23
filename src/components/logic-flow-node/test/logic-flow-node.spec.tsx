import { newSpecPage } from '@stencil/core/testing';
import { LogicFlowNode } from '../logic-flow-node';

describe('logic-flow-node', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LogicFlowNode],
      html: `<logic-flow-node></logic-flow-node>`,
    });
    expect(page.root).toEqualHtml(`
      <logic-flow-node>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </logic-flow-node>
    `);
  });
});
