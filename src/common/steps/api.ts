import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
// import { request } from 'playwright';

Given('set API method "{method}" and endpoint {string}', async function (this: CustomWorld, method: string, endpoint: string) {
    const req = this.apiRequest;
    req.url = this.parseStepParameter(endpoint);
    req.config["method"] = method;
})
Given('set API request:', async function (this: CustomWorld, data: DataTable) {
    const reqConfig = this.apiRequest.config;
    data.hashes().forEach((row) => {
        if (["header", "h"].indexOf(row.type) !== -1) {
            if (!reqConfig.headers) reqConfig.headers = {};
            reqConfig.headers[row.key] = row.value;
        }
        if (["payload", "body", "data", "b"].indexOf(row.type) !== -1) {
            if (!reqConfig.data) reqConfig.data = {};
            reqConfig.data[row.key] = row.value;
        }
        if (["parameter", "params", "p"].indexOf(row.type) !== -1) {
            if (!reqConfig.params) reqConfig.params = {};
            reqConfig.params[row.key] = row.value;
        }
        // https://playwright.dev/docs/api/class-apirequestcontext#api-request-context-fetch
    })
})

When('send API request', async function (this: CustomWorld) {
    await this.sendRequest();
    // await this.sendAxiosRequest();
})

When('send API request and keep response to {string}', async function (this: CustomWorld, responseName: string) {
    await this.sendRequest(responseName);
    // await this.sendAxiosRequest(responseName);
})

When('save response data {string} to {string}', function (this: CustomWorld, path: string, variableName: string) {
    this.variables[variableName] = this.getObjectValueByPath(this.apiResponse.data, path);
})

Given(/set API (header|h|payload|body|data|b|parameter|params|p):/, async function (this: CustomWorld, type: string, data: string) {
    const reqConfig = this.apiRequest.config;
    if (["header", "h"].indexOf(type) !== -1) {
        if (!reqConfig.headers) reqConfig.headers = {};
        reqConfig.headers = { ...reqConfig.headers, ...JSON.parse(data) };
    } else if (["payload", "body", "data", "b"].indexOf(type) !== -1) {
        if (!reqConfig.data) reqConfig.data = {};
        reqConfig.data = { ...reqConfig.data, ...JSON.parse(data) };
    } else if (["parameter", "params", "p"].indexOf(type) !== -1) {
        if (!reqConfig.params) reqConfig.params = {};
        reqConfig.params = { ...reqConfig.params, ...JSON.parse(data) };
    }
})

