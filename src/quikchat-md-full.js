import quikchat from './quikchat.js';
import QuikdownEditor from 'quikdown/edit';

// Subclass that uses QuikdownEditor as a rendering engine.
// The editor's fence plugins dynamically load syntax highlighting,
// math (MathJax), maps (Leaflet), diagrams (Mermaid), etc. from CDN on first use.
class quikchatMDFull extends quikchat {
    constructor(parentElement, onSend, options = {}) {
        if (!options.messageFormatter) {
            // Create a hidden container for the editor rendering engine
            const renderContainer = document.createElement('div');
            renderContainer.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;';
            document.body.appendChild(renderContainer);

            const editor = new QuikdownEditor(renderContainer, { mode: 'preview' });
            let ready = false;

            // Editor init is async (buildUI, loadPlugins, applyTheme).
            // Track messages added before init so we can re-render them.
            const pending = [];

            editor.initPromise.then(() => {
                ready = true;
                for (const resolve of pending) {
                    resolve();
                }
                pending.length = 0;
            });

            options.messageFormatter = (content) => {
                if (ready) {
                    editor.updateFromMarkdown(content);
                    return editor.getHTML();
                }
                // Not ready — return escaped content as placeholder
                return content;
            };

            options._quikdownEditor = editor;
            options._renderContainer = renderContainer;
            options._editorReady = () => ready;
            options._editorPending = pending;
        }
        super(parentElement, onSend, options);
        this._quikdownEditor = options._quikdownEditor || null;
        this._renderContainer = options._renderContainer || null;

        // Re-render all messages once editor is ready
        if (options._editorPending) {
            const self = this;
            options._editorPending.push(() => {
                for (const item of self._history) {
                    const el = self.messageGetDOMObject(item.msgid);
                    if (el) {
                        const contentDiv = el.querySelector('.quikchat-message-content');
                        if (contentDiv) {
                            contentDiv.innerHTML = self._processContent(item.content);
                        }
                    }
                }
            });
        }
    }

    destroy() {
        if (this._renderContainer && this._renderContainer.parentNode) {
            if (this._quikdownEditor && this._quikdownEditor.destroy) {
                this._quikdownEditor.destroy();
            }
            this._renderContainer.parentNode.removeChild(this._renderContainer);
        }
    }
}

// Expose the QuikdownEditor class for direct access
quikchatMDFull.QuikdownEditor = QuikdownEditor;

export default quikchatMDFull;
