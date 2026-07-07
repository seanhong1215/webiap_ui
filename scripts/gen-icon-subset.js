const fs = require('fs');

// 專案實際用到的 Tabler 圖示(codemod MAP 的 value 去重)
const USED = [...new Set([
    'arrow-down','arrow-left','arrow-right','arrow-up','box','package','building','calendar','calendar-event',
    'chart-bar','chart-line','chart-pie','check','circle-check','chevron-down','chevron-left','chevron-right','chevron-up',
    'circle','clipboard-check','clipboard-list','clock','git-branch','door-enter','edit','exclamation-circle',
    'file-text','file-pencil','file-invoice','filter','hash','history','hourglass','inbox','info-circle','stack-2',
    'bulb','map-pin','network','send','plus','receipt','refresh','rocket','route','search','login','logout','sitemap',
    'loader-2','rubber-stamp','timeline','gauge','tag','layout-grid','x','circle-x','trash','beach','user','user-check',
])].sort();

const css = fs.readFileSync('node_modules/@tabler/icons-webfont/tabler-icons.css', 'utf8');

const rules = [];
const codepoints = [];
const missing = [];
for (const name of USED) {
    const re = new RegExp('\\.ti-' + name.replace(/[-]/g, '\\-') + ':before\\s*\\{\\s*content:\\s*"\\\\([0-9a-fA-F]+)"', 'm');
    const m = css.match(re);
    if (!m) { missing.push(name); continue; }
    const hex = m[1].toLowerCase();
    rules.push(`.ti-${name}:before { content: "\\${hex}"; }`);
    codepoints.push('U+' + hex);
}

// 產出精簡 CSS(只用 woff2、只含用到的 61 個 class)
const out = `/* Tabler Icons 子集(僅本專案使用的 ${rules.length} 個圖示)
 * 由 @tabler/icons-webfont 2.47.0 子集化而來 · MIT License
 * 重新產生: 見 scripts/build-icon-font.md
 */
@font-face {
    font-family: 'tabler-icons';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url('./tabler-icons-subset.woff2') format('woff2');
}
.ti {
    font-family: 'tabler-icons' !important;
    font-style: normal;
    font-weight: normal;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    display: inline-block;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
${rules.join('\n')}
`;

fs.mkdirSync('src/assets/fonts', { recursive: true });
fs.writeFileSync('src/assets/fonts/tabler-subset.css', out, 'utf8');
fs.writeFileSync(process.argv[2] || 'unicodes.txt', codepoints.join(','), 'utf8');

console.log(`圖示數: ${rules.length}`);
if (missing.length) console.log('⚠️ 找不到 codepoint:', missing.join(', '));
else console.log('✓ 全部取得 codepoint');
console.log('unicodes 已寫出供 pyftsubset 使用');
