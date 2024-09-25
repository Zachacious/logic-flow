import { newE2EPage } from '@stencil/core/testing';

describe('logic-flow-node', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<logic-flow-node></logic-flow-node>');

    const element = await page.find('logic-flow-node');
    expect(element).toHaveClass('hydrated');
  });
});
