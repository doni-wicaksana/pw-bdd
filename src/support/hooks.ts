import { BeforeAll, AfterAll, Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { Browser, BrowserContext, chromium, Page } from 'playwright';
// import { ThisWorld } from './world';
import * as fs from 'fs';
import path from 'path';

enum PATH {
  REPORTS = "reports",
  VIDEOS = "reports/video",
}
const REPORTS_PATH = "reports";
const TIMESTAMP = new Date();
const VIDEOS_PATH = `${REPORTS_PATH}/video`;

let page: Page;
let browser: Browser;
let context: BrowserContext;
setDefaultTimeout(60000);

Before(async function () {
  try {
    remDirContents();//TODO: please remove this
    browser = await chromium.launch({ headless: false });
    context = await browser.newContext({
      recordVideo: {
        dir: path.resolve(`${VIDEOS_PATH}`),
        size: { width: 1920, height: 1080 }
      },//todo: pindah ke config
      viewport: { width: 1920, height: 1080 }//todo: pindah ke config
    });
    page = await context.newPage();
  }
  catch (error) {
    console.log(`browser error due to: ${error}`);
    throw new Error(`browser error due to: ${error}`);

  }
});

After(async function () {
  await page.waitForTimeout(20000);//todo: need optimized
  await page.waitForLoadState('networkidle');
  browser.contexts().forEach(async ctx => {
    await ctx.close();
  });
  await browser.close();
});

export { page, browser,PATH };


function remDirContents() {

  // Path ke direktori yang ingin dihapus isinya
  const directoryPath = VIDEOS_PATH;

  // Hapus semua file dalam direktori
  fs.readdir(directoryPath, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(`${directoryPath}/${file}`, (err) => {
        if (err) throw err;
      });
    }

    console.log('Semua file dalam direktori berhasil dihapus');
  });

}