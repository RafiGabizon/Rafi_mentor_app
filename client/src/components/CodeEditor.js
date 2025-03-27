import React from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import atomOneDark from 'react-syntax-highlighter/dist/esm/styles/hljs/atom-one-dark';

// Register JavaScript for syntax highlighting
SyntaxHighlighter.registerLanguage('javascript', js);

// component for the code editor
// displays the code editor with syntax highlighting and line numbers
export default function CodeEditor({ code, onChange, isMentor }) {
  return (
    <>
      {isMentor ? (
        // Mentor view (read-only)
        <div className="code-editor readonly">
          <SyntaxHighlighter
            language="javascript"
            style={atomOneDark}
            showLineNumbers={true}
            wrapLines={true}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      ) : (
        // Student view (editable)
        <div className="code-editor editable">
          <textarea
            value={code}
            onChange={onChange}
            className="code-textarea"
            spellCheck="false"
            autoComplete="off"
            style={{ cursor: 'text' }}
          />
          
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
              zIndex: 1,
              cursor: 'text',
              margin: 0,
              padding: '15px',
              overflow: 'auto'
            }}
            onClick={() => {
              // Focus on the textarea when clicking the code preview
              document.querySelector('.code-textarea').focus();
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      )}
    </>
  );
}