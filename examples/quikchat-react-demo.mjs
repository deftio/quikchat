import React from 'react';
import { createRoot } from 'react-dom/client';
const container = document.getElementById('app');
const root = createRoot(container); 

import QuikChatReact from '../dist/quikchat.react.js';

const QuikChatReactDemo = () => {
  return (
    <div>
      <QuikChatReact onsend={(c,m)=>{c.messageAddNew(m,"user")}} meta={{ theme: 'quikchat-theme-light' }} />
    </div>
  );
};

root.render(
  <React.StrictMode>
    <QuikChatReactDemo />
  </React.StrictMode>,
  document.getElementById('root')
);
