'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Badge,
  ShortcutGrid,
  Kbd,
  Hint,
  Button,
  SectionHeader,
  Grid,
  Code,
} from '../../ui';

function escapeHTML(html: string): string {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatHTML(html: string): string {
  let formatted = html;
  formatted = formatted.replace(
    /(<\/?(p|div|h[1-6]|blockquote)[^>]*>)/gi,
    '\n$1\n',
  );
  formatted = formatted.replace(/(<br\s*\/?>)/gi, '$1\n');
  formatted = formatted
    .split('\n')
    .filter((line) => line.trim())
    .join('\n');
  return `<div contenteditable="true">\n  ${formatted}\n</div>`;
}

export default function ContentEditableDemo() {
  const formatEditorRef = useRef<HTMLDivElement>(null);
  const [domOutput, setDomOutput] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);

  const updateDOMOutput = useCallback(() => {
    const editor = formatEditorRef.current;
    if (!editor) return;
    const html = editor.innerHTML;
    const formatted = formatHTML(html);
    setDomOutput(escapeHTML(formatted));
  }, []);

  useEffect(() => {
    updateDOMOutput();
  }, [updateDOMOutput]);

  const handleInput = () => {
    updateDOMOutput();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (
      (e.ctrlKey || e.metaKey) &&
      ['b', 'i', 'u'].includes(e.key.toLowerCase())
    ) {
      setTimeout(updateDOMOutput, 10);
    }
  };

  const shortcuts = [
    { keys: <><Kbd>Ctrl</Kbd>+<Kbd>B</Kbd></>, label: 'Bold' },
    { keys: <><Kbd>Ctrl</Kbd>+<Kbd>I</Kbd></>, label: 'Italic' },
    { keys: <><Kbd>Ctrl</Kbd>+<Kbd>U</Kbd></>, label: 'Underline' },
    { keys: <><Kbd>Ctrl</Kbd>+<Kbd>Z</Kbd></>, label: 'Undo' },
  ];

  return (
    <section id='contenteditable' className='demo-section active'>
      <SectionHeader
        title="ContentEditable Deep Dive"
        subtitle="Understanding the HTML attribute that powers rich text editing"
      />

      <Grid cols={2}>
        <Card variant="large">
          <CardHeader>
            <h3>Native Formatting Shortcuts</h3>
            <Badge variant="green">Try These!</Badge>
          </CardHeader>
          <CardContent>
            <div
              id='format-editor'
              ref={formatEditorRef}
              className='demo-contenteditable large'
              contentEditable
              suppressContentEditableWarning
              onInput={handleInput}
              onKeyDown={handleKeyDown}
            >
              Type here and try the keyboard shortcuts below to format your
              text. Select some text first!
            </div>
            <ShortcutGrid shortcuts={shortcuts} />
          </CardContent>
        </Card>

        <Card variant="large">
          <CardHeader>
            <h3>Live DOM Output</h3>
            <Badge variant="blue">Updates in Real-time</Badge>
          </CardHeader>
          <CardContent>
            <pre className='code-output'>
              <code dangerouslySetInnerHTML={{ __html: domOutput }} />
            </pre>
            <Hint>Watch how the DOM changes as you format text ↑</Hint>
          </CardContent>
        </Card>
      </Grid>

      <Grid cols={2}>
        <Card>
          <CardHeader>
            <h3>🧩 Understanding Text Nodes</h3>
          </CardHeader>
          <CardContent>
            <div className='text-node-demo'>
              <p>How many DOM nodes in this HTML?</p>
              <pre className='code-small'>
                <Code>
                  &lt;p&gt;Hello &lt;strong&gt;World&lt;/strong&gt;&lt;/p&gt;
                </Code>
              </pre>
              <Button onClick={() => setShowAnswer(!showAnswer)}>
                {showAnswer ? 'Hide Answer' : 'Reveal Answer'}
              </Button>
              <div className={`answer ${showAnswer ? '' : 'hidden'}`}>
                <p>
                  <strong>4 nodes!</strong>
                </p>
                <ol className='node-list'>
                  <li>
                    <Code>HTMLParagraphElement</Code> (&lt;p&gt;)
                  </li>
                  <li>
                    <Code>Text</Code> node: &quot;Hello &quot;
                  </li>
                  <li>
                    <Code>HTMLStrongElement</Code> (&lt;strong&gt;)
                  </li>
                  <li>
                    <Code>Text</Code> node: &quot;World&quot;
                  </li>
                </ol>
                <Hint>
                  Text is always in Text nodes - they&apos;re invisible in
                  DevTools by default!
                </Hint>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3>📍 Cursor Behavior</h3>
          </CardHeader>
          <CardContent>
            <div className='cursor-demo-area'>
              <div
                contentEditable
                suppressContentEditableWarning
                className='demo-contenteditable multi-line'
                dangerouslySetInnerHTML={{
                  __html:
                    '<h2>Large Heading</h2><p>Normal text here</p><small>Small text</small>',
                }}
              />
            </div>
            <Hint>Notice how the cursor height automatically matches the text size!</Hint>
          </CardContent>
        </Card>
      </Grid>

      <Card variant="insight">
        <CardHeader>
          <h3>⚠️ The Catch with ContentEditable</h3>
        </CardHeader>
        <CardContent>
          <ul>
            <li>
              <strong>Browser inconsistencies:</strong> Chrome and Safari may
              produce different HTML for the same action
            </li>
            <li>
              <strong>Limited formatting:</strong> Only inline formatting
              built-in, no headings/lists shortcuts
            </li>
            <li>
              <strong>HTML is unsafe:</strong> Storing raw HTML can lead to XSS
              vulnerabilities
            </li>
          </ul>
          <p className='solution'>
            That&apos;s why editors like Lexical intercept events and maintain
            their own state model! →
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
