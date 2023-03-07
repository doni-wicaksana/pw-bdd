import { IWorldOptions, setWorldConstructor, World } from '@cucumber/cucumber';
import { BrowserContext, Page, ChromiumBrowser, APIRequestContext, request } from '@playwright/test';
import { playwrightConfig } from './config';
import path from 'path';

export class CustomWorld extends World {
    scenarioId: string;
    scenarioName: string;
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
        delete options.parameters.browser.name;//setting browser tidak boleh di ubah
        Object.assign(playwrightConfig, options.parameters);
    }
    async init(scenarioId: string, scenarioName: string, browser: ChromiumBrowser) {
        this.scenarioId = scenarioId;
        this.scenarioName = scenarioName;
        this.browser = browser;
        await this.newTab();
    }
    async newTab() {
        try {
            //todo: rename video folder dengan scenarioName (issue nya harus buat interface dulu)
            this.context = await this.browser.newContext(playwrightConfig.browser.context);
            await this.context.tracing.start(playwrightConfig.trace.start);
            this.page = await this.context!.newPage();
        }
        catch (error) {
            console.log(`browser error due to: ${error}`);
            throw new Error(`browser error due to: ${error}`);

        }
    }
    async traceStop() {
        let traceStopConfig = { ...playwrightConfig.trace.stop };//shallow copy
        traceStopConfig.path = path.join(traceStopConfig.path, `${this.scenarioId}-${this.scenarioName}.zip`);
        await this.context.tracing.stop(traceStopConfig);
    }

    //api

    async sendRequest(nameIt?: string): Promise<any> {
        const req = this.lastApiRequest.request;
        const response = await (await request.newContext()).fetch(req.url, req.config);
        this.lastApiResponse = await response.json();
        if (nameIt) this.variables[nameIt] = this.lastApiResponse
        return this.lastApiResponse;
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
}

setWorldConstructor(CustomWorld);