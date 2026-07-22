const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const webRoot = path.join(__dirname, "..", "..");
const read = (file) => fs.readFileSync(path.join(webRoot, file), "utf8");
const html = read("index.html");
const app = read("app.js");
const css = read("style.css");
const books = JSON.parse(read("books.json"));

test("books.json is the only full book collection and loading has an explicit retry", () => {
  assert.equal(Array.isArray(books), true);
  assert.ok(books.length > 1);
  assert.doesNotMatch(app, /fallbackBooks/);
  assert.match(app, /fetch\("\.\/books\.json", \{ cache: "no-store" \}\)/);
  assert.match(app, /retryBooksButton\.addEventListener\("click", loadBooks\)/);
  assert.match(html, /id="bookLoadStatus"/);
  assert.match(html, /id="retryBooksButton"/);
});

test("all required runtime assets exist and planned book covers keep a visual fallback", () => {
  const sources = [app, css];
  const assetPaths = new Set();
  for (const source of sources) {
    for (const match of source.matchAll(/\.\/assets\/[A-Za-z0-9_./-]+/g)) {
      assetPaths.add(match[0].replace(/^\.\//, ""));
    }
  }
  const missing = Array.from(assetPaths).filter((assetPath) => !fs.existsSync(path.join(webRoot, assetPath)));
  assert.deepEqual(missing, []);
  assert.match(app, /image\.onerror = \(\) =>/);
  assert.match(app, /linear-gradient\(135deg, \$\{nextBook\.coverA\}, \$\{nextBook\.coverB\}\)/);
});

test("teacher image-prompt view supports filtering, selection, copy, and UTF-8 TXT export", () => {
  for (const id of [
    "teacherPromptViewTab",
    "teacherPromptDateFilter",
    "teacherPromptSelectAllButton",
    "teacherPromptClearSelectionButton",
    "teacherPromptCopyButton",
    "teacherPromptExportButton",
    "teacherPromptList"
  ]) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(app, /record\.type === "titleScenarioSubmission"/);
  assert.match(app, /navigator\.clipboard\.writeText\(text\)/);
  assert.match(app, /new Blob\(\["\\uFEFF", text\], \{ type: "text\/plain;charset=utf-8" \}\)/);
  for (const label of ["제출 일시:", "학생:", "책:", "이미지 생성 프롬프트:"]) {
    assert.match(app, new RegExp(label));
  }
});

test("title and activity layouts keep the requested responsive scroll contracts", () => {
  assert.match(html, /<h1><span>한 권으로의<\/span> <span>모험<\/span><\/h1>/);
  assert.match(css, /\.hero-copy h1 span\s*\{[^}]*white-space:\s*nowrap/s);
  assert.match(css, /\.dialogue-box\s*\{[^}]*right:\s*calc\(var\(--hud-width\) \+ 16px\)/s);
  assert.match(css, /\.character-chat-profile-grid\s*\{[^}]*overflow-y:\s*auto/s);
  assert.match(css, /\.character-chat-log\s*\{[^}]*overflow-y:\s*auto/s);
  assert.match(css, /scrollbar-color:\s*#d9af62 #26140c/);
  assert.match(css, /\.character-chat-selector\s*\{\s*min-height:\s*260px/s);
  assert.match(css, /\.character-chat-room\s*\{\s*height:\s*min\(460px, calc\(var\(--app-height\) - 116px\)\)/s);
  assert.match(html, /id="characterChatProfileGrid" tabindex="0"/);
  assert.match(html, /id="characterChatLog" tabindex="0"/);
});
