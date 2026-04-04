import quikchat from './quikchat.js';
import quikdownFull from 'quikdown/bd';

// Subclass that pre-wires quikdown bd (full renderer) as the message formatter.
// The bd build includes extended rendering features and emits language-tagged
// code blocks ready for syntax highlighting (loaded dynamically or by the user).
class quikchatMDFull extends quikchat {
    constructor(parentElement, onSend, options = {}) {
        if (!options.messageFormatter) {
            options.messageFormatter = (content) => quikdownFull(content);
        }
        super(parentElement, onSend, options);
    }
}

// Expose quikdown bd on the class for direct access
quikchatMDFull.quikdown = quikdownFull;

export default quikchatMDFull;
