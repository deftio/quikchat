(function (React, quikchat) {
    const { useEffect, useRef, forwardRef, useImperativeHandle } = React;
  
    const QuikChat = forwardRef(function QuikChat({ onSend, options }, ref) {
      const chatContainerRef = useRef(null);
      const quikChatInstanceRef = useRef(null);
  
      useEffect(function() {
        if (chatContainerRef.current && !quikChatInstanceRef.current) {
          quikChatInstanceRef.current = new quikchat(
            chatContainerRef.current,
            function(chat, msg) {
              if (onSend) {
                onSend(chat, msg);
              }
            },
            options
          );
        }
  
        return function() {
          // Clean up if necessary
        };
      }, [onSend, options]);
  
      useImperativeHandle(ref, function() {
        return {
          titleAreaToggle: function() { return quikChatInstanceRef.current.titleAreaToggle(); },
          titleAreaShow: function() { return quikChatInstanceRef.current.titleAreaShow(); },
          titleAreaHide: function() { return quikChatInstanceRef.current.titleAreaHide(); },
          titleAreaSetContents: function() { return quikChatInstanceRef.current.titleAreaSetContents.apply(quikChatInstanceRef.current, arguments); },
          titleAreaGetContents: function() { return quikChatInstanceRef.current.titleAreaGetContents(); },
          inputAreaToggle: function() { return quikChatInstanceRef.current.inputAreaToggle(); },
          inputAreaShow: function() { return quikChatInstanceRef.current.inputAreaShow(); },
          inputAreaHide: function() { return quikChatInstanceRef.current.inputAreaHide(); },
          messagesAreaAlternateColors: function() { return quikChatInstanceRef.current.messagesAreaAlternateColors.apply(quikChatInstanceRef.current, arguments); },
          messagesAreaAlternateColorsToggle: function() { return quikChatInstanceRef.current.messagesAreaAlternateColorsToggle(); },
          messagesAreaAlternateColorsGet: function() { return quikChatInstanceRef.current.messagesAreaAlternateColorsGet(); },
          messageAddFull: function() { return quikChatInstanceRef.current.messageAddFull.apply(quikChatInstanceRef.current, arguments); },
          messageAddNew: function() { return quikChatInstanceRef.current.messageAddNew.apply(quikChatInstanceRef.current, arguments); },
          messageRemove: function() { return quikChatInstanceRef.current.messageRemove.apply(quikChatInstanceRef.current, arguments); },
          messageGetDOMObject: function() { return quikChatInstanceRef.current.messageGetDOMObject.apply(quikChatInstanceRef.current, arguments); },
          messageGetContent: function() { return quikChatInstanceRef.current.messageGetContent.apply(quikChatInstanceRef.current, arguments); },
          messageAppendContent: function() { return quikChatInstanceRef.current.messageAppendContent.apply(quikChatInstanceRef.current, arguments); },
          messageReplaceContent: function() { return quikChatInstanceRef.current.messageReplaceContent.apply(quikChatInstanceRef.current, arguments); },
          historyGet: function() { return quikChatInstanceRef.current.historyGet.apply(quikChatInstanceRef.current, arguments); },
          historyClear: function() { return quikChatInstanceRef.current.historyClear(); },
          historyGetLength: function() { return quikChatInstanceRef.current.historyGetLength(); },
          historyGetMessage: function() { return quikChatInstanceRef.current.historyGetMessage.apply(quikChatInstanceRef.current, arguments); },
          historyGetMessageContent: function() { return quikChatInstanceRef.current.historyGetMessageContent.apply(quikChatInstanceRef.current, arguments); },
          changeTheme: function() { return quikChatInstanceRef.current.changeTheme.apply(quikChatInstanceRef.current, arguments); }
        };
      });
  
      return React.createElement('div', {
        ref: chatContainerRef,
        style: { height: '100%', width: '100%' }
      });
    });
  
    // Export for use in browser
    window.QuikChatReact = { QuikChat: QuikChat };
  })(React, quikchat);