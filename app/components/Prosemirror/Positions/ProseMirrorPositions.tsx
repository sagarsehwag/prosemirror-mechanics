'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Card, CardHeader, CardContent, Button, Code } from '../../ui';
import { POSITION_TOOLTIPS, getProseMirrorPosition } from '../utils';

const POSITION_TOKENS = [
  '<p>',
  'O',
  'n',
  'e',
  '</p>',
  '<bq>',
  '<p>',
  'T',
  'w',
  'o',
  '[img]',
  '</p>',
  '</bq>',
] as const;

type PositionsSubTab = 'positions' | 'selection';

export default function ProseMirrorPositions() {
  const [activeSubTab, setActiveSubTab] =
    useState<PositionsSubTab>('positions');
  const [hoveredPosition, setHoveredPosition] = useState<number | null>(null);
  const [selectionExample, setSelectionExample] = useState<
    'cursor' | 'forward' | 'backward'
  >('forward');
  const liveEditorRef = useRef<HTMLDivElement>(null);
  const liveAnchorRef = useRef<HTMLSpanElement>(null);
  const liveHeadRef = useRef<HTMLSpanElement>(null);
  const liveFromToRef = useRef<HTMLSpanElement>(null);

  const updateLiveSelection = useCallback(() => {
    const sel = window.getSelection();
    const editor = liveEditorRef.current;
    const clear = () => {
      if (liveAnchorRef.current) liveAnchorRef.current.textContent = '—';
      if (liveHeadRef.current) liveHeadRef.current.textContent = '—';
      if (liveFromToRef.current) liveFromToRef.current.textContent = '—';
    };
    if (!sel || !editor || sel.rangeCount === 0) {
      clear();
      return;
    }
    const inEditor = sel.anchorNode && editor.contains(sel.anchorNode);
    if (!inEditor) {
      clear();
      return;
    }
    const anchorPos = getProseMirrorPosition(
      editor,
      sel.anchorNode!,
      sel.anchorOffset,
    );
    const headPos = getProseMirrorPosition(
      editor,
      sel.focusNode!,
      sel.focusOffset,
    );
    const from = Math.min(anchorPos, headPos);
    const to = Math.max(anchorPos, headPos);
    if (liveAnchorRef.current)
      liveAnchorRef.current.textContent = String(anchorPos);
    if (liveHeadRef.current) liveHeadRef.current.textContent = String(headPos);
    if (liveFromToRef.current) {
      liveFromToRef.current.textContent = sel.isCollapsed
        ? `${from} (cursor)`
        : `${from} / ${to}`;
    }
  }, []);

  useEffect(() => {
    const editor = liveEditorRef.current;
    if (editor && activeSubTab === 'selection' && !editor.hasChildNodes()) {
      editor.innerHTML =
        '<p><strong>Prosemirror</strong> uses positions: integer offsets into a flat token sequence.</p>' +
        '<p>Select text here to see <em>anchor</em> and <em>head</em> update in real time. Cursor = anchor = head.</p>' +
        '<blockquote><p>Blockquotes, paragraphs, and other block nodes each add structure. Positions increment at boundaries.</p></blockquote>' +
        '<p>The quick brown fox jumps over the lazy dog. Try selecting across paragraphs to see how positions span blocks.</p>' +
        '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>' +
        '<p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.</p>';
    }
  }, [activeSubTab]);

  useEffect(() => {
    const handleChange = () => {
      const editor = liveEditorRef.current;
      const sel = window.getSelection();
      if (editor && sel?.anchorNode && editor.contains(sel.anchorNode)) {
        updateLiveSelection();
      }
    };
    document.addEventListener('selectionchange', handleChange);
    return () => document.removeEventListener('selectionchange', handleChange);
  }, [updateLiveSelection]);

  return (
    <div className='positions-tab'>
      <div className='positions-sub-tabs'>
        <button
          type='button'
          className={`positions-sub-tab ${activeSubTab === 'positions' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('positions')}
        >
          Positions
        </button>
        <button
          type='button'
          className={`positions-sub-tab ${activeSubTab === 'selection' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('selection')}
        >
          Selection
        </button>
      </div>

      {activeSubTab === 'positions' && (
        <>
          <Card className='prosemirror-section positions-intro'>
            <CardHeader>
              <h3>Positions: Integer Offsets</h3>
            </CardHeader>
            <CardContent>
              <p>
                A document position is an integer: the index in a flat{' '}
                <strong>token sequence</strong>. Selection, transforms, and
                slices all use these positions. Document size ={' '}
                <Code>doc.content.size</Code> (e.g. 14 for the doc below).
              </p>
              <div className='content-expr-grid position-rules-grid'>
                <div className='content-expr-item'>
                  <Code>+1</Code>
                  <span>Per character in text nodes</span>
                </div>
                <div className='content-expr-item'>
                  <Code>+1</Code>
                  <span>Entering a non-leaf node</span>
                </div>
                <div className='content-expr-item'>
                  <Code>+1</Code>
                  <span>Leaving a non-leaf node</span>
                </div>
                <div className='content-expr-item'>
                  <Code>+1</Code>
                  <span>Leaf node (img, br, hr) = 1 token</span>
                </div>
              </div>

              <div className='position-sequence'>
                <p className='position-legend'>
                  Positions are indices in the token sequence. The start of the
                  document, right before the first content, is position 0. Hover
                  to see each position.
                </p>
                <div className='position-row'>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((pos) => (
                    <span
                      key={pos}
                      className={`pos-gap ${hoveredPosition === pos ? 'active' : ''}`}
                      onMouseEnter={() => setHoveredPosition(pos)}
                      onMouseLeave={() => setHoveredPosition(null)}
                    >
                      <span className='pos-num'>{pos}</span>
                      {pos < 13 && (
                        <span
                          className={`pos-token ${hoveredPosition === pos ? 'active' : ''}`}
                        >
                          {POSITION_TOKENS[pos]}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
                <div className='position-tooltip-slot'>
                  <div className='position-tooltip'>
                    {hoveredPosition !== null
                      ? POSITION_TOOLTIPS[hoveredPosition]
                      : 'Hover over a position'}
                  </div>
                </div>
              </div>
        </CardContent>
      </Card>

      <Card className='prosemirror-section'>
        <CardHeader>
          <h4>How We Count to 14</h4>
        </CardHeader>
        <CardContent>
              <div className='position-count-table-wrapper'>
                <table className='position-count-table'>
                  <thead>
                    <tr>
                      <th>Pos</th>
                      <th>Token</th>
                      <th>Step</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <Code>0</Code>
                      </td>
                      <td>&lt;p&gt;</td>
                      <td>Start of document, right before first content</td>
                    </tr>
                    <tr>
                      <td>
                        <Code>1</Code>
                      </td>
                      <td>O</td>
                      <td>
                        After &lt;p&gt;. Enter paragraph, first char of
                        &quot;One&quot;
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Code>2</Code>
                      </td>
                      <td>n</td>
                      <td>After &quot;O&quot;</td>
                    </tr>
                    <tr>
                      <td>
                        <Code>3</Code>
                      </td>
                      <td>e</td>
                      <td>After &quot;n&quot;</td>
                    </tr>
                    <tr>
                      <td>
                        <Code>4</Code>
                      </td>
                      <td>&lt;/p&gt;</td>
                      <td>After &quot;e&quot;. Leave paragraph</td>
                    </tr>
                    <tr>
                      <td>
                        <Code>5</Code>
                      </td>
                      <td>&lt;bq&gt;</td>
                      <td>After &lt;/p&gt;. Enter blockquote</td>
                    </tr>
                    <tr>
                      <td>
                        <Code>6</Code>
                      </td>
                      <td>&lt;p&gt;</td>
                      <td>After &lt;blockquote&gt;. Enter paragraph</td>
                    </tr>
                    <tr>
                      <td>
                        <Code>7</Code>
                      </td>
                      <td>T</td>
                      <td>
                        After &lt;p&gt;, before &quot;T&quot; in &quot;Two&quot;
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Code>8</Code>
                      </td>
                      <td>w</td>
                      <td>After &quot;T&quot;</td>
                    </tr>
                    <tr>
                      <td>
                        <Code>9</Code>
                      </td>
                      <td>o</td>
                      <td>After &quot;w&quot;</td>
                    </tr>
                    <tr>
                      <td>
                        <Code>10</Code>
                      </td>
                      <td>[img]</td>
                      <td>After &quot;o&quot;. Leaf node = 1 token</td>
                    </tr>
                    <tr>
                      <td>
                        <Code>11</Code>
                      </td>
                      <td>&lt;/p&gt;</td>
                      <td>After [img]. Leave paragraph</td>
                    </tr>
                    <tr>
                      <td>
                        <Code>12</Code>
                      </td>
                      <td>&lt;/bq&gt;</td>
                      <td>After &lt;/p&gt;. Leave blockquote</td>
                    </tr>
                    <tr>
                      <td>
                        <Code>13</Code>
                      </td>
                      <td>—</td>
                      <td>End of document (after &lt;/blockquote&gt;)</td>
                    </tr>
                  </tbody>
                </table>
                <p className='position-flow-legend'>
                  Entering or leaving a non-leaf node counts as one token. Each
                  character = 1 token. Leaf nodes = 1 token.
                </p>
              </div>
        </CardContent>
      </Card>

      <Card className='prosemirror-section'>
        <CardHeader>
          <h4>ResolvedPos</h4>
        </CardHeader>
        <CardContent>
              <p>
                <Code>doc.resolve(pos)</Code> returns a <Code>ResolvedPos</Code>{' '}
                with context: parent node, offset into parent, ancestors,{' '}
                <Code>before()</Code> / <Code>after()</Code>.
              </p>
              <p className='rp-depth-explanation'>
                <strong>depth</strong> = number of levels the parent node is
                from the root. 0 if pointing into the root, 1 for a top-level
                paragraph, etc.
              </p>
              <p className='rp-depth-explanation'>
                <strong>before(depth)</strong> / <strong>after(depth)</strong> =
                the (absolute) position directly before or after the wrapping
                node at that depth. Default depth is the current position&apos;s
                depth.
              </p>
              <div className='rp-before-after-visual'>
                <p className='rp-ba-label'>At pos 6 (inside blockquote):</p>
                <div className='rp-ba-doc'>
                  {[
                    [0, '<p>'],
                    [1, 'O'],
                    [2, 'n'],
                    [3, 'e'],
                    [4, '</p>'],
                    [5, '<bq>'],
                    [6, '<p>'],
                    [7, 'T'],
                    [8, 'w'],
                    [9, 'o'],
                    [10, 'img'],
                    [11, '</p>'],
                    [12, '</bq>'],
                    [13, null],
                  ].map(([pos, token]) => {
                    const posNum = Number(pos);
                    const isBefore = posNum === 5;
                    const isAfter = posNum === 13;
                    const inBlockquote = posNum >= 5 && posNum < 13;
                    return (
                      <span
                        key={pos}
                        className={`rp-ba-gap ${inBlockquote ? 'in-blockquote' : ''}`}
                      >
                        <span
                          className={`rp-ba-pos ${isBefore ? 'before' : ''} ${isAfter ? 'after' : ''}`}
                        >
                          {pos}
                          {isBefore && (
                            <span className='rp-ba-tag'>before()</span>
                          )}
                          {isAfter && (
                            <span className='rp-ba-tag'>after()</span>
                          )}
                        </span>
                        {token != null && (
                          <span className='rp-ba-token'>{token}</span>
                        )}
                      </span>
                    );
                  })}
                </div>
                <p className='rp-ba-legend'>
                  <span className='rp-ba-legend-item'>
                    <span className='rp-ba-swatch before' /> before(5)
                  </span>
                  <span className='rp-ba-legend-item'>
                    <span className='rp-ba-swatch after' /> after(13)
                  </span>
                  <span className='rp-ba-legend-item'>
                    <span className='rp-ba-swatch blockquote' /> blockquote
                  </span>
                </p>
              </div>
              <div className='resolvedpos-visual'>
                <div className='resolvedpos-doc'>
                  <div className='resolvedpos-tree'>
                    <div className='rp-node'>
                      <span className='rp-node-name'>doc</span>
                      <span className='rp-depth'>depth 0</span>
                      <div className='rp-children'>
                        <div className='rp-node'>
                          <span className='rp-node-name'>p</span>
                          <span className='rp-node-content'>
                            &quot;One&quot;
                          </span>
                          <span className='rp-depth'>depth 1</span>
                        </div>
                        <div className='rp-node rp-highlight'>
                          <span className='rp-node-name'>blockquote</span>
                          <span className='rp-pos-badge'>pos 6</span>
                          <span className='rp-depth'>depth 1</span>
                          <div className='rp-children'>
                            <div className='rp-node'>
                              <span className='rp-node-name'>p</span>
                              <span className='rp-node-content'>
                                &quot;Two&quot;
                              </span>
                              <span className='rp-depth'>depth 2</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='resolvedpos-props'>
                  <p className='resolvedpos-code'>
                    <Code>doc.resolve(6)</Code>
                  </p>
                  <div className='rp-prop'>
                    <span className='rp-prop-name'>parent</span>
                    <span className='rp-prop-value'>blockquote</span>
                  </div>
                  <div className='rp-prop'>
                    <span className='rp-prop-name'>depth</span>
                    <span className='rp-prop-value'>1</span>
                  </div>
                  <div className='rp-prop'>
                    <span className='rp-prop-name'>before()</span>
                    <span className='rp-prop-value'>5</span>
                  </div>
                  <div className='rp-prop'>
                    <span className='rp-prop-name'>after()</span>
                    <span className='rp-prop-value'>13</span>
                  </div>
                  <p className='rp-note'>
                    before/after = parent block boundaries
                  </p>
                </div>
              </div>
        </CardContent>
      </Card>

      <Card className='prosemirror-section'>
        <CardHeader>
          <h4>Ranges (from, to)</h4>
        </CardHeader>
        <CardContent>
              <p>
                A range is a pair of positions. <Code>to</Code> is exclusive:
                the content between <Code>from</Code> and <Code>to</Code>{' '}
                includes positions from <Code>from</Code> up to (not including){' '}
                <Code>to</Code>.
              </p>
              <div className='range-visual'>
                <p className='range-visual-label'>
                  <Code>from=3, to=8</Code>: since <Code>to</Code> is exclusive,
                  positions 3–7
                </p>
                <div className='range-doc-visual'>
                  {[
                    [0, '<p>'],
                    [1, 'O'],
                    [2, 'n'],
                    [3, 'e'],
                    [4, '</p>'],
                    [5, '<p>'],
                    [6, 'T'],
                    [7, 'w'],
                    [8, 'o'],
                    [9, '</p>'],
                  ].map(([pos, token]) => {
                    const inRange = Number(pos) >= 3 && Number(pos) < 8;
                    return (
                      <span
                        key={pos}
                        className={`range-gap ${inRange ? 'in-range' : ''}`}
                      >
                        <span className='range-pos'>{pos}</span>
                        <span className='range-token'>{token}</span>
                      </span>
                    );
                  })}
                </div>
                <p className='range-result'>
                  Content: <Code>e</Code> <Code>&lt;/p&gt;</Code>{' '}
                  <Code>&lt;p&gt;</Code> <Code>T</Code> <Code>w</Code>
                </p>
              </div>
        </CardContent>
      </Card>

      <Card className='prosemirror-section'>
        <CardHeader>
          <h4>Slice</h4>
        </CardHeader>
        <CardContent>
              <p>
                <Code>doc.slice(from, to)</Code> cuts a slice of the document:
                the content between two positions. Used for copy-paste and
                drag-drop.
              </p>
              <p>
                <strong>Open vs closed:</strong> Selecting whole nodes → closed
                slice (openStart: 0, openEnd: 0). Cutting through nodes → open
                boundaries (incomplete nodes at edges).
              </p>
              <div className='slice-visual'>
                <div className='slice-scenario'>
                  <h5>Closed</h5>
                  <div className='slice-doc-visual'>
                    <span className='slice-block selected'>One</span>
                    <span className='slice-block'>Two</span>
                  </div>
                  <p className='slice-range'>
                    <Code>slice(0, 5)</Code>
                  </p>
                  <div className='slice-result closed'>
                    <Code>&lt;p&gt;One&lt;/p&gt;</Code>
                    <span className='slice-meta'>openStart: 0, openEnd: 0</span>
                  </div>
                </div>
                <div className='slice-scenario'>
                  <h5>Open</h5>
                  <div className='slice-doc-visual'>
                    <span className='slice-block'>
                      <span className='slice-cut'>│</span>
                      <span className='slice-selected'>One</span>
                    </span>
                    <span className='slice-block'>
                      <span className='slice-selected'>Tw</span>
                      <span className='slice-cut'>│</span>
                      <span className='slice-unselected'>o</span>
                    </span>
                  </div>
                  <p className='slice-range'>
                    <Code>slice(1, 8)</Code>
                  </p>
                  <div className='slice-result open'>
                    <Code>…ne&lt;/p&gt;&lt;p&gt;Tw…</Code>
                    <span className='slice-meta'>openStart: 1, openEnd: 1</span>
                  </div>
                </div>
              </div>
          </CardContent>
        </Card>
        </>
      )}

      {activeSubTab === 'selection' && (
        <Card className='prosemirror-section'>
          <CardHeader>
            <h3>Selection</h3>
          </CardHeader>
          <CardContent>
            <p>
              Selections have <strong>anchor</strong> (unmoveable) and{' '}
              <strong>head</strong> (moveable). Both are positions pointing
              into the document.
              <Code>from</Code> = min(anchor, head), <Code>to</Code> =
              max(anchor, head).
            </p>
            <div className='selection-demo-controls'>
              <Button
                variant={selectionExample === 'cursor' ? 'primary' : 'secondary'}
                size='sm'
                onClick={() => setSelectionExample('cursor')}
              >
                Cursor at 5
              </Button>
              <Button
                variant={selectionExample === 'forward' ? 'primary' : 'secondary'}
                size='sm'
                onClick={() => setSelectionExample('forward')}
              >
                Select 3→8
              </Button>
              <Button
                variant={selectionExample === 'backward' ? 'primary' : 'secondary'}
                size='sm'
                onClick={() => setSelectionExample('backward')}
              >
                Select 8→3
              </Button>
            </div>
            <div className='pm-selection-visual'>
              <div className='pm-selection-unified'>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((pos) => {
                  const anchor =
                    selectionExample === 'cursor'
                      ? 5
                      : selectionExample === 'forward'
                        ? 3
                        : 8;
                  const head =
                    selectionExample === 'cursor'
                      ? 5
                      : selectionExample === 'forward'
                        ? 8
                        : 3;
                  const from = Math.min(anchor, head);
                  const to = Math.max(anchor, head);
                  const isAnchor = pos === anchor;
                  const isHead = pos === head && anchor !== head;
                  const isInRange = pos >= from && pos < to;
                  const cursorHere = selectionExample === 'cursor' && pos === 5;
                  const token = POSITION_TOKENS[pos];
                  return (
                    <span
                      key={pos}
                      className={`pm-sel-gap ${isInRange ? 'in-range' : ''} ${cursorHere ? 'cursor-pos' : ''}`}
                    >
                      <span
                        className={`pm-sel-pos-num ${isAnchor ? 'anchor' : ''} ${isHead ? 'head' : ''}`}
                      >
                        {pos}
                        {isAnchor && <span className='pos-label'>anchor</span>}
                        {isHead && <span className='pos-label'>head</span>}
                      </span>
                      {pos < 13 && (
                        <span
                          className={`pm-sel-token ${isInRange ? 'selected' : ''}`}
                        >
                          {token}
                          {cursorHere && (
                            <span className='pm-cursor' aria-hidden>
                              |
                            </span>
                          )}
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
              <div className='pm-selection-summary'>
                <span className='pm-marker anchor'>
                  anchor ={' '}
                  {selectionExample === 'cursor'
                    ? 5
                    : selectionExample === 'forward'
                      ? 3
                      : 8}
                </span>
                <span className='pm-marker head'>
                  head ={' '}
                  {selectionExample === 'cursor'
                    ? 5
                    : selectionExample === 'forward'
                      ? 8
                      : 3}
                </span>
              </div>
            </div>
            <div className='pm-live-selection'>
              <h5>Live: select text below</h5>
              <div className='pm-live-editor-wrapper'>
                <div
                  ref={liveEditorRef}
                  className='pm-live-editor'
                  contentEditable
                  suppressContentEditableWarning
                />
              </div>
              <div className='pm-live-state'>
                <div className='state-row'>
                  <span className='state-label'>anchor:</span>
                  <span className='state-value' ref={liveAnchorRef}>
                    —
                  </span>
                </div>
                <div className='state-row'>
                  <span className='state-label'>head:</span>
                  <span className='state-value' ref={liveHeadRef}>
                    —
                  </span>
                </div>
                <div className='state-row'>
                  <span className='state-label'>from / to:</span>
                  <span className='state-value' ref={liveFromToRef}>
                    —
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
