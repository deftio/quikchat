import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testPerformance() {
    const browser = await chromium.launch({ 
        headless: false,  // Set to true for CI
        devtools: true    // Open devtools to see console
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Enable console logging
    page.on('console', msg => {
        console.log('Browser console:', msg.type(), msg.text());
    });
    
    page.on('pageerror', error => {
        console.error('Page error:', error);
    });
    
    // Navigate to test page
    const testFile = `file://${path.resolve(__dirname, 'test-performance-comparison.html')}`;
    console.log('Loading:', testFile);
    await page.goto(testFile);
    
    // Wait for page to load
    await page.waitForTimeout(1000);
    
    // Test 1: Check if QuikChat loaded
    const quikchatExists = await page.evaluate(() => {
        return typeof quikchat !== 'undefined';
    });
    console.log('QuikChat loaded:', quikchatExists);
    
    // Test 2: Check if sanitizers exist
    const sanitizersExist = await page.evaluate(() => {
        return typeof quikchat !== 'undefined' && quikchat.sanitizers !== undefined;
    });
    console.log('Sanitizers available:', sanitizersExist);
    
    // Test 3: Try adding a small number of messages first
    console.log('\n--- Testing with 10 messages ---');
    const smallTestResult = await page.evaluate(() => {
        const startTime = performance.now();
        
        // Create a simple chat
        const testDiv = document.createElement('div');
        testDiv.id = 'test-chat';
        document.body.appendChild(testDiv);
        
        const chat = new quikchat('#test-chat', null, {
            virtualScrolling: true,
            virtualScrollingThreshold: 500
        });
        
        // Add 10 messages
        for (let i = 0; i < 10; i++) {
            chat.messageAddNew('Test message ' + i, 'User', 'right');
        }
        
        const endTime = performance.now();
        
        return {
            success: true,
            time: endTime - startTime,
            messageCount: chat.historyGetLength(),
            virtualScrolling: chat.isVirtualScrollingEnabled()
        };
    });
    
    console.log('Small test result:', smallTestResult);
    
    // Test 4: Try with sanitizer
    console.log('\n--- Testing with sanitizer (10 messages) ---');
    const sanitizerTestResult = await page.evaluate(() => {
        const startTime = performance.now();
        
        // Clear previous test
        const prevTest = document.getElementById('test-chat');
        if (prevTest) prevTest.remove();
        
        const testDiv = document.createElement('div');
        testDiv.id = 'test-chat-sanitizer';
        document.body.appendChild(testDiv);
        
        try {
            const chat = new quikchat('#test-chat-sanitizer', null, {
                virtualScrolling: true,
                virtualScrollingThreshold: 500,
                sanitizer: quikchat.sanitizers.escapeHTML
            });
            
            // Add 10 messages
            for (let i = 0; i < 10; i++) {
                chat.messageAddNew('<b>Test</b> message ' + i, 'User', 'right');
            }
            
            const endTime = performance.now();
            
            // Check if content was sanitized
            const firstMessage = document.querySelector('#test-chat-sanitizer .quikchat-message-content');
            const wasSanitized = firstMessage ? firstMessage.innerHTML.includes('&lt;b&gt;') : false;
            
            return {
                success: true,
                time: endTime - startTime,
                messageCount: chat.historyGetLength(),
                virtualScrolling: chat.isVirtualScrollingEnabled(),
                sanitized: wasSanitized
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    });
    
    console.log('Sanitizer test result:', sanitizerTestResult);
    
    // Test 5: Gradually increase message count to find where it breaks
    console.log('\n--- Finding performance threshold ---');
    const testCounts = [50, 100, 200, 300, 400, 500];
    
    for (const count of testCounts) {
        console.log(`\nTesting with ${count} messages...`);
        
        const result = await Promise.race([
            page.evaluate((messageCount) => {
                const startTime = performance.now();
                
                // Clear previous
                const prevTest = document.getElementById('perf-test');
                if (prevTest) prevTest.remove();
                
                const testDiv = document.createElement('div');
                testDiv.id = 'perf-test';
                testDiv.style.height = '400px';
                testDiv.style.overflow = 'auto';
                document.body.appendChild(testDiv);
                
                try {
                    const chat = new quikchat('#perf-test', null, {
                        virtualScrolling: true,
                        virtualScrollingThreshold: 500
                    });
                    
                    // Add messages in small batches
                    const batchSize = 10;
                    let added = 0;
                    
                    while (added < messageCount) {
                        const batchEnd = Math.min(added + batchSize, messageCount);
                        for (let i = added; i < batchEnd; i++) {
                            chat.messageAddNew('Message ' + i, 'User', i % 2 === 0 ? 'right' : 'left');
                        }
                        added = batchEnd;
                    }
                    
                    const endTime = performance.now();
                    const domNodes = document.querySelectorAll('#perf-test .quikchat-message').length;
                    
                    return {
                        success: true,
                        count: messageCount,
                        time: endTime - startTime,
                        perMessage: (endTime - startTime) / messageCount,
                        domNodes: domNodes,
                        virtualScrolling: chat.isVirtualScrollingEnabled(),
                        historyLength: chat.historyGetLength()
                    };
                } catch (error) {
                    return {
                        success: false,
                        count: messageCount,
                        error: error.message
                    };
                }
            }, count),
            new Promise((resolve) => setTimeout(() => resolve({ 
                success: false, 
                count: count,
                error: 'Timeout after 10 seconds' 
            }), 10000))
        ]);
        
        if (result.success) {
            console.log(`✓ ${count} messages: ${result.time.toFixed(0)}ms (${result.perMessage.toFixed(2)}ms/msg)`);
            console.log(`  DOM nodes: ${result.domNodes}, Virtual scrolling: ${result.virtualScrolling}`);
        } else {
            console.log(`✗ ${count} messages: FAILED - ${result.error}`);
            console.log('  Performance issue detected at this message count');
            break;
        }
    }
    
    // Test 6: Profile the virtual scrolling initialization
    console.log('\n--- Profiling virtual scrolling activation ---');
    const vsProfile = await page.evaluate(() => {
        const testDiv = document.createElement('div');
        testDiv.id = 'vs-test';
        testDiv.style.height = '400px';
        document.body.appendChild(testDiv);
        
        const chat = new quikchat('#vs-test', null, {
            virtualScrolling: true,
            virtualScrollingThreshold: 5  // Very low threshold
        });
        
        const results = [];
        
        // Add messages one by one and check when VS activates
        for (let i = 0; i < 10; i++) {
            const before = chat.isVirtualScrollingEnabled();
            chat.messageAddNew('Message ' + i, 'User', 'right');
            const after = chat.isVirtualScrollingEnabled();
            
            results.push({
                messageNum: i + 1,
                vsBeforeAdd: before,
                vsAfterAdd: after,
                activated: !before && after
            });
            
            if (!before && after) {
                console.log('Virtual scrolling activated at message', i + 1);
            }
        }
        
        return results;
    });
    
    console.log('Virtual scrolling activation profile:');
    vsProfile.forEach(r => {
        if (r.activated) {
            console.log(`  Message ${r.messageNum}: VS ACTIVATED`);
        }
    });
    
    // Keep browser open for manual inspection
    console.log('\n--- Test complete. Browser will close in 5 seconds ---');
    await page.waitForTimeout(5000);
    
    await browser.close();
}

// Run the test
testPerformance().catch(console.error);