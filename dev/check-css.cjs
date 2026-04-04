const css = require("fs").readFileSync("./dist/quikchat.css", "utf8");
const structural = new Set(["padding", "font-size", "font-weight", "font-family", "line-height",
    "cursor", "margin-left", "margin-right", "margin", "display", "flex-grow", "flex-shrink",
    "flex", "width", "height", "min-width", "min-height", "max-width", "max-height",
    "overflow", "overflow-y", "resize", "white-space", "word-wrap"]);

const themeRegex = /(\.quikchat-theme-\w+[^{]*)\{([^}]+)\}/g;
let match;
const violations = [];
while ((match = themeRegex.exec(css)) !== null) {
    const selector = match[1].trim();
    const body = match[2];
    const props = body.match(/([\w-]+)\s*:/g) || [];
    for (const p of props) {
        const propName = p.replace(":", "").trim();
        if (structural.has(propName)) {
            violations.push({ selector, property: propName });
        }
    }
}

if (violations.length > 0) {
    console.log("STRUCTURAL PROPERTIES IN THEMES (to remove):");
    violations.forEach(v => console.log("  " + v.selector + " -> " + v.property));
} else {
    console.log("All themes are clean — appearance only.");
}

const baseSection = css.substring(0, css.indexOf("quikchat-theme"));
console.log("");
console.log("BASE SECTION CHECKLIST:");
console.log("  font-size on .quikchat-base: " + /\.quikchat-base[^{]*\{[^}]*font-size/.test(baseSection));
console.log("  line-height: " + /line-height/.test(baseSection));
console.log("  font-family inherit on form controls: " + /font-family:\s*inherit/.test(baseSection));
console.log("  .quikchat-user-label class: " + /quikchat-user-label/.test(baseSection));
console.log("  .quikchat-message-content class (JS only, no CSS rule needed): ok");
console.log("  :focus styles: " + /:focus/.test(baseSection));
