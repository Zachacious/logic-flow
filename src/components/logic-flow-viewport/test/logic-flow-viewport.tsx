import { newSpecPage } from '@stencil/core/testing';
import { LogicFlowViewport } from '../logic-flow-viewport';

describe('logic-flow-viewport', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LogicFlowViewport],
      html: `<logic-flow-viewport></logic-flow-viewport>`,
    });
    expect(page.root).toEqualHtml(`
      <logic-flow-viewport>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </logic-flow-viewport>
    `);
  });
});
