import type { LifecycleStepDef } from './types';

export const LIFECYCLE_STEPS: LifecycleStepDef[] = [
  {
    id: 'dom-event',
    label: 'DOM Event',
    desc: 'User interaction triggers a browser event',
    tooltip:
      'A user types, clicks, pastes, or presses a key. ' +
      'The browser fires a native DOM event (keydown, input, compositionend, paste, drop, click). ' +
      'ProseMirror\'s EditorView intercepts this event on the contentEditable element before the default browser behavior takes over.',
    color: 'red',
  },
  {
    id: 'tr',
    label: 'Transaction',
    desc: 'Steps accumulated into a mutable transaction object',
    tooltip:
      'The intercepted event is translated into a Transaction: a mutable object that collects one or more Steps ' +
      '(ReplaceStep, AddMarkStep, ReplaceAroundStep). ' +
      'Plugins can append their own steps or metadata. ' +
      'The transaction is then dispatched via view.dispatch(tr).',
    color: 'blue',
  },
  {
    id: 'new-state',
    label: 'new EditorState',
    desc: 'Immutable state created from old state + steps',
    tooltip:
      'Calling state.apply(tr) produces a brand-new, immutable EditorState. ' +
      'Each step is mapped over the document sequentially. ' +
      'The old state remains untouched. Structural sharing keeps this efficient. ' +
      'This is what powers undo/redo and collaborative editing.',
    color: 'slate',
  },
  {
    id: 'editor-view',
    label: 'EditorView',
    desc: 'DOM reconciled with the new state',
    tooltip:
      'The EditorView receives the new state via view.updateState(newState). ' +
      'It diffs the old and new document, applies minimal DOM mutations, ' +
      'restores the cursor and selection, re-renders decorations, ' +
      'and calls each plugin\'s view.update() hook. The cycle then waits for the next DOM event.',
    color: 'purple',
  },
];

export const LIFECYCLE_DELAY_MS = 1800;
export const MAX_TRANSACTIONS = 60;

export const TYPE_COLORS: Record<string, string> = {
  doc: 'var(--accent-purple)',
  selection: 'var(--accent-red)',
  mark: 'var(--accent-orange)',
  history: 'var(--accent-green)',
  meta: 'var(--text-muted)',
};
