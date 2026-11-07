const crypto = require('node:crypto');
const path = require('node:path');
const { chromium } = require('playwright-core');

const baseUrl = 'http://127.0.0.1:5173/';
const browserPath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const report = { viewports: [], hoverStates: {}, sectionTransitions: [], navigation: {}, interactions: {}, errors: [] };

const hash = (buffer) => crypto.createHash('sha1').update(buffer).digest('hex');

async function scrollToSection(page, selector) {
  await page.evaluate(async (sectionSelector) => {
    const section = document.querySelector(sectionSelector);
    const start = window.scrollY;
    const target = Math.max(0, Math.min(document.documentElement.scrollHeight - innerHeight,
      section.getBoundingClientRect().top + window.scrollY - innerHeight * 0.2));
    for (let step = 1; step <= 24; step += 1) {
      window.scrollTo({ top: start + (target - start) * (step / 24), behavior: 'instant' });
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
  }, selector);
  await page.waitForFunction((sectionSelector) => {
    const heading = document.querySelector(`${sectionSelector} .section-heading h2`);
    if (!heading) return true;
    const style = getComputedStyle(heading);
    return Number(style.opacity) > 0.99 && !style.clipPath.includes('100%');
  }, selector, { timeout: 8000 });
}

async function imageDifference(page, first, second) {
  return page.evaluate(async ({ firstPng, secondPng }) => {
    const pixels = async (base64) => {
      const image = new Image();
      image.src = `data:image/png;base64,${base64}`;
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      context.drawImage(image, 0, 0);
      return context.getImageData(0, 0, image.width, image.height).data;
    };
    const [a, b] = await Promise.all([pixels(firstPng), pixels(secondPng)]);
    let changed = 0;
    for (let index = 0; index < a.length; index += 4) {
      if (Math.abs(a[index] - b[index]) + Math.abs(a[index + 1] - b[index + 1]) + Math.abs(a[index + 2] - b[index + 2]) > 65) changed += 1;
    }
    return changed / (a.length / 4);
  }, { firstPng: first.toString('base64'), secondPng: second.toString('base64') });
}

async function main() {
  const browser = await chromium.launch({ headless: true, executablePath: browserPath, args: ['--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader'] });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    page.on('pageerror', (error) => report.errors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') report.errors.push(message.text()); });
    page.on('requestfailed', (request) => report.errors.push(`${request.url()} ${request.failure()?.errorText}`));
    const response = await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForFunction(() => document.querySelector('.preloader')?.classList.contains('preloader--done'));
    await page.waitForFunction(() => document.querySelector('.scene3d canvas')?.getAttribute('data-engine') === 'three.js r180', null, { timeout: 20000 });
    await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' });
    report.httpStatus = response.status();

    report.brokenAnchorTargets = await page.evaluate(() => {
      const ids = [...document.querySelectorAll('a[href^="#"]')].map((link) => link.getAttribute('href').slice(1)).filter(Boolean);
      return [...new Set(ids)].filter((id) => !document.getElementById(id));
    });

    const heroButton = page.locator('.hero__actions .button').first();
    const buttonBefore = await heroButton.boundingBox();
    const buttonX = buttonBefore.x + buttonBefore.width / 2;
    const buttonY = buttonBefore.y + buttonBefore.height / 2;
    await page.mouse.move(buttonX, buttonY);
    await page.mouse.move(buttonX + buttonBefore.width * 0.22, buttonY + 3, { steps: 8 });
    await page.waitForTimeout(300);
    const buttonAfter = await heroButton.boundingBox();
    report.hoverStates.buttonMagneticMovement = Math.abs(buttonAfter.x - buttonBefore.x) > 1;
    report.hoverStates.buttonArrowMovement = await heroButton.locator('svg').evaluate((element) => getComputedStyle(element).transform !== 'none');
    const cursor = page.locator('.cursor-halo');
    report.hoverStates.cursorFollow = await cursor.evaluate((element) => getComputedStyle(element).opacity === '1' && getComputedStyle(element).pointerEvents === 'none');
    report.hoverStates.cursorDoesNotBlockClickTarget = await page.evaluate(({ x, y }) => document.elementFromPoint(x, y)?.closest('.button') != null, { x: buttonX, y: buttonY });
    const canvasHoverBox = await page.locator('.scene3d canvas').boundingBox();
    await page.mouse.move(canvasHoverBox.x + 420, canvasHoverBox.y + 400);
    await page.waitForTimeout(180);
    report.hoverStates.cursorHidesOverThreeScene = await cursor.evaluate((element) => Number(getComputedStyle(element).opacity) < 0.1);

    await scrollToSection(page, '.about');
    report.about = await page.evaluate(() => {
      const accent = document.querySelector('.about .section-heading h2 em');
      const style = getComputedStyle(accent);
      const art = document.querySelector('.about-art');
      return {
        accentBackgroundSize: style.backgroundSize,
        accentBackgroundColor: style.backgroundColor,
        artIsVisible: getComputedStyle(art).visibility === 'visible' && getComputedStyle(art).opacity === '1',
        artContainsArchitecture: Boolean(art.querySelector('.about-art__arch')),
        artMark: art.querySelector('.about-art__word')?.textContent,
      };
    });
    await page.screenshot({ path: path.join(process.env.TEMP, 'lexora-about-fixed.png'), fullPage: false });

    await scrollToSection(page, '.practice');
    report.hoverStates.practiceCardCount = await page.locator('.practice-card').count();
    report.hoverStates.practiceCardLinks = await page.locator('.practice-card__link[href="#contact"]').count();
    const practiceTilt = [];
    for (const card of await page.locator('.practice-card').all()) {
      const bounds = await card.boundingBox();
      await page.mouse.move(bounds.x + bounds.width * 0.83, bounds.y + 34);
      await page.waitForTimeout(180);
      const transform = await card.locator('.practice-card__surface').evaluate((element) => getComputedStyle(element).transform);
      practiceTilt.push(transform !== 'none');
    }
    report.hoverStates.practiceCardsTiltWithPointer = practiceTilt;
    await page.keyboard.press('Tab');

    await scrollToSection(page, '.attorneys');
    const attorneyImages = await page.locator('.attorney-card__portrait img').evaluateAll((images) => images.map((image) => ({ loaded: image.complete && image.naturalWidth > 0, alt: Boolean(image.alt) })));
    report.hoverStates.attorneyImages = attorneyImages;
    const imageTransforms = [];
    for (const card of await page.locator('.attorney-card').all()) {
      const bounds = await card.boundingBox();
      const image = card.locator('.attorney-card__portrait img');
      const before = await image.evaluate((element) => getComputedStyle(element).transform);
      await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + 60);
      await page.waitForTimeout(220);
      const after = await image.evaluate((element) => getComputedStyle(element).transform);
      imageTransforms.push(before !== after && after !== 'none');
    }
    report.hoverStates.attorneyImageZoom = imageTransforms;
    report.hoverStates.attorneyCardLinks = await page.locator('.attorney-card__arrow[href="#contact"]').count();

    await scrollToSection(page, '.testimonials');
    const insightTransforms = [];
    for (const card of await page.locator('.testimonial-card').all()) {
      const bounds = await card.boundingBox();
      await page.mouse.move(bounds.x + bounds.width * 0.8, bounds.y + 40);
      await page.waitForTimeout(180);
      insightTransforms.push(await card.locator('.testimonial-card__surface').evaluate((element) => getComputedStyle(element).transform !== 'none'));
    }
    report.hoverStates.insightsCardDepth = insightTransforms;

    await scrollToSection(page, '.about');
    const firstStat = page.locator('.stat').first();
    const statBounds = await firstStat.boundingBox();
    await page.mouse.move(statBounds.x + statBounds.width / 2, statBounds.y + statBounds.height / 2);
    await page.waitForTimeout(300);
    report.hoverStates.statCounterAndLift = {
      values: await page.locator('.stat__number').allTextContents(),
      translate: await firstStat.evaluate((element) => getComputedStyle(element).translate),
    };

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(1200);
    const canvas = page.locator('.scene3d canvas');
    const box = await canvas.boundingBox();
    const startX = Math.round(box.x + 180);
    const startY = Math.round(box.y + box.height * 0.5);
    const beforeTurn = await canvas.screenshot();
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 650, startY, { steps: 45 });
    await page.mouse.up();
    await page.waitForTimeout(650);
    const afterTurn = await canvas.screenshot();
    report.interactions.fullTurnDragChangesModel = hash(beforeTurn) !== hash(afterTurn);
    report.interactions.manualModeAnnounced = await page.locator('.scene3d').getAttribute('data-view-control') === 'manual'
      && (await page.locator('#scene3d-hint').innerText()).includes('Manual view active');
    await page.evaluate(() => window.scrollTo({ top: 300, behavior: 'instant' }));
    await page.waitForTimeout(850);
    report.interactions.manualModePersistsOnScroll = await page.locator('.scene3d').getAttribute('data-view-control') === 'manual';
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(1500);
    const restoredTurn = await canvas.screenshot();
    report.interactions.selectedViewDifferenceAfterScroll = await imageDifference(page, afterTurn, restoredTurn);
    await page.mouse.move(startX + 60, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 60, startY + 85, { steps: 20 });
    await page.mouse.up();
    await page.waitForTimeout(450);
    report.interactions.verticalTiltChangesModel = hash(restoredTurn) !== hash(await canvas.screenshot());
    await page.locator('.scene3d').focus();
    const beforeKeyTurn = hash(await canvas.screenshot());
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(450);
    report.interactions.keyboardRotation = beforeKeyTurn !== hash(await canvas.screenshot());

    const navLinks = await page.locator('.desktop-nav a[href^="#"]').all();
    const visited = [];
    for (const link of navLinks) {
      const href = await link.getAttribute('href');
      await link.click();
      await page.waitForFunction((expected) => window.location.hash === expected, href);
      visited.push(href);
    }
    report.navigation.desktopVisited = visited;
    report.navigation.activeState = await page.locator('.desktop-nav a[aria-current="location"]').getAttribute('href');
    report.buttonTargets = await page.locator('.button[href^="#"]').evaluateAll((links) => links.map((link) => ({ href: link.getAttribute('href'), targetExists: Boolean(document.getElementById(link.getAttribute('href').slice(1))) })));

    for (const [width, height] of [[1920, 1080], [1440, 900], [1200, 900], [1100, 900], [1024, 900], [1000, 900], [900, 900], [860, 1024], [768, 1024], [390, 844], [360, 800]]) {
      await page.setViewportSize({ width, height });
      await page.waitForTimeout(80);
      report.viewports.push(await page.evaluate(() => ({
        size: [innerWidth, innerHeight],
        overflow: document.documentElement.scrollWidth > innerWidth,
        mobileMenu: getComputedStyle(document.querySelector('.menu-toggle')).display !== 'none',
        desktopNavHidden: getComputedStyle(document.querySelector('.desktop-nav')).display === 'none',
      })));
    }
    await context.close();

    const motionContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    const reducedPage = await motionContext.newPage();
    await reducedPage.goto(baseUrl, { waitUntil: 'networkidle' });
    await reducedPage.waitForFunction(() => document.querySelector('.preloader')?.classList.contains('preloader--done'));
    report.reducedMotion = await reducedPage.evaluate(() => ({
      enabled: matchMedia('(prefers-reduced-motion: reduce)').matches,
      allHeadingsVisible: [...document.querySelectorAll('.section-heading h2')].every((el) => getComputedStyle(el).visibility === 'visible' && getComputedStyle(el).opacity === '1'),
      aboutAccent: getComputedStyle(document.querySelector('.about .section-heading h2 em')).backgroundSize,
      customCursorDisabled: Number(getComputedStyle(document.querySelector('.cursor-halo')).opacity) < 0.1,
    }));
    await motionContext.close();

    const touchContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    const touchPage = await touchContext.newPage();
    await touchPage.goto(baseUrl, { waitUntil: 'networkidle' });
    await touchPage.waitForFunction(() => document.querySelector('.scene3d canvas')?.getAttribute('data-engine') === 'three.js r180');
    const touchBox = await touchPage.locator('.scene3d canvas').boundingBox();
    const touchX = Math.round(touchBox.x + touchBox.width * 0.5);
    const touchY = Math.round(touchBox.y + touchBox.height * 0.5);
    const cdp = await touchContext.newCDPSession(touchPage);
    const beforeTouch = hash(await touchPage.locator('.scene3d canvas').screenshot());
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: touchX, y: touchY, id: 1 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: touchX + 90, y: touchY + 45, id: 1 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await touchPage.waitForTimeout(400);
    report.interactions.touchRotation = beforeTouch !== hash(await touchPage.locator('.scene3d canvas').screenshot());
    report.interactions.touchCursorDisabled = await touchPage.locator('.cursor-halo').evaluate((element) => Number(getComputedStyle(element).opacity) < 0.1);
    await touchPage.locator('.menu-toggle').click();
    report.navigation.mobileDrawerOpen = await touchPage.locator('.menu-toggle').getAttribute('aria-expanded') === 'true'
      && await touchPage.evaluate(() => document.body.style.overflow === 'hidden');
    await touchPage.locator('.mobile-drawer__contact').click();
    await touchPage.waitForFunction(() => window.location.hash === '#contact' && document.body.style.overflow !== 'hidden');
    report.navigation.mobileAnchorClosesDrawer = await touchPage.locator('.menu-toggle').getAttribute('aria-expanded') === 'false';
    report.navigation.mobileActiveSection = await touchPage.locator('.mobile-drawer a[aria-current="location"]').getAttribute('href');
    await touchContext.close();

    const fallbackContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    await fallbackContext.addInitScript(() => {
      const originalGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function getContext(type, ...args) {
        if (typeof type === 'string' && type.toLowerCase().startsWith('webgl')) return null;
        return originalGetContext.call(this, type, ...args);
      };
    });
    const fallbackPage = await fallbackContext.newPage();
    await fallbackPage.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await fallbackPage.waitForSelector('.scene-fallback', { timeout: 9000 });
    report.webglFallback = await fallbackPage.locator('.scene-fallback').isVisible();
    await fallbackContext.close();

    console.log(JSON.stringify(report, null, 2));
    const failures = [];
    if (report.httpStatus !== 200) failures.push('page did not return HTTP 200');
    if (report.brokenAnchorTargets.length) failures.push('local anchor target is missing');
    if (!report.about?.accentBackgroundSize.includes('1px') || !report.about?.artContainsArchitecture) failures.push('About visual fix did not render');
    if (!report.hoverStates.buttonMagneticMovement || !report.hoverStates.buttonArrowMovement || !report.hoverStates.cursorFollow || !report.hoverStates.cursorDoesNotBlockClickTarget || !report.hoverStates.cursorHidesOverThreeScene) failures.push('button or cursor hover check failed');
    if (report.hoverStates.practiceCardsTiltWithPointer?.some((value) => !value)) failures.push('practice card tilt check failed');
    if (report.hoverStates.attorneyImages?.some((image) => !image.loaded || !image.alt) || report.hoverStates.attorneyImageZoom?.some((value) => !value)) failures.push('attorney image hover check failed');
    if (report.hoverStates.insightsCardDepth?.some((value) => !value)) failures.push('insights card depth check failed');
    if (!report.interactions.fullTurnDragChangesModel || !report.interactions.verticalTiltChangesModel || !report.interactions.keyboardRotation || !report.interactions.touchRotation) failures.push('3D interaction check failed');
    if (!report.interactions.manualModePersistsOnScroll || report.interactions.selectedViewDifferenceAfterScroll > 0.12) failures.push('manual 3D control was overridden by scroll');
    if (report.viewports.some((viewport) => viewport.overflow)) failures.push('responsive layout overflows horizontally');
    if (report.navigation.desktopVisited?.length !== 6 || report.navigation.mobileActiveSection !== '#contact' || !report.navigation.mobileDrawerOpen || !report.navigation.mobileAnchorClosesDrawer) failures.push('navigation interaction check failed');
    if (!report.reducedMotion?.allHeadingsVisible || !report.reducedMotion?.customCursorDisabled) failures.push('reduced-motion check failed');
    if (!report.webglFallback) failures.push('WebGL fallback did not display');
    if (report.errors.length) failures.push('browser runtime errors or failed requests were reported');
    if (failures.length) throw new Error(failures.join('; '));
  } finally {
    await browser.close();
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
