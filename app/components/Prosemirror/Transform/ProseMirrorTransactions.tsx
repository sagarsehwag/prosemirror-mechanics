'use client';

import React, { useCallback, useRef, useState } from 'react';
import { CodeBlock, Code, Card, CardHeader, CardContent, Button } from '../../ui';

export default function ProseMirrorTransactions() {
  const [txStepState, setTxStepState] = useState<{
    activeStep: number | null;
    completedSteps: Set<number>;
    activeArrows: Set<number>;
  }>({
    activeStep: null,
    completedSteps: new Set(),
    activeArrows: new Set(),
  });
  const [isRunning, setIsRunning] = useState(false);
  const [txButtonText, setTxButtonText] = useState('▶ Start Animation');
  const [txSpeed, setTxSpeed] = useState(3);
  const txAnimationRef = useRef(false);
  const txTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const txSleep = useCallback((ms: number): Promise<void> => {
    return new Promise((resolve) => {
      txTimeoutRef.current = setTimeout(resolve, ms);
    });
  }, []);

  const txReset = useCallback(() => {
    txAnimationRef.current = false;
    if (txTimeoutRef.current) {
      clearTimeout(txTimeoutRef.current);
      txTimeoutRef.current = null;
    }
    setTxStepState({
      activeStep: null,
      completedSteps: new Set(),
      activeArrows: new Set(),
    });
    setIsRunning(false);
    setTxButtonText('▶ Start Animation');
  }, []);

  const txRunAnimation = useCallback(async () => {
    if (txAnimationRef.current) return;
    txReset();
    txAnimationRef.current = true;
    setIsRunning(true);
    setTxButtonText('⏸ Running...');
    const delay = 2000 - txSpeed * 300;

    for (let i = 1; i <= 5; i++) {
      if (!txAnimationRef.current) break;
      setTxStepState((prev) => ({ ...prev, activeStep: i }));
      await txSleep(delay);
      if (!txAnimationRef.current) break;
      setTxStepState((prev) => {
        const newCompleted = new Set(prev.completedSteps);
        newCompleted.add(i);
        const newArrows = new Set(prev.activeArrows);
        newArrows.add(i);
        return {
          activeStep: null,
          completedSteps: newCompleted,
          activeArrows: newArrows,
        };
      });
      await txSleep(delay / 3);
    }

    if (txAnimationRef.current) {
      setTxStepState((prev) => {
        const newCompleted = new Set(prev.completedSteps);
        newCompleted.delete(5);
        return { ...prev, activeStep: 5, completedSteps: newCompleted };
      });
      await txSleep(delay);
    }

    setTxButtonText('▶ Play Again');
    setIsRunning(false);
    txAnimationRef.current = false;
  }, [txSpeed, txReset, txSleep]);

  const getTxStepClass = (step: number): string => {
    const classes = ['update-step'];
    if (step >= 4) classes.push('wide');
    if (txStepState.activeStep === step) classes.push('active');
    if (txStepState.completedSteps.has(step)) classes.push('completed');
    return classes.join(' ');
  };

  const getTxArrowClass = (step: number): string =>
    `flow-arrow ${txStepState.activeArrows.has(step) ? 'active' : ''}`;

  return (
    <div className='transactions-tab'>
      <Card className='prosemirror-section transactions-intro'>
        <CardHeader>
          <h3>What is a Transform?</h3>
        </CardHeader>
        <CardContent>
          <p>
            A <strong>Transform</strong> is a sequence of steps applied to a
            document. A <strong>Transaction</strong> extends it with selection,
            stored marks, and metadata. It is the full unit of change you create
            and apply. You never mutate state directly; instead, you create a
            transaction and apply it.
          </p>
          <div className='transactions-hierarchy'>
            <div className='tx-hierarchy-flow'>
              <div className='tx-hierarchy-pill'>
                <span className='tx-hierarchy-label'>Step</span>
                <span className='tx-hierarchy-hint'>ReplaceStep, etc.</span>
              </div>
              <span className='tx-hierarchy-arrow'>→</span>
              <div className='tx-hierarchy-pill'>
                <span className='tx-hierarchy-label'>Transform</span>
                <span className='tx-hierarchy-hint'>Step[]</span>
              </div>
              <span className='tx-hierarchy-arrow'>→</span>
              <div className='tx-hierarchy-pill tx-hierarchy-pill-final'>
                <span className='tx-hierarchy-label'>Transaction</span>
                <span className='tx-hierarchy-hint'>
                  Transform + selection, meta
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='prosemirror-section'>
        <CardHeader>
          <h4>The Update Loop</h4>
        </CardHeader>
        <CardContent>
          <p>
            When the user types or pastes, the view creates a transaction,
            applies it to state, and re-renders. This flow is the core of every
            edit.
          </p>
          <div className='update-loop-container'>
            <div className='update-loop-controls'>
              <Button
                variant='primary'
                onClick={txRunAnimation}
                disabled={isRunning}
              >
                {txButtonText}
              </Button>
              <Button variant='secondary' onClick={txReset}>
                ↺ Reset
              </Button>
              <span className='speed-control'>
                <label>Speed:</label>
                <input
                  type='range'
                  min={1}
                  max={5}
                  value={txSpeed}
                  onChange={(e) => setTxSpeed(Number(e.target.value))}
                />
              </span>
            </div>
            <div className='update-loop-diagram'>
              <div className={getTxStepClass(1)}>
                <div className='step-icon'>⌨️</div>
                <div className='step-content'>
                  <h4>1. User Input</h4>
                  <p>Keypress, paste, etc.</p>
                </div>
              </div>
              <div className={getTxArrowClass(1)}>→</div>
              <div className={getTxStepClass(2)}>
                <div className='step-icon'>📋</div>
                <div className='step-content'>
                  <h4>2. Transaction</h4>
                  <p>Create transaction with steps</p>
                </div>
              </div>
              <div className={getTxArrowClass(2)}>→</div>
              <div className={getTxStepClass(3)}>
                <div className='step-icon'>✏️</div>
                <div className='step-content'>
                  <h4>3. Apply Steps</h4>
                  <p>Transform doc via steps</p>
                </div>
              </div>
              <div className={getTxArrowClass(3)}>→</div>
              <div className={getTxStepClass(4)}>
                <div className='step-icon'>📑</div>
                <div className='step-content'>
                  <h4>4. New State</h4>
                  <p>Immutable state update</p>
                </div>
              </div>
              <div className={getTxArrowClass(4)}>→</div>
              <div className={getTxStepClass(5)}>
                <div className='step-icon'>🖥️</div>
                <div className='step-content'>
                  <h4>5. Update View</h4>
                  <p>Diff &amp; patch DOM</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='prosemirror-section'>
        <CardHeader>
          <h4>Common Step Types</h4>
        </CardHeader>
        <CardContent>
          <p>
            Steps describe low-level document changes. The most common is{' '}
            <Code>ReplaceStep</Code>, which can insert, delete, or replace
            content. Higher-level APIs like <Code>tr.insertText</Code>
            and <Code>tr.delete</Code> create steps for you.
          </p>
          <div className='tx-steps-grid'>
            <div className='tx-step-card'>
              <Code>tr.insertText(text, pos)</Code>
              <p>Insert text at position</p>
            </div>
            <div className='tx-step-card'>
              <Code>tr.delete(from, to)</Code>
              <p>Delete range</p>
            </div>
            <div className='tx-step-card'>
              <Code>tr.replaceWith(from, to, node)</Code>
              <p>Replace range with node(s)</p>
            </div>
            <div className='tx-step-card'>
              <Code>tr.setSelection(sel)</Code>
              <p>Update selection (no doc change)</p>
            </div>
            <div className='tx-step-card'>
              <Code>tr.addMark(from, to, mark)</Code>
              <p>Add mark to range</p>
            </div>
            <div className='tx-step-card'>
              <Code>tr.removeMark(from, to, mark)</Code>
              <p>Remove mark from range</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='prosemirror-section'>
        <CardHeader>
          <h4>Creating Transactions</h4>
        </CardHeader>
        <CardContent>
          <p>
            Use <Code>state.tr</Code> (short for{' '}
            <Code>Transaction.create(state)</Code>) to create a transaction.
            Chain methods to add steps and update selection.
          </p>
          <div className='code-snippet'>
            <CodeBlock
              code={`const tr = state.tr
  .insertText("hello", 0)
  .delete(5, 10)
  .setSelection(TextSelection.create(doc, 5));

const newState = state.apply(tr);`}
            />
          </div>
          <p className='transactions-callout'>
            <strong>Chaining:</strong> Each method returns the same transaction
            (mutated in place), so you can chain <Code>insertText</Code>,{' '}
            <Code>delete</Code>, <Code>setSelection</Code>,{' '}
            <Code>setStoredMarks</Code>, and more.
          </p>
        </CardContent>
      </Card>

      <Card className='prosemirror-section'>
        <CardHeader>
          <h4>What&apos;s in a Transaction</h4>
        </CardHeader>
        <CardContent>
          <p>
            A transaction carries steps (document changes) plus metadata.
            Plugins read and extend it via <Code>tr.getMeta()</Code> and{' '}
            <Code>tr.setMeta()</Code>.
          </p>
          <div className='transactions-structure'>
            <div className='tx-struct-row'>
              <span className='tx-struct-key'>steps</span>
              <span className='tx-struct-arrow'>→</span>
              <span className='tx-struct-value'>Step[]</span>
              <span className='tx-struct-desc'>
                Document edits (replace, insert, delete)
              </span>
            </div>
            <div className='tx-struct-row'>
              <span className='tx-struct-key'>docChanged</span>
              <span className='tx-struct-arrow'>→</span>
              <span className='tx-struct-value'>boolean</span>
              <span className='tx-struct-desc'>
                True if steps modify the doc
              </span>
            </div>
            <div className='tx-struct-row'>
              <span className='tx-struct-key'>selection</span>
              <span className='tx-struct-arrow'>→</span>
              <span className='tx-struct-value'>Selection</span>
              <span className='tx-struct-desc'>
                New selection after applying steps
              </span>
            </div>
            <div className='tx-struct-row'>
              <span className='tx-struct-key'>storedMarks</span>
              <span className='tx-struct-arrow'>→</span>
              <span className='tx-struct-value'>Mark[] | null</span>
              <span className='tx-struct-desc'>
                Marks for next typed character
              </span>
            </div>
            <div className='tx-struct-row'>
              <span className='tx-struct-key'>meta</span>
              <span className='tx-struct-arrow'>→</span>
              <span className='tx-struct-value'>Object</span>
              <span className='tx-struct-desc'>
                Plugin metadata (undo, addToHistory, etc.)
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='prosemirror-section'>
        <CardHeader>
          <h4>Applying Transactions</h4>
        </CardHeader>
        <CardContent>
          <p>
            <Code>state.apply(tr)</Code> returns a new EditorState. The
            view&apos;s <Code>dispatchTransaction</Code> callback receives every
            transaction; you apply it and pass the new state back.
          </p>
          <div className='code-snippet'>
            <CodeBlock
              code={`dispatchTransaction(tr) {
  const newState = state.apply(tr);
  state = newState;
  view.updateState(newState);
}`}
            />
          </div>
          <p className='section-note'>
            Transactions enable <strong>undo</strong> (history plugin stores
            inverse steps) and <strong>collaborative editing</strong> (steps can
            be sent over the wire and applied remotely).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
