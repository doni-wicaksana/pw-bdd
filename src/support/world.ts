// import { IWorldOptions, setWorldConstructor , World} from '@cucumber/cucumber';
// import { chromium, Browser, Page, BrowserContext } from 'playwright';
// import path from 'path';

// export class ThisWorld extends World {
//   private browser!: Browser;
//   private context!: BrowserContext;
//   public page!: Page;

//   constructor(options: IWorldOptions) {
//     super(options);
//   }
  
//   public async openNewPage(url: string) {
//     this.browser = await chromium.launch({ headless: false });
    
//     this.context = await this.browser.newContext({
//       recordVideo: {
//         dir: path.resolve(`videos/xxx`),
//         size: { width: 1920, height: 1080 }
//       },
//       viewport: { width: 1920, height: 1080 }
//     });
//     this.page = await this.context.newPage();
//     await this.page.goto(url);
//   }

//   public async closeBrowser() {
//     await this.browser.contexts().forEach(async(ctx: BrowserContext) =>{
//         await ctx.close();
//     });
//     await this.browser.close();
//   }

//   // public getPage() {
//   //   return this.page;
//   // }
// }

// setWorldConstructor(ThisWorld);