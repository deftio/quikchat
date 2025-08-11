const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('QuikChat Virtual Scrolling with Sanitizer', () => {
    test('virtual scrolling activates at threshold with sanitizer enabled', async ({ page }) => {
        const filePath = `file://${path.resolve(__dirname, 'test-virtual-scrolling-sanitizer.html')}`;
        await page.goto(filePath);
        
        // Wait for quikchat to initialize
        await page.waitForFunction(() => typeof window.quikchat !== 'undefined');
        
        // Add messages below threshold
        await page.click('button:text("Add 100 Messages")');
        await page.waitForTimeout(200);
        
        // Check virtual scrolling is not active for first chat (100 < 500 threshold)
        let isVirtualActive = await page.evaluate(() => {
            const chat1 = window.chat1;
            return chat1 && chat1.isVirtualScrollingEnabled();
        });
        expect(isVirtualActive).toBe(false);
        
        // Add more messages to exceed threshold
        await page.click('button:text("Add 500 Messages")');
        await page.waitForTimeout(500);
        
        // Check virtual scrolling is now active (600 > 500 threshold)
        isVirtualActive = await page.evaluate(() => {
            const chat1 = window.chat1;
            return chat1 && chat1.isVirtualScrollingEnabled();
        });
        expect(isVirtualActive).toBe(true);
        
        // Verify sanitizer is working - check that script tags are escaped
        const sanitizedContent = await page.evaluate(() => {
            const messages = document.querySelectorAll('#chat1 .quikchat-message');
            return Array.from(messages).some(msg => {
                const text = msg.textContent;
                const html = msg.innerHTML;
                // Check that script tags appear as text but not as actual HTML tags
                return text.includes('script') && text.includes('alert') && 
                       html.includes('&lt;script&gt;');
            });
        });
        expect(sanitizedContent).toBe(true);
    });
    
    test('performance remains good with thousands of messages', async ({ page }) => {
        const filePath = `file://${path.resolve(__dirname, 'test-long-messages.html')}`;
        await page.goto(filePath);
        
        // Wait for chat instance to initialize
        await page.waitForFunction(() => typeof window.chat !== 'undefined');
        
        // Add many messages
        const startTime = Date.now();
        await page.click('button:text("Add 1000 Mixed")');
        await page.waitForTimeout(1000);
        
        const loadTime = Date.now() - startTime;
        
        // Check that loading was reasonably fast (under 5 seconds)
        expect(loadTime).toBeLessThan(5000);
        
        // Verify virtual scrolling is active
        const stats = await page.evaluate(() => {
            const chatInstance = window.chat;
            return {
                isVirtual: chatInstance && chatInstance.isVirtualScrollingEnabled(),
                messageCount: chatInstance ? chatInstance.historyGetLength() : 0,
                domNodes: document.querySelectorAll('.quikchat-message').length
            };
        });
        
        expect(stats.isVirtual).toBe(true);
        expect(stats.messageCount).toBeGreaterThan(900);
        // Virtual scrolling should limit DOM nodes
        expect(stats.domNodes).toBeLessThan(100);
    });
    
    test('scroll to bottom works with virtual scrolling', async ({ page }) => {
        const filePath = `file://${path.resolve(__dirname, 'test-virtual-scrolling-sanitizer.html')}`;
        await page.goto(filePath);
        
        // Wait for quikchat to initialize
        await page.waitForFunction(() => typeof window.quikchat !== 'undefined');
        
        // Add enough messages to activate virtual scrolling
        await page.click('button:text("Add 500 Messages")');
        await page.waitForTimeout(1500);
        
        // Scroll to top first
        await page.evaluate(() => {
            const messagesArea = document.querySelector('#chat1 .quikchat-messages-area');
            if (messagesArea) {
                messagesArea.scrollTop = 0;
            }
        });
        
        await page.waitForTimeout(300);
        
        // Verify we're NOT at the bottom after scrolling to top
        const notAtBottom = await page.evaluate(() => {
            const messagesArea = document.querySelector('#chat1 .quikchat-messages-area');
            if (!messagesArea) return false;
            return messagesArea.scrollTop < 100;
        });
        expect(notAtBottom).toBe(true);
        
        // Use the messageScrollToBottom function
        await page.evaluate(() => {
            if (window.chat1) {
                window.chat1.messageScrollToBottom();
            }
        });
        await page.waitForTimeout(800);
        
        // Verify scroll moved down significantly
        const scrolledDown = await page.evaluate(() => {
            const messagesArea = document.querySelector('#chat1 .quikchat-messages-area');
            if (!messagesArea) return false;
            // Check if we scrolled down at least to near the bottom
            const distanceFromBottom = messagesArea.scrollHeight - messagesArea.scrollTop - messagesArea.clientHeight;
            return distanceFromBottom < 200; // Allow some tolerance
        });
        
        expect(scrolledDown).toBe(true);
    });
    
    test('message append works with virtual scrolling and sanitizer', async ({ page }) => {
        const filePath = `file://${path.resolve(__dirname, 'test-virtual-scrolling-sanitizer.html')}`;
        await page.goto(filePath);
        
        // Wait for quikchat to initialize
        await page.waitForFunction(() => typeof window.quikchat !== 'undefined');
        
        // Add enough messages to activate virtual scrolling
        await page.click('button:text("Add 500 Messages")');
        await page.waitForTimeout(1000);
        
        // Get last message ID before append
        const lastMsgId = await page.evaluate(() => {
            const chat1 = window.chat1;
            if (!chat1) return null;
            const length = chat1.historyGetLength();
            const lastMsg = chat1.historyGetMessage(length - 1);
            return lastMsg ? lastMsg.msgid : null;
        });
        
        // Append to last message
        await page.evaluate((msgId) => {
            const chat1 = window.chat1;
            if (chat1 && msgId) {
                chat1.messageAppendContent(msgId, ' - APPENDED TEXT');
            }
        }, lastMsgId);
        
        await page.waitForTimeout(200);
        
        // Verify the append worked
        const appendWorked = await page.evaluate(() => {
            const chat1 = window.chat1;
            if (!chat1) return false;
            const lastMessage = chat1.historyGetMessage(chat1.historyGetLength() - 1);
            return lastMessage && lastMessage.content.includes('APPENDED TEXT');
        });
        
        expect(appendWorked).toBe(true);
    });
});

