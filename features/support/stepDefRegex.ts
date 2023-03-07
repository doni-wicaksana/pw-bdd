const { defineParameterType } = require('@cucumber/cucumber');


defineParameterType({
  name: 'method',
  regexp: /(post|get|put|delete|patch|POST|GET|PUT|DELETE|PATCH)/,
  transformer(s: string) {
    return s.toLowerCase();
  },
})
