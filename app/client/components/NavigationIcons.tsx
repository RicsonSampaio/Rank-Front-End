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

export function OrganizationIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 21V3h14v18M3 21h18M10 21v-4h4v4" />
      <path d="M9 7h1m4 0h1M9 11h1m4 0h1" />
    </svg>
  );
}

export function PencilIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m16 3 5 5-12 12-6 1 1-6L16 3ZM13 6l5 5" />
    </svg>
  );
}

export function TrashIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7" />
    </svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 5 5" />
    </svg>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function MemberIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="4" />
      <path d="M4 21v-2a8 8 0 0 1 16 0v2H4Z" />
    </svg>
  );
}