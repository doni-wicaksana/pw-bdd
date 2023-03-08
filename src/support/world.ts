import { IWorldOptions, setWorldConstructor, World } from '@cucumber/cucumber';
import { Pickle } from '@cucumber/messages';
import { BrowserContext, Page, ChromiumBrowser, APIRequestContext, request } from '@playwright/test';
import { playwrightConfig } from './config';
import path from 'path';
import { existsSync, writeFileSync, readFileSync, createWriteStream, mkdirSync } from 'fs';
import { compareImages } from './images';
import { PNG } from 'pngjs';

export class CustomWorld extends World {
    scenario: Pickle;
    browser: ChromiumBrowser;
    context: BrowserContext;
    page: Page;
    // lastApiContext:APIRequestContext;
    lastApiRequest: Record<string, any> = {
        request: {
            url: "",
            config: {}
        },
        response: {}
    };
    lastApiResponse: Record<string, any>;
    variables: Record<string, any> = {};

    constructor(options: IWorldOptions) {
        super(options);
        // delete options.parameters.browser.name;//setting browser tidak boleh di ubah
        Object.assign(playwrightConfig, options.parameters);
    }
    async init(scenario: Pickle, browser: ChromiumBrowser) {
        this.scenario = scenario;
        this.scenario["name_"] = scenario.name.replace(/\W/g, "_");
        this.browser = browser;
        await this.newTab();
    }
    async newTab() {
        try {
            //todo: rename video folder dengan scenario.name (issue nya harus buat interface dulu)
            // if(!this.context) //newcontext = open new browser
            this.context = await this.browser.newContext(playwrightConfig.browser.context);
            await this.context.tracing.start(playwrightConfig.trace.start);
            this.page = await this.context!.newPage();
        }
        catch (error) {
            console.error(`browser error due to: ${error}`);
            throw new Error(`browser error due to: ${error}`);

        }
    }
    async traceStop() {
        let traceStopConfig = { ...playwrightConfig.trace.stop };//shallow copy
        traceStopConfig.path = path.join(traceStopConfig.path, `${this.scenario.id}-${this.scenario["name_"]}.zip`);
        await this.context.tracing.stop(traceStopConfig);
    }

    //api
    cleanRequest() {
        this.lastApiRequest = {
            request: {
                url: "",
                config: {}
            },
            response: {}
        };
    }
    async sendRequest(nameIt?: string): Promise<any> {
        const req = this.lastApiRequest.request;
        const response = await (await request.newContext()).fetch(req.url, req.config);
        await response.json().then((v) => {
            this.lastApiResponse = v;
            if (nameIt) this.variables[nameIt] = v;
            this.cleanRequest();
            return v;
        });
    }
    //common
    parseStepParameter(parameter: string): any {
        const matchAsAVar = parameter.match(/^{{\w+}}$/);
        if (matchAsAVar) return this.variables[parameter.replace(/{{(\w+)}}/, "$1")];
        else { //return as string
            const regex = /{{(\w+)}}/gm;
            const match = parameter.match(regex);
            let output = parameter;
            match?.forEach((m) => {
                let replacement = this.variables[m.replace(/{{(\w+)}}/, "$1")]
                if (replacement)
                    output = output.replace(m, replacement);
            });
            return output;
        }
    }
    async matchingTheScreenshot(screenshot: Buffer, name: string, threshold: number) {
        let imagePath = path.join(
            playwrightConfig.screenshotPath,
            this.scenario.uri,
            process.platform,
            playwrightConfig.browser.name,
            `${name}.png`);

        if (existsSync(imagePath)) {
            let oldImage = PNG.sync.read(readFileSync(imagePath));
            let newImage = PNG.sync.read(screenshot);
            compareImages(oldImage, newImage)
                .then(({ numDiffPixels, diff }) => {
                    // console.log(`Number of different pixels: ${numDiffPixels}`);
                    diff.pack().pipe(createWriteStream('diff.png'));
                })
                .catch(error => {
                    console.error(error);
                });
        }
        else {
            mkdirSync(path.dirname(imagePath), { recursive: true });
            writeFileSync(imagePath, screenshot);
            console.log("fresh new screenshoot.");
        }
    }
}
setWorldConstructor(CustomWorld);