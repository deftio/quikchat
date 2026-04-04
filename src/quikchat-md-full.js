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

            options.messageFormatter = (content) => {
                editor.updateFromMarkdown(content);
                return editor.getHTML();
            };

            // Store for cleanup and direct access
            options._quikdownEditor = editor;
            options._renderContainer = renderContainer;
        }
        super(parentElement, onSend, options);
        this._quikdownEditor = options._quikdownEditor || null;
        this._renderContainer = options._renderContainer || null;
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
