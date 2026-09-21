import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const icon = readFileSync('public/icon-512.png').toString('base64');
const phone = readFileSync('src/assets/screens/iphone-month-light.webp').toString('base64');

const html = `<!doctype html><meta charset="utf-8"><style>
*{box-sizing:border-box}body{margin:0;width:1200px;height:630px;overflow:hidden;font:600 20px -apple-system,system-ui,sans-serif;background:linear-gradient(135deg,#f2f7ff,#ffffff 55%,#e6f0ff);color:#1c1c1e;position:relative}
.icon{position:absolute;left:80px;top:80px;width:112px;height:112px;border-radius:26px;box-shadow:0 18px 40px -16px rgba(0,60,160,.5)}
h1{position:absolute;left:80px;top:230px;margin:0;width:560px;font-size:68px;line-height:1.04;letter-spacing:-.03em;font-weight:750}
h1 span{color:#0062cc}
p{position:absolute;left:80px;top:470px;margin:0;font-weight:500;font-size:26px;color:#5b5b60;width:520px}
.phone{position:absolute;left:760px;top:60px;width:300px;height:640px;border-radius:50px;border:11px solid #16181a;overflow:hidden;box-shadow:0 40px 80px -30px rgba(0,60,160,.5)}
.phone img{width:100%;height:100%;object-fit:cover;object-position:top}
</style><img class="icon" src="data:image/png;base64,${icon}"><h1>Your headache diary. <span>Kept in order.</span></h1><p>Coming soon to the App Store</p>
<div class="phone"><img src="data:image/webp;base64,${phone}"></div>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.screenshot({ path: 'public/og.png' });
await browser.close();
console.log('wrote public/og.png');
