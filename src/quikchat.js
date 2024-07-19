// quikchat.js

class quikchat {
    constructor(parentElement, meta = { theme: 'quikchat-theme-light', onSend: () => { } }) {
        this.parentElement = parentElement;
        this.theme = meta.theme;
        this.onSend = meta.onSend ? meta.onSend : () => { };
        this.createWidget();
        // title area
        if (meta.titleArea) {
            this.titleAreaSet(meta.titleArea.title, meta.titleArea.align);
            if (meta.titleArea.show) {
                this.titleAreaShow();
            } else {
                this.titleAreaHide();
            }
        }
        this.attachEventListeners();
    }

    createWidget() {
        const widgetHTML =
            `
            <div class="quikchat-base ${this.theme}">
                <div class="quikchat-title-area">
                    <span style="font-size: 1.5em; font-weight: 600;">Title Area</span>
                </div>
                <div class="quikchat-messages-area"></div>
                <div class="quikchat-input-area">
                    <textarea class="quikchat-input-textbox"></textarea>
                    <button class="quikchat-input-send-btn">Send</button>
                </div>
            </div>
            `;

        this.parentElement.innerHTML = widgetHTML;
        this.chatWidget = this.parentElement.querySelector('.quikchat-base');
        this.titleArea = this.chatWidget.querySelector('.quikchat-title-area');
        this.messagesArea = this.chatWidget.querySelector('.quikchat-messages-area');
        this.inputArea = this.chatWidget.querySelector('.quikchat-input-area');
        this.textEntry = this.inputArea.querySelector('.quikchat-input-textbox');
        this.sendButton = this.inputArea.querySelector('.quikchat-input-send-btn');
    }

    attachEventListeners() {
        this.sendButton.addEventListener('click', () => this.onSend(this, this.textEntry.value.trim()));
        window.addEventListener('resize', () => this.handleContainerResize());
        this.chatWidget.addEventListener('resize', () => this.handleContainerResize());
        this.textEntry.addEventListener('keydown', (event) => {
            // Check if Shift + Enter is pressed
            if (event.shiftKey && event.keyCode === 13) {
                // Prevent default behavior (adding new line)
                event.preventDefault();
                this.onSend(this, this.textEntry.value.trim())
            }
        });
    }

    titleAreaToggle() {
        this.titleArea.style.display === 'none' ? this.titleAreaShow() : this.titleAreaHide();
    }

    titleAreaShow() {
        this.titleArea.style.display = '';
        this.adjustMessagesAreaHeight();
    }

    titleAreaHide() {
        this.titleArea.style.display = 'none';
        this.adjustMessagesAreaHeight();
    }

    titleAreaSet(title, align = 'center') {
        this.titleArea.textContent = title;
        this.titleArea.style.textAlign = align;
    }

    titleAreaGet() {
        return this.titleArea.textContent;
    }

    inputAreaToggle() {
        this.inputArea.classList.toggle('hidden');
        this.inputArea.style.display === 'none' ? this.inputAreaShow() : this.inputAreaHide();
    }

    inputAreaShow() {
        this.inputArea.style.display = '';
        this.adjustMessagesAreaHeight();
    }

    inputAreaHide() {
        this.inputArea.style.display = 'none';
        this.adjustMessagesAreaHeight();
    }

    adjustMessagesAreaHeight() {
        const hiddenElements = [...this.chatWidget.children].filter(child => child.classList.contains('hidden'));
        const totalHiddenHeight = hiddenElements.reduce((sum, child) => sum + child.offsetHeight, 0);
        const containerHeight = this.chatWidget.offsetHeight;
        this.messagesArea.style.height = `calc(100% - ${containerHeight - totalHiddenHeight}px)`;
    }

    handleContainerResize() {
        this.adjustMessagesAreaHeight();
        this.adjustSendButtonWidth();
        console.log('Container resized');
    }

    adjustSendButtonWidth() {
        const sendButtonText = this.sendButton.textContent.trim();
        const fontSize = parseFloat(getComputedStyle(this.sendButton).fontSize);
        const minWidth = fontSize * sendButtonText.length + 16;
        this.sendButton.style.minWidth = `${minWidth}px`;
    }

    addMessage(message, user = "foo", align = 'left') {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('quikchat-message');
        messageDiv.classList.add(this.messagesArea.children.length % 2 === 1 ? 'quikchat-message-1' : 'quikchat-message-2');

        const userDiv = document.createElement('div');
        userDiv.textContent = user;
        userDiv.style = `width: 100%; text-align: ${align}; font-size: 1em; font-weight:700; color: #444;`;

        const contentDiv = document.createElement('div');
        contentDiv.style = `width: 100%; text-align: ${align};`;
        contentDiv.textContent = message;

        messageDiv.appendChild(userDiv);
        messageDiv.appendChild(contentDiv);
        this.messagesArea.appendChild(messageDiv);
        this.messagesArea.lastChild.scrollIntoView();

        this.textEntry.value = '';
        this.adjustMessagesAreaHeight();
    }

    removeMesssage(n) {
        this.messagesArea.removeChild(this.messagesArea.children[n]);
    }

    getMessage(n) {
        return this.messagesArea.children[n].lastChild.textContent;
    }

    appendMessage(n, message) {
        this.messagesArea.children[n].lastChild.textContent += message;
    }

    updateMessage(n, message) {
        this.messagesArea.children[n].lastChild.textContent = message;
    }

    changeTheme(newTheme) {
        this.chatWidget.classList.remove(this.theme);
        this.chatWidget.classList.add(newTheme);
        this.theme = newTheme;
    }
}

export default quikchat;
