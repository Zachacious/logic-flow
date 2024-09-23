import { newSpecPage } from '@stencil/core/testing';
import { LogicFlowConnector } from '../logic-flow-connector';

describe('logic-flow-connector', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LogicFlowConnector],
      html: `<logic-flow-connector></logic-flow-connector>`,
    });
    expect(page.root).toEqualHtml(`
      <logic-flow-connector>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </logic-flow-connector>
    `);
  });
});
