'use client';

import React from 'react';

type CodeSize = 'xs' | 'sm' | 'md';

type CodeProps = {
  children: React.ReactNode;
  size?: CodeSize;
  className?: string;
};

export function Code({ children, size = 'sm', className = '' }: CodeProps) {
  return (
    <code className={`ds-code ds-code-${size} ${className}`.trim()}>
      {children}
    </code>
  );
}