test.describe('QuikChat Sanitizer Security', () => {
    test('XSS attempts are properly sanitized', async ({ page }) => {
        const filePath = `file://${path.resolve(__dirname, 'test-virtual-scrolling-sanitizer.html')}`;
        await page.goto(filePath);
        
        // Wait for quikchat to initialize
        await page.waitForFunction(() => typeof window.quikchat !== 'undefined');
        
        // Monitor for any alert dialogs (which would indicate XSS)
        let alertFired = false;
        page.on('dialog', async dialog => {
            alertFired = true;
            await dialog.dismiss();
        });
        
        // Add messages with XSS attempts
        await page.click('button:text("Test XSS Content")');
        await page.waitForTimeout(500);
        
        // Check that no alerts were triggered
        expect(alertFired).toBe(false);
        
        // Verify script tags are visible as text, not executed
        const scriptVisible = await page.evaluate(() => {
            const messages = document.querySelectorAll('#chat1 .quikchat-message');
            return Array.from(messages).some(msg => {
                const text = msg.textContent;
                // Check that script/alert text is visible
                return text.includes('script') || text.includes('alert') || text.includes('onerror');
            });
        });
        expect(scriptVisible).toBe(true);
        
        // Verify no actual script tags in DOM (they should be escaped)
        const hasScriptTags = await page.evaluate(() => {
            const chat1Container = document.querySelector('#chat1');
            if (!chat1Container) return false;
            // Check for actual script elements
            return chat1Container.querySelectorAll('script').length > 0;
        });
        expect(hasScriptTags).toBe(false);
        
        // Check that HTML entities are properly escaped in sanitized chat
        const properlyEscaped = await page.evaluate(() => {
            const messages = document.querySelectorAll('#chat1 .quikchat-message');
            return Array.from(messages).some(msg => {
                return msg.innerHTML.includes('&lt;') || msg.innerHTML.includes('&gt;');
            });
        });
        expect(properlyEscaped).toBe(true);
    });
});