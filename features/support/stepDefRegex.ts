import { defineParameterType } from '@cucumber/cucumber';


// defineParameterType({
//   name: 'optional',
//   regexp: /(.*)?/
// })

// defineParameterType({
//   name: 'url',
//   regexp: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
//   transformer: function (s: string) {
//     return s.toLowerCase();
//   }
// });
// defineParameterType({
//   name: 'word',
//   regexp: /['"]?([A-Z][a-z]+)['"]?/,
//   transformer(s: string) {
//     return s.replace(/['"]?([A-Z][a-z]+)['"]?/,"$1");
//   },
// });

defineParameterType({
  name: 'method',
  regexp: /(post|get|put|delete|patch|POST|GET|PUT|DELETE|PATCH)/,
  transformer(s: string) {
    return s.toLowerCase();
  },
});