'use client';

import React from 'react';
import { Highlight, themes } from 'prism-react-renderer';

type CodeBlockProps = {
  code: string;
  language?: 'javascript' | 'typescript' | 'json' | 'css' | 'html';
  className?: string;
};

export function CodeBlock({
  code,
  language = 'javascript',
  className = '',
}: CodeBlockProps) {
  return (
    <Highlight theme={themes.vsDark} code={code.trim()} language={language}>
      {({ className: highlightClassName, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={`${highlightClassName} ${className}`.trim()}
          style={{
            ...style,
            backgroundColor: 'var(--code-bg)',
            fontFamily: 'var(--font-mono-code)',
          }}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}
