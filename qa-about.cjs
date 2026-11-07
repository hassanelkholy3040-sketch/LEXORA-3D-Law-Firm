const path = require('node:path');
const { chromium } = require('playwright-core');
async function main() {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', args: ['--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader'] });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.querySelector('.preloader')?.classList.contains('preloader--done'));
    await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' });
    await page.evaluate(async () => {
      const section = document.querySelector('.about');
      const target = section.getBoundingClientRect().top + scrollY - innerHeight * 0.2;
      const start = scrollY;
      for (let step = 1; step <= 24; step += 1) {
        window.scrollTo({ top: start + (target - start) * (step / 24), behavior: 'instant' });
        await new Promise((resolve) => requestAnimationFrame(resolve));
      }
    });
    await page.waitForTimeout(2600);
    console.log(JSON.stringify(await page.evaluate(() => ({
      title: getComputedStyle(document.querySelector('.about-art')).clipPath,
      artBounds: document.querySelector('.about-art').getBoundingClientRect().toJSON(),
      frameBackground: getComputedStyle(document.querySelector('.about-art__frame')).background,
      artChildren: [...document.querySelectorAll('.about-art__frame > *')].map((child) => ({ class: child.className.baseVal ?? child.className, visible: getComputedStyle(child).visibility, opacity: getComputedStyle(child).opacity, rect: child.getBoundingClientRect().toJSON() })),
      ambient: getComputedStyle(document.querySelector('.about')).getPropertyValue('--ambient-opacity'),
    })), null, 2));
    await page.screenshot({ path: path.join(process.env.TEMP, 'lexora-about-before.png'), fullPage: false });
  } finally { await browser.close(); }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
