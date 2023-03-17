import { Given, When, Then } from '@cucumber/cucumber';
// import { expect } from 'chai';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world';


Given('Open new page {string}', async function (this: CustomWorld, s: string) {
    await this.page.goto(s);
})
Given('Open new tab {string}', async function (this: CustomWorld, s: string) {
    await this.newTab();
    await this.page.goto(s);
})

Given('Match screenshot of page {string}', async function (this: CustomWorld,name: string) {
    await this.page.waitForLoadState("load");
    await this.page.waitForLoadState("domcontentloaded");
    let screenshot = await this.page.screenshot();
    let compareResult = await this.matchingTheScreenshot(screenshot, name);
        // expect(compareResult.numDiffPixels,`Image Not Match: Number of different pixels: ${compareResult.numDiffPixels}`)
        // .to.be.lessThanOrEqual(0);
    expect(compareResult.numDiffPixels,`Image Not Match: Number of different pixels: ${compareResult.numDiffPixels}`)
        .toBeLessThanOrEqual(0);
})
