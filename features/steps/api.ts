import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { CustomWorld } from '../../src/support/world';
// import { request } from 'playwright';

Given('set API method "{method}" and endpoint {string}', async function (this: CustomWorld, method: string, endpoint: string) {
    const req = this.lastApiRequest.request;
    req.url = endpoint;
    req.config["method"] = method;
})
Given('set API request data:', async function (this: CustomWorld, data: DataTable) {
    const reqConfig = this.lastApiRequest.request.config;
    data.hashes().forEach((row) => {
        if (["header", "h"].indexOf(row.type) !== -1) {
            if (!reqConfig.headers) reqConfig.headers = {};
            reqConfig.headers[row.key] = row.value;
        }
        if (["body", "data", "b"].indexOf(row.type) !== -1) {
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
})

When('send API request and keep response to {string}', async function (this: CustomWorld, responseName: string) {
    await this.sendRequest(responseName);
})

When('save response data {string} to {string}', function (this: CustomWorld, path: string, variableName: string) {
    let data = this.lastApiResponse;
    let dataPathString: string = "";
    let x =path.split(/[\[\].]/).filter(Boolean).forEach((propName) => {
        if (data.hasOwnProperty(propName)) {
            data = data[propName];
            dataPathString += propName;
        }
        else {
            throw new Error(`Response ${dataPathString} does not contain the "${propName}" property.`);
        }
    });
    this.variables[variableName] = data;
    // console.log(this.variables);
})

When('console log {string}', function(this: CustomWorld, parameter: string) {
    // console.log(this.variables[variableName]);
    console.log(this.parseStepParameter(parameter));
    // console.log(output);
})

When('set value {string} to variable {string}', function (this: CustomWorld ,value: string, variableName: string) {
  this.variables[variableName]=value;
})
