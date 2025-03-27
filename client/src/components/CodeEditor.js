import React from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import atomOneDark from 'react-syntax-highlighter/dist/esm/styles/hljs/atom-one-dark';

// Register the javascript language for syntax highlighting
SyntaxHighlighter.registerLanguage('javascript', js);

// CodeEditor component
// This component displays a code editor with syntax highlighting 
export default function CodeEditor({ code, onChange, isMentor }) {
  return (
    <div className={`code-editor ${isMentor ? 'readonly' : 'editable'}`}>
      {!isMentor && (
        <textarea
          value={code}
          onChange={onChange}
          className="code-textarea"
          spellCheck="false"
          autoComplete="off"
        />
      )}

      <SyntaxHighlighter
        language="javascript"
        style={atomOneDark}
        showLineNumbers={true}
        wrapLines={true}
        className="code-preview"
        customStyle={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          margin: 0,
          padding: '55px 15px 15px',
          overflow: 'auto',
          fontSize: '14px',
          lineHeight: '1.5',
          fontFamily: 'Consolas, Courier New, monospace',
          backgroundColor: '#282c34', 
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
