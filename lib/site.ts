// The works page isn't finished yet: while this is true every link to /works
// shows "WIP" / "EN PROCESO" on the cursor and does nothing when clicked, and
// visiting /works directly sends you back home. Set to false to open it.
export const WORKS_WIP = true;

export function isWorksHref(href: unknown): boolean {
  return typeof href === 'string' && (href === '/works' || href.startsWith('/works#') || href.startsWith('/works?'));
}
