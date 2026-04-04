import quikchat from './quikchat.js';
import quikdownBD from 'quikdown/bd';

// CDN URLs for dynamic loading (same as quikdown editor uses)
const CDN = {
    hljs:       'https://unpkg.com/@highlightjs/cdn-assets/highlight.min.js',
    hljsCSS:    'https://unpkg.com/@highlightjs/cdn-assets/styles/github.min.css',
    hljsCSSdark:'https://unpkg.com/@highlightjs/cdn-assets/styles/github-dark.min.css',
    mathjax:    'https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js',
    mermaid:    'https://unpkg.com/mermaid/dist/mermaid.min.js',
    leaflet:    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
    leafletCSS: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    dompurify:  'https://unpkg.com/dompurify/dist/purify.min.js',
};

// Load a script from CDN (cached — only loads once)
const _loaded = {};
function loadScript(src) {
    if (_loaded[src]) return _loaded[src];
    _loaded[src] = new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src;
        s.onload = () => resolve(true);
        s.onerror = () => { _loaded[src] = null; reject(new Error('Failed to load: ' + src)); };
        document.head.appendChild(s);
    });
    return _loaded[src];
}
function loadCSS(href) {
    if (_loaded[href]) return _loaded[href];
    _loaded[href] = new Promise((resolve) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = () => resolve(true);
        document.head.appendChild(link);
        setTimeout(resolve, 1000); // CSS doesn't always fire onload
    });
    return _loaded[href];
}

/**
 * Process fence blocks rendered by quikdown/bd.
 * Detects code blocks with language tags and renders them with the appropriate library.
 * Libraries are loaded from CDN on first use.
 */
