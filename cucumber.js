module.exports = {
  default: {
    parallel: 1,
    retry: 1,
    retryTagFilter: '@retry',
    requireModule: ['ts-node/register'],
    require: ['./src/**/*.ts', './features/steps/**/*.ts', './features/support/**/*.ts'],
    paths: ['./features/features/**/*.feature'],
    format:['html:reports/cucumber-report.html'],
    formatOptions:{"snippetInterface":"async-await"},
    publishQuiet: true,
    worldParameters: {
      browser: {
        context: {
          recordVideo: {
            dir: "reports/video",
            size: { width: 1920, height: 1080 }
          },
          viewport: { width: 1920, height: 1080 },
        }
      },
      visualRegresion:{
          pixelmatchOptions:{threshold:0.2},
          screenshotPath: "reports/screenshots",
          saveDifferentAs:["file","attachment"],
          unMatchPath: "reports/screenshots",
      },
      // trace: {
      //     start: { screenshots: true, snapshots: true },
      //     stop: { path: "reports/trace" }
      // }
    },
  }
}