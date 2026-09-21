// The light theme has two candidate looks, compared side by side while developing:
//   discreet: white page, warm ink, terracotta accent, sunrise photo
//   bold:     the same on a peach-tinted page, with terracotta titles and tinted section bands
// Only the development build can switch (see LookSwitch). The production site always uses the
// default, so no stored value can change what visitors see.
export const LOOKS = ['discreet', 'bold'] as const;
export type Look = (typeof LOOKS)[number];

export const DEFAULT_LOOK: Look = 'discreet';
const STORAGE_KEY = 'portfolio-light-look';

export function readStoredLook(): Look {
  if (!import.meta.env.DEV) return DEFAULT_LOOK;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'bold' ? 'bold' : DEFAULT_LOOK;
  } catch {
    return DEFAULT_LOOK;
  }
}

export function applyLook(look: Look): void {
  document.documentElement.dataset.look = look;
  if (!import.meta.env.DEV) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, look);
  } catch {
    // Storage can be blocked; the look then simply resets on reload.
  }
}
