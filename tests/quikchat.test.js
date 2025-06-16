import quikchat from '../src/quikchat';
// Prevent scrollIntoView error in jsdom
Element.prototype.scrollIntoView = () => {};

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

    //test titleAreaGetContents
    test('test title area get contents', () => {
        const title = 'Test Chat';
        chatInstance.titleAreaSetContents(title);
        expect(chatInstance.titleAreaGetContents()).toBe(title);
    });

    //test inputAreaToggle()  
    test('should toggle input area', () => {
        chatInstance.inputAreaToggle();
        expect(chatInstance._inputArea.style.display).toBe('none');
        chatInstance.inputAreaToggle();
        expect(chatInstance._inputArea.style.display).toBe('');
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

    // resize events
    //_handleContainerResize()
    test('should handle container resize', () => {
        let w = chatInstance._chatWidget.style.height
        chatInstance._handleContainerResize();
        expect(chatInstance._chatWidget.style.height).toBe(w);
    });

    //_adjustSendButtonWidth()
    test('should adjust send button width', () => {
        let w = chatInstance._sendButton.style.width;
        chatInstance._adjustSendButtonWidth();
        expect(chatInstance._sendButton.style.width).toBe(w);
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

    // write a test for  messageGetDOMObject(n) function which returns an html dom element of the message
    test('should get message DOM object', () => {
        const content = 'Content to be retrieved';
        const msgId = chatInstance.messageAddNew(content,'user');
        const msgDOM = chatInstance.messageGetDOMObject(msgId);
        expect(msgDOM.lastChild.textContent).toBe(content);
    });
        
    // change theme test
    test('should change theme', () => {
        const newTheme = 'quikchat-theme-dark';
        chatInstance.changeTheme(newTheme);
        expect(chatInstance._theme).toBe(newTheme);
        expect(chatInstance._chatWidget.classList.contains(newTheme)).toBe(true);
    });

    test('should generate lorem ipsum text', () => {
        const text = quikchat.loremIpsum(50);
        expect(text.length).toBe(50);
        expect(/^[A-Z]/.test(text)).toBe(true); // Starts with capital letter
    });

    test('should toggle message area alternating colors', () => {
        chatInstance.messagesAreaAlternateColors(true);
        expect(chatInstance.messagesAreaAlternateColorsGet()).toBe(true);
        chatInstance.messagesAreaAlternateColors(false);
        expect(chatInstance.messagesAreaAlternateColorsGet()).toBe(false);
    });

    test('should append content to an existing message', () => {
        const content = 'Hello, world!';
        const appendedContent = ' How are you?';
        const msgId = chatInstance.messageAddNew(content);
        chatInstance.messageAppendContent(msgId, appendedContent);
        expect(chatInstance.messageGetContent(msgId)).toBe(content + appendedContent);
    });

    test('should replace content of an existing message', () => {
        const content = 'Hello, world!';
        const newContent = 'Hi there!';
        const msgId = chatInstance.messageAddNew(content);
        chatInstance.messageReplaceContent(msgId, newContent);
        expect(chatInstance.messageGetContent(msgId)).toBe(newContent);
    });

    test('should clear message history', () => {
        chatInstance.messageAddNew('Message 1');
        chatInstance.messageAddNew('Message 2');
        expect(chatInstance.historyGetLength()).toBe(2);
        chatInstance.historyClear();
        expect(chatInstance.historyGetLength()).toBe(0);
    });

    test('should get specific history messages', () => {
        chatInstance.messageAddNew('Message 1');
        chatInstance.messageAddNew('Message 2');
        const history = chatInstance.historyGet(0, 1);
        expect(history.length).toBe(1);
        expect(history[0].content).toBe('Message 1');
    });

    test('should set callback on send', () => {
        const callback = jest.fn();
        chatInstance.setCallbackOnSend(callback);
        chatInstance._sendButton.click();
        expect(callback).toHaveBeenCalled();
    });

    test('should set callback on message added', () => {
        const callback = jest.fn();
        chatInstance.setCallbackonMessageAdded(callback);
        chatInstance.messageAddNew('Test message');
        expect(callback).toHaveBeenCalled();
    });

    // test history functions
    test('should get history length', () => {
        chatInstance.messageAddNew('Message 1');
        chatInstance.messageAddNew('Message 2');
        expect(chatInstance.historyGetLength()).toBe(2);
    });

    // test historyGet(n,m)  // start and end ranges
    test('should get history messages', () => {
        chatInstance.messageAddNew('Message 1','u1');
        chatInstance.messageAddNew('Message 2','u2');
        chatInstance.messageAddNew('Message 3','u3');
        let history = chatInstance.historyGet();
        expect(history.length).toBe(3);
        history = chatInstance.historyGet(0, 2);
        expect(history.length).toBe(2);
        expect(history[0].content).toBe('Message 1');
        expect(history[1].content).toBe('Message 2');


    });
    

    // test historyGetMessageN()
    test('should get history message', () => {
        chatInstance.messageAddNew('Message 1','bot');
        let n = chatInstance.messageAddNew('Message 2','user');
        expect(chatInstance.historyGetMessage(n).content).toBe('Message 2');
        expect(chatInstance.historyGetMessageContent(n)).toBe('Message 2');
    });

    // static version function, just test that the repo points to /github/deftio/quikchat
    // version()
    test('should return version', () => {
        expect(quikchat.version().url).toBe('https://github/deftio/quikchat');
    });

    describe('Message Visibility', () => {
        test('should render message by default (backward compatibility)', () => {
            const msgId = chatInstance.messageAddNew('Visible message');
            expect(chatInstance.messageGetVisibility(msgId)).toBe(true);
            const historyItem = chatInstance.historyGet(0, 1)[0];
            expect(historyItem.visible).toBe(true);
        });

        test('should render message when visible: true is passed', () => {
            const msgId = chatInstance.messageAddNew('Visible message', 'user', 'right', 'user', true, true);
            expect(chatInstance.messageGetVisibility(msgId)).toBe(true);
        });

        test('should hide message when visible: false is passed', () => {
            const msgId = chatInstance.messageAddNew('Hidden message', 'user', 'right', 'user', true, false);
            expect(chatInstance.messageGetVisibility(msgId)).toBe(false);
            const domElement = chatInstance.messageGetDOMObject(msgId);
            expect(domElement.style.display).toBe('none');
        });

        test('should show a hidden message', () => {
            const msgId = chatInstance.messageAddNew('Hidden message', 'user', 'right', 'user', true, false);
            expect(chatInstance.messageGetVisibility(msgId)).toBe(false);
            chatInstance.messageSetVisibility(msgId, true);
            expect(chatInstance.messageGetVisibility(msgId)).toBe(true);
        });

        test('should hide a visible message', () => {
            const msgId = chatInstance.messageAddNew('Visible message');
            expect(chatInstance.messageGetVisibility(msgId)).toBe(true);
            chatInstance.messageSetVisibility(msgId, false);
            expect(chatInstance.messageGetVisibility(msgId)).toBe(false);
        });

        test('should toggle visibility repeatedly', () => {
            const msgId = chatInstance.messageAddNew('A message');
            chatInstance.messageSetVisibility(msgId, false);
            expect(chatInstance.messageGetVisibility(msgId)).toBe(false);
            chatInstance.messageSetVisibility(msgId, true);
            expect(chatInstance.messageGetVisibility(msgId)).toBe(true);
            chatInstance.messageSetVisibility(msgId, false);
            expect(chatInstance.messageGetVisibility(msgId)).toBe(false);
        });

        test('should correctly set alternating colors when visibility changes', () => {
            chatInstance.messageAddNew('Msg 0');
            const msg1 = chatInstance.messageAddNew('Msg 1', 'user', 'right', 'user', true, false);
            chatInstance.messageAddNew('Msg 2');

            const msg0_dom = chatInstance.messageGetDOMObject(0);
            const msg2_dom = chatInstance.messageGetDOMObject(2);

            expect(msg0_dom.classList.contains('quikchat-message-1')).toBe(true);
            expect(msg2_dom.classList.contains('quikchat-message-2')).toBe(true);

            chatInstance.messageSetVisibility(1, true);
            const msg1_dom = chatInstance.messageGetDOMObject(1);
            expect(msg1_dom.classList.contains('quikchat-message-2')).toBe(true);
            expect(msg2_dom.classList.contains('quikchat-message-1')).toBe(true); // Should have changed
        });

        test('should return false for invalid msgid', () => {
            expect(chatInstance.messageSetVisibility(999, true)).toBe(false);
            expect(chatInstance.messageGetVisibility(999)).toBe(false);
        });
        
        test('should include `visible` property in history export', () => {
            chatInstance.messageAddNew('Visible message');
            chatInstance.messageAddNew('Hidden message', 'user', 'right', 'user', true, false);
            const history = chatInstance.historyGetAllCopy();
            expect(history[0].visible).toBe(true);
            expect(history[1].visible).toBe(false);
        });
    });

    describe('Tagged Visibility', () => {
        test('should apply instanceClass to the main widget', () => {
            const chatWithClass = new quikchat(parentElement, () => {}, { instanceClass: 'my-test-class' });
            expect(chatWithClass._chatWidget.classList.contains('my-test-class')).toBe(true);
        });

        test('should add tag classes to message elements', () => {
            const msgId = chatInstance.messageAddNew('Tagged message', 'user', 'right', 'user', true, true, ['system', 'priority']);
            const msgDom = chatInstance.messageGetDOMObject(msgId);
            expect(msgDom.classList.contains('quikchat-tag-system')).toBe(true);
            expect(msgDom.classList.contains('quikchat-tag-priority')).toBe(true);
        });

        test('should not add invalid tag names', () => {
            const msgId = chatInstance.messageAddNew('Tagged message', 'user', 'right', 'user', true, true, ['system', 'invalid tag']);
            const msgDom = chatInstance.messageGetDOMObject(msgId);
            expect(msgDom.classList.contains('quikchat-tag-system')).toBe(true);
            expect(msgDom.classList.contains('quikchat-tag-invalid tag')).toBe(false);
        });

        test('should get all active tags', () => {
            chatInstance.messageAddNew('Tagged message', 'user', 'right', 'user', true, true, ['system', 'priority']);
            chatInstance.messageAddNew('Another message', 'user', 'right', 'user', true, true, ['system', 'debug']);
            expect(chatInstance.getActiveTags()).toEqual(expect.arrayContaining(['system', 'priority', 'debug']));
            expect(chatInstance.getActiveTags().length).toBe(3);
        });

        test('should set and get tag visibility', () => {
            chatInstance.setTagVisibility('system', true);
            expect(chatInstance.getTagVisibility('system')).toBe(true);
            expect(chatInstance._chatWidget.classList.contains('quikchat-show-tag-system')).toBe(true);

            chatInstance.setTagVisibility('system', false);
            expect(chatInstance.getTagVisibility('system')).toBe(false);
            expect(chatInstance._chatWidget.classList.contains('quikchat-show-tag-system')).toBe(false);
        });

        test('should restore history with tags and rebuild active tag set', () => {
            const history = [
                { content: "msg1", tags: ['system'] },
                { content: "msg2", tags: ['debug', 'priority'] }
            ];
            chatInstance.historyRestoreAll(history);
            expect(chatInstance.historyGetLength()).toBe(2);
            expect(chatInstance.getActiveTags()).toEqual(expect.arrayContaining(['system', 'debug', 'priority']));
            const msgDom = chatInstance.messageGetDOMObject(1);
            expect(msgDom.classList.contains('quikchat-tag-debug')).toBe(true);
        });

        test('individual visibility should override group visibility', () => {
            // Note: This requires CSS to be set up correctly in a real environment.
            // The test here only checks the JS behavior (inline style).
            const msgId = chatInstance.messageAddNew('A message', 'user', 'right', 'user', true, true, ['system']);
            
            // Hide the group (in a real scenario, this would hide the message via CSS class)
            chatInstance.setTagVisibility('system', false);

            // Now, individually show the message
            chatInstance.messageSetVisibility(msgId, true);
            const msgDom = chatInstance.messageGetDOMObject(msgId);
            expect(msgDom.style.display).not.toBe('none'); // It has an inline style to show it
        });
    });
    
});
