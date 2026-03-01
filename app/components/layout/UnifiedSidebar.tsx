'use client';

import React, { useCallback, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import type { ProseMirrorTab } from '../Prosemirror';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';
const ICON_SRC = `${BASE_PATH}/prosemirror-icon.svg`;

const PROSEMIRROR_SECTIONS: {
  id: ProseMirrorTab;
  icon: string;
  label: string;
  badge?: string;
}[] = [
  { id: 'overview', icon: '📋', label: 'Overview' },
  { id: 'schema', icon: '📄', label: 'Model' },
  { id: 'state', icon: '📦', label: 'State' },
  { id: 'transform', icon: '🔄', label: 'Transform' },
  { id: 'view', icon: '👁', label: 'View' },
  { id: 'positions', icon: '📍', label: 'Positions & Selection' },
  { id: 'plugins', icon: '🧩', label: 'Plugins' },
  { id: 'immutable', icon: '📎', label: 'Miscellaneous' },
];

const RICH_TEXT_DEMOS: { id: string; icon: string; label: string }[] = [
  { id: 'rendering', icon: '🎨', label: 'Rendering Approaches' },
  { id: 'contenteditable', icon: '✏️', label: 'ContentEditable Deep Dive' },
  { id: 'selection', icon: '📍', label: 'Selection Inspector' },
  { id: 'state', icon: '🏗️', label: 'State Model & Formatting' },
  { id: 'update-loop', icon: '🔄', label: 'Update Loop' },
  { id: 'node-structures', icon: '🔗', label: 'Node Structures' },
];

interface UnifiedSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function UnifiedSidebar({
  isOpen,
  onToggle,
}: UnifiedSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isProseMirror = pathname === '/' || pathname === '/prosemirror';
  const isRichTextEditor = pathname === '/rich-text-editor';
  const prosemirrorBase = pathname === '/prosemirror' ? '/prosemirror' : '/';
  const activeProseMirrorSection =
    (searchParams.get('tab') as ProseMirrorTab) || 'overview';
  const activeDemo = searchParams.get('tab') || 'rendering';

  const handleNavItemClick = useCallback(
    (href: string) => {
      router.push(href);
      if (window.innerWidth <= 768) {
        onToggle();
      }
    },
    [router, onToggle],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onToggle();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onToggle]);

  return (
    <>
      <button
        className={`sidebar-toggle ${isOpen ? 'open' : 'sidebar-closed'}`}
        onClick={onToggle}
        aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={isOpen}
      >
        <span className='hamburger-line' />
        <span className='hamburger-line' />
        <span className='hamburger-line' />
      </button>

      {isOpen && <div className='sidebar-overlay' onClick={onToggle} />}

      <nav
        className={`sidebar unified-sidebar ${isOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}
      >
        <div className='sidebar-header'>
          <div className='sidebar-header-content'>
            <h1>Editor · ProseMirror</h1>
            <p className='subtitle'>
              How prosemirror and rich text editors work
            </p>
          </div>
          <button
            className='sidebar-collapse-btn'
            onClick={onToggle}
            aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isOpen ? (
              <svg
                width='18'
                height='18'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                aria-hidden
              >
                <path d='M18 6L6 18M6 6l12 12' />
              </svg>
            ) : (
              <span className='sidebar-collapse-btn-hamburger'>
                <span className='hamburger-line' />
                <span className='hamburger-line' />
                <span className='hamburger-line' />
              </span>
            )}
          </button>
        </div>

        <div className='unified-nav-sections'>
          {/* ProseMirror - Main nav */}
          <div className='nav-section'>
            <Link
              href={prosemirrorBase}
              className={`nav-section-header ${isProseMirror ? 'active' : ''}`}
            >
              <span className='nav-icon nav-icon-img'>
                <img src={ICON_SRC} alt='' width={20} height={20} />
              </span>
              <span>Prosemirror</span>
            </Link>
            {isProseMirror && (
              <ul className='nav-list nav-sublist'>
                {PROSEMIRROR_SECTIONS.map((item) => (
                  <li
                    key={item.id}
                    className={`nav-item ${
                      activeProseMirrorSection === item.id ? 'active' : ''
                    }`}
                  >
                    <button
                      type='button'
                      className='nav-link'
                      onClick={() =>
                        handleNavItemClick(`${prosemirrorBase}?tab=${item.id}`)
                      }
                    >
                      <span className='nav-icon'>{item.icon}</span>
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className='nav-badge'>{item.badge}</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Rich Text Editor - Tab */}
          <div className='nav-section'>
            <Link
              href='/rich-text-editor?tab=rendering'
              className={`nav-section-header ${isRichTextEditor ? 'active' : ''}`}
            >
              <span className='nav-icon'>📝</span>
              <span>Rich Text Editor</span>
            </Link>
            {isRichTextEditor && (
              <ul className='nav-list nav-sublist'>
                {RICH_TEXT_DEMOS.map((item) => (
                  <li
                    key={item.id}
                    className={`nav-item ${activeDemo === item.id ? 'active' : ''}`}
                  >
                    <button
                      type='button'
                      className='nav-link'
                      onClick={() =>
                        handleNavItemClick(`/rich-text-editor?tab=${item.id}`)
                      }
                    >
                      <span className='nav-icon'>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
