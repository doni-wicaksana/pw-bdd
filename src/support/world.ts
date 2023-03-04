import { IWorldOptions, setWorldConstructor, World } from '@cucumber/cucumber';
import { BrowserContext, Page, ChromiumBrowser } from '@playwright/test';
import { playwrightConfig } from './config';
import path from 'path';


export class CustomWorld extends World {
    scenarioId: string;
    scenarioName: string;
    context: BrowserContext;
    page: Page;

    constructor(options: IWorldOptions) {
        super(options);
        Object.assign(playwrightConfig, options.parameters);
    }
    async Initx(scenarioId: string, scenarioName: string) {
        this.scenarioId = scenarioId;
        this.scenarioName = scenarioName;
    }
    async newTab(browser: ChromiumBrowser) {
        try {
            //todo: rename video folder dengan scenarioName (issue nya harus buat interface dulu)
            this.context = await browser.newContext(playwrightConfig.browser.context);
            await this.context.tracing.start(playwrightConfig.trace.start);
            this.page = await this.context!.newPage();
        }
        catch (error) {
            console.log(`browser error due to: ${error}`);
            throw new Error(`browser error due to: ${error}`);

        }
    }
    async traceStop() {
        let traceStopConfig = {...playwrightConfig.trace.stop};//shallow copy
        traceStopConfig.path = path.join(traceStopConfig.path, `${this.scenarioId}-${this.scenarioName}.zip`);
        await this.context.tracing.stop(traceStopConfig);
    }
}

setWorldConstructor(CustomWorld);

