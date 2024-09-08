import { newE2EPage } from '@stencil/core/testing';

describe('flowy-canvas', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<flowy-canvas></flowy-canvas>');

    const element = await page.find('flowy-canvas');
    expect(element).toHaveClass('hydrated');
  });
});
