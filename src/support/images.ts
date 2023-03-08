import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

export interface ICompareResult {
  numDiffPixels: number;
  diff: PNG;
}
//todo add { threshold: 0.1 } parameter
export function compareImages(img1: PNG, img2: PNG): Promise<ICompareResult> {
  return new Promise((resolve, reject) => {
    try {
        const diff = new PNG({ width: img1.width, height: img1.height });
        const numDiffPixels = pixelmatch(
          img1.data, img2.data, diff.data, img1.width, img1.height,
          { threshold: 0.1 }
        );
        resolve({ numDiffPixels, diff });
    } catch (error) {
        reject(new Error(`error: ${error}`));
    }
  });
}

// Usage example
// compareImages('image1.png', 'image2.png')
//   .then(({ numDiffPixels, diff }) => {
//     console.log(`Number of different pixels: ${numDiffPixels}`);
//     diff.pack().pipe(fs.createWriteStream('diff.png'));
//   })
//   .catch(error => {
//     console.error(error);
//   });
