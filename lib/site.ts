// Pages that aren't finished yet. While a page is set to true here, every link
// to it shows "WIP" / "EN PROCESO" on the cursor (a short notice on touch
// screens) and does nothing when clicked, and visiting it directly sends you
// back home. Set a page to false to open it.
export const WIP_PAGES: Record<string, boolean> = {
  '/works': false,
  '/about': false,
  '/contact': true,
};

// The same for the inner pages of About (the switch under its nav): a page set
// to true shows "WIP" on the cursor and can't be opened. Set it to false to open it.
export const WIP_ABOUT_PAGES: Record<string, boolean> = {
  experience: false,
  more: true,
};

// The same for each project of the Works page (by project id). A project set to
// true — or missing here — stays behind frosted glass with "WIP" on the cursor
// and its page (/works/<id>) can't be opened. Set it to false to open it.
export const WIP_PROJECTS: Record<string, boolean> = {
  'bloom-states': false, // Las Caras de la Mente
  'diseno-para-eventos': true,
  'proyecto-3': true, // Inktobers
  'proyecto-4': true, // Passions in Bloom
};

/** True when the project's page isn't ready yet (projects not listed count as WIP). */
export function isWipProject(id: string): boolean {
  return WIP_PROJECTS[id] !== false;
}

/** True when `href` points at a page that is still WIP (ignores #hash and ?query). */
export function isWipHref(href: unknown): boolean {
  if (typeof href !== 'string') return false;
  const path = href.split(/[?#]/)[0];
  return WIP_PAGES[path] === true;
}
