describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should have welcome screen', async () => {
    await expect(element(by.id('welcome'))).toBeVisible();
  });

  it('should type hello world in text input', async () => {
    await element(by.id('text_input')).typeText('hello world');
    await expect(element(by.id('text_input'))).toHaveText('hello world');
  });
});
