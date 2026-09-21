import { type RefObject, useLayoutEffect, useState } from 'react';

// Where the summit sits in the photograph, as a share of its height (measured on the export).
const SUMMIT_RATIO = 0.487;
// Air between the last line of the title and the summit.
const SUMMIT_CLEARANCE_PX = 28;
// The photo is at least this tall relative to the screen width (the design height on a recent phone).
const MIN_HEIGHT_IN_WIDTHS = 1.5;
const PHONE_MAX_WIDTH_PX = 640;

/**
 * On a phone the photo is top-aligned and its height is tied to the screen width, so the summit lands at a
 * fixed height while the title gets taller on narrow screens (more lines). This returns the photo height, in
 * pixels, that keeps the summit below the title, or `undefined` from `sm` up where the photo fills the hero.
 */
export function usePhonePhotoHeight(
  titleRef: RefObject<HTMLElement | null>,
): number | undefined {
  const [height, setHeight] = useState<number>();

  useLayoutEffect(() => {
    const title = titleRef.current;
    if (!title) return;

    const measure = () => {
      if (window.innerWidth >= PHONE_MAX_WIDTH_PX) return setHeight(undefined);
      // offsetTop/offsetHeight are layout values: unlike getBoundingClientRect they ignore the entrance transform.
      const titleBottom = title.offsetTop + title.offsetHeight;
      const clearingSummit = (titleBottom + SUMMIT_CLEARANCE_PX) / SUMMIT_RATIO;
      setHeight(Math.ceil(Math.max(window.innerWidth * MIN_HEIGHT_IN_WIDTHS, clearingSummit)));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(title);
    return () => observer.disconnect();
  }, [titleRef]);

  return height;
}
