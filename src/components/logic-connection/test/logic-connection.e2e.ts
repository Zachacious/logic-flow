import { newE2EPage } from '@stencil/core/testing';

describe('logic-connection', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<logic-connection></logic-connection>');

    const element = await page.find('logic-connection');
    expect(element).toHaveClass('hydrated');
  });
});
