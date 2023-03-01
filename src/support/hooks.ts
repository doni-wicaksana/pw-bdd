import { BeforeAll, AfterAll, Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, ChromiumBrowser, FirefoxBrowser, WebKitBrowser } from '@playwright/test';
import { CustomWorld } from './world';
import dir from './dir'

const REPORTS_PATH = "reports";
const VIDEOS_PATH = `${REPORTS_PATH}/video`;

let browser: ChromiumBrowser | FirefoxBrowser | WebKitBrowser;
setDefaultTimeout(60000);

BeforeAll(async function (this: CustomWorld) {
  browser = await chromium.launch({ headless: false });
});

Before(async function (this: CustomWorld) {
  await this.newTab(browser);
});

After(async function (this: CustomWorld) {
  await this.page!.waitForTimeout(20000);//todo: need optimized
  await this.page!.waitForLoadState('networkidle');
  browser.contexts().forEach(async ctx => {
    await ctx.close();
  });
});

AfterAll(async function (this: CustomWorld) {
  await browser.close();
});
