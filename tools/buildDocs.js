#!/usr/bin/env node

/**
 * buildDocs.js - Convert markdown documentation to HTML
 * 
 * This script converts all markdown files to HTML with proper formatting,
 * syntax highlighting, and character encoding.
 */

import fs from 'fs/promises';
import path from 'path';
import { marked } from 'marked';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

// HTML template for documentation pages
const htmlTemplate = (title, content, cssPath = 'https://unpkg.com/github-markdown-css@5/github-markdown.css') => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - QuikChat Documentation</title>
    <link rel="stylesheet" href="${cssPath}">
    <link rel="stylesheet" href="https://unpkg.com/prismjs@1/themes/prism.css">
    <style>
        body {
            box-sizing: border-box;
            min-width: 200px;
            max-width: 980px;
            margin: 0 auto;
            padding: 45px;
        }
        .markdown-body {
            box-sizing: border-box;
            min-width: 200px;
            max-width: 980px;
            margin: 0 auto;
        }
        @media (max-width: 767px) {
            body { padding: 15px; }
        }
        /* Ensure emojis display properly */
        .markdown-body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
        }
        /* Code block styling */
        pre {
            background-color: #f6f8fa;
            border-radius: 6px;
            padding: 16px;
            overflow: auto;
        }
        code {
            background-color: rgba(175, 184, 193, 0.2);
            padding: 0.2em 0.4em;
            border-radius: 3px;
            font-size: 85%;
        }
        pre code {
            background-color: transparent;
            padding: 0;
        }
        /* Table styling */
        table {
            border-collapse: collapse;
            width: 100%;
            margin-top: 16px;
            margin-bottom: 16px;
        }
        table th, table td {
            border: 1px solid #d0d7de;
            padding: 6px 13px;
        }
        table tr:nth-child(2n) {
            background-color: #f6f8fa;
        }
    </style>
    <script src="https://unpkg.com/prismjs@1/components/prism-core.min.js"></script>
    <script src="https://unpkg.com/prismjs@1/plugins/autoloader/prism-autoloader.min.js"></script>
</head>
<body>
    <article class="markdown-body">
        ${content}
    </article>
    <script>
        // Syntax highlighting
        if (typeof Prism !== 'undefined') {
            Prism.highlightAll();
        }
    </script>
</body>
</html>`;

// Configure marked options
marked.setOptions({
    gfm: true,           // GitHub Flavored Markdown
    breaks: true,        // Convert \n to <br>
    headerIds: true,     // Add IDs to headers for navigation
    mangle: false,       // Don't mangle email addresses
    sanitize: false,     // Allow HTML in markdown
    smartLists: true,    // Better list behavior
    smartypants: false,  // Don't convert quotes and dashes
    xhtml: false         // Use HTML5
});

/**
 * Convert a markdown file to HTML
 */
async function convertMarkdownToHtml(mdPath, htmlPath, title) {
    try {
        // Read markdown file
        const markdown = await fs.readFile(mdPath, 'utf8');
        
        // Convert to HTML
        const htmlContent = marked(markdown);
        
        // Wrap in template
        const fullHtml = htmlTemplate(title, htmlContent);
        
        // Write HTML file
        await fs.writeFile(htmlPath, fullHtml, 'utf8');
        
        console.log(`✅ Converted: ${path.basename(mdPath)} → ${path.basename(htmlPath)}`);
    } catch (error) {
        console.error(`❌ Error converting ${mdPath}:`, error.message);
    }
}

/**
 * Main function to convert all documentation
 */
async function buildDocs() {
    console.log('🔨 Building documentation HTML files...\n');
    
    // Convert README.md to index.html
    await convertMarkdownToHtml(
        path.join(projectRoot, 'README.md'),
        path.join(projectRoot, 'index.html'),
        'QuikChat - Zero-dependency JavaScript Chat Widget'
    );
    
    // Convert all markdown files in docs/ folder
    const docsDir = path.join(projectRoot, 'docs');
    
    try {
        const files = await fs.readdir(docsDir);
        
        for (const file of files) {
            if (file.endsWith('.md')) {
                const mdPath = path.join(docsDir, file);
                const htmlFile = file.replace('.md', '.html');
                const htmlPath = path.join(docsDir, htmlFile);
                const title = file.replace('.md', '').replace(/-/g, ' ')
                    .replace(/\b\w/g, c => c.toUpperCase());
                
                await convertMarkdownToHtml(mdPath, htmlPath, title);
            }
        }
    } catch (error) {
        console.error('❌ Error reading docs directory:', error.message);
    }
    
    // Create docs/index.html as a documentation hub
    const docsIndexContent = `
# QuikChat Documentation

Welcome to the QuikChat documentation hub.

## 📚 Documentation

- [API Reference](./API-REFERENCE.html) - Complete technical reference for all methods and options
- [Developer Guide](./DEVELOPER-GUIDE.html) - Practical recipes and advanced patterns  
- [Release Notes](./release-notes.html) - Version history and changelog

## 🔗 Quick Links

- [Main Project Page](../) - Return to QuikChat homepage
- [GitHub Repository](https://github.com/deftio/quikchat) - Source code and issues
- [NPM Package](https://www.npmjs.com/package/quikchat) - Package information
- [Live Examples](https://deftio.github.io/quikchat/examples/) - Interactive demos

## 🚀 Getting Started

\`\`\`bash
npm install quikchat
\`\`\`

\`\`\`javascript
import quikchat from 'quikchat';
import 'quikchat/dist/quikchat.css';

const chat = new quikchat('#chat', (instance, message) => {
    console.log('User said:', message);
});
\`\`\`
`;
    
    const docsIndexHtml = htmlTemplate(
        'Documentation Hub',
        marked(docsIndexContent)
    );
    
    await fs.writeFile(
        path.join(docsDir, 'index.html'),
        docsIndexHtml,
        'utf8'
    );
    console.log('✅ Created: docs/index.html (documentation hub)');
    
    console.log('\n✨ Documentation build complete!');
}

// Run the build
buildDocs().catch(console.error);