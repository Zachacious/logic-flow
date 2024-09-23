import { newE2EPage } from '@stencil/core/testing';

describe('logic-flow-viewport', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<logic-flow-viewport></logic-flow-viewport>');

    const element = await page.find('logic-flow-viewport');
    expect(element).toHaveClass('hydrated');
  });
});
