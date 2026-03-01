'use client';

import React, { useState } from 'react';
import { CodeBlock, Code, Card, CardHeader, CardContent } from '../../ui';

type ViewSubTab = 'overview' | 'decorations';

export default function ProseMirrorView() {
  const [activeSubTab, setActiveSubTab] = useState<ViewSubTab>('overview');

  return (
    <div className='view-tab'>
      <div className='view-sub-tabs'>
        <button
          type='button'
          className={`view-sub-tab ${activeSubTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('overview')}
        >
          Overview
        </button>
        <button
          type='button'
          className={`view-sub-tab ${activeSubTab === 'decorations' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('decorations')}
        >
          Decorations
        </button>
      </div>

      {activeSubTab === 'overview' && (
        <>
          <Card className='prosemirror-section view-intro'>
            <CardHeader>
              <h3>What is the View?</h3>
            </CardHeader>
            <CardContent>
              <p>
                The <strong>EditorView</strong> is the UI layer. It reads{' '}
                <Code>state.doc</Code> and renders it to the DOM, handles user
                input (keyboard, mouse, clipboard), and dispatches transactions
                when the user edits.
              </p>
              <p>
                You create it with{' '}
                <Code>new EditorView(element, {`{ state, dispatch }`})</Code>.
                The view subscribes to state updates and re-renders when state
                changes.
              </p>
            </CardContent>
          </Card>
          <Card className='prosemirror-section'>
            <CardHeader>
              <h4>State → View → Dispatch</h4>
            </CardHeader>
            <CardContent>
              <p>
                The view reads state to render. When the user types or selects,
                the view creates a transaction and calls{' '}
                <Code>dispatch(tr)</Code>. The owner (e.g. React) applies it and
                passes new state back; the view re-renders.
              </p>
              <div className='view-flow-diagram'>
                <div className='view-flow-row'>
                  <span className='view-flow-box'>State</span>
                  <span className='view-flow-arrow'>→</span>
                  <span className='view-flow-box'>View (renders doc)</span>
                </div>
                <div className='view-flow-row'>
                  <span className='view-flow-box'>User input</span>
                  <span className='view-flow-arrow'>→</span>
                  <span className='view-flow-box'>dispatch(tr)</span>
                  <span className='view-flow-arrow'>→</span>
                  <span className='view-flow-box'>New State</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='prosemirror-section'>
            <CardHeader>
              <h4>Key Responsibilities</h4>
            </CardHeader>
            <CardContent>
              <ul className='view-responsibilities-list'>
                <li>
                  <strong>Rendering:</strong> Converts <Code>state.doc</Code>{' '}
                  to DOM nodes. Uses a node-view system for custom rendering.
                </li>
                <li>
                  <strong>Input handling:</strong> Keyboard, mouse, clipboard.
                  Maps browser events to transactions.
                </li>
                <li>
                  <strong>Selection:</strong> Syncs{' '}
                  <Code>state.selection</Code> with the DOM selection.
                </li>
                <li>
                  <strong>Props:</strong> <Code>editable</Code>,{' '}
                  <Code>attributes</Code>, event handlers. Passed when creating
                  the view.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className='prosemirror-section'>
            <CardHeader>
              <h4>Creating a View</h4>
            </CardHeader>
            <CardContent>
              <div className='code-snippet'>
                <CodeBlock
                  code={`const view = new EditorView(document.querySelector("#editor"), {
  state,
  dispatchTransaction(tr) {
    const newState = state.apply(tr);
    state = newState;
    view.updateState(newState);
  }
});`}
                />
              </div>
              <p className='section-note'>
                In React, you typically use a wrapper (e.g.{' '}
                <Code>useEditorEffect</Code> or a ref) to create the view and
                wire <Code>dispatchTransaction</Code> to your state setter.
              </p>
            </CardContent>
          </Card>
        </>
      )}

      {activeSubTab === 'decorations' && (
        <Card className='prosemirror-section view-decorations'>
          <CardHeader>
            <h3>Decorations</h3>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Decorations</strong> are visual overlays the view renders
              on top of the document without changing its content. They&apos;re
              provided via <Code>props.decorations</Code> (typically from
              plugins) and used for search highlights, syntax highlighting,
              placeholders, and inline widgets.
            </p>
            <div className='view-deco-visual'>
              <div className='view-deco-example'>
                <span className='view-deco-label'>Document:</span>
                <span className='view-deco-text'>The quick brown fox</span>
              </div>
              <div className='view-deco-example view-deco-highlight'>
                <span className='view-deco-label'>With highlight:</span>
                <span className='view-deco-text'>
                  The <mark>quick</mark> brown fox
                </span>
              </div>
            </div>
            <div className='code-snippet'>
              <CodeBlock
                code={`// Plugin provides decorations via props
const plugin = new Plugin({
  props: {
    decorations(state) {
      const { from, to } = state.selection;
      if (from === to) return null;
      return DecorationSet.create(state.doc, [
        Decoration.inline(from, to, { class: "highlight" })
      ]);
    }
  }
});`}
              />
            </div>
            <div className='view-deco-types'>
              <div className='view-deco-type'>
                <Code>Decoration.inline(from, to, attrs)</Code>
                <p>Wrap a range with a span (highlight, underline)</p>
              </div>
              <div className='view-deco-type'>
                <Code>Decoration.widget(pos, spec)</Code>
                <p>Insert a widget at a position (placeholder, cursor)</p>
              </div>
              <div className='view-deco-type'>
                <Code>Decoration.node(from, to, attrs)</Code>
                <p>Add attributes to a block node</p>
              </div>
            </div>
            <p className='section-note'>
              The view merges all <Code>props.decorations</Code> from plugins
              and renders them when drawing the document.{' '}
              <Code>DecorationSet.map(tr.mapping)</Code> updates positions when
              the doc changes.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
