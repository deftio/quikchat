import quikchat from './quikchat.js';
import quikdownEdit from 'quikdown/edit';

// Subclass that pre-wires quikdown editor (full) as the message formatter.
// The edit build dynamically loads syntax highlighting, math rendering,
// maps, and other processors from CDN on first use.
class quikchatMDFull extends quikchat {
    constructor(parentElement, onSend, options = {}) {
        if (!options.messageFormatter) {
            options.messageFormatter = (content) => quikdownEdit(content);
        }
        super(parentElement, onSend, options);
    }
}

// Expose quikdown edit on the class for direct access
quikchatMDFull.quikdown = quikdownEdit;

export default quikchatMDFull;