async function postProcessMessage(el) {
    if (!el) return;

    // --- Syntax highlighting (highlight.js) ---
    const codeBlocks = el.querySelectorAll('pre.quikdown-pre code[class*="language-"]');
    if (codeBlocks.length > 0) {
        const langSet = new Set();
        codeBlocks.forEach(cb => {
            const match = cb.className.match(/language-(\S+)/);
            if (match) langSet.add(match[1]);
        });

        // Skip languages handled by other renderers
        const specialLangs = new Set(['svg', 'html', 'math', 'tex', 'latex', 'katex', 'mermaid', 'geojson', 'csv', 'tsv', 'psv', 'json', 'json5', 'stl']);
        const needsHljs = [...langSet].some(l => !specialLangs.has(l));

        if (needsHljs && !window.hljs) {
            try {
                await Promise.all([loadScript(CDN.hljs), loadCSS(CDN.hljsCSS)]);
            } catch (_e) { /* continue without highlighting */ }
        }
        if (window.hljs) {
            codeBlocks.forEach(cb => {
                const match = cb.className.match(/language-(\S+)/);
                if (match && !specialLangs.has(match[1]) && !cb.classList.contains('hljs')) {
                    window.hljs.highlightElement(cb);
                }
            });
        }
    }

    // --- SVG (inline, no external lib) ---
    const svgBlocks = el.querySelectorAll('pre.quikdown-pre[data-qd-lang="svg"], pre.quikdown-pre code.language-svg');
    svgBlocks.forEach(block => {
        const pre = block.closest('pre') || block;
        const code = pre.querySelector('code') || pre;
        const svgSource = code.textContent;
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(svgSource, 'image/svg+xml');
            if (!doc.querySelector('parsererror')) {
                const svg = doc.documentElement;
                // Sanitize: remove scripts and event handlers
                svg.querySelectorAll('script').forEach(s => s.remove());
                const walker = document.createTreeWalker(svg, NodeFilter.SHOW_ELEMENT);
                let node = walker.nextNode();
                while (node) {
                    for (let i = node.attributes.length - 1; i >= 0; i--) {
                        const attr = node.attributes[i];
                        if (attr.name.startsWith('on') || attr.value.includes('javascript:')) {
                            node.removeAttribute(attr.name);
                        }
                    }
                    node = walker.nextNode();
                }
                const container = document.createElement('div');
                container.className = 'qde-svg-container';
                container.innerHTML = new XMLSerializer().serializeToString(svg);
                pre.replaceWith(container);
            }
        } catch (_e) { /* leave as code block */ }
    });

    // --- HTML (inline, sanitized with DOMPurify) ---
    const htmlBlocks = el.querySelectorAll('pre.quikdown-pre code.language-html');
    for (const block of htmlBlocks) {
        const pre = block.closest('pre');
        if (!pre) continue;
        // Only render if the code is likely meant as rendered HTML (short snippets)
        // Skip if it looks like documentation (contains doctype, html, head tags)
        const src = block.textContent;
        if (src.match(/<(!DOCTYPE|html|head|body)/i)) continue;

        if (!window.DOMPurify) {
            try { await loadScript(CDN.dompurify); } catch (_e) { continue; }
        }
        if (window.DOMPurify) {
            const container = document.createElement('div');
            container.className = 'qde-html-container';
            container.innerHTML = window.DOMPurify.sanitize(src);
            pre.replaceWith(container);
        }
    }

    // --- Math (MathJax) ---
    // Look for math fences and inline math ($...$, $$...$$)
    const mathBlocks = el.querySelectorAll('pre.quikdown-pre code.language-math, pre.quikdown-pre code.language-tex, pre.quikdown-pre code.language-latex, pre.quikdown-pre code.language-katex');
    const hasInlineMath = el.innerHTML.match(/\$\$[\s\S]+?\$\$|\$[^$\n]+?\$/);

    if (mathBlocks.length > 0 || hasInlineMath) {
        if (!window.MathJax || !window.MathJax.typesetPromise) {
            if (!window.mathJaxLoading) {
                window.mathJaxLoading = true;
                window.MathJax = {
                    loader: { load: ['input/tex', 'output/svg'] },
                    tex: {
                        inlineMath: [['$', '$'], ['\\(', '\\)']],
                        displayMath: [['$$', '$$'], ['\\[', '\\]']],
                        processEscapes: true,
                        processEnvironments: true
                    },
                    options: { renderActions: { addMenu: [] } },
                    svg: { fontCache: 'none' },
                    startup: { typeset: false }
                };
                try { await loadScript(CDN.mathjax); } catch (_e) { /* continue */ }
                window.mathJaxLoading = false;
            }
        }

        // Convert math fence blocks to divs MathJax can process
        mathBlocks.forEach(block => {
            const pre = block.closest('pre');
            if (!pre) return;
            const mathDiv = document.createElement('div');
            mathDiv.className = 'math-display';
            mathDiv.textContent = '$$' + block.textContent + '$$';
            pre.replaceWith(mathDiv);
        });

        if (window.MathJax && window.MathJax.typesetPromise) {
            try { await window.MathJax.typesetPromise([el]); } catch (_e) { /* continue */ }
        }
    }

    // --- Mermaid diagrams ---
    const mermaidBlocks = el.querySelectorAll('pre.quikdown-pre code.language-mermaid');
    if (mermaidBlocks.length > 0) {
        if (!window.mermaid) {
            try {
                await loadScript(CDN.mermaid);
                if (window.mermaid) {
                    window.mermaid.initialize({ startOnLoad: false, theme: 'default' });
                }
            } catch (_e) { /* continue without mermaid */ }
        }
        if (window.mermaid) {
            for (const block of mermaidBlocks) {
                const pre = block.closest('pre');
                if (!pre) continue;
                const container = document.createElement('div');
                container.className = 'qde-mermaid-container';
                const mermaidId = 'mermaid-' + Math.random().toString(36).substring(2, 9);
                try {
                    const { svg } = await window.mermaid.render(mermaidId, block.textContent);
                    container.innerHTML = svg;
                    pre.replaceWith(container);
                } catch (_e) { /* leave as code block */ }
            }
        }
    }

    // --- GeoJSON / Leaflet maps ---
    const geoBlocks = el.querySelectorAll('pre.quikdown-pre code.language-geojson');
    if (geoBlocks.length > 0) {
        if (!window.L) {
            try { await Promise.all([loadScript(CDN.leaflet), loadCSS(CDN.leafletCSS)]); } catch (_e) { /* continue */ }
        }
        if (window.L) {
            for (const block of geoBlocks) {
                const pre = block.closest('pre');
                if (!pre) continue;
                try {
                    const geojson = JSON.parse(block.textContent);
                    const container = document.createElement('div');
                    container.className = 'qde-geojson-container';
                    container.style.cssText = 'height: 300px; width: 100%; border-radius: 4px;';
                    pre.replaceWith(container);
                    const map = window.L.map(container);
                    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; OpenStreetMap'
                    }).addTo(map);
                    const layer = window.L.geoJSON(geojson).addTo(map);
                    map.fitBounds(layer.getBounds());
                } catch (_e) { /* leave as code block */ }
            }
        }
    }

    // --- CSV / TSV / PSV tables ---
    const tableBlocks = el.querySelectorAll('pre.quikdown-pre code.language-csv, pre.quikdown-pre code.language-tsv, pre.quikdown-pre code.language-psv');
    tableBlocks.forEach(block => {
        const pre = block.closest('pre');
        if (!pre) return;
        const lang = block.className.match(/language-(csv|tsv|psv)/);
        if (!lang) return;
        const delim = { csv: ',', tsv: '\t', psv: '|' }[lang[1]];
        const lines = block.textContent.trim().split('\n');
        if (lines.length < 2) return;
        try {
            const table = document.createElement('table');
            table.className = 'quikdown-table';
            lines.forEach((line, i) => {
                const row = document.createElement('tr');
                const cells = line.split(delim).map(c => c.trim());
                cells.forEach(cell => {
                    const td = document.createElement(i === 0 ? 'th' : 'td');
                    td.className = i === 0 ? 'quikdown-th' : 'quikdown-td';
                    td.textContent = cell;
                    row.appendChild(td);
                });
                table.appendChild(row);
            });
            pre.replaceWith(table);
        } catch (_e) { /* leave as code block */ }
    });

    // --- JSON pretty-print ---
    const jsonBlocks = el.querySelectorAll('pre.quikdown-pre code.language-json, pre.quikdown-pre code.language-json5');
    jsonBlocks.forEach(block => {
        try {
            const obj = JSON.parse(block.textContent);
            block.textContent = JSON.stringify(obj, null, 2);
            // If hljs is loaded, re-highlight
            if (window.hljs && window.hljs.getLanguage('json')) {
                window.hljs.highlightElement(block);
            }
        } catch (_e) { /* not valid JSON, leave as is */ }
    });
}


