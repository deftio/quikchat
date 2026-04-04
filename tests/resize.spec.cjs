const { test, expect } = require('@playwright/test');
const path = require('path');

const testPage = `file://${path.resolve(__dirname, 'resize-test.html')}`;

// Helper: get bounding boxes for all widget zones
async function getLayout(page) {
    return page.evaluate(() => {
        const base = document.querySelector('.quikchat-base');
        const title = document.querySelector('.quikchat-title-area');
        const messages = document.querySelector('.quikchat-messages-area');
        const input = document.querySelector('.quikchat-input-area');
        const textbox = document.querySelector('.quikchat-input-textbox');
        const button = document.querySelector('.quikchat-input-send-btn');
        const rect = el => {
            if (!el) return null;
            const r = el.getBoundingClientRect();
            return { x: r.x, y: r.y, width: r.width, height: r.height, bottom: r.bottom, right: r.right };
        };
        return {
            base: rect(base),
            title: rect(title),
            messages: rect(messages),
            input: rect(input),
            textbox: rect(textbox),
            button: rect(button),
            titleVisible: title && title.style.display !== 'none',
            inputVisible: input && input.style.display !== 'none',
            messagesScroll: {
                scrollHeight: messages.scrollHeight,
                clientHeight: messages.clientHeight,
            },
        };
    });
}

// Helper: resize the container and wait for layout
async function resizeContainer(page, width, height) {
    await page.evaluate(({w, h}) => {
        document.getElementById('container').style.width = w + 'px';
        document.getElementById('container').style.height = h + 'px';
    }, { w: width, h: height });
    await page.waitForTimeout(100);
}

