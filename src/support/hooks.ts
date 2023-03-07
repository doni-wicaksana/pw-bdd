import { BeforeAll, AfterAll, Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, ChromiumBrowser, firefox, FirefoxBrowser, webkit, WebKitBrowser } from '@playwright/test';
import { CustomWorld } from './world';
import playwrightConfig from './config';


let browser: ChromiumBrowser | FirefoxBrowser | WebKitBrowser;
setDefaultTimeout(60000);

BeforeAll(async function () {
  switch (playwrightConfig.browser.name) {
    case 'chrome':
      browser = await chromium.launch(playwrightConfig.browser.launchOption);
      break;
    case 'firefox':
      browser = await firefox.launch(playwrightConfig.browser.launchOption);
      break;
    case 'webkit':
      browser = await webkit.launch(playwrightConfig.browser.launchOption);
      break;
    default:
      browser = await chromium.launch(playwrightConfig.browser.launchOption);
  }
});

Before({ tags: '@skip' }, function () {
  return 'skipped';
});

Before(async function (this: CustomWorld, param) {
  await this.init(param.testCaseStartedId, param.pickle.name.replace(/\W/g, "_"), browser);
});

// BeforeStep({tags: "@foo"}, function () {
//   // This hook will be executed before all steps in a scenario with tag @foo
// });

// AfterStep( function ({result}) {
//   // This hook will be executed after all steps, and take a screenshot on step failure
//   if (result.status === Status.FAILED) {
//     this.driver.takeScreenshot();
//   }
// });

After(async function (this: CustomWorld) {
  if (this.context) {
    if (this.page) await this.page.waitForTimeout(2000);//todo: need optimized
    await this.traceStop();
    await this.context.close();
  }
});

AfterAll(async function () {
  await browser.close();
});
