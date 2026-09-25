type IconProps = { className?: string };

export function HomeIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10Z" />
      <path d="M9 21v-7h6v7" />
    </svg>
  );
}

export function SettingsIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3.5 13.6 5l2-.2.8 2 1.9.8-.2 2 1.5 1.6-1.5 1.6.2 2-1.9.8-.8 2-2-.2L12 19l-1.6-1.5-2 .2-.8-2-1.9-.8.2-2L4.4 11l1.5-1.6-.2-2 1.9-.8.8-2 2 .2L12 3.5Z" transform="translate(0 1)" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function PeopleIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20v-2a6 6 0 0 1 12 0v2H3Z" />
      <path d="M16 5.2a3 3 0 0 1 0 5.6M18 14a5 5 0 0 1 3 4.6V20h-3" />
    </svg>
  );
}