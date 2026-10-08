// 주간 리포트 워드 파일 만들기
// 사용법 (작업파일 폴더에서): node make_report.js <리포트.json> <저장할 .docx 경로>
// 글꼴 맑은 고딕, 표 테두리. 마지막 안내 문장은 이 프로그램에 고정되어 있다.
const fs = require("fs");
const path = require("path");
const {
  AlignmentType, BorderStyle, Document, HeadingLevel, Packer, Paragraph,
  ShadingType, Table, TableCell, TableRow, TextRun, WidthType,
} = require("docx");

const FONT = "맑은 고딕";
const DARK = "1F4E78";
const HEAD_BG = "DDEBF7";
const LINE = { style: BorderStyle.SINGLE, size: 6, color: "7F8C8D" };
const BORDERS = { top: LINE, bottom: LINE, left: LINE, right: LINE, insideHorizontal: LINE, insideVertical: LINE };
const CHECK_LINE = "이 문서의 숫자는 AI가 옮겨 적은 것입니다. 쓰기 전에 GA4 화면의 숫자와 직접 한 번 대조해 주세요.";

const run = (text, o = {}) => new TextRun({ text: String(text ?? ""), font: FONT, size: o.size || 22, bold: o.bold, color: o.color });
const para = (text, o = {}) => new Paragraph({ children: [run(text, o)], spacing: { after: o.after ?? 80 }, alignment: o.align });
const heading = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 },
  children: [run(text, { size: 28, bold: true, color: DARK })],
});
const cell = (text, head) => new TableCell({
  children: [new Paragraph({ children: [run(text, { bold: head })] })],
  shading: head ? { type: ShadingType.CLEAR, color: "auto", fill: HEAD_BG } : undefined,
  margins: { top: 50, bottom: 50, left: 100, right: 100 },
});
const table = (header, rows) => new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  borders: BORDERS,
  rows: [new TableRow({ tableHeader: true, children: header.map((h) => cell(h, true)) }),
    ...rows.map((r) => new TableRow({ children: r.map((v) => cell(v, false)) }))],
});

function main() {
  const [src, out] = process.argv.slice(2);
  if (!src || !out) throw new Error("사용법: node make_report.js <리포트.json> <저장할 .docx>");
  const d = JSON.parse(fs.readFileSync(src, "utf8"));
  const body = [
    new Paragraph({ spacing: { after: 200 }, children: [run(d.title, { size: 40, bold: true, color: DARK })] }),
    para(`기간: ${d.period}`),
    para(`만든 날: ${d.made}`),
    para(`사이트: ${d.site || "확인 안 됨"}`),
    para(`숫자 출처: ${d.source}`, { after: 200 }),
    heading("1. 이번 주 숫자"),
    table(["항목", "이번 주", "메모"], d.numbers),
    para("", { after: 80 }),
    table(["상위 유입 소스", "세션"], d.sources),
    heading("2. 해석 세 줄"),
    ...d.interpret.map((t) => para(`· ${t}`)),
    heading("3. 다음 주 할 일"),
    ...d.todo.map((t, i) => para(`${i + 1}. ${t}`)),
    heading("4. 기준점 비교 (검색 결과에 내 이름이 나온 질문 수)"),
    table(["기준점 문서", "내 이름 O 개수"], d.baseline.rows),
    para(d.baseline.note, { after: 200 }),
    para(CHECK_LINE, { bold: true, color: "B91C1C" }),
  ];
  const doc = new Document({
    styles: { default: { document: { run: { font: FONT, size: 22 } } } },
    sections: [{ properties: { page: { margin: { top: 850, bottom: 850, left: 1000, right: 1000 } } }, children: body }],
  });
  Packer.toBuffer(doc).then((buf) => {
    fs.writeFileSync(out, buf);
    console.log("저장:", path.resolve(out));
  });
}

main();
