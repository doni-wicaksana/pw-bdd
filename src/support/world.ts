import { IWorldOptions, setWorldConstructor, World } from '@cucumber/cucumber';
import { Pickle } from '@cucumber/messages';
import { BrowserContext, Page, APIRequestContext, request, Browser } from '@playwright/test';
import { playwrightConfig as pwConfig } from './config';
import path from 'path';
import fs from 'fs';
import { compareImages, ICompareResult } from './images';
import { PNG } from 'pngjs';
import { PixelmatchOptions } from 'pixelmatch';
import { faker } from "@faker-js/faker";
import { stringParser } from './utils';
import axios from 'axios';
import BingPage from "../../features/pageobjects/bing";

type tAPIRequest = {
    url: string,
    config: {
        method?: string,
        headers?: Record<string, any>,
        params?: Record<string, any>,
        data?: Record<string, any>,
        // timeout?: number,
        // withCredentials?: boolean,
        // auth?: Record<string, any>,
        // responseType?: string
    }
}
type tAPIResponse = {
    data?: {},
    status?: number,
    statusText?: string,
    headers?: {},
    // config?: {},
    request?: {},
}
export class CustomWorld extends World {
    scenario: Pickle;
    browser: Browser;
    context: BrowserContext;
    page: Page;
    apiContext:APIRequestContext;
    apiRequest: tAPIRequest = { url: "", config: {} };
    apiResponse: tAPIResponse;
    variables: Record<string, any> = {};
    withBrowser: boolean = true;

    //pages
    public bingPage: BingPage;

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
        //TODO: kalau bersama brower sebaiknya tidak menggunakan api context tapi browser context agar cookies nya gabung.
        this.apiContext = await request.newContext();
        if (this.withBrowser) {
            this.browser = browser;
            await this.newTab();
            this.bingPage = new BingPage(this.page);
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
    async sendRequest(nameIt?: string): Promise<any> {
        const req = this.apiRequest;
        const response = await this.apiContext.fetch(req.url, req.config);
        const responseData = await response.json();
        this.apiResponse = {
            data: responseData,
            status: response.status(),
            statusText: response.statusText(),
            headers: response.headers(),
            //todo change with interceptor
            request: {
                url: req.url,
                method: req.config.method,
                headers: req.config.headers,
                params: req.config.params,
                data: req.config.data,
            },
        };

        //>log
        this.log(`${this.apiRequest.config.method} : ${response.url()}\n${JSON.stringify(this.apiResponse.request, null, 2)}`);
        // const contentType: string = response.headers['content-type'];
        // if (contentType.includes('application/json'))
        this.log(`Response:\n${JSON.stringify(this.apiResponse, null, 2)}`);
        //<log
        if (nameIt) this.variables[nameIt] = response;
        this.apiRequest = { url: "", config: {} };
        return response;
    }
    async sendAxiosRequest(nameIt?: string): Promise<any> {
        const req = this.apiRequest;
        await axios(req.url, req.config).then((response) => {
            // this.apiInfo.
            this.apiResponse = {
                data: response.data,
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
                request: {
                    url: response.config.url,
                    method: response.config.method,
                    headers: response.config.headers,
                    params: response.config.params,
                    data: response.config.data,
                },
            }
            //>log
            this.log(`${response.config.method} : ${axios.getUri(this.apiResponse.request)}\n${JSON.stringify(this.apiResponse.request, null, 2)}`);
            // const contentType: string = response.headers['content-type'];
            // if (contentType.includes('application/json'))
            this.log(`Response:\n${JSON.stringify(this.apiResponse, null, 2)}`);
            //<log
            if (nameIt) this.variables[nameIt] = response.data;
            this.apiRequest = { url: "", config: {} };
            return response.data;
        });
    }
    //common
    parseStepParameter(parameter: string): any {
        const matchAsAVar = parameter.match(/^{{\w+}}$/);
        if (matchAsAVar) return this.variables[parameter.replace(/{{(\w+)}}/, "$1")];//Return object not string
        else { //return as string
            parameter = stringParser(parameter, /{{(\w+)}}/gm, (m) => {
                return this.variables[m.replace(/{{(\w+)}}/, "$1")];
            });
            parameter = stringParser(parameter, /{{@faker\.(.+)}}/gm, (m) => {
                return faker.helpers.fake(m.replace(/{{@faker\.(.+)}}/, "{{$1}}"));
            });
            return parameter;
        }
    }
    async matchingTheScreenshot(screenshot: Buffer, name: string, output?: Array<string>, options?: PixelmatchOptions): Promise<ICompareResult> {
        let newImage = PNG.sync.read(screenshot);
        let imagePath = path.join(
            pwConfig.visualRegresion.screenshotPath,
            this.scenario.uri,
            process.platform,
            pwConfig.browser.name,
            `${name}_${newImage.width}X${newImage.height}.png`);
        let diffImagePath = path.join(
            pwConfig.visualRegresion.screenshotPath,
            this.scenario.uri,
            process.platform,
            pwConfig.browser.name,
            `diff_${name}_${newImage.width}X${newImage.height}.png`);
        let result: ICompareResult = { numDiffPixels: 0, diff: undefined };
        let pixelmatchOpt: PixelmatchOptions = pwConfig.visualRegresion.pixelmatchOptions;
        Object.assign(pixelmatchOpt, options);

        output = output || pwConfig.visualRegresion.saveDifferentAs || ["file", "attachment"];
        if (fs.existsSync(imagePath)) {
            let oldImage = PNG.sync.read(fs.readFileSync(imagePath));
            let newImage = PNG.sync.read(screenshot);
            await compareImages(oldImage, newImage, pixelmatchOpt)
                .then(({ numDiffPixels, diff }) => {
                    result = { numDiffPixels, diff };
                    if (numDiffPixels) {
                        if (output.includes("file")) {
                            fs.mkdirSync(path.dirname(diffImagePath), { recursive: true });
                            diff.pack().pipe(fs.createWriteStream(diffImagePath));
                        }
                        if (output.includes("attachment")) { this.attach(PNG.sync.write(diff), 'image/png'); }
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        }
        else {
            fs.mkdirSync(path.dirname(imagePath), { recursive: true });
            fs.writeFileSync(imagePath, screenshot);
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