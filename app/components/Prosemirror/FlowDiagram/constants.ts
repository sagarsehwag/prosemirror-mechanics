export const STEPS = [
  {
    id: 'view-input',
    label: 'EditorView',
    sublabel: 'Input handler',
    desc: 'Captures DOM input (keydown, input, paste)',
    code: 'view.dom.addEventListener(...)',
    detail: 'Creates Transaction from DOM change',
    tooltip:
      'Listens to keydown, input, paste, cut on the contentEditable DOM. Input handlers parse the DOM change into a Transaction with steps (e.g. ReplaceStep for typing).',
    color: 'purple',
  },
  {
    id: 'transaction',
    label: 'Transaction',
    sublabel: 'Steps',
    desc: 'ReplaceStep, AddMarkStep, etc.',
    code: 'tr.steps',
    detail: 'Plugins: filterTransaction, appendTransaction',
    tooltip:
      'A Transaction holds an array of Steps. Plugins run filterTransaction (can reject) and appendTransaction (can add steps). History plugin stores inverse steps for undo.',
    color: 'orange',
  },
  {
    id: 'apply',
    label: 'Apply Transaction',
    sublabel: 'Immutable',
    desc: 'Returns new EditorState',
    code: 'const newState = state.apply(tr)',
    detail: 'Old state unchanged. Enables undo.',
    tooltip:
      'state.apply(tr) creates a new EditorState by mapping each step over the doc. Old state is unchanged (structural sharing). Plugin state is updated via state.apply.',
    color: 'green',
  },
  {
    id: 'view-update',
    label: 'Update EditorView',
    sublabel: 'Re-render',
    desc: 'Updates DOM from new state',
    code: 'view.updateState(newState)',
    detail: 'Efficient diffing, preserves selection',
    tooltip:
      'Compares new state to current DOM, applies minimal DOM updates. Preserves cursor position and selection. Uses DOMSerializer for node views.',
    color: 'blue',
  },
] as const;

export const DEBOUNCE_MS = 500;
export const FLASH_DURATION_MS = 1600;
export const STATE_APPLY_DURATION_MS = 2800;
export const MAX_TRANSACTIONS = 10;
