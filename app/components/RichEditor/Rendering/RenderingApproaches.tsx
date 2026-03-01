'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  SectionHeader,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Badge,
  Instructions,
  ProsConsList,
  Kbd,
  Textarea,
  Table,
  type TableRow,
} from '../../ui';

function CanvasDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    const styles = getComputedStyle(document.documentElement);
    const textColor =
      styles.getPropertyValue('--text-primary').trim() || '#ffffff';
    const bgColor =
      styles.getPropertyValue('--bg-tertiary').trim() || '#242424';

    ctx.fillStyle = textColor;
    ctx.font = "16px 'Fira Code', monospace";
    ctx.fillText('Hello World', 20, 35);

    ctx.font = "bold 16px 'Fira Code', monospace";
    ctx.fillText('(This is rendered text)', 20, 60);

    let cursorVisible = true;
    const cursorX = 180;
    const cursorY = 25;

    const interval = setInterval(() => {
      ctx.fillStyle = bgColor;
      ctx.fillRect(cursorX, cursorY, 2, 20);

      if (cursorVisible) {
        ctx.fillStyle = textColor;
        ctx.fillRect(cursorX, cursorY, 2, 20);
      }
      cursorVisible = !cursorVisible;
    }, 530);

    return () => clearInterval(interval);
  }, []);

  return (
    <canvas ref={canvasRef} className='demo-canvas' width={200} height={80} />
  );
}

function FakeCursorDemo() {
  const demoRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const [showNote, setShowNote] = useState(false);

  const handleWordClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    const word = e.currentTarget;
    const cursor = cursorRef.current;
    if (!cursor) return;

    word.after(cursor);
    cursor.style.animation = 'none';
    // Force reflow
    void cursor.offsetHeight;
    cursor.style.animation = 'fakeBlink 1s step-end infinite';
  };

  return (
    <>
      <div
        className='fake-cursor-demo'
        id='fake-cursor-demo'
        ref={demoRef}
        onMouseEnter={() => setShowNote(true)}
      >
        <span className='word' onClick={handleWordClick}>
          Hello
        </span>{' '}
        <span className='word' onClick={handleWordClick}>
          World
        </span>
        <span className='fake-cursor' ref={cursorRef}></span>
      </div>
      {showNote && (
        <div className='cursor-complexity-note'>
          💡 Real implementation needs: text measurement, line wrapping, font
          metrics, click position calculation...
        </div>
      )}
    </>
  );
}

const COMPARISON_COLUMNS = [
  { key: 'approach', header: 'Approach' },
  { key: 'richFormatting', header: 'Rich Formatting' },
  { key: 'cursors', header: 'Cursors' },
  { key: 'implementation', header: 'Implementation' },
  { key: 'usedBy', header: 'Used By' },
];

const COMPARISON_ROWS: TableRow[] = [
  {
    approach: <code>&lt;textarea&gt;</code>,
    richFormatting: '❌ No',
    cursors: '✅ Native',
    implementation: 'Easy',
    usedBy: 'Code editors, comments',
    _cellClassNames: {
      richFormatting: 'no',
      cursors: 'yes',
      implementation: 'easy',
    },
  },
  {
    approach: <code>DOM + Fake Cursor</code>,
    richFormatting: '✅ Yes',
    cursors: '⚙️ Custom',
    implementation: 'High',
    usedBy: 'Rarely used',
    _cellClassNames: {
      richFormatting: 'yes',
      cursors: 'no',
      implementation: 'hard',
    },
  },
  {
    approach: <code>contenteditable</code>,
    richFormatting: '✅ Yes',
    cursors: '✅ Native',
    implementation: 'Moderate',
    usedBy: 'Lexical, Slate, Gmail',
    _rowClassName: 'highlight-row',
    _cellClassNames: {
      richFormatting: 'yes',
      cursors: 'yes',
      implementation: 'medium',
    },
  },
  {
    approach: <code>&lt;canvas&gt;</code>,
    richFormatting: '✅ Custom',
    cursors: '⚙️ Custom',
    implementation: 'Very High',
    usedBy: 'Google Docs',
    _cellClassNames: {
      richFormatting: 'yes',
      cursors: 'no',
      implementation: 'hard',
    },
  },
];

