import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const BASE = process.env.A11Y_BASE ?? 'http://localhost:4321';
const PATHS = ['/', '/privacy/'];
const SCHEMES = ['light', 'dark'];

const browser = await chromium.launch();
let failed = false;
for (const colorScheme of SCHEMES) {
  const context = await browser.newContext({ colorScheme, viewport: { width: 400, height: 900 } });
  const page = await context.newPage();
  for (const path of PATHS) {
    await page.goto(BASE + path);
    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    if (violations.length) {
      failed = true;
      console.error(`FAIL ${path} (${colorScheme})`);
      for (const v of violations) console.error(`  ${v.id}: ${v.help} (${v.nodes.length} nodes)`);
    } else {
      console.log(`ok   ${path} (${colorScheme})`);
    }
  }
  await context.close();
}
await browser.close();
process.exit(failed ? 1 : 0);
