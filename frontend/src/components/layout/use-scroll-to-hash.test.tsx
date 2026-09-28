import { fireEvent, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useScrollToHash } from './use-scroll-to-hash';

// jsdom has no ResizeObserver; this stand-in lets a test fire "the page resized" by hand.
let resizeCallbacks: Array<() => void> = [];
class ResizeObserverStub {
  private readonly callback: () => void;
  constructor(callback: () => void) {
    this.callback = callback;
  }
  observe() {
    resizeCallbacks.push(this.callback);
  }
  disconnect() {
    resizeCallbacks = resizeCallbacks.filter((callback) => callback !== this.callback);
  }
}

function Page() {
  useScrollToHash();
  return <section id="contact">Contact</section>;
}

function renderAt(url: string) {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Page />
    </MemoryRouter>,
  );
}

describe('useScrollToHash', () => {
  const scrollIntoView = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal('ResizeObserver', ResizeObserverStub);
    Element.prototype.scrollIntoView = scrollIntoView;
    window.scrollTo = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    scrollIntoView.mockReset();
    resizeCallbacks = [];
  });

  it('scrolls to the top when there is no hash', () => {
    renderAt('/mentions-legales');

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it('scrolls to the section named by the hash', () => {
    renderAt('/#contact');

    expect(scrollIntoView).toHaveBeenCalledTimes(1);
  });

  it('re-aligns when the page grows shortly after, until the visitor scrolls', () => {
    renderAt('/#contact');

    resizeCallbacks.forEach((callback) => callback());
    expect(scrollIntoView).toHaveBeenCalledTimes(2);

    fireEvent.wheel(window);
    resizeCallbacks.forEach((callback) => callback());
    expect(scrollIntoView).toHaveBeenCalledTimes(2);
  });

  it('stops re-aligning once the settle window is over', () => {
    renderAt('/#contact');

    vi.advanceTimersByTime(2000);
    resizeCallbacks.forEach((callback) => callback());

    expect(scrollIntoView).toHaveBeenCalledTimes(1);
  });
});
