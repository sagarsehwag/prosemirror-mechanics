'use client';

import React from 'react';
import 'prosemirror-view/style/prosemirror.css';
import { STEPS } from './constants';
import { useProseMirrorEditor } from './hooks/useProseMirrorEditor';
import { useTransactionFlow } from './hooks/useTransactionFlow';
import { Code } from '../../ui';
import { FlowEditorPanel } from './FlowEditorPanel';
import { FlowSteps } from './FlowSteps';
import { TransactionList } from './TransactionList';
import { DataPanelContent } from './DataPanelContent';
import './FlowDiagram.css';

export default function ProseMirrorFlowDiagram() {
  const {
    doc,
    setDoc,
    transactions,
    selectedTx,
    selectedTxId,
    activeStep,
    isPaused,
    handleFlush,
    handleStepHover,
    handleFlowEnter,
    handleFlowLeave,
    handleSelectTransaction,
    handleClearTransactions,
  } = useTransactionFlow();

  const { onEditorReady } = useProseMirrorEditor(setDoc, handleFlush);

  return (
    <div className="pm-flow-diagram pm-flow-diagram-compact">
      <div className="pm-flow-header">
        <h3 className="pm-flow-title">How ProseMirror works</h3>
        <p className="pm-flow-subtitle">
          Type and watch the flow. Data updates live from the real ProseMirror
          instance.
        </p>
      </div>

      <div className="pm-flow-grid">
        <FlowEditorPanel
          onEditorReady={onEditorReady}
          onFlowEnter={handleFlowEnter}
          onFlowLeave={handleFlowLeave}
        >
          <FlowSteps
            activeStep={activeStep}
            isPaused={isPaused}
            onStepHover={handleStepHover}
          />
        </FlowEditorPanel>

        <div className="pm-flow-data-panel">
          <div className="pm-flow-data-header">
            <span>
              {activeStep !== null && STEPS[activeStep]
                ? STEPS[activeStep].label
                : 'Data'}
            </span>
            {transactions.length > 0 && (
              <span className="pm-flow-data-badge">
                {transactions.length} transaction
                {transactions.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <TransactionList
            transactions={transactions}
            selectedTxId={selectedTxId}
            onSelect={handleSelectTransaction}
            onClear={handleClearTransactions}
          />
          <div className="pm-flow-data-body">
            <DataPanelContent selectedTx={selectedTx} activeStep={activeStep} />
          </div>
        </div>
      </div>

      <details className="pm-flow-plugins-note">
        <summary>Plugin pipeline</summary>
        <p>
          Before <Code>state.apply(tr)</Code>, plugins run{' '}
          <Code>filterTransaction</Code> (can reject) and{' '}
          <Code>appendTransaction</Code> (can add steps). History stores inverse
          steps for undo.
        </p>
      </details>
    </div>
  );
}
