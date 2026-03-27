import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PLATFORM_ROUTES } from "../../config/navigation";

function buildBreadcrumb(pathname: string): { label: string; href?: string }[] {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return [{ label: "Dashboard" }];
  const root = parts[0];

  switch (root) {
    case 'dashboard':
    case 'overview':
      return [{ label: 'Overview' }];
    case 'campaigns':
      return [{ label: 'Campaigns' }];
    case 'campaign':
      return [{ label: 'Campaigns', href: '/dashboard' }, { label: 'Campaign Details' }];
    case 'platform':
      {
        const plat = parts[1];
        const platName = plat ? (PLATFORM_ROUTES[plat.toLowerCase()] || plat) : 'Platforms';
        return [{ label: 'Platforms', href: '/dashboard' }, { label: platName }];
      }
    case 'ai-insights':
      return [{ label: 'Intelligence', href: '/dashboard' }, { label: 'AI Insights' }];
    case 'settings':
      return [{ label: 'Settings' }];
    default:
      return [{ label: root.charAt(0).toUpperCase() + root.slice(1) }];
  }
}

export const Breadcrumb: React.FC = () => {
  const pathname = usePathname() || '/';
  const segments = useMemo(() => buildBreadcrumb(pathname), [pathname]);

  return (
    <nav className="flex items-center text-sm font-medium space-x-2 shrink-0 overflow-hidden ml-2">
      {segments.map((seg, idx) => {
        const isLast = idx === segments.length - 1;
        return (
          <React.Fragment key={idx}>
            {idx > 0 && <span className="text-gray-500/40 shrink-0">/</span>}
            {isLast || !seg.href ? (
              <span className={`truncate ${isLast ? 'text-white/90 font-semibold tracking-tight' : 'hidden sm:inline-block text-gray-400'}`}>
                {seg.label}
              </span>
            ) : (
              <Link to={seg.href} className="hover:text-white/80 transition-colors hidden sm:inline-block truncate text-gray-400">
                {seg.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
