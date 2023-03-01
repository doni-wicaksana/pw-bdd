module.exports = {
    default: {
      parallel: 2,
      requireModule: ['ts-node/register'], 
      require: ['./src/**/*.ts','./tests/steps/**/*.ts'],
      paths: ['./tests/features/**/*.feature'],
    }
  }