/**
 * quikchat-md-full: batteries-included build.
 * Uses quikdown/bd for markdown parsing, then post-processes fence blocks
 * with dynamically loaded renderers (highlight.js, MathJax, Mermaid, Leaflet, etc.).
 */
class quikchatMDFull extends quikchat {
    constructor(parentElement, onSend, options = {}) {
        if (!options.messageFormatter) {
            options.messageFormatter = (content) => quikdownBD(content);
        }
        super(parentElement, onSend, options);
    }

    // Override message methods to add post-processing
    messageAddNew(content = "", userString = "user", align = "right", role = "user") {
        const id = super.messageAddNew(content, userString, align, role);
        const el = this.messageGetDOMObject(id);
        if (el) {
            postProcessMessage(el.querySelector('.quikchat-message-content'));
        }
        return id;
    }

    messageAddFull(input) {
        const id = super.messageAddFull(input);
        const el = this.messageGetDOMObject(id);
        if (el) {
            postProcessMessage(el.querySelector('.quikchat-message-content'));
        }
        return id;
    }

    messageAppendContent(n, content) {
        const result = super.messageAppendContent(n, content);
        if (result) {
            const el = this.messageGetDOMObject(n);
            if (el) {
                postProcessMessage(el.querySelector('.quikchat-message-content'));
            }
        }
        return result;
    }

    messageReplaceContent(n, content) {
        const result = super.messageReplaceContent(n, content);
        if (result) {
            const el = this.messageGetDOMObject(n);
            if (el) {
                postProcessMessage(el.querySelector('.quikchat-message-content'));
            }
        }
        return result;
    }

    destroy() {
        // No hidden container to clean up in this approach
    }
}

// Expose quikdown bd and post-processor for direct access
quikchatMDFull.quikdown = quikdownBD;
quikchatMDFull.postProcessMessage = postProcessMessage;

export default quikchatMDFull;
