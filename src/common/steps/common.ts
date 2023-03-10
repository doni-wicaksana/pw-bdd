import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world';

When('set value {string} to variable {string}', function (this: CustomWorld, value: string, variableName: string) {
  this.variables[variableName] = value;
})

When('console log {string}', function (this: CustomWorld, parameter: string) {
  console.log(this.parseStepParameter(parameter));
})

Then('eval', function (this: CustomWorld, s: string) {
  eval(s);
})
Then('exec {string}', function (this: CustomWorld, s: string) {
  eval(s);
})

Then('expect {string} = {string}', function (this: CustomWorld, s: string, s2: string)  {
  expect(this.parseStepParameter(s)).toEqual(s2);
})

Then('expect {string} to be equal to {string}', function (this: CustomWorld, s: string, s2: string)  {
  expect(this.parseStepParameter(s)).toEqual(s2);
})
