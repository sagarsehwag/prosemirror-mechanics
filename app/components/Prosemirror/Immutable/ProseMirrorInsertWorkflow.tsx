'use client';

import React, { useCallback, useRef, useState } from 'react';
import { CodeBlock, Button } from '../../ui';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function ProseMirrorInsertWorkflow() {
  const [stepStates, setStepStates] = useState<Record<number, string>>({});
  const [disabled, setDisabled] = useState(false);
  const diagramRef = useRef<HTMLDivElement>(null);

  const runInsert = useCallback(async () => {
    setDisabled(true);
    setStepStates({});

    const diagram = diagramRef.current;
    if (!diagram) {
      setDisabled(false);
      return;
    }

    const p2Row = diagram.querySelector('[data-node="p2"]') as HTMLElement;
    const fragmentEl = diagram.querySelector('[data-fragment="p2"]') as HTMLElement;

    if (!p2Row || !fragmentEl) {
      setDisabled(false);
      return;
    }

    diagram.querySelectorAll('.pm-workflow-new').forEach((n) => n.remove());

    // Step 1: Create new text node
    setStepStates({ 1: 'active' });
    await sleep(600);

    const newText = document.createElement('span');
    newText.className = 'pm-workflow-text pm-workflow-new';
    newText.setAttribute('data-text', 'new');
    newText.textContent = '"x"';
    newText.style.animation = 'pmFadeIn 0.4s ease';

    setStepStates({ 1: 'completed' });
    await sleep(400);

    // Step 2: New Fragment for p2 (replaceRange - immutable)
    setStepStates({ 1: 'completed', 2: 'active' });
    fragmentEl.classList.add('pm-workflow-highlight');
    await sleep(600);

    // Insert new node into the fragment visual (between t1 and t2)
    const fragmentContent = fragmentEl.querySelector('.pm-workflow-fragment-content');
    if (fragmentContent) {
      const t2El = fragmentContent.querySelector('[data-text="t2"]');
      const wrapper = document.createElement('span');
      wrapper.className = 'pm-workflow-new';
      wrapper.appendChild(newText);
      fragmentContent.insertBefore(wrapper, t2El || fragmentContent.firstChild);
    }

    setStepStates({ 1: 'completed', 2: 'completed' });
    await sleep(400);

    // Step 3: New p2 node
    setStepStates({ 1: 'completed', 2: 'completed', 3: 'active' });
    p2Row.classList.add('pm-workflow-recreated');
    fragmentEl.classList.remove('pm-workflow-highlight');
    await sleep(600);

    setStepStates({ 1: 'completed', 2: 'completed', 3: 'completed' });
    await sleep(300);

    // Step 4: New doc
    setStepStates({ 1: 'completed', 2: 'completed', 3: 'completed', 4: 'active' });
    const docRow = diagram.querySelector('[data-node="doc"]') as HTMLElement;
    if (docRow) docRow.classList.add('pm-workflow-recreated');
    await sleep(600);

    setStepStates({ 1: 'completed', 2: 'completed', 3: 'completed', 4: 'completed' });
    await sleep(300);

    // Step 5: Siblings shared
    setStepStates({ 1: 'completed', 2: 'completed', 3: 'completed', 4: 'completed', 5: 'active' });
    const p1Row = diagram.querySelector('[data-node="p1"]') as HTMLElement;
    const p3Row = diagram.querySelector('[data-node="p3"]') as HTMLElement;
    if (p1Row) p1Row.classList.add('pm-workflow-shared');
    if (p3Row) p3Row.classList.add('pm-workflow-shared');
    await sleep(1200);

    // Reset after delay
    setTimeout(() => {
      diagram.querySelectorAll('.pm-workflow-new').forEach((n) => n.remove());
      p2Row?.classList.remove('pm-workflow-recreated');
      docRow?.classList.remove('pm-workflow-recreated');
      p1Row?.classList.remove('pm-workflow-shared');
      p3Row?.classList.remove('pm-workflow-shared');
      setStepStates({});
    }, 2500);

    setDisabled(false);
  }, []);

  const getStepClass = (step: number, extra?: string): string => {
    const classes = ['op-step'];
    if (extra) classes.push(extra);
    if (stepStates[step] === 'active') classes.push('active');
    if (stepStates[step] === 'completed') classes.push('completed');
    return classes.join(' ');
  };

  return (
    <>
      <div className="code-snippet">
        <CodeBlock
          code={`// Each node has content: Fragment (immutable)
interface ProseMirrorNode {
  content: Fragment;  // immutable list of children
}`}
        />
      </div>

      <div className="pm-workflow-diagram" ref={diagramRef}>
        <div className="pm-workflow-tree">
          <div className="pm-workflow-row" data-node="doc">
            <span className="pm-workflow-node doc">doc</span>
            <span className="pm-workflow-arrow">content:</span>
            <span className="pm-workflow-fragment">[p1, p2, p3]</span>
          </div>
          <div className="pm-workflow-children">
            <div className="pm-workflow-row" data-node="p1">
              <span className="pm-workflow-node">p</span>
              <span className="pm-workflow-text" data-text="p1-t">&quot;One&quot;</span>
            </div>
            <div className="pm-workflow-row" data-node="p2">
              <span className="pm-workflow-node">p</span>
              <span className="pm-workflow-arrow">content:</span>
              <span className="pm-workflow-fragment-inline" data-fragment="p2">
                <span className="pm-workflow-fragment-content">
                  <span className="pm-workflow-text" data-text="t1">&quot;He&quot;</span>
                  <span className="pm-workflow-text" data-text="t2">&quot;llo&quot;</span>
                  <span className="pm-workflow-text" data-text="t3">&quot; world&quot;</span>
                </span>
              </span>
            </div>
            <div className="pm-workflow-row" data-node="p3">
              <span className="pm-workflow-node">p</span>
              <span className="pm-workflow-text" data-text="p3-t">&quot;Three&quot;</span>
            </div>
          </div>
        </div>
      </div>

      <div className="operation-demo">
        <h4>Insert &quot;x&quot; into p2 (after &quot;He&quot;)</h4>
        <Button
          size="sm"
          variant="secondary"
          onClick={runInsert}
          disabled={disabled}
        >
          ▶ Animate Insert
        </Button>
        <div className="operation-steps">
          <div className={getStepClass(1)}>1. Create new text node &quot;x&quot;</div>
          <div className={getStepClass(2)}>2. New Fragment for p2 (replaceRange)</div>
          <div className={getStepClass(3)}>3. New p2 with new Fragment</div>
          <div className={getStepClass(4)}>4. New doc with new p2</div>
          <div className={getStepClass(5, 'highlight-good')}>5. p1, p3 shared. No copy! ✅</div>
        </div>
        <div className="complexity-note">
          <span className="good">O(depth)</span>: only the changed path is recreated. No index shifting.
        </div>
      </div>
    </>
  );
}
