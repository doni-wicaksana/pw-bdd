import { Given, When, Then } from '@cucumber/cucumber';
import { Locator } from 'playwright';
import { CustomWorld } from '../../src/support/world';


When('Key-in keyword {string}', async function (this: CustomWorld, s: string) {
  const inputField: Locator = this.page.getByPlaceholder('Search the web');
  await inputField.click();
  await inputField.fill(s);
  await this.page.waitForTimeout(2000);
  await this.page.getByPlaceholder('Search the web').press('Enter');
})

Then('I get search result {string} at first row', async function (this: CustomWorld, s: string) {
  const linkDoni = await this.page.getByRole('link', { name: 'Doni Wicaksana - QA Manager - Alodokter | LinkedIn' }).first().click();
  await this.page.waitForLoadState("domcontentloaded");
})