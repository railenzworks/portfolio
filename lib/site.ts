// Pages that aren't finished yet. While a page is set to true here, every link
// to it shows "WIP" / "EN PROCESO" on the cursor (a short notice on touch
// screens) and does nothing when clicked, and visiting it directly sends you
// back home. Set a page to false to open it.
export const WIP_PAGES: Record<string, boolean> = {
  '/works': true,
  '/about': false,
  '/contact': true,
};

// The same for the inner pages of About (the switch under its nav): a page set
// to true shows "WIP" on the cursor and can't be opened. Set it to false to open it.
export const WIP_ABOUT_PAGES: Record<string, boolean> = {
  experience: false,
  more: true,
};

/** True when `href` points at a page that is still WIP (ignores #hash and ?query). */
export function isWipHref(href: unknown): boolean {
  if (typeof href !== 'string') return false;
  const path = href.split(/[?#]/)[0];
  return WIP_PAGES[path] === true;
}
