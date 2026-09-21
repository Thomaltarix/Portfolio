import { afterEach, describe, expect, it } from 'vitest';
import { applyLook, DEFAULT_LOOK, readStoredLook } from './look';

describe('light look', () => {
  afterEach(() => {
    window.localStorage.clear();
    delete document.documentElement.dataset.look;
  });

  it('defaults to the discreet look', () => {
    expect(DEFAULT_LOOK).toBe('discreet');
    expect(readStoredLook()).toBe('discreet');
  });

  it('applies the look to <html> and remembers it', () => {
    applyLook('bold');

    expect(document.documentElement.dataset.look).toBe('bold');
    expect(readStoredLook()).toBe('bold');
  });

  it('falls back to the default for an unknown stored value', () => {
    window.localStorage.setItem('portfolio-light-look', 'neon');

    expect(readStoredLook()).toBe('discreet');
  });
});
