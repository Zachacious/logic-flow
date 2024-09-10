import { newE2EPage } from '@stencil/core/testing';

describe('logic-node', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<logic-node></logic-node>');

    const element = await page.find('logic-node');
    expect(element).toHaveClass('hydrated');
  });
});
