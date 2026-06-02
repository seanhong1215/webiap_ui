const { chromium } = require('playwright');
const path = require('path');

const BASE = 'http://localhost:8080/#';
const OUT_USER  = path.join(__dirname, 'images', 'user');
const OUT_ADMIN = path.join(__dirname, 'images', 'admin');

const VIEWPORT = { width: 1440, height: 900 };

async function shot(page, dir, name) {
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(dir, name), fullPage: false });
  console.log('✓', name);
}

async function clearSession(page) {
  await page.evaluate(() => sessionStorage.clear());
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: VIEWPORT });
  const page = await ctx.newPage();

  // ──────────────────────────────────────────────
  // 使用者流程
  // ──────────────────────────────────────────────
  console.log('\n=== 使用者流程 ===');

  // 1. 登入頁面
  await page.goto(`${BASE}/login`);
  await page.waitForSelector('.login-card');
  await shot(page, OUT_USER, '01-登入頁面.png');

  // 2. 填入使用者帳密
  await page.fill('input[type="text"]', 'user');
  await page.fill('input[type="password"]', '123456');
  await shot(page, OUT_USER, '02-填入帳密.png');

  // 3. 登入後 Dashboard
  await page.click('.login-btn');
  await page.waitForURL(`**/#/dashboard`);
  await page.waitForSelector('.dashboard', { timeout: 5000 }).catch(() => {});
  await shot(page, OUT_USER, '03-控制台.png');

  // 4. 申請表單頁
  await page.click('a[href="#/forms"]');
  await page.waitForTimeout(600);
  await shot(page, OUT_USER, '04-申請表單.png');

  // 5. 我的申請頁
  await page.click('a[href="#/my-requests"]');
  await page.waitForTimeout(600);
  await shot(page, OUT_USER, '05-我的申請.png');

  // ──────────────────────────────────────────────
  // 管理者流程
  // ──────────────────────────────────────────────
  console.log('\n=== 管理者流程 ===');

  // 清除 session，重新登入
  await clearSession(page);
  await page.goto(`${BASE}/login`);
  await page.waitForSelector('.login-card');
  await shot(page, OUT_ADMIN, '01-登入頁面.png');

  // 2. 填入管理者帳密
  await page.fill('input[type="text"]', 'admin');
  await page.fill('input[type="password"]', 'admin');
  await shot(page, OUT_ADMIN, '02-填入帳密.png');

  // 3. 登入後自動進入 Dashboard
  await page.click('.login-btn');
  await page.waitForURL(`**/#/dashboard`);
  await page.waitForTimeout(600);

  // 4. 系統總覽 (Admin Overview)
  await page.goto(`${BASE}/admin`);
  await page.waitForTimeout(1000);
  await shot(page, OUT_ADMIN, '03-系統總覽.png');

  // 5. 流程總覽
  await page.goto(`${BASE}/admin/processes`);
  await page.waitForTimeout(800);
  await shot(page, OUT_ADMIN, '04-流程總覽.png');

  // 6. 開啟條件規則 Modal
  const ruleBtn = page.locator('.btn-rules').first();
  await ruleBtn.click();
  await page.waitForSelector('.modal-overlay', { timeout: 3000 });
  await page.waitForTimeout(500);
  await shot(page, OUT_ADMIN, '05-條件規則管理.png');

  // 關閉 rule modal — 直接點關閉按鈕
  await page.locator('.modal-close').first().click();
  await page.waitForSelector('.modal-overlay', { state: 'hidden', timeout: 3000 }).catch(() => {});
  await page.waitForTimeout(500);

  // 7. 開啟表單欄位 Modal
  const fieldBtn = page.locator('.btn-form').first();
  await fieldBtn.click();
  await page.waitForSelector('.modal-overlay', { timeout: 3000 });
  await page.waitForTimeout(500);
  await shot(page, OUT_ADMIN, '06-表單欄位管理.png');

  // 關閉 form modal
  await page.locator('.modal-close').first().click();
  await page.waitForSelector('.modal-overlay', { state: 'hidden', timeout: 3000 }).catch(() => {});
  await page.waitForTimeout(400);

  // 8. 申請記錄
  await page.goto(`${BASE}/admin/records`);
  await page.waitForTimeout(800);
  await shot(page, OUT_ADMIN, '07-申請記錄.png');

  // 9. 展開第一筆記錄
  const firstRow = page.locator('.record-row').first();
  await firstRow.click();
  await page.waitForTimeout(500);
  await shot(page, OUT_ADMIN, '08-申請記錄展開詳情.png');

  await browser.close();
  console.log('\n✅ 所有截圖完成');
})();
