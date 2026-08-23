import fs from "node:fs";
import path from "node:path";

const root = path.resolve("..");
const outDir = path.resolve("src/pages");

const pages = [
  { file: "index.html", name: "Home", component: "HomePage" },
  { file: "about.html", name: "About", component: "AboutPage" },
  { file: "menu.html", name: "Menu", component: "MenuPage" },
  { file: "reservation.html", name: "Reservation", component: "ReservationPage" },
  { file: "contact.html", name: "Contact", component: "ContactPage" },
];

function htmlToJsx(html) {
  let jsx = html;

  jsx = jsx.replace(/<!--[\s\S]*?-->/g, "");

  jsx = jsx.replace(/\sclass=/g, " className=");
  jsx = jsx.replace(/\sfor=/g, " htmlFor=");
  jsx = jsx.replace(/\sallowfullscreen/gi, " allowFullScreen");
  jsx = jsx.replace(/\sreferrerpolicy=/gi, " referrerPolicy=");
  jsx = jsx.replace(/\sautocomplete=/gi, " autoComplete=");
  jsx = jsx.replace(/\sreadonly/gi, " readOnly");
  jsx = jsx.replace(/\smaxlength=/gi, " maxLength=");
  jsx = jsx.replace(/\sminlength=/gi, " minLength=");
  jsx = jsx.replace(/\stabindex=/gi, " tabIndex=");
  jsx = jsx.replace(/\scolspan=/gi, " colSpan=");
  jsx = jsx.replace(/\srowspan=/gi, " rowSpan=");
  jsx = jsx.replace(/\scellpadding=/gi, " cellPadding=");
  jsx = jsx.replace(/\scellspacing=/gi, " cellSpacing=");
  jsx = jsx.replace(/\sframeborder=/gi, " frameBorder=");
  jsx = jsx.replace(/\scharset=/gi, " charSet=");

  jsx = jsx.replace(/src="\.\/assets\//g, 'src="/assets/');
  jsx = jsx.replace(/href="\.\/index\.html"/g, 'href="/"');
  jsx = jsx.replace(/href="\.\/about\.html"/g, 'href="/about"');
  jsx = jsx.replace(/href="\.\/menu\.html"/g, 'href="/menu"');
  jsx = jsx.replace(/href="\.\/reservation\.html"/g, 'href="/reservation"');
  jsx = jsx.replace(/href="\.\/contact\.html"/g, 'href="/contact"');

  jsx = jsx.replace(
    /style="border:0;"/g,
    'style={{ border: 0 }}'
  );

  jsx = jsx.replace(/<(img|input|br|hr|col|source|embed|track|wbr)([^>]*?)\s*>/gi, (match, tag, attrs) => {
    if (attrs.trim().endsWith("/")) return match;
    return `<${tag}${attrs} />`;
  });

  return jsx.trim();
}

fs.mkdirSync(outDir, { recursive: true });

for (const page of pages) {
  const raw = fs.readFileSync(path.join(root, page.file), "utf8");
  const match = raw.match(/<main[\s\S]*?<\/main>/);
  if (!match) throw new Error(`No <main> in ${page.file}`);
  const jsx = htmlToJsx(match[0]);
  const source = `export default function ${page.component}() {
  return (
    ${jsx}
  );
}
`;
  fs.writeFileSync(path.join(outDir, `${page.component}.jsx`), source);
  console.log("wrote", page.component);
}