export default function RenderingApproaches() {
  return (
    <section id='rendering' className='demo-section active'>
      <SectionHeader
        title='Rendering Approaches Comparison'
        subtitle='4 ways to render editable text - each with trade-offs'
      />

      <Grid cols={4}>
        {/* Textarea */}
        <Card>
          <CardHeader>
            <h3>&lt;textarea&gt;</h3>
            <Badge variant='red'>Plain Text Only</Badge>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder='Try typing here...'
              defaultValue={'Hello World\nThis is a second line'}
            />
            <Instructions>
              <p>
                Try: Select text + <Kbd>Ctrl</Kbd>+<Kbd>B</Kbd>
              </p>
              <p className='result'>
                ❌ Nothing happens - no rich text support
              </p>
            </Instructions>
          </CardContent>
          <CardFooter>
            <ProsConsList
              items={[
                { type: 'pro', text: 'Multi-line support' },
                { type: 'con', text: 'No formatting' },
                { type: 'pro', text: 'Native cursor' },
              ]}
            />
          </CardFooter>
        </Card>

        {/* DOM with Fake Cursors */}
        <Card>
          <CardHeader>
            <h3>DOM + Fake Cursor</h3>
            <Badge variant='orange'>Complex!</Badge>
          </CardHeader>
          <CardContent>
            <FakeCursorDemo />
            <Instructions>
              <p>Click words to &quot;move&quot; cursor</p>
              <p className='result'>
                ⚠️ Custom cursor positioning is very hard!
              </p>
            </Instructions>
          </CardContent>
          <CardFooter>
            <ProsConsList
              items={[
                { type: 'pro', text: 'Rich formatting' },
                { type: 'con', text: 'Custom cursor needed' },
                { type: 'con', text: 'Complex text measurement' },
              ]}
            />
          </CardFooter>
        </Card>

        {/* ContentEditable */}
        <Card variant='featured'>
          <CardHeader>
            <h3>contenteditable</h3>
            <Badge variant='green'>Rich Text!</Badge>
          </CardHeader>
          <CardContent>
            <div
              className='demo-contenteditable'
              contentEditable
              suppressContentEditableWarning
              dangerouslySetInnerHTML={{
                __html: 'Hello <strong>World</strong>',
              }}
            />
            <Instructions>
              <p>
                Try: Select text + <Kbd>Ctrl</Kbd>+<Kbd>B</Kbd>
              </p>
              <p className='result'>
                ✅ Text becomes bold! Inspect to see &lt;b&gt; tags
              </p>
            </Instructions>
          </CardContent>
          <CardFooter>
            <ProsConsList
              items={[
                { type: 'pro', text: 'Rich formatting' },
                { type: 'pro', text: 'Native cursor' },
                { type: 'con', text: 'Browser inconsistencies' },
              ]}
            />
          </CardFooter>
        </Card>

        {/* Canvas */}
        <Card>
          <CardHeader>
            <h3>&lt;canvas&gt;</h3>
            <Badge variant='purple'>Custom Everything</Badge>
          </CardHeader>
          <CardContent>
            <CanvasDemo />
            <Instructions>
              <p>Inspect this element in DevTools</p>
              <p className='result'>
                ⚠️ Screen readers can&apos;t access text inside!
              </p>
            </Instructions>
          </CardContent>
          <CardFooter>
            <ProsConsList
              items={[
                { type: 'pro', text: 'Full control' },
                { type: 'con', text: 'Custom cursor needed' },
                { type: 'con', text: 'Accessibility issues' },
              ]}
            />
          </CardFooter>
        </Card>
      </Grid>

      <Card>
        <CardHeader>
          <h3>📊 Feature Comparison</h3>
        </CardHeader>
        <CardContent>
          <Table columns={COMPARISON_COLUMNS} rows={COMPARISON_ROWS} />
        </CardContent>
      </Card>

      <Card variant='insight'>
        <CardHeader>
          <h3>🎯 Key Insight</h3>
        </CardHeader>
        <CardContent>
          <p>
            <strong>contenteditable</strong> is the sweet spot - you get native
            rich text support and cursor handling for free. That&apos;s why
            Lexical, Slate, Quill, and most editors use it!
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
