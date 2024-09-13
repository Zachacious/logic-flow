import { newE2EPage } from '@stencil/core/testing';

describe('logic-connector', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<logic-connector></logic-connector>');

    const element = await page.find('logic-connector');
    expect(element).toHaveClass('hydrated');
  });
});
