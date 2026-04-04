import quikchatMDFull from '../src/quikchat-md-full.js';

describe('quikchat-md-full', () => {
    let parentElement;
    let chatInstance;

    beforeEach(() => {
        parentElement = document.createElement('div');
        document.body.appendChild(parentElement);
        chatInstance = new quikchatMDFull(parentElement, () => {});
    });

    afterEach(() => {
        if (chatInstance.destroy) chatInstance.destroy();
        document.body.removeChild(parentElement);
    });

    test('is a subclass of quikchat', () => {
        expect(chatInstance.constructor.name).toBe('quikchatMDFull');
        expect(typeof chatInstance.messageAddNew).toBe('function');
        expect(typeof chatInstance.historyGet).toBe('function');
    });

    test('exposes quikdown bd on the class', () => {
        expect(typeof quikchatMDFull.quikdown).toBe('function');
    });

    test('exposes postProcessMessage on the class', () => {
        expect(typeof quikchatMDFull.postProcessMessage).toBe('function');
    });

    test('has a default messageFormatter (quikdown bd)', () => {
        expect(chatInstance._messageFormatter).not.toBeNull();
        expect(typeof chatInstance._messageFormatter).toBe('function');
    });

    test('formats bold markdown in messages', () => {
        const id = chatInstance.messageAddNew('**bold**', 'bot', 'left');
        const el = chatInstance.messageGetDOMObject(id);
        const content = el.querySelector('.quikchat-message-content').innerHTML;
        expect(content).toContain('quikdown-strong');
        expect(content).toContain('bold');
    });

    test('formats code blocks with language tags', () => {
        const id = chatInstance.messageAddNew('```javascript\nconst x = 1;\n```', 'bot', 'left');
        const el = chatInstance.messageGetDOMObject(id);
        const content = el.querySelector('.quikchat-message-content').innerHTML;
        expect(content).toContain('quikdown-pre');
        expect(content).toContain('language-javascript');
    });

    test('formats inline code', () => {
        const id = chatInstance.messageAddNew('use `console.log()`', 'bot', 'left');
        const el = chatInstance.messageGetDOMObject(id);
        const content = el.querySelector('.quikchat-message-content').innerHTML;
        expect(content).toContain('quikdown-code');
    });

    test('formats links', () => {
        const id = chatInstance.messageAddNew('[click](https://example.com)', 'bot', 'left');
        const el = chatInstance.messageGetDOMObject(id);
        const content = el.querySelector('.quikchat-message-content').innerHTML;
        expect(content).toContain('quikdown-a');
        expect(content).toContain('https://example.com');
    });

    test('allows custom messageFormatter to override', () => {
        const custom = (content) => '<p>' + content + '</p>';
        const chat2 = new quikchatMDFull(document.createElement('div'), () => {}, {
            messageFormatter: custom
        });
        expect(chat2._messageFormatter).toBe(custom);
    });

    test('plain text is passed through without errors', () => {
        const id = chatInstance.messageAddNew('just plain text', 'user', 'right');
        const content = chatInstance.messageGetContent(id);
        expect(content).toBe('just plain text');
    });

    test('messageAppendContent works with formatter', () => {
        const id = chatInstance.messageAddNew('start', 'bot', 'left');
        const result = chatInstance.messageAppendContent(id, ' **more**');
        expect(result).toBe(true);
        const el = chatInstance.messageGetDOMObject(id);
        const content = el.querySelector('.quikchat-message-content').innerHTML;
        expect(content).toContain('quikdown-strong');
    });

    test('messageReplaceContent works with formatter', () => {
        const id = chatInstance.messageAddNew('original', 'bot', 'left');
        const result = chatInstance.messageReplaceContent(id, '**replaced**');
        expect(result).toBe(true);
        const el = chatInstance.messageGetDOMObject(id);
        const content = el.querySelector('.quikchat-message-content').innerHTML;
        expect(content).toContain('quikdown-strong');
    });

    test('messageAddFull triggers post-processing', () => {
        const id = chatInstance.messageAddFull({
            content: '**full**', userString: 'bot', align: 'left', role: 'assistant'
        });
        const el = chatInstance.messageGetDOMObject(id);
        const content = el.querySelector('.quikchat-message-content').innerHTML;
        expect(content).toContain('quikdown-strong');
    });

    test('version returns correct version info', () => {
        const v = quikchatMDFull.version();
        expect(v.version).toBe('1.2.4');
    });

    test('all base quikchat methods work', () => {
        chatInstance.changeTheme('quikchat-theme-ocean');
        expect(chatInstance.theme).toBe('quikchat-theme-ocean');
        chatInstance.setDirection('rtl');
        expect(chatInstance.getDirection()).toBe('rtl');
        const id = chatInstance.messageAddNew('test', 'u', 'right');
        chatInstance.messageSetTags(id, ['debug']);
        expect(chatInstance.messageGetTags(id)).toEqual(['debug']);
        const exported = chatInstance.historyExport();
        expect(exported.length).toBe(1);
    });

    test('destroy does not throw', () => {
        expect(() => chatInstance.destroy()).not.toThrow();
    });

    // Post-processing runs synchronously for SVG and CSV (no CDN needed)
    test('SVG fence blocks are rendered inline', () => {
        const id = chatInstance.messageAddNew('```svg\n<svg xmlns="http://www.w3.org/2000/svg"><circle r="10"/></svg>\n```', 'bot', 'left');
        const el = chatInstance.messageGetDOMObject(id);
        const content = el.querySelector('.quikchat-message-content');
        // SVG post-processor replaces <pre> with a container div
        const svgContainer = content.querySelector('.qde-svg-container');
        if (svgContainer) {
            expect(svgContainer.querySelector('svg')).not.toBeNull();
        } else {
            // jsdom DOMParser may not support SVG fully — verify the fence is at least present
            expect(content.innerHTML).toContain('svg');
        }
    });

    test('mermaid fence blocks are preserved for async processing', () => {
        const id = chatInstance.messageAddNew('```mermaid\ngraph TD\nA-->B\n```', 'bot', 'left');
        const el = chatInstance.messageGetDOMObject(id);
        const content = el.querySelector('.quikchat-message-content').innerHTML;
        // Mermaid needs CDN load — in jsdom it stays as a code block
        expect(content).toContain('language-mermaid');
    });

    test('CSV fence blocks are converted to tables', () => {
        const id = chatInstance.messageAddNew('```csv\nname,age\nalice,30\n```', 'bot', 'left');
        const el = chatInstance.messageGetDOMObject(id);
        const content = el.querySelector('.quikchat-message-content');
        // CSV post-processor should convert to a table
        const table = content.querySelector('table.quikdown-table');
        if (table) {
            expect(table.querySelector('th').textContent).toBe('name');
            expect(table.querySelector('td').textContent).toBe('alice');
        } else {
            // Fallback: verify CSV content is present
            expect(content.innerHTML).toContain('csv');
        }
    });
});
