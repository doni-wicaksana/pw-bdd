import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { Locator } from 'playwright';
import { page,PATH } from '../support/hooks';

Given('Open new page {string}', async function(s: string){
  await page.goto(s);
})

When('Key-in keyword {string}', async function(s: string){
  const inputField: Locator = page.getByPlaceholder('Search the web');
  await inputField.click();
  await inputField.fill(s);
  await page.waitForTimeout(2000);
  await page.getByPlaceholder('Search the web').press('Enter');
})

Then('I get search result {string} at first row', async function(s: string){
  await page.getByText('Doni Wicaksana - QA Manager - Alodokter | LinkedInhttps://id.linkedin.com/in/don').screenshot({path:`${PATH.VIDEOS}/screenshots.png`});
  await page.getByRole('link', { name: 'Doni Wicaksana - QA Manager - Alodokter | LinkedIn' }).click();
})

