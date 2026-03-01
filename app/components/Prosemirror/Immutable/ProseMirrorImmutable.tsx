'use client';

import React from 'react';
import { Card, CardHeader, CardContent, Table, type TableRow } from '../../ui';
import ProseMirrorInsertWorkflow from './ProseMirrorInsertWorkflow';

const IMMUTABLE_COMPLEXITY_COLUMNS = [
  { key: 'operation', header: 'Operation' },
  { key: 'complexity', header: 'Complexity' },
];

const IMMUTABLE_COMPLEXITY_ROWS: TableRow[] = [
  {
    operation: 'Insert / delete child',
    complexity: 'O(depth)',
    _cellClassNames: { complexity: 'good' },
  },
  {
    operation: 'Resolve position',
    complexity: 'O(depth)',
    _cellClassNames: { complexity: 'medium' },
  },
  {
    operation: 'Memory per update',
    complexity: 'O(depth)',
    _cellClassNames: { complexity: 'good' },
  },
  {
    operation: 'Store undo state',
    complexity: 'O(1) ref',
    _cellClassNames: { complexity: 'good' },
  },
  {
    operation: 'Index shifting',
    complexity: 'No',
    _cellClassNames: { complexity: 'good' },
  },
];

export default function ProseMirrorImmutable() {
  return (
    <div className='immutable-tab'>
      <Card className='prosemirror-section'>
        <CardHeader>
          <h3>Persistent Data</h3>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Nodes are immutable values</strong>: like the number 3, you
            never change them in place; updates produce new values instead.{' '}
            <strong>Structural sharing</strong> reuses unchanged nodes by
            reference, so updates stay cheap.
          </p>
        </CardContent>
      </Card>

      <Card className='prosemirror-section'>
        <CardHeader>
          <h3>Structural Sharing</h3>
        </CardHeader>
        <CardContent>
          <p>
            When you apply a transaction, Prosemirror creates a{' '}
            <strong>new</strong> document, but it doesn&apos;t copy everything.
            Unchanged nodes are <strong>reused by reference</strong>. Only the{' '}
            <strong>changed node and its ancestors</strong> (up to the root) are
            recreated, because each ancestor holds a new children array.
          </p>
          <p>
            This is called <strong>structural sharing</strong> (or
            copy-on-write). Siblings of the changed node stay shared. Example:
            doc has 3 paragraphs; you change paragraph 2. Result: new{' '}
            <code>doc</code> object, new paragraph 2 object. Paragraphs 1 and 3
            are the same objects as before.
          </p>
          <p>
            That keeps updates cheap: typing in a 10,000-word doc allocates
            only a few new nodes (the changed paragraph and its ancestors), not
            the whole tree. Undo stays cheap too: old states share most nodes
            with the current state.
          </p>
        </CardContent>
      </Card>

      <Card className='prosemirror-section'>
        <CardHeader>
          <h3>What Gets Recreated</h3>
        </CardHeader>
        <CardContent>
          <p>
            The <strong>changed node and all ancestors</strong> are new.{' '}
            <strong>Siblings</strong> of the changed node are reused (same
            object reference).
          </p>
          <div className='ss-path-diagram'>
            <div className='ss-path-tree'>
              <div className='ss-path-row'>
                <span className='ss-path-node ss-path-recreated'>
                  doc (new)
                </span>
                <span className='ss-path-arrow'>→</span>
              </div>
              <div className='ss-path-children'>
                <div className='ss-path-row'>
                  <span className='ss-path-node ss-path-shared'>
                    p: &quot;One&quot;
                  </span>
                  <span className='ss-path-badge shared'>shared</span>
                </div>
                <div className='ss-path-row'>
                  <span className='ss-path-node ss-path-recreated'>
                    p: &quot;Two!&quot;
                  </span>
                  <span className='ss-path-badge recreated'>recreated</span>
                </div>
                <div className='ss-path-row'>
                  <span className='ss-path-node ss-path-shared'>
                    p: &quot;Three&quot;
                  </span>
                  <span className='ss-path-badge shared'>shared</span>
                </div>
              </div>
            </div>
            <p className='ss-path-legend'>
              Changed &quot;Two&quot; → &quot;Two!&quot;. <code>doc</code>{' '}
              (root) and paragraph 2 are new. Each holds a new children array.
              Paragraphs 1 and 3 are reused.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className='prosemirror-section'>
        <CardHeader>
          <h3>Old State vs New State</h3>
        </CardHeader>
        <CardContent>
          <p>
            Both states exist in memory. Green = <strong>same object</strong> in
            both. Orange = new allocation. The new state has a new{' '}
            <code>doc</code> (root) and new paragraph 2; paragraphs 1 and 3 are
            shared.
          </p>
          <div className='ss-side-by-side'>
            <div className='ss-state-panel'>
              <div className='ss-state-label'>Old state</div>
              <div className='ss-state-tree'>
                <div className='doc-node unchanged'>doc</div>
                <div className='doc-children'>
                  <div className='doc-node unchanged'>p: &quot;One&quot;</div>
                  <div className='doc-node unchanged'>p: &quot;Two&quot;</div>
                  <div className='doc-node unchanged'>p: &quot;Three&quot;</div>
                </div>
              </div>
            </div>
            <div className='ss-connector'>
              <span className='ss-connector-shared'>shared</span>
              <span className='ss-connector-new'>new</span>
            </div>
            <div className='ss-state-panel'>
              <div className='ss-state-label'>New state</div>
              <div className='ss-state-tree'>
                <div className='doc-node changed'>doc</div>
                <div className='doc-children'>
                  <div className='doc-node unchanged'>p: &quot;One&quot;</div>
                  <div className='doc-node changed'>p: &quot;Two!&quot;</div>
                  <div className='doc-node unchanged'>p: &quot;Three&quot;</div>
                </div>
              </div>
            </div>
          </div>
          <p className='ss-side-by-side-note'>
            Green = same reference in both states. Orange = new allocation. Undo
            keeps old state cheap because it shares &quot;One&quot; and
            &quot;Three&quot; with current state.
          </p>
        </CardContent>
      </Card>

      <Card className='prosemirror-section'>
        <CardHeader>
          <h3>Animated Insert Workflow</h3>
        </CardHeader>
        <CardContent>
          <p>
            Like the &quot;Map with Child Array&quot; demo in NodeStructures,
            but aligned with Prosemirror&apos;s model:{' '}
            <strong>immutable tree</strong> with <strong>Fragment</strong> for
            children. No index shifting: we create new immutable values along
            the changed path; siblings stay shared.
          </p>
          <ProseMirrorInsertWorkflow />
        </CardContent>
      </Card>

      <Card className='prosemirror-section'>
        <CardHeader>
          <h3>Algorithm Complexity</h3>
        </CardHeader>
        <CardContent>
          <p>
            Prosemirror&apos;s immutable tree with structural sharing gives
            predictable complexity. New nodes are created only along the changed
            path.
          </p>
          <Table
            columns={IMMUTABLE_COMPLEXITY_COLUMNS}
            rows={IMMUTABLE_COMPLEXITY_ROWS}
            wrapperClassName='comparison-table-container'
          />
          <p className='table-note'>
            <code>depth</code> = tree depth (typically &lt; 20). Structural
            sharing reuses siblings. Position-based model.
          </p>
        </CardContent>
      </Card>

      <Card className='prosemirror-section'>
        <CardHeader>
          <h3>Why It Matters</h3>
        </CardHeader>
        <CardContent>
          <ul className='structural-sharing-list'>
            <li>
              <strong>Performance:</strong> Updates allocate O(depth) new
              nodes, not O(doc size).
            </li>
            <li>
              <strong>Undo / Redo:</strong> Old states share most nodes with
              current state; memory stays bounded.
            </li>
            <li>
              <strong>Collaborative editing:</strong> Multiple states can
              coexist without copying the whole doc.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
