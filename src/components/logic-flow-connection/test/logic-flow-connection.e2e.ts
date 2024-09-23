import { newE2EPage } from '@stencil/core/testing';

describe('logic-flow-connection', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<logic-flow-connection></logic-flow-connection>');

    const element = await page.find('logic-flow-connection');
    expect(element).toHaveClass('hydrated');
  });
});
