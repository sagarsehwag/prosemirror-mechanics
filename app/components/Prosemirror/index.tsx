'use client';

import React from 'react';
import type { ProseMirrorProps, ProseMirrorTab } from './types';
import { SectionHeader } from '../ui';
import ProseMirrorOverview from './Overview/ProseMirrorOverview';
import ProseMirrorSchema from './Schema/ProseMirrorSchema';
import ProseMirrorState from './State/ProseMirrorState';
import ProseMirrorTransactions from './Transform/ProseMirrorTransactions';
import ProseMirrorView from './View/ProseMirrorView';
import ProseMirrorPositions from './Positions/ProseMirrorPositions';
import ProseMirrorImmutable from './Immutable/ProseMirrorImmutable';
import ProseMirrorPlugins from './Plugins/ProseMirrorPlugins';

import './shared.css';
import './Schema/Schema.css';
import './State/State.css';
import './Transform/Transform.css';
import './View/View.css';
import './Positions/Positions.css';
import './Plugins/Plugins.css';
import './Immutable/Immutable.css';

const TAB_HEADINGS: Record<
  ProseMirrorTab,
  { title: React.ReactNode; subtitle: string }
> = {
  overview: {
    title: 'Prosemirror Overview',
    subtitle:
      'Build rich text editors with a structured document model. State flows through transactions. Schema enforces structure, and undo and collaboration come built-in.',
  },
  schema: {
    title: 'Document Model',
    subtitle: 'Schema defines node types, content expressions, and marks: the data shape of your document',
  },
  state: {
    title: 'EditorState',
    subtitle: 'Single source of truth for document, selection, stored marks, and plugin state',
  },
  transform: {
    title: 'Transforms & Transactions',
    subtitle: 'Immutable updates: steps applied to create new state, never mutate in place',
  },
  view: {
    title: 'View',
    subtitle: 'Renders state to DOM, handles input, and dispatches transactions',
  },
  positions: {
    title: 'Positions & Selection',
    subtitle: 'Integer offsets into a flat token sequence: anchor, head, from, to',
  },
  plugins: {
    title: 'Plugins',
    subtitle: 'Extend the editor with keymaps, commands, and custom state',
  },
  immutable: {
    title: 'Miscellaneous',
    subtitle: 'Structural sharing, fragments, and why updates stay cheap',
  },
};

export type { ProseMirrorTab, ProseMirrorProps };

export default function ProseMirror({ activeTab }: ProseMirrorProps) {
  const show = (tab: ProseMirrorTab) => !activeTab || activeTab === tab;
  const tab = activeTab || 'overview';
  const { title, subtitle } = TAB_HEADINGS[tab];

  return (
    <section id="prosemirror" className="demo-section active">
      <SectionHeader title={title} subtitle={subtitle} />

      {show('overview') && <ProseMirrorOverview />}
      {show('schema') && <ProseMirrorSchema />}
      {show('state') && <ProseMirrorState />}
      {show('transform') && <ProseMirrorTransactions />}
      {show('view') && <ProseMirrorView />}
      {show('positions') && <ProseMirrorPositions />}
      {show('plugins') && <ProseMirrorPlugins />}
      {show('immutable') && <ProseMirrorImmutable />}
    </section>
  );
}
