module.exports = {
  default: {
    parallel: 1,
    requireModule: ['ts-node/register'],
    require: ['./src/**/*.ts', './features/steps/**/*.ts', './features/support/**/*.ts'],
    paths: ['./features/features/**/*.feature'],
    publishQuiet: true,
    worldParameters: {
      browser: {
        name: "chrome",
        launchOption: {
          headless: false,
        },
        context: {
          recordVideo: {
            dir: "reports/video",
            size: { width: 1920, height: 1080 }
          },
          viewport: { width: 1920, height: 1080 },
        }
      },
      reportPath: "reports",
      trace: {
          start: { screenshots: true, snapshots: true },
          stop: { path: "reports/trace" }
      }
    },
  }
}