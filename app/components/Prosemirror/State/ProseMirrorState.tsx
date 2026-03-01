'use client';

import React from 'react';
import { CodeBlock, Card, CardHeader, CardContent } from '../../ui';

export default function ProseMirrorState() {
  return (
    <div className='state-tab'>
      <Card className='prosemirror-section state-intro'>
        <CardHeader>
          <h3>What is EditorState?</h3>
        </CardHeader>
        <CardContent>
          <p>
            <strong>EditorState</strong> is the single source of truth for the
            document, selection, stored marks, schema, and plugin state. It is
            immutable: you never mutate it directly. Instead, you create a new
            state by applying a transaction.
          </p>
          <div className='state-intro-tagline'>
            Everything the editor displays comes from state.
          </div>
          <div className='state-single-source'>
            <div className='state-ss-hub'>
              <div className='state-ss-box'>EditorState</div>
              <span className='state-ss-hub-label'>
                All read from &amp; write to
              </span>
            </div>
            <div className='state-ss-connector' aria-hidden='true' />
            <div className='state-ss-items'>
              <div className='state-ss-item'>
                <span className='state-ss-label'>View</span>
                <span className='state-ss-desc'>Reads doc → renders</span>
                <span className='state-ss-desc'>
                  Writes → dispatches transactions
                </span>
              </div>
              <div className='state-ss-item'>
                <span className='state-ss-label'>Commands</span>
                <span className='state-ss-desc'>Reads state → decides</span>
                <span className='state-ss-desc'>
                  Writes → creates transactions
                </span>
              </div>
              <div className='state-ss-item'>
                <span className='state-ss-label'>Plugins</span>
                <span className='state-ss-desc'>
                  Reads state → pluginState()
                </span>
                <span className='state-ss-desc'>Writes → apply(tr)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='prosemirror-section'>
        <CardHeader>
          <h4>How State Changes</h4>
        </CardHeader>
        <CardContent>
          <p>
            Updates are never in-place. You create a transaction (steps) and
            apply it. That returns a new EditorState; the old one is unchanged.
            This enables undo, redo, and collaborative editing.
          </p>
          <div className='state-flow-visual'>
            <div className='state-flow-box'>EditorState</div>
            <div className='state-flow-arrow-wrap'>
              <span className='state-flow-arrow-label'>create</span>
              <div className='state-flow-arrow'>
                state.tr.insertText(&quot;x&quot;)
              </div>
            </div>
            <div className='state-flow-box'>Transaction</div>
            <div className='state-flow-arrow-wrap'>
              <span className='state-flow-arrow-label'>apply</span>
              <div className='state-flow-arrow'>state.apply(tr)</div>
            </div>
            <div className='state-flow-box state-flow-box-new'>
              EditorState&apos;
            </div>
          </div>
          <div className='code-snippet'>
            <CodeBlock
              code={`const tr = state.tr.insertText("hello", 0);
const newState = state.apply(tr);
// state unchanged; newState has the new doc`}
            />
          </div>
          <p className='state-callout'>
            <strong>state.tr</strong> is a shortcut for{' '}
            <code>Transaction.create(state)</code>. Returns a transaction you
            can chain steps on (<code>tr.insertText()</code>,{' '}
            <code>tr.delete()</code>, etc.).
          </p>
        </CardContent>
      </Card>

      <Card className='prosemirror-section'>
        <CardHeader>
          <h4>Creating State</h4>
        </CardHeader>
        <CardContent>
          <p>
            To bootstrap an editor, use <code>EditorState.create()</code>. You
            need a schema and (optionally) an initial document. Plugins and
            custom selection can be passed too.
          </p>
          <div className='code-snippet'>
            <CodeBlock
              code={`const state = EditorState.create({
  schema: mySchema,
  doc: docFromJSON(schema, { type: "doc", content: [...] }),
  plugins: [history(), keymap(...)]
});`}
            />
          </div>
          <p className='section-note'>
            <code>doc</code> defaults to an empty paragraph if omitted.{' '}
            <code>plugins</code> add history, keybindings, and more. See the
            Plugins tab for details.
          </p>
        </CardContent>
      </Card>

      <Card className='prosemirror-section'>
        <CardHeader>
          <h4>Built-in Fields</h4>
        </CardHeader>
        <CardContent>
          <p>
            Every EditorState has these core fields. <code>doc</code> and{' '}
            <code>selection</code> are the ones you use most; plugins extend
            with their own state.
          </p>
          <div className='state-structure-merged'>
            <div className='state-object-box'>
              <div className='state-object-header'>EditorState</div>
              <div className='state-object-body'>
                <div className='state-object-row'>
                  <span className='key'>doc</span>
                  <span className='arrow'>→</span>
                  <span className='value'>ProseMirrorNode</span>
                  <span className='state-field-desc'>Content tree</span>
                </div>
                <div className='state-object-row'>
                  <span className='key'>selection</span>
                  <span className='arrow'>→</span>
                  <span className='value'>Selection</span>
                  <span className='state-field-desc'>
                    Caret/selection (anchor, head)
                  </span>
                </div>
                <div className='state-object-row'>
                  <span className='key'>storedMarks</span>
                  <span className='arrow'>→</span>
                  <span className='value'>Mark[] | null</span>
                  <span className='state-field-desc'>
                    Marks for next typed char
                  </span>
                </div>
                <div className='state-object-row'>
                  <span className='key'>schema</span>
                  <span className='arrow'>→</span>
                  <span className='value'>Schema</span>
                  <span className='state-field-desc'>
                    Schema this state conforms to
                  </span>
                </div>
                <div className='state-object-row'>
                  <span className='key'>plugins</span>
                  <span className='arrow'>→</span>
                  <span className='value'>PluginState[]</span>
                  <span className='state-field-desc'>
                    Plugin instances + state
                  </span>
                </div>
              </div>
            </div>

            <h5>doc and selection together</h5>
            <p>
              <code>doc</code> holds the content; <code>selection</code> (from,
              to) selects a range. Together they describe what the user sees.
            </p>
            <div className='state-doc-selection-visual'>
              <p className='state-ds-label'>
                <code>from=1, to=6</code>
              </p>
              <div className='state-doc-visual'>
                {[
                  [0, '<p>'],
                  [1, 'H'],
                  [2, 'e'],
                  [3, 'l'],
                  [4, 'l'],
                  [5, 'o'],
                  [6, ' '],
                  [7, 'w'],
                  [8, 'o'],
                  [9, 'r'],
                  [10, 'l'],
                  [11, 'd'],
                  [12, '</p>'],
                ].map(([pos, token]) => {
                  const inSel = Number(pos) >= 1 && Number(pos) < 6;
                  return (
                    <span
                      key={pos}
                      className={`state-doc-gap ${inSel ? 'in-selection' : ''}`}
                    >
                      <span className='state-doc-pos'>{pos}</span>
                      <span className='state-doc-token'>{String(token)}</span>
                    </span>
                  );
                })}
              </div>
              <p className='state-ds-legend'>
                Selects &quot;Hello&quot;. See Positions tab for details.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='prosemirror-section'>
        <CardHeader>
          <h4>Plugin State</h4>
        </CardHeader>
        <CardContent>
          <p>
            Each plugin can store its own state. Access it via{' '}
            <code>state.pluginState(plugin)</code> or{' '}
            <code>plugin.getState(state)</code>. When a transaction is applied,
            plugins reconcile their state via <code>plugin.spec.state</code>.
          </p>
          <div className='code-snippet'>
            <CodeBlock
              code={`const historyState = state.pluginState(historyPlugin);
// or: historyPlugin.getState(state)`}
            />
          </div>
          <p className='section-note'>
            Plugin state is immutable too. Plugins return new state from their{' '}
            <code>apply</code> function.
          </p>
        </CardContent>
      </Card>

      <Card className='prosemirror-section'>
        <CardHeader>
          <h4>storedMarks</h4>
        </CardHeader>
        <CardContent>
          <p>
            When the cursor is inside formatted text (e.g. bold),{' '}
            <code>storedMarks</code> holds those marks. The next character you
            type gets them applied automatically. When the cursor is in plain
            text, <code>storedMarks</code> is <code>null</code>.
          </p>
          <div className='state-storedmarks-visual'>
            <div className='state-sm-panel before'>
              <h5>Before typing</h5>
              <p>
                Cursor inside bold: Hello <strong>w|</strong>orld
              </p>
              <div className='state-sm-code'>
                <code>storedMarks: [strong]</code>
              </div>
              <p className='state-sm-hint'>Next typed char will be bold.</p>
            </div>
            <div className='state-sm-panel after'>
              <h5>After typing &quot;x&quot;</h5>
              <p>
                Result: Hello <strong>wx|</strong>orld
              </p>
              <div className='state-sm-code'>
                <code>storedMarks: [strong]</code>
              </div>
              <p className='state-sm-hint'>
                The &quot;x&quot; inherited the bold mark.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
