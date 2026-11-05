import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const BASE = process.env.A11Y_BASE ?? 'http://localhost:4321';
const PATHS = ['/', '/privacy/'];
const SCHEMES = ['light', 'dark'];
const WIDTHS = [400, 1200];

const browser = await chromium.launch();
let failed = false;
try {
  for (const [colorScheme, width] of SCHEMES.flatMap((s) => WIDTHS.map((w) => [s, w]))) {
    const context = await browser.newContext({ colorScheme, viewport: { width, height: 900 } });
    const page = await context.newPage();
    for (const path of PATHS) {
      let res;
      try {
        res = await page.goto(BASE + path);
      } catch (e) {
        console.error(`Could not reach ${BASE + path}: ${e.message.split('\n')[0]}. Is 'npm run preview' running?`);
        process.exitCode = 1;
        throw e;
      }
      if (!res || !res.ok()) {
        failed = true;
        console.error(`FAIL ${path} (${colorScheme}, ${width}): HTTP ${res ? res.status() : 'no response'}`);
        continue;
      }
      const h1s = await page.locator('h1').count();
      if (h1s !== 1) {
        failed = true;
        console.error(`FAIL ${path} (${colorScheme}, ${width}): expected exactly one <h1>, found ${h1s}`);
        continue;
      }
      const { violations } = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      if (violations.length) {
        failed = true;
        console.error(`FAIL ${path} (${colorScheme}, ${width})`);
        for (const v of violations) console.error(`  ${v.id}: ${v.help} (${v.nodes.length} nodes)`);
      } else {
        console.log(`ok   ${path} (${colorScheme}, ${width})`);
      }
    }
    await context.close();
  }
} catch {
  failed = true;
} finally {
  await browser.close();
}
process.exit(failed ? 1 : 0);
