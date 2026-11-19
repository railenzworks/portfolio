// The arrow of the home's carousel buttons (FeaturedTabs), for the project pages.
export function Arrow({ left = false }: { left?: boolean }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={left ? { transform: 'rotate(180deg)' } : undefined}
    >
      <path d="M3 8H13" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
      <path
        d="M9.25 4.25L13 8L9.25 11.75"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
