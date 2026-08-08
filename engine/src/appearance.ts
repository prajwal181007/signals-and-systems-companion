// Appearance: theme (light / dark / system) and typeface. Light is the
// design's home and the default; dark exists as an explicit choice.
import type { Store } from './store';

export type Theme = 'light' | 'dark' | 'system';
export type Font = 'system' | 'helvetica' | 'palatino';

export function applyAppearance(store: Store) {
  const theme = (store.state.settings.theme as Theme) || 'light';
  const font = (store.state.settings.font as Font) || 'system';
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.dataset.font = font;
}

// True when the app is effectively dark right now (plots read this at draw time).
export function isDarkNow(): boolean {
  const theme = document.documentElement.dataset.theme || 'light';
  return theme === 'dark' || (theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
}

// In system mode, re-render when the OS appearance flips (motion = information).
export function watchSystemTheme(onChange: () => void) {
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if ((document.documentElement.dataset.theme || 'light') === 'system') onChange();
  });
}
