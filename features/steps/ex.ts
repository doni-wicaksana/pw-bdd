import { Given, When, Then } from '@cucumber/cucumber';
import { Locator } from 'playwright';
import { CustomWorld } from '../../src/support/world'

Given('Open new page {string}', async function(this:CustomWorld, s: string){
  await this.page.goto(s);
})

When('Key-in keyword {string}', async function(this:CustomWorld, s: string){
  const inputField: Locator = this.page.getByPlaceholder('Search the web');
  await inputField.click();
  await inputField.fill(s);
  await this.page.waitForTimeout(2000);
  await this.page.getByPlaceholder('Search the web').press('Enter');
})

Then('I get search result {string} at first row', async function(this:CustomWorld, s: string){
  // await this.page.getByText('Doni Wicaksana - QA Manager - Alodokter | LinkedInhttps://id.linkedin.com/in/don').screenshot({path:`${PATH.VIDEOS}/screenshots.png`});
  // await this.page.getByRole('link', { name: 'Doni Wicaksana - QA Manager - Alodokter | LinkedIn' }).click();
})

