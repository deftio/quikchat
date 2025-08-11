#!/usr/bin/env node

/**
 * Performance test for QuikChat virtual scrolling
 * Run with: node test/perf-test.js
 */

const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// Read the QuikChat library
const quikchatCode = fs.readFileSync(path.join(__dirname, '../dist/quikchat.umd.js'), 'utf8');
const quikchatCSS = fs.readFileSync(path.join(__dirname, '../dist/quikchat.css'), 'utf8');

// Create a virtual DOM
const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<head>
    <style>${quikchatCSS}</style>
</head>
<body>
    <div id="chat1" style="height: 500px;"></div>
    <div id="chat2" style="height: 500px;"></div>
</body>
</html>
`, {
    runScripts: 'dangerously',
    resources: 'usable'
});

const window = dom.window;
const document = window.document;

// Inject QuikChat into the virtual DOM
const scriptEl = document.createElement('script');
scriptEl.textContent = quikchatCode;
document.head.appendChild(scriptEl);

// Wait for DOM to be ready
setTimeout(() => {
    const quikchat = window.quikchat;
    
    if (!quikchat) {
        console.error('QuikChat not loaded!');
        process.exit(1);
    }
    
    console.log('QuikChat loaded, version:', quikchat.version());
    console.log('\n=== Performance Test Starting ===\n');
    
    // Test different message counts
    const testCounts = [100, 1000, 5000, 10000];
    
    testCounts.forEach(count => {
        console.log(`\nTesting with ${count} messages:`);
        console.log('-'.repeat(40));
        
        // Test standard mode
        const chat1 = new quikchat('#chat1', null, {
            theme: 'quikchat-theme-light',
            virtualScrolling: false
        });
        
        const startStandard = Date.now();
        for (let i = 0; i < count; i++) {
            chat1.messageAddNew(
                `Message #${i}: This is a test message with some content.`,
                i % 2 === 0 ? 'User' : 'Bot',
                i % 2 === 0 ? 'right' : 'left',
                'user',
                false  // Don't scroll
            );
        }
        const endStandard = Date.now();
        const standardTime = endStandard - startStandard;
        const standardNodes = document.querySelectorAll('#chat1 .quikchat-message').length;
        
        // Test virtual scrolling mode
        const chat2 = new quikchat('#chat2', null, {
            theme: 'quikchat-theme-light',
            virtualScrolling: true
        });
        
        const startVirtual = Date.now();
        for (let i = 0; i < count; i++) {
            chat2.messageAddNew(
                `Message #${i}: This is a test message with some content.`,
                i % 2 === 0 ? 'User' : 'Bot',
                i % 2 === 0 ? 'right' : 'left',
                'user',
                false  // Don't scroll
            );
        }
        const endVirtual = Date.now();
        const virtualTime = endVirtual - startVirtual;
        const virtualNodes = document.querySelectorAll('#chat2 .quikchat-message').length;
        
        // Calculate improvement
        const improvement = ((standardTime - virtualTime) / standardTime * 100).toFixed(1);
        const nodeReduction = ((standardNodes - virtualNodes) / standardNodes * 100).toFixed(1);
        
        console.log(`Standard Mode:`);
        console.log(`  Time: ${standardTime}ms`);
        console.log(`  DOM Nodes: ${standardNodes}`);
        console.log(`  Rate: ${(count / (standardTime / 1000)).toFixed(0)} msg/s`);
        
        console.log(`\nVirtual Scrolling:`);
        console.log(`  Time: ${virtualTime}ms`);
        console.log(`  DOM Nodes: ${virtualNodes}`);
        console.log(`  Rate: ${(count / (virtualTime / 1000)).toFixed(0)} msg/s`);
        
        console.log(`\nImprovement:`);
        console.log(`  Speed: ${improvement}% faster`);
        console.log(`  DOM Reduction: ${nodeReduction}% fewer nodes`);
        
        // Clear for next test
        chat1.historyClear();
        chat2.historyClear();
    });
    
    console.log('\n=== Performance Test Complete ===\n');
    process.exit(0);
    
}, 1000);