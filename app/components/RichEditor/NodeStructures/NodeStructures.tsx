'use client';

import React, { useCallback, useRef, useState } from 'react';
import {
  SectionHeader,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Badge,
  Button,
  Table,
  type TableRow,
} from '../../ui';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function NodeStructures() {
  const [arrayStepStates, setArrayStepStates] = useState<
    Record<number, string>
  >({});
  const [linkedStepStates, setLinkedStepStates] = useState<
    Record<number, string>
  >({});
  const [arrayDisabled, setArrayDisabled] = useState(false);
  const [linkedDisabled, setLinkedDisabled] = useState(false);

  // Array insert refs
  const arrayDiagramRef = useRef<HTMLDivElement>(null);
  const arrayNodeCountRef = useRef(0);

  // Linked list refs
  const linkedDiagramRef = useRef<HTMLDivElement>(null);
  const linkedNodeCountRef = useRef(0);

  const runArrayInsert = useCallback(async () => {
    setArrayDisabled(true);
    setArrayStepStates({});

    const nodeMap = arrayDiagramRef.current?.querySelector('.node-map');
    if (!nodeMap) {
      setArrayDisabled(false);
      return;
    }

    // Remove previous inserts
    nodeMap.querySelectorAll('.new-inserted').forEach((n) => n.remove());

    arrayNodeCountRef.current++;
    const newKey = `new${arrayNodeCountRef.current}`;

    // Step 1: Create new node
    setArrayStepStates({ 1: 'active' });
    await sleep(600);

    const newEntry = document.createElement('div');
    newEntry.className = 'map-entry new-inserted new-entry';
    newEntry.innerHTML = `
      <span class="key">"${newKey}"</span>
      <span class="arrow">→</span>
      <div class="node-box text" style="border-color: var(--accent-orange); background: color-mix(in srgb, var(--accent-orange) 20%, transparent);">
        <span class="node-type" style="color: var(--accent-orange);">TextNode (NEW!)</span>
        <span class="text-content">" inserted"</span>
      </div>
    `;
    nodeMap.appendChild(newEntry);

    setArrayStepStates({ 1: 'completed' });
    await sleep(400);

    // Step 2: Splice into children array
    setArrayStepStates({ 1: 'completed', 2: 'active' });
    const p1Entry = nodeMap.querySelector(
      '[data-key="p1"] .children-arr',
    ) as HTMLElement;
    const originalText = p1Entry?.textContent || '';

    if (p1Entry) {
      p1Entry.style.transition = 'all 0.3s';
      p1Entry.innerHTML = `<span style="color:var(--text-secondary)">children: ["t1",</span> <span style="color:var(--accent-orange);font-weight:bold">"${newKey}"</span><span style="color:var(--text-secondary)">, "b1", "t2"]</span>`;
    }
    await sleep(800);
    setArrayStepStates({ 1: 'completed', 2: 'completed' });

    // Step 3: Show indices shifting
    setArrayStepStates({ 1: 'completed', 2: 'completed', 3: 'active' });

    const shiftOverlay = document.createElement('div');
    shiftOverlay.className = 'new-inserted';
    shiftOverlay.style.cssText = `
      background: color-mix(in srgb, var(--accent-red) 15%, transparent);
      border: 1px dashed var(--accent-red);
      border-radius: 4px;
      padding: 8px;
      margin-top: 8px;
      font-size: 0.75rem;
      font-family: var(--font-mono);
    `;
    shiftOverlay.innerHTML = `
      <div style="color: var(--accent-red); font-weight: 600; margin-bottom: 4px;">⚠️ Array indices must shift!</div>
      <div style="color: var(--text-secondary)">
        <span style="text-decoration: line-through">b1 @ index 1</span> → <span style="color: var(--accent-red)">b1 @ index 2</span><br>
        <span style="text-decoration: line-through">t2 @ index 2</span> → <span style="color: var(--accent-red)">t2 @ index 3</span>
      </div>
    `;
    p1Entry?.parentElement?.appendChild(shiftOverlay);

    const b1Entry = nodeMap.querySelector('[data-key="b1"]') as HTMLElement;
    const t2Entry = nodeMap.querySelector('[data-key="t2"]') as HTMLElement;
    if (b1Entry) {
      b1Entry.style.transition = 'all 0.3s';
      b1Entry.style.outline = '2px solid var(--accent-red)';
      b1Entry.style.outlineOffset = '2px';
    }
    await sleep(300);
    if (t2Entry) {
      t2Entry.style.transition = 'all 0.3s';
      t2Entry.style.outline = '2px solid var(--accent-red)';
      t2Entry.style.outlineOffset = '2px';
    }

    await sleep(1500);

    // Reset after 3 seconds
    setTimeout(() => {
      if (p1Entry) {
        p1Entry.textContent = originalText;
        p1Entry.style.color = '';
      }
      newEntry.remove();
      shiftOverlay.remove();
      if (b1Entry) b1Entry.style.outline = '';
      if (t2Entry) t2Entry.style.outline = '';
      setArrayStepStates({});
    }, 3000);

    setArrayDisabled(false);
  }, []);

  const runLinkedInsert = useCallback(async () => {
    setLinkedDisabled(true);
    setLinkedStepStates({});

    const diagram = linkedDiagramRef.current;
    if (!diagram) {
      setLinkedDisabled(false);
      return;
    }

    const childrenRow = diagram.querySelector('.children-row');
    const t1 = diagram.querySelector('[data-key="t1"]') as HTMLElement;
    const b1 = diagram.querySelector('[data-key="b1"]') as HTMLElement;
    const firstArrow = childrenRow?.querySelectorAll(
      '.horizontal-pointer',
    )[0] as HTMLElement;

    if (!childrenRow || !t1 || !b1 || !firstArrow) {
      setLinkedDisabled(false);
      return;
    }

    // Reset
    diagram
      .querySelectorAll('.linked-node')
      .forEach((n) => (n as HTMLElement).classList.remove('highlight'));
    childrenRow.querySelectorAll('.new-inserted').forEach((n) => n.remove());

    linkedNodeCountRef.current++;

    // Step 1: Create new node
    setLinkedStepStates({ 1: 'active' });
    await sleep(600);

    const newNode = document.createElement('div');
    newNode.className = 'linked-node text new-inserted new-node';
    newNode.style.cssText =
      'border-color: var(--accent-orange); background: color-mix(in srgb, var(--accent-orange) 20%, transparent); color: var(--accent-orange);';
    newNode.innerHTML = '<span>NEW</span><small>"inserted"</small>';

    const newArrow = document.createElement('div');
    newArrow.className = 'horizontal-pointer new-inserted';
    newArrow.textContent = '↔';

    firstArrow.after(newNode);
    newNode.after(newArrow);

    setLinkedStepStates({ 1: 'completed' });
    await sleep(400);

    // Step 2: Update prev.next pointer
    setLinkedStepStates({ 1: 'completed', 2: 'active' });
    t1.classList.add('highlight');
    firstArrow.style.color = 'var(--accent-orange)';
    await sleep(700);
    setLinkedStepStates({ 1: 'completed', 2: 'completed' });
    t1.classList.remove('highlight');

    // Step 3: Update next.prev pointer
    setLinkedStepStates({ 1: 'completed', 2: 'completed', 3: 'active' });
    b1.classList.add('highlight');
    newArrow.style.color = 'var(--accent-orange)';
    await sleep(700);
    setLinkedStepStates({ 1: 'completed', 2: 'completed', 3: 'completed' });
    b1.classList.remove('highlight');

    // Step 4: Done
    setLinkedStepStates({
      1: 'completed',
      2: 'completed',
      3: 'completed',
      4: 'active',
    });
    newNode.style.boxShadow = '0 0 15px var(--accent-green)';
    newNode.style.borderColor = 'var(--accent-green)';
    await sleep(1000);

    // Reset after 3 seconds
    setTimeout(() => {
      newNode.remove();
      newArrow.remove();
      firstArrow.style.color = '';
      setLinkedStepStates({});
    }, 3000);

    setLinkedDisabled(false);
  }, []);

  const COMPARISON_COLUMNS = [
    { key: 'operation', header: 'Operation' },
    { key: 'array', header: 'Array' },
    { key: 'linkedList', header: 'Linked List' },
    { key: 'winner', header: 'Winner' },
  ];

  const COMPARISON_ROWS: TableRow[] = [
    {
      operation: 'Access node by key',
      array: 'O(1)',
      linkedList: 'O(1)',
      winner: '🤝 Tie',
      _cellClassNames: { array: 'good', linkedList: 'good' },
    },
    {
      operation: 'Insert/Delete child',
      array: 'O(n)',
      linkedList: 'O(1)',
      winner: '🔗 Linked',
      _cellClassNames: { array: 'bad', linkedList: 'good' },
    },
    {
      operation: 'Get children count',
      array: 'O(1)',
      linkedList: 'O(n)*',
      winner: '📚 Array',
      _cellClassNames: { array: 'good', linkedList: 'bad' },
    },
    {
      operation: 'Clone state',
      array: 'O(1) shallow',
      linkedList: 'O(1) shallow',
      winner: '🤝 Tie',
      _cellClassNames: { array: 'good', linkedList: 'good' },
    },
    {
      operation: 'Reparent node',
      array: 'O(n)',
      linkedList: 'O(1)',
      winner: '🔗 Linked',
      _cellClassNames: { array: 'bad', linkedList: 'good' },
    },
  ];

  const getOpStepClass = (
    stepStates: Record<number, string>,
    step: number,
    extraClass?: string,
  ): string => {
    const classes = ['op-step'];
    if (extraClass) classes.push(extraClass);
    if (stepStates[step] === 'active') classes.push('active');
    if (stepStates[step] === 'completed') classes.push('completed');
    return classes.join(' ');
  };

  return (
    <section id='node-structures' className='demo-section active'>
      <SectionHeader
        title='Node Data Structures'
        subtitle='Comparing Map + Array vs Map + Linked List approaches'
      />

      <Grid cols={2} className='structure-comparison'>
        {/* Array Approach */}
        <Card id='array-structure'>
          <CardHeader>
            <h3>📚 Map with Child Array</h3>
            <Badge variant='blue'>Draft.js, Slate.js</Badge>
          </CardHeader>
          <CardContent>
            <div className='code-snippet'>
              <pre>
                <code>{`interface ElementNode {
  children: Array<NodeKey>;
}`}</code>
              </pre>
            </div>

            <div
              className='node-diagram'
              id='array-diagram'
              ref={arrayDiagramRef}
            >
              <div className='node-map'>
                <div className='map-title'>NodeMap</div>
                <div className='map-entry' data-key='root'>
                  <span className='key'>&quot;root&quot;</span>
                  <span className='arrow'>→</span>
                  <div className='node-box element'>
                    <span className='node-type'>ElementNode</span>
                    <span className='children-arr'>
                      children: [&quot;p1&quot;]
                    </span>
                  </div>
                </div>
                <div className='map-entry' data-key='p1'>
                  <span className='key'>&quot;p1&quot;</span>
                  <span className='arrow'>→</span>
                  <div className='node-box element'>
                    <span className='node-type'>ElementNode</span>
                    <span className='children-arr'>
                      children: [&quot;t1&quot;, &quot;b1&quot;, &quot;t2&quot;]
                    </span>
                  </div>
                </div>
                <div className='map-entry' data-key='t1'>
                  <span className='key'>&quot;t1&quot;</span>
                  <span className='arrow'>→</span>
                  <div className='node-box text'>
                    <span className='node-type'>TextNode</span>
                    <span className='text-content'>&quot;Hello &quot;</span>
                  </div>
                </div>
                <div className='map-entry' data-key='b1'>
                  <span className='key'>&quot;b1&quot;</span>
                  <span className='arrow'>→</span>
                  <div className='node-box element'>
                    <span className='node-type'>ElementNode (bold)</span>
                    <span className='children-arr'>
                      children: [&quot;t3&quot;]
                    </span>
                  </div>
                </div>
                <div className='map-entry' data-key='t2'>
                  <span className='key'>&quot;t2&quot;</span>
                  <span className='arrow'>→</span>
                  <div className='node-box text'>
                    <span className='node-type'>TextNode</span>
                    <span className='text-content'>&quot; Jane&quot;</span>
                  </div>
                </div>
                <div className='map-entry' data-key='t3'>
                  <span className='key'>&quot;t3&quot;</span>
                  <span className='arrow'>→</span>
                  <div className='node-box text'>
                    <span className='node-type'>TextNode</span>
                    <span className='text-content'>&quot;World&quot;</span>
                  </div>
                </div>
              </div>
            </div>

            <div className='operation-demo'>
              <h4>Insert Node Operation</h4>
              <Button
                size='sm'
                variant='secondary'
                onClick={runArrayInsert}
                disabled={arrayDisabled}
              >
                ▶ Animate Insert
              </Button>
              <div className='operation-steps' id='array-steps'>
                <div
                  className={getOpStepClass(arrayStepStates, 1)}
                  data-step='1'
                >
                  1. Create new node in Map
                </div>
                <div
                  className={getOpStepClass(arrayStepStates, 2)}
                  data-step='2'
                >
                  2. Update parent&apos;s children array
                </div>
                <div
                  className={getOpStepClass(
                    arrayStepStates,
                    3,
                    'highlight-bad',
                  )}
                  data-step='3'
                >
                  3. Shift all following indices ⚠️
                </div>
              </div>
              <div className='complexity-note'>
                <span className='bad'>O(n)</span> - Array splice shifts elements
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Linked List Approach */}
        <Card id='linked-structure'>
          <CardHeader>
            <h3>🔗 Map with Linked List</h3>
            <Badge variant='green'>Lexical</Badge>
          </CardHeader>
          <CardContent>
            <div className='code-snippet'>
              <pre>
                <code>{`interface EditorNode {
  parent: NodeKey | null;
  prev: NodeKey | null;
  next: NodeKey | null;
}
interface ElementNode {
  firstChild: NodeKey | null;
  lastChild: NodeKey | null;
}`}</code>
              </pre>
            </div>

            <div
              className='node-diagram'
              id='linked-diagram'
              ref={linkedDiagramRef}
            >
              <div className='linked-visual'>
                <div className='linked-row'>
                  <div className='linked-node root' data-key='root'>
                    root
                  </div>
                </div>
                <div className='vertical-pointer'>↓ firstChild</div>
                <div className='linked-row'>
                  <div className='linked-node element' data-key='p1'>
                    p1
                  </div>
                </div>
                <div className='vertical-pointer'>↓ firstChild</div>
                <div className='linked-row children-row'>
                  <div className='linked-node text' data-key='t1'>
                    <span>t1</span>
                    <small>&quot;Hello &quot;</small>
                  </div>
                  <div className='horizontal-pointer'>↔</div>
                  <div className='linked-node element' data-key='b1'>
                    <span>b1</span>
                    <small>bold</small>
                  </div>
                  <div className='horizontal-pointer'>↔</div>
                  <div className='linked-node text' data-key='t2'>
                    <span>t2</span>
                    <small>&quot; Jane&quot;</small>
                  </div>
                </div>
                <div className='parent-pointers'>
                  <span>↑ parent</span>
                  <span>↑ parent</span>
                  <span>↑ parent</span>
                </div>
              </div>
            </div>

            <div className='operation-demo'>
              <h4>Insert Node Operation</h4>
              <Button
                size='sm'
                variant='green'
                onClick={runLinkedInsert}
                disabled={linkedDisabled}
              >
                ▶ Animate Insert
              </Button>
              <div className='operation-steps' id='linked-steps'>
                <div
                  className={getOpStepClass(linkedStepStates, 1)}
                  data-step='1'
                >
                  1. Create new node in Map
                </div>
                <div
                  className={getOpStepClass(linkedStepStates, 2)}
                  data-step='2'
                >
                  2. Update prev.next pointer
                </div>
                <div
                  className={getOpStepClass(linkedStepStates, 3)}
                  data-step='3'
                >
                  3. Update next.prev pointer
                </div>
                <div
                  className={getOpStepClass(
                    linkedStepStates,
                    4,
                    'highlight-good',
                  )}
                  data-step='4'
                >
                  4. Done! No shifting needed ✅
                </div>
              </div>
              <div className='complexity-note'>
                <span className='good'>O(1)</span> - Just update pointers
              </div>
            </div>
          </CardContent>
        </Card>
      </Grid>

      <Card>
        <CardHeader>
          <h3>📊 Comparison</h3>
        </CardHeader>
        <CardContent>
          <Table columns={COMPARISON_COLUMNS} rows={COMPARISON_ROWS} />
          <p className='table-note'>
            * Can be mitigated with cached size field
          </p>
        </CardContent>
      </Card>

      <Card variant='insight'>
        <CardHeader>
          <h3>🎯 Why Lexical Uses Linked Lists</h3>
        </CardHeader>
        <CardContent>
          <ul>
            <li>
              <strong>Rich text editing = frequent inserts/deletes</strong> -
              O(1) wins
            </li>
            <li>
              <strong>Parent pointers</strong> enable easy traversal up the tree
            </li>
            <li>
              <strong>Sibling navigation</strong> is instant (next/prev)
            </li>
            <li>
              <strong>API abstraction</strong> - Lexical hid this complexity,
              allowing migration from arrays to linked lists without breaking
              changes
            </li>
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
