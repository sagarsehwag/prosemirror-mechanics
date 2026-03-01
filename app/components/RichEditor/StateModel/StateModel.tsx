'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  SectionHeader,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Toolbar,
  ToolbarButton,
  Badge,
  Code,
} from '../../ui';

interface TextNode {
  type: 'text';
  text: string;
  format: string[];
}

interface ParagraphNode {
  type: 'paragraph';
  children: TextNode[];
}

interface RootNode {
  type: 'root';
  children: ParagraphNode[];
}

function syntaxHighlight(json: string): string {
  return json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(
      /"([^"]+)":/g,
      '<span style="color: var(--accent-purple)">"$1"</span>:',
    )
    .replace(
      /: "([^"]*)"/g,
      ': <span style="color: var(--accent-green)">"$1"</span>',
    )
    .replace(
      /: (\d+)/g,
      ': <span style="color: var(--accent-orange)">$1</span>',
    )
    .replace(
      /: (true|false)/g,
      ': <span style="color: var(--accent-blue)">$1</span>',
    )
    .replace(/\[\]/g, '<span style="color: var(--text-muted)">[]</span>');
}

export default function StateModel() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [stateHtml, setStateHtml] = useState('');
  const [boldActive, setBoldActive] = useState(false);
  const [italicActive, setItalicActive] = useState(false);
  const [underlineActive, setUnderlineActive] = useState(false);

  const parseContentToState = useCallback((): RootNode => {
    const editor = editorRef.current;
    if (!editor) {
      return {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'text', text: '', format: [] }],
          },
        ],
      };
    }

    const state: RootNode = { type: 'root', children: [] };
    const paragraph: ParagraphNode = { type: 'paragraph', children: [] };

    function processNode(node: Node): TextNode | TextNode[] | null {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        if (text) {
          return { type: 'text', text, format: [] };
        }
        return null;
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const format: string[] = [];
        let current: HTMLElement | null = el;

        while (current && current !== editor) {
          const tag = current.tagName?.toLowerCase();
          if (tag === 'strong' || tag === 'b') format.push('bold');
          if (tag === 'em' || tag === 'i') format.push('italic');
          if (tag === 'u') format.push('underline');
          current = current.parentElement;
        }

        const children: TextNode[] = [];
        el.childNodes.forEach((child) => {
          if (child.nodeType === Node.TEXT_NODE && child.textContent) {
            children.push({
              type: 'text',
              text: child.textContent,
              format: format.length ? [...format] : [],
            });
          } else if (child.nodeType === Node.ELEMENT_NODE) {
            const processed = processNode(child);
            if (processed) {
              if (Array.isArray(processed)) {
                children.push(...processed);
              } else {
                children.push(processed);
              }
            }
          }
        });

        return children.length === 1 ? children[0] : children;
      }

      return null;
    }

    editor.childNodes.forEach((child) => {
      const result = processNode(child);
      if (result) {
        if (Array.isArray(result)) {
          paragraph.children.push(...result);
        } else {
          paragraph.children.push(result);
        }
      }
    });

    if (paragraph.children.length === 0) {
      paragraph.children.push({
        type: 'text',
        text: editor.textContent || '',
        format: [],
      });
    }

    state.children.push(paragraph);
    return state;
  }, []);

  const updateStateDisplay = useCallback(() => {
    const state = parseContentToState();
    const json = JSON.stringify(state, null, 2);
    setStateHtml(syntaxHighlight(json));
  }, [parseContentToState]);

  useEffect(() => {
    queueMicrotask(updateStateDisplay);
  }, [updateStateDisplay]);

  const handleInput = () => {
    updateStateDisplay();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      setTimeout(updateStateDisplay, 10);
    }
  };

  const handleBold = () => {
    document.execCommand('bold', false);
    setBoldActive((prev) => !prev);
    updateStateDisplay();
  };

  const handleItalic = () => {
    document.execCommand('italic', false);
    setItalicActive((prev) => !prev);
    updateStateDisplay();
  };

  const handleUnderline = () => {
    document.execCommand('underline', false);
    setUnderlineActive((prev) => !prev);
    updateStateDisplay();
  };

  return (
    <section id='state' className='demo-section active'>
      <SectionHeader
        title='State Model &amp; Formatting'
        subtitle='How editors represent content internally (not as raw HTML)'
      />

      <Grid cols={2}>
        <Card variant='large'>
          <CardHeader>
            <h3>Editor (Type here)</h3>
            <Toolbar>
              <ToolbarButton
                active={boldActive}
                title='Bold'
                onClick={handleBold}
              >
                B
              </ToolbarButton>
              <ToolbarButton
                active={italicActive}
                title='Italic'
                onClick={handleItalic}
              >
                <em>I</em>
              </ToolbarButton>
              <ToolbarButton
                active={underlineActive}
                title='Underline'
                onClick={handleUnderline}
              >
                <u>U</u>
              </ToolbarButton>
            </Toolbar>
          </CardHeader>
          <CardContent>
            <div
              ref={editorRef}
              className='demo-contenteditable large'
              contentEditable
              suppressContentEditableWarning
              onInput={handleInput}
              onKeyDown={handleKeyDown}
            >
              Hello World
            </div>
          </CardContent>
        </Card>

        <Card variant='large'>
          <CardHeader>
            <h3>Internal State Model</h3>
            <Badge variant='green' live>
              LIVE
            </Badge>
          </CardHeader>
          <CardContent>
            <pre className='code-output json'>
              <code dangerouslySetInnerHTML={{ __html: stateHtml }} />
            </pre>
          </CardContent>
        </Card>
      </Grid>

      <Card>
        <CardHeader>
          <h3>🎨 How Formatting Works</h3>
        </CardHeader>
        <CardContent>
          <div className='format-example'>
            <p>
              For the text: <strong>Tarzan</strong>{' '}
              <strong>
                <u>and</u>
              </strong>{' '}
              <u>Jane</u>
            </p>

            <div className='approach-comparison'>
              <div className='approach'>
                <h4>❌ Nested Tags (Complex)</h4>
                <pre>
                  <Code>
                    {`<strong>Tarzan <u>and</u></strong><u> Jane</u>`}
                  </Code>
                </pre>
                <p className='con'>Hard to edit - need to manage nesting!</p>
              </div>
              <div className='approach preferred'>
                <h4>✅ Flat Text Nodes (Lexical&apos;s Approach)</h4>
                <pre>
                  <Code>
                    {`[
  { text: "Tarzan ", format: ["bold"] },
  { text: "and", format: ["bold", "underline"] },
  { text: " Jane", format: ["underline"] }
]`}
                  </Code>
                </pre>
                <p className='pro'>Easy to edit - just update format arrays!</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3>🌳 Node Tree Structure</h3>
        </CardHeader>
        <CardContent>
          <div className='tree'>
            <div className='tree-node root'>
              <span>Root</span>
              <div className='tree-children'>
                <div className='tree-node element'>
                  <span>Paragraph</span>
                  <div className='tree-children'>
                    <div className='tree-node text'>
                      <span>&quot;Hello &quot;</span>
                      <span className='format-tag'>bold</span>
                    </div>
                    <div className='tree-node text'>
                      <span>&quot;World&quot;</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className='tree-legend'>
            <span className='legend-item root'>Root Node</span>
            <span className='legend-item element'>Element Node</span>
            <span className='legend-item text'>Text Node (leaf)</span>
          </p>
        </CardContent>
      </Card>

      <Card variant='insight'>
        <CardHeader>
          <h3>🎯 Why Use a Custom State Model?</h3>
        </CardHeader>
        <CardContent>
          <ul>
            <li>
              <strong>Portability:</strong> Same data can render on web, mobile,
              etc.
            </li>
            <li>
              <strong>Safety:</strong> No raw HTML = no XSS vulnerabilities
            </li>
            <li>
              <strong>Undo/Redo:</strong> Easy to snapshot and restore states
            </li>
            <li>
              <strong>Testing:</strong> Can test logic without a browser
              (headless)
            </li>
            <li>
              <strong>Tamper-proof:</strong> Browser extensions can&apos;t
              corrupt your source of truth
            </li>
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
