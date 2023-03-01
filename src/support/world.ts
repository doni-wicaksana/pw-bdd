import { IWorldOptions, setWorldConstructor, World } from '@cucumber/cucumber';
import { BrowserContext, Page, ChromiumBrowser } from '@playwright/test';
import path from 'path';

const REPORTS_PATH = "reports";
const VIDEOS_PATH = `${REPORTS_PATH}/video`;

export class CustomWorld extends World {
    static sharedData: { [key: string]: any } = {};
    // public browser?: ChromiumBrowser;
    context: BrowserContext;
    page: Page;


    constructor(options: IWorldOptions) {
        super(options);
    }

    // async s(){
        
    //     this.browser = await chromium.launch({ headless: false });
    // }
    async newTab(browser: ChromiumBrowser){

        try {
            this.context = await browser.newContext({
                recordVideo: {
                    dir: path.resolve(`${VIDEOS_PATH}`),
                    size: { width: 1920, height: 1080 }
                },//todo: pindah ke config
                viewport: { width: 1920, height: 1080 }//todo: pindah ke config
            });
            this.page = await this.context!.newPage();
        }
        catch (error) {
            console.log(`browser error due to: ${error}`);
            throw new Error(`browser error due to: ${error}`);

        }
    }
}

setWorldConstructor(CustomWorld);