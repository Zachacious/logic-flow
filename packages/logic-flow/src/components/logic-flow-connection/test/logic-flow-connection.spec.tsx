import { newSpecPage } from '@stencil/core/testing';
import { LogicFlowConnection } from '../logic-flow-connection';

describe('logic-flow-connection', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [LogicFlowConnection],
      html: `<logic-flow-connection></logic-flow-connection>`,
    });
    expect(page.root).toEqualHtml(`
      <logic-flow-connection>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </logic-flow-connection>
    `);
  });
});
