import puppeteer from 'puppeteer';
import path from 'path';

const OUTPUT_DIR = '/Users/sunshineroachdopeapps/dopetech-support-website/public/images';

async function captureHeroImage(page, url, outputFile, label) {
  console.log(`\n--- Capturing ${label} from ${url} ---`);
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

  // Wait a bit for animations/lazy images to load
  await new Promise(r => setTimeout(r, 2000));

  // Strategy 1: Try to find an <img> element in the hero section
  const elementHandle = await page.evaluateHandle(() => {
    // Look for hero sections by common patterns
    const selectors = [
      'section:first-of-type img',
      '[class*="hero"] img',
      '[class*="Hero"] img',
      'header + * img',
      'main > *:first-child img',
      'main section:first-child img',
      '.hero img',
      '#hero img',
    ];

    for (const sel of selectors) {
      const imgs = document.querySelectorAll(sel);
      for (const img of imgs) {
        const rect = img.getBoundingClientRect();
        // We want a sizable image in the upper portion of the page (hero area)
        if (rect.width > 150 && rect.height > 150 && rect.top < 800) {
          console.log(`Found hero image with selector "${sel}": ${rect.width}x${rect.height} at (${rect.left}, ${rect.top})`);
          return img;
        }
      }
    }

    // Fallback: find the largest image in the top 900px of the page
    const allImgs = document.querySelectorAll('img');
    let best = null;
    let bestArea = 0;
    for (const img of allImgs) {
      const rect = img.getBoundingClientRect();
      if (rect.top < 900 && rect.width > 100 && rect.height > 100) {
        const area = rect.width * rect.height;
        if (area > bestArea) {
          bestArea = area;
          best = img;
        }
      }
    }
    if (best) {
      const r = best.getBoundingClientRect();
      console.log(`Fallback: largest hero image ${r.width}x${r.height} at (${r.left}, ${r.top})`);
    }
    return best;
  });

  const element = elementHandle.asElement();

  if (element) {
    const box = await element.boundingBox();
    if (box) {
      console.log(`Found element: ${box.width}x${box.height} at (${box.x}, ${box.y})`);
      try {
        await element.screenshot({
          path: path.join(OUTPUT_DIR, outputFile),
          omitBackground: true,
        });
        console.log(`Saved element screenshot to ${outputFile}`);
        return;
      } catch (err) {
        console.log(`Element screenshot failed: ${err.message}. Trying clip fallback.`);
        // Add some padding around the element
        const pad = 10;
        await page.screenshot({
          path: path.join(OUTPUT_DIR, outputFile),
          omitBackground: true,
          clip: {
            x: Math.max(0, box.x - pad),
            y: Math.max(0, box.y - pad),
            width: box.width + pad * 2,
            height: box.height + pad * 2,
          },
        });
        console.log(`Saved clipped screenshot to ${outputFile}`);
        return;
      }
    }
  }

  // Strategy 2: Clip the right side of the hero area
  console.log('No hero image element found. Using clip fallback for right side of hero.');
  await page.screenshot({
    path: path.join(OUTPUT_DIR, outputFile),
    omitBackground: true,
    clip: {
      x: 700,
      y: 50,
      width: 740,
      height: 600,
    },
  });
  console.log(`Saved right-side hero clip to ${outputFile}`);
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  try {
    // 1. DopeApps phone mockup
    await captureHeroImage(page, 'https://dopetech.ai/dopeapps', 'dopeapps-phone.png', 'DopeApps phone mockup');

    // 2. DopeSites laptop mockup
    await captureHeroImage(page, 'https://dopetech.ai/dopesites', 'dopesites-laptop.png', 'DopeSites laptop mockup');

    console.log('\nDone! Images saved to:', OUTPUT_DIR);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await browser.close();
  }
})();
