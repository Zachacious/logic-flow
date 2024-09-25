import { newE2EPage } from '@stencil/core/testing';

describe('logic-flow-connector', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<logic-flow-connector></logic-flow-connector>');

    const element = await page.find('logic-flow-connector');
    expect(element).toHaveClass('hydrated');
  });
});
