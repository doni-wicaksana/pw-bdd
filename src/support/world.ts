import { IWorldOptions, setWorldConstructor, World } from '@cucumber/cucumber';
import { Pickle } from '@cucumber/messages';
import { BrowserContext, Page, APIRequestContext, request, Browser } from '@playwright/test';
import { playwrightConfig as pwConfig } from './config';
import path from 'path';
import { existsSync, writeFileSync, readFileSync, createWriteStream, mkdirSync } from 'fs';
import { compareImages, ICompareResult } from './images';
import { PNG } from 'pngjs';
import { PixelmatchOptions } from 'pixelmatch';
import { faker } from "@faker-js/faker";

export class CustomWorld extends World {
    scenario: Pickle;
    browser: Browser;
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
    withBrowser: boolean = true;

    constructor(options: IWorldOptions) {
        super(options);
        /*prevent update cause: this two option set by BeforAll which Browser already launch =>*/
        options.parameters.browser.name = pwConfig.browser.name;
        /*<= prevent update cause: this two option set by BeforAll which Browser already launch */
        Object.assign(pwConfig, options.parameters);
    }
    async init(scenario: Pickle, browser: Browser) {
        this.scenario = scenario;
        this.scenario["name_"] = scenario.name.replace(/\W/g, "_");
        if (this.withBrowser) {
            this.browser = browser;
            await this.newTab();
        }
    }
    async newTab() {
        try {
            //todo: rename video folder dengan scenario.name (issue nya harus buat interface dulu)
            // if(!this.context) //newcontext = open new browser
            this.context = await this.browser.newContext(pwConfig.browser.context);
            await this.context.tracing.start(pwConfig.trace.start);
            this.page = await this.context!.newPage();
        }
        catch (error) {
            console.error(`browser error due to: ${error}`);
            throw new Error(`browser error due to: ${error}`);

        }
    }
    async traceStop() {
        let traceStopConfig = { ...pwConfig.trace.stop };//shallow copy
        traceStopConfig.path = path.join(traceStopConfig.path, `${this.scenario.id}-${this.scenario["name_"]}.zip`);
        await this.context.tracing.stop(traceStopConfig);
        this.attach(`To trace, run this command in the terminal.
        npm run trace ${traceStopConfig.path}`);
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
        if (matchAsAVar) return this.variables[parameter.replace(/{{(\w+)}}/, "$1")];//Return object not string
        else { //return as string
            const regex = /{{(?:[^{]{?)+[^}]}}/gm;
            const match = parameter.match(regex);
            let output = parameter;
            match?.forEach((m) => {
                let replacement;
                if (m.match(/{{@faker\..+}}/)) {
                    replacement = faker.helpers.fake(m.replace(/{{@faker\.(.+)}}/, "{{$1}}"));
                } else if (m.match(/{{(\w+)}}/)) {
                    replacement = this.variables[m.replace(/{{(\w+)}}/, "$1")];
                } 
                if (replacement) output = output.replace(m, replacement);
            });
            return output;
        }
    }
    async matchingTheScreenshot(screenshot: Buffer, name: string, output?: Array<string>, options?: PixelmatchOptions): Promise<ICompareResult> {
        let imagePath = path.join(
            pwConfig.visualRegresion.screenshotPath,
            this.scenario.uri,
            process.platform,
            pwConfig.browser.name,
            `${name}.png`);
        let diffImagePath = path.join(
            pwConfig.visualRegresion.screenshotPath,
            this.scenario.uri,
            process.platform,
            pwConfig.browser.name,
            `diff_${name}.png`);
        let result: ICompareResult = { numDiffPixels: 0, diff: undefined };
        let pixelmatchOpt: PixelmatchOptions = pwConfig.visualRegresion.pixelmatchOptions;
        Object.assign(pixelmatchOpt, options);

        output = output || pwConfig.visualRegresion.saveDifferentAs || ["file", "attachment"];
        if (existsSync(imagePath)) {
            let oldImage = PNG.sync.read(readFileSync(imagePath));
            let newImage = PNG.sync.read(screenshot);
            await compareImages(oldImage, newImage, pixelmatchOpt)
                .then(({ numDiffPixels, diff }) => {
                    result = { numDiffPixels, diff };
                    if (numDiffPixels) {
                        if (output.includes("file")) {
                            mkdirSync(path.dirname(diffImagePath), { recursive: true });
                            diff.pack().pipe(createWriteStream(diffImagePath));
                        }
                        if (output.includes("attachment")) { this.attach(PNG.sync.write(diff), 'image/png'); }
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        }
        else {
            mkdirSync(path.dirname(imagePath), { recursive: true });
            writeFileSync(imagePath, screenshot);
            this.log(`Since there are no previous screenshots, this screenshot will be saved as a reference for future comparisons.`);
            this.attach(screenshot, 'image/png');
        }
        return result;
    }
    getObjectValueByPath(obejct: Record<string, any>, valuePath: string): any {
        let dataPathString: string = "";
        valuePath.split(/[\[\].]/).filter(Boolean).forEach((propName) => {
            if (obejct.hasOwnProperty(propName)) {
                obejct = obejct[propName];
                dataPathString += propName;
            }
            else {
                throw new Error(`Object ${dataPathString ? `"${dataPathString}" ` : ""}does not contain the "${propName}" property.`);
            }
        });
        return obejct;
    }
}
setWorldConstructor(CustomWorld);