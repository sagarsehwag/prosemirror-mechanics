'use client';

import React from 'react';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4';

type HeadingProps = {
  as?: HeadingLevel;
  children: React.ReactNode;
  className?: string;
};

const STYLES: Record<HeadingLevel, React.CSSProperties> = {
  h1: { fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-mono-code)' },
  h2: { fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-mono-code)' },
  h3: { fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-semibold)', fontFamily: 'var(--font-mono-code)' },
  h4: { fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', fontFamily: 'var(--font-mono-code)' },
};

export function Heading({
  as: Level = 'h2',
  children,
  className = '',
}: HeadingProps) {
  return (
    <Level className={className} style={STYLES[Level]}>
      {children}
    </Level>
  );
}
