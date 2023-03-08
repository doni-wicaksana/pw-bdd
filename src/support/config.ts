import dotenv from 'dotenv';

dotenv.config();

// interface PwConfig {
//     browser: {
//         name: string,
//         launchOption: {
//           headless: boolean,
//         },
//         viewport: { width: number, height: number },
//       },
//       reportPath: string,
//       video: {
//         dir: string,
//         size: { width: number, height: number }
//       },
//       trace: boolean
// }

export const playwrightConfig = {
    browser: {
        name: process.env.BROWSER || "chrome",
        launchOption: {
            headless: false,
        },
        context: {
            // recordVideo: {
            //     dir: "reports/video",
            //     size: { width: 1920, height: 1080 }
            // },
            viewport: { width: 1920, height: 1080 },
        }
    },
    reportPath: "reports",
    screenshotPath: "reports/screenshots",
    trace: {
        start: { screenshots: true, snapshots: true },
        stop: { path: "reports/trace" }
    }

    //     actionTimeout - Timeout for each Playwright action in milliseconds. Defaults to 0 (no timeout). Learn more about various timeouts.
    // baseURL - Base URL used for all pages in the context. Allows navigating by using just the path, for example page.goto('/settings').
    // browserName - Name of the browser that will run the tests, one of chromium, firefox, or webkit.
    // bypassCSP - Toggles bypassing Content-Security-Policy. Useful when CSP includes the production origin.
    // channel - Browser channel to use. Learn more about different browsers and channels.
    // storageState - Populates context with given storage state. Useful for easy authentication, learn more.
    // colorScheme - Emulates 'prefers-colors-scheme' media feature, supported values are 'light', 'dark', 'no-preference'.
    // geolocation - Context geolocation.
    // locale - Emulates the user locale, for example en-GB, de-DE, etc.
    // permissions - A list of permissions to grant to all pages in the context.
    // timezoneId - Changes the timezone of the context.

    // network
    // acceptDownloads - Whether to automatically download all the attachments, defaults to true. Learn more about working with downloads.
    // extraHTTPHeaders - An object containing additional HTTP headers to be sent with every request. All header values must be strings.
    // httpCredentials - Credentials for HTTP authentication.
    // ignoreHTTPSErrors - Whether to ignore HTTPS errors during navigation.
    // offline - Whether to emulate network being offline.
    // proxy - Proxy settings used for all pages in the test.

    // screenshot: 'only-on-failure'|off|on,

    // retries: The maximum number of retry attempts per test.
};
export default playwrightConfig;
