import quikchat from '../src/quikchat';
//window.HTMLElement.prototype.scrollIntoView = function() {};
Element.prototype.scrollIntoView = () => {}; // hack to prevent scrollIntoView not in jsdom error


describe('quikchat', () => {
    let parentElement;
    let chatInstance;

    beforeEach(() => {
        // Set up a DOM element for testing
        document.body.innerHTML = '<div id="chat-container"></div>';
        parentElement = document.getElementById('chat-container');
        chatInstance = new quikchat(parentElement);
    });

    afterEach(() => {
        // Clean up after each test
        document.body.innerHTML = '';
    });

    test('should initialize with default options', () => {
        expect(chatInstance._theme).toBe('quikchat-theme-light');
        expect(chatInstance.trackHistory).toBe(true);
    });

    test('should toggle title area visibility', () => {
        chatInstance.titleAreaShow();
        expect(chatInstance._titleArea.style.display).toBe('');

        chatInstance.titleAreaHide();
        expect(chatInstance._titleArea.style.display).toBe('none');
    });

    test('should set title area contents', () => {
        const title = 'Test Chat';
        chatInstance.titleAreaSetContents(title);
        expect(chatInstance._titleArea.innerHTML).toBe(title);
    });

    test('should toggle input area visibility', () => {
        chatInstance.inputAreaShow();
        expect(chatInstance._inputArea.style.display).toBe('');

        chatInstance.inputAreaHide();
        expect(chatInstance._inputArea.style.display).toBe('none');
    });

    test('should add a new message', () => {
        const content = 'Hello, world!';
        chatInstance.messageAddNew(content);
        expect(chatInstance._messagesArea.children.length).toBe(1);
        expect(chatInstance._messagesArea.children[0].textContent).toContain(content);
    });

    test('should remove a message', () => {
        const content = 'Message to be removed';
        const msgId = chatInstance.messageAddNew(content);
        expect(chatInstance._messagesArea.children.length).toBe(1);

        chatInstance.messageRemove(msgId);
        expect(chatInstance._messagesArea.children.length).toBe(0);
    });

    test('should get message content', () => {
        const content = 'Content to be retrieved';
        const msgId = chatInstance.messageAddNew(content);
        expect(chatInstance.messageGetContent(msgId)).toBe(content);
    });

    test('should change theme', () => {
        const newTheme = 'quikchat-theme-dark';
        chatInstance.changeTheme(newTheme);
        expect(chatInstance._theme).toBe(newTheme);
        expect(chatInstance._chatWidget.classList.contains(newTheme)).toBe(true);
    });

    test('should generate lorem ipsum text', () => {
        const text = quikchat.loremIpsum(50);
        expect(text.length).toBe(50);
        expect(text).toMatch(/^[A-Z][a-z]/); // Starts with capital letter
    });


});
