import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world';


Given('Open new page {string}', async function (this: CustomWorld, s: string) {
    await this.page.goto(s);
})
Given('Open new tab {string}', async function (this: CustomWorld, s: string) {
    await this.newTab();
    await this.page.goto(s);
})

//tambahkan optional config untuk threshold
Given('Matching page screenshot', async function (this: CustomWorld) {
    Promise.all(
        [this.page.waitForLoadState("domcontentloaded"),
        this.page.waitForLoadState("domcontentloaded")]
    ).then(() => {
        this.page.screenshot()
        .then((screenshot) => { this.matchingTheScreenshot(screenshot, "sample", 0.2) });
    });
})