test.describe('QuikChat Resize — Content Containment', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto(testPage);
        await page.waitForSelector('.quikchat-base');
    });

    test('initial layout: all zones stay within container', async ({ page }) => {
        const l = await getLayout(page);
        expect(l.title.right).toBeLessThanOrEqual(l.base.right + 1);
        expect(l.messages.right).toBeLessThanOrEqual(l.base.right + 1);
        expect(l.input.right).toBeLessThanOrEqual(l.base.right + 1);
        expect(l.input.bottom).toBeLessThanOrEqual(l.base.bottom + 1);
    });

    test('initial layout: messages area is scrollable with overflow content', async ({ page }) => {
        const l = await getLayout(page);
        expect(l.messagesScroll.scrollHeight).toBeGreaterThan(l.messagesScroll.clientHeight);
    });

    test('shrink to 300x250: all zones stay within container', async ({ page }) => {
        await resizeContainer(page, 300, 250);
        const l = await getLayout(page);
        expect(l.input.bottom).toBeLessThanOrEqual(l.base.bottom + 1);
        expect(l.messages.right).toBeLessThanOrEqual(l.base.right + 1);
        expect(l.messages.height).toBeGreaterThan(0);
        expect(l.textbox.width).toBeGreaterThan(50);
    });

    test('shrink to 200x200: widget does not overflow parent', async ({ page }) => {
        await resizeContainer(page, 200, 200);
        const l = await getLayout(page);
        expect(l.base.width).toBeLessThanOrEqual(204); // 200 + 2px border each side
        expect(l.base.height).toBeLessThanOrEqual(204);
    });

    test('shrink below min (150x120): widget clipped, not overflowing', async ({ page }) => {
        await resizeContainer(page, 150, 120);
        const container = await page.evaluate(() => {
            const c = document.getElementById('container');
            return { width: c.offsetWidth, height: c.offsetHeight };
        });
        const l = await getLayout(page);
        // Widget may be larger than container due to min-width/min-height,
        // but overflow:hidden on .quikchat-base should prevent visual spill
        expect(l.base.width).toBeLessThanOrEqual(container.width);
    });

    test('expand to 1200x800: layout fills container', async ({ page }) => {
        await resizeContainer(page, 1200, 800);
        const l = await getLayout(page);
        expect(l.base.width).toBeGreaterThanOrEqual(1190);
        expect(l.base.height).toBeGreaterThanOrEqual(790);
        expect(l.input.bottom).toBeLessThanOrEqual(l.base.bottom + 1);
    });

    test('narrow mobile width 320px: textarea and button both usable', async ({ page }) => {
        await resizeContainer(page, 320, 500);
        const l = await getLayout(page);
        expect(l.textbox.width).toBeGreaterThan(100);
        expect(l.button.width).toBeGreaterThan(40);
        expect(l.button.right).toBeLessThanOrEqual(l.base.right + 1);
    });

    test('rapid resize sequence: final layout consistent', async ({ page }) => {
        const sizes = [
            [800, 600], [400, 300], [1200, 400], [320, 568], [600, 500]
        ];
        for (const [w, h] of sizes) {
            await resizeContainer(page, w, h);
        }
        const l = await getLayout(page);
        expect(l.input.bottom).toBeLessThanOrEqual(l.base.bottom + 1);
        expect(l.messages.right).toBeLessThanOrEqual(l.base.right + 1);
        expect(l.messages.height).toBeGreaterThan(0);
    });

    test('toggle title off: messages area grows, nothing overflows', async ({ page }) => {
        await page.evaluate(() => chat.titleAreaHide());
        await page.waitForTimeout(100);
        const hidden = await getLayout(page);

        await page.evaluate(() => chat.titleAreaShow());
        await page.waitForTimeout(100);
        const shown = await getLayout(page);

        expect(hidden.messages.height).toBeGreaterThan(shown.messages.height);
        expect(hidden.input.bottom).toBeLessThanOrEqual(hidden.base.bottom + 1);
        expect(shown.input.bottom).toBeLessThanOrEqual(shown.base.bottom + 1);
    });

    test('toggle input off: messages area grows, nothing overflows', async ({ page }) => {
        await page.evaluate(() => chat.inputAreaHide());
        await page.waitForTimeout(100);
        const hidden = await getLayout(page);

        await page.evaluate(() => chat.inputAreaShow());
        await page.waitForTimeout(100);
        const shown = await getLayout(page);

        expect(hidden.messages.height).toBeGreaterThan(shown.messages.height);
    });

    test('resize after adding many messages: scroll works, no overflow', async ({ page }) => {
        await page.evaluate(() => {
            for (let i = 0; i < 50; i++) {
                chat.messageAddNew('Extra message ' + i + ' with enough text to wrap on small screens.', 'bot', 'left');
            }
        });
        await resizeContainer(page, 400, 300);
        const l = await getLayout(page);
        expect(l.messagesScroll.scrollHeight).toBeGreaterThan(l.messagesScroll.clientHeight);
        expect(l.input.bottom).toBeLessThanOrEqual(l.base.bottom + 1);
        expect(l.messages.right).toBeLessThanOrEqual(l.base.right + 1);
    });

    test('all three themes: no horizontal overflow at 400px width', async ({ page }) => {
        const themes = ['quikchat-theme-light', 'quikchat-theme-dark', 'quikchat-theme-debug'];
        await resizeContainer(page, 400, 400);

        for (const theme of themes) {
            await page.evaluate(t => chat.changeTheme(t), theme);
            await page.waitForTimeout(50);
            const l = await getLayout(page);
            expect(l.messages.right).toBeLessThanOrEqual(l.base.right + 1);
            expect(l.input.right).toBeLessThanOrEqual(l.base.right + 1);
        }
    });

    test('text-align on user label uses class not inline font styling', async ({ page }) => {
        const result = await page.evaluate(() => {
            const label = document.querySelector('.quikchat-user-label');
            return {
                hasClass: !!label,
                inlineFontSize: label ? label.style.fontSize : 'n/a',
                inlineFontWeight: label ? label.style.fontWeight : 'n/a',
                textAlign: label ? label.style.textAlign : 'n/a',
            };
        });
        expect(result.hasClass).toBe(true);
        expect(result.inlineFontSize).toBe('');
        expect(result.inlineFontWeight).toBe('');
        expect(result.textAlign).not.toBe('');
    });

    test('no structural properties in theme CSS at runtime', async ({ page }) => {
        // Verify the dark theme does not override structural properties
        await page.evaluate(() => chat.changeTheme('quikchat-theme-dark'));
        const result = await page.evaluate(() => {
            const btn = document.querySelector('.quikchat-input-send-btn');
            const textbox = document.querySelector('.quikchat-input-textbox');
            const cs = prop => getComputedStyle(btn)[prop];
            const ts = prop => getComputedStyle(textbox)[prop];
            return {
                btnMarginLeft: cs('marginLeft'),
                btnCursor: cs('cursor'),
                textboxFontFamily: ts('fontFamily'),
            };
        });
        // margin-left should be 8px (base), not 10px (old dark theme override)
        expect(result.btnMarginLeft).toBe('8px');
        expect(result.btnCursor).toBe('pointer');
    });
});
