import fs from "node:fs";
import zlib from "node:zlib";

const file = process.argv[2];
const pdf = fs.readFileSync(file, "latin1");

function ascii85Decode(input) {
  let data = input.replace(/\s/g, "");
  const end = data.indexOf("~>");
  if (end !== -1) data = data.slice(0, end);
  const out = [];
  let tuple = [];

  for (const ch of data) {
    if (ch === "z" && tuple.length === 0) {
      out.push(0, 0, 0, 0);
      continue;
    }
    const code = ch.charCodeAt(0);
    if (code < 33 || code > 117) continue;
    tuple.push(code - 33);
    if (tuple.length === 5) {
      let value = 0;
      for (const n of tuple) value = value * 85 + n;
      out.push((value >>> 24) & 255, (value >>> 16) & 255, (value >>> 8) & 255, value & 255);
      tuple = [];
    }
  }

  if (tuple.length) {
    const original = tuple.length;
    while (tuple.length < 5) tuple.push(84);
    let value = 0;
    for (const n of tuple) value = value * 85 + n;
    const bytes = [(value >>> 24) & 255, (value >>> 16) & 255, (value >>> 8) & 255, value & 255];
    out.push(...bytes.slice(0, original - 1));
  }

  return Buffer.from(out);
}

function unescapePdfString(value) {
  return value
    .replace(/\\([nrtbf()\\])/g, (_, ch) => {
      const map = { n: "\n", r: "\r", t: "\t", b: "\b", f: "\f", "(": "(", ")": ")", "\\": "\\" };
      return map[ch] ?? ch;
    })
    .replace(/\\([0-7]{1,3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)));
}

for (const match of pdf.matchAll(/<<(.*?)>>\s*stream\r?\n([\s\S]*?)\r?\nendstream/g)) {
  const dict = match[1];
  let stream = Buffer.from(match[2], "latin1");
  try {
    if (dict.includes("ASCII85Decode")) stream = ascii85Decode(stream.toString("latin1"));
    if (dict.includes("FlateDecode")) stream = zlib.inflateSync(stream);
  } catch {
    continue;
  }

  const content = stream.toString("latin1");
  const parts = [];
  for (const text of content.matchAll(/\((?:\\.|[^\\)])*\)\s*Tj/g)) {
    parts.push(unescapePdfString(text[0].replace(/\)\s*Tj$/, "").slice(1)));
  }
  for (const arrayText of content.matchAll(/\[((?:.|\n)*?)\]\s*TJ/g)) {
    for (const text of arrayText[1].matchAll(/\((?:\\.|[^\\)])*\)/g)) {
      parts.push(unescapePdfString(text[0].slice(1, -1)));
    }
  }
  if (parts.length) console.log(parts.join("\n"));
}
