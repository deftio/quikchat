import quikchat from './quikchat.js';
import quikdown from 'quikdown';

// Subclass that pre-wires quikdown as the message formatter
class quikchatMD extends quikchat {
    constructor(parentElement, onSend, options = {}) {
        if (!options.messageFormatter) {
            options.messageFormatter = (content) => quikdown(content);
        }
        super(parentElement, onSend, options);
    }
}

// Expose quikdown on the class for direct access
quikchatMD.quikdown = quikdown;

export default quikchatMD;
