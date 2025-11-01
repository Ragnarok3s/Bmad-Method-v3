import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const matchingShortcut = shortcuts.find(
        (shortcut) =>
          shortcut.key.toLowerCase() === event.key.toLowerCase() &&
          (shortcut.ctrlKey === undefined || shortcut.ctrlKey === (event.ctrlKey || event.metaKey)) &&
          (shortcut.shiftKey === undefined || shortcut.shiftKey === event.shiftKey) &&
          (shortcut.altKey === undefined || shortcut.altKey === event.altKey)
      );

      if (matchingShortcut) {
        event.preventDefault();
        matchingShortcut.action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
}

// Common keyboard navigation patterns
export const KeyboardNavigationPatterns = {
  // Escape to close dialogs/drawers
  closeOnEscape: (onClose: () => void): KeyboardShortcut => ({
    key: 'Escape',
    action: onClose,
    description: 'Close dialog/drawer',
  }),

  // Arrow navigation for calendars
  calendarNavigation: (onNavigate: (direction: 'left' | 'right' | 'up' | 'down') => void) => [
    {
      key: 'ArrowLeft',
      action: () => onNavigate('left'),
      description: 'Previous day',
    },
    {
      key: 'ArrowRight',
      action: () => onNavigate('right'),
      description: 'Next day',
    },
    {
      key: 'ArrowUp',
      action: () => onNavigate('up'),
      description: 'Previous week',
    },
    {
      key: 'ArrowDown',
      action: () => onNavigate('down'),
      description: 'Next week',
    },
  ],

  // Page Up/Down for month navigation
  monthNavigation: (onNavigate: (direction: 'prev' | 'next') => void) => [
    {
      key: 'PageUp',
      action: () => onNavigate('prev'),
      description: 'Previous month',
    },
    {
      key: 'PageDown',
      action: () => onNavigate('next'),
      description: 'Next month',
    },
  ],

  // Enter to select/confirm
  confirmOnEnter: (onConfirm: () => void): KeyboardShortcut => ({
    key: 'Enter',
    action: onConfirm,
    description: 'Confirm selection',
  }),

  // Cmd/Ctrl + K for search
  globalSearch: (onSearch: () => void): KeyboardShortcut => ({
    key: 'k',
    ctrlKey: true,
    action: onSearch,
    description: 'Open search',
  }),

  // Tab navigation
  tabForward: (onNext: () => void): KeyboardShortcut => ({
    key: 'Tab',
    action: onNext,
    description: 'Next field',
  }),

  tabBackward: (onPrevious: () => void): KeyboardShortcut => ({
    key: 'Tab',
    shiftKey: true,
    action: onPrevious,
    description: 'Previous field',
  }),
};

// Hook for managing focus trap in modals/drawers
export function useFocusTrap(containerRef: React.RefObject<HTMLElement>, enabled = true) {
  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey as any);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey as any);
    };
  }, [containerRef, enabled]);
}

// Hook for accessible focus management
export function useFocusManagement() {
  const setFocusToFirst = (container: HTMLElement) => {
    const focusable = container.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.focus();
  };

  const restoreFocus = (previousElement: HTMLElement | null) => {
    previousElement?.focus();
  };

  return { setFocusToFirst, restoreFocus };
}
