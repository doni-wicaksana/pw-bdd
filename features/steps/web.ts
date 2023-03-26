import { Given, When, Then } from '@cucumber/cucumber';
import { Locator } from 'playwright';
import { CustomWorld } from '../../src/support/world';


When('Key-in keyword {string}', async function (this: CustomWorld, s: string) {
  await this.bingPage.inputSearch.click();
  await this.bingPage.inputSearch.fill(s);
  await this.bingPage.inputSearch.press("Enter");
})

Then('I get search result {string} at first row', async function (this: CustomWorld, s: string) {
  this.bingPage.linkDoniWicaksanaAtFirstResult.click();
  await this.page.waitForLoadState("domcontentloaded");
})