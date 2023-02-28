module.exports = {
    default: {
      parallel: 2,
      requireModule: ['ts-node/register'], 
      require: ['./src/steps/**/*.ts'],
      paths: ['./features/**/*.feature'],
    }
  }