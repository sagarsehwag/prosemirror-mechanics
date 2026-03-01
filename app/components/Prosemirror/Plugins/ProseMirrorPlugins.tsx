'use client';

import React from 'react';
import { CodeBlock, Code, Card, CardHeader, CardContent } from '../../ui';

export default function ProseMirrorPlugins() {
  return (
    <div className='plugins-tab'>
      {/* 1. Intro */}
      <Card className='prosemirror-section plugins-intro'>
        <CardHeader>
          <h3>What is a Plugin?</h3>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Plugins</strong> extend ProseMirror with custom state,
            props, and behavior. They hook into the editor lifecycle: filter
            transactions, store state, add keybindings, and attach UI. Pass them
            to <Code>{`EditorState.create({ plugins: [...] })`}</Code>.
          </p>
          <div className='plugins-intro-tagline'>
            History, keymap, input rules, and collab are all plugins.
          </div>
        </CardContent>
      </Card>

      {/* 2. Plugin Spec: one section, one example */}
      <Card className='prosemirror-section'>
        <CardHeader>
          <h4>Plugin Spec</h4>
        </CardHeader>
        <CardContent>
          <p>
            A plugin is <Code>new Plugin(spec)</Code>. The spec defines how it
            participates in the editor lifecycle.
          </p>
          <div className='plugins-spec-grid'>
            <div className='plugins-spec-card'>
              <Code>state</Code>
              <p>
                Init and reconcile plugin state when transactions are applied
              </p>
            </div>
            <div className='plugins-spec-card'>
              <Code>props</Code>
              <p>
                Add handlers to the view (handleDOMEvents, decorations, etc.)
              </p>
            </div>
            <div className='plugins-spec-card'>
              <Code>view</Code>
              <p>Optional EditorView extension (tooltip, menu, DOM overlay)</p>
            </div>
            <div className='plugins-spec-card'>
              <Code>filterTransaction</Code>
              <p>Reject or modify transactions before they&apos;re applied</p>
            </div>
          </div>
          <details className='plugins-spec-accordion'>
            <summary>Example: word count plugin</summary>
            <div className='code-snippet'>
              <CodeBlock
                code={`const wordCountPlugin = new Plugin({
  state: {
    init() { return { words: 0 }; },
    apply(tr, value) {
      if (!tr.docChanged) return value;
      const text = tr.doc.textBetween(0, tr.doc.content.size);
      return { words: text.trim() ? text.trim().split(/\\s+/).length : 0 };
    },
  },
  filterTransaction(tr) { return true; },
});

// Access: state.pluginState(wordCountPlugin)?.words`}
              />
            </div>
          </details>
        </CardContent>
      </Card>

      {/* 3. Common Plugins */}
      <Card className='prosemirror-section'>
        <CardHeader>
          <h4>Common Plugins</h4>
        </CardHeader>
        <CardContent>
          <p>
            ProseMirror ships with core plugins. Import from{' '}
            <Code>prosemirror-history</Code>, <Code>prosemirror-keymap</Code>,
            and similar packages.
          </p>
          <div className='plugins-list'>
            <div className='plugins-list-item'>
              <span className='plugins-list-name'>history()</span>
              <span className='plugins-list-desc'>
                Undo/redo. Stores inverse steps; <Code>undo</Code> and{' '}
                <Code>redo</Code> commands apply them.
              </span>
            </div>
            <div className='plugins-list-item'>
              <span className='plugins-list-name'>keymap(keyBindings)</span>
              <span className='plugins-list-desc'>
                Binds keys to commands. <Code>baseKeymap</Code> adds Enter,
                Backspace, etc.
              </span>
            </div>
            <div className='plugins-list-item'>
              <span className='plugins-list-name'>inputRules</span>
              <span className='plugins-list-desc'>
                Transform typed text (e.g. &quot;---&quot; → horizontal rule,
                &quot;1. &quot; → ordered list).
              </span>
            </div>
            <div className='plugins-list-item'>
              <span className='plugins-list-name'>collab</span>
              <span className='plugins-list-desc'>
                Collaborative editing. Send/receive steps over the wire; merge
                with CRDT-like logic.
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Commands */}
      <Card className='prosemirror-section'>
        <CardHeader>
          <h4>Commands</h4>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Commands</strong> are functions{' '}
            <Code>(state, dispatch, view) → boolean</Code>. They read state,
            optionally dispatch a transaction, and return whether they handled
            the action. Used by keymap, menus, and toolbars.
          </p>
          <div className='code-snippet'>
            <CodeBlock
              code={`const boldCommand = (state, dispatch) => {
  const { from, to } = state.selection;
  if (from === to) return false;
  const mark = schema.marks.bold.create();
  if (dispatch) dispatch(state.tr.addMark(from, to, mark));
  return true;
};

keymap({ "Mod-b": boldCommand });`}
            />
          </div>
          <p className='plugins-callout'>
            <strong>Mod</strong>: Cross-platform modifier. <Code>Cmd</Code> on
            Mac, <Code>Ctrl</Code> elsewhere. <Code>undo</Code> and{' '}
            <Code>redo</Code> from history are commands.
          </p>
        </CardContent>
      </Card>

      {/* 5. Wiring it up */}
      <Card className='prosemirror-section'>
        <CardHeader>
          <h4>Creating an Editor with Plugins</h4>
        </CardHeader>
        <CardContent>
          <p>
            Pass plugins when creating state. Order can matter. For example, history
            should receive transactions before other plugins that might filter
            them.
          </p>
          <div className='code-snippet'>
            <CodeBlock
              code={`import { history } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";

const state = EditorState.create({
  schema,
  plugins: [
    history(),
    keymap(baseKeymap),
    keymap({ "Mod-z": undo, "Mod-y": redo })
  ]
});`}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
