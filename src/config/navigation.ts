import React from "react";import {
  LayoutDashboard, Megaphone, Zap, Settings,
  Globe, Facebook, Linkedin, Twitter, Target
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  exact?: boolean;
  badge?: string;
  disabled?: boolean;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const PLATFORM_ROUTES: Record<string, string> = {
  google:   "Google Ads",
  meta:     "Meta Ads",
  linkedin: "LinkedIn Ads",
  twitter:  "Twitter Ads",
};

export const PLATFORM_ICONS: Record<string, any> = {
  google:   Globe,
  meta:     Facebook,
  linkedin: Linkedin,
  twitter:  Twitter,
};

export const NAV_SECTIONS: NavSection[] = [
  {
    title: "Main",
    items: [
      { label: "Overview",     href: "/dashboard",    icon: LayoutDashboard, exact: true },
      { label: "Campaigns",    href: "/campaigns",    icon: Megaphone },
    ],
  },
  {
    title: "Platforms",
    items: [
      { label: "Google Ads",   href: "/platform/google",   icon: Globe },
      { label: "Meta Ads",     href: "/platform/meta",     icon: Facebook },
      { label: "LinkedIn Ads", href: "/platform/linkedin", icon: Linkedin },
      { label: "Twitter Ads",  href: "/platform/twitter",  icon: Twitter },
    ],
  },
  {
    title: "Intelligence",
    items: [
      { label: "AI Insights",  href: "/ai-insights",  icon: Zap, badge: "New" },
      { label: "AI Recommendations", href: "/ai-recommendations", icon: Target },
    ],
  },
  {
    title: "Settings",
    items: [
      { label: "Settings",     href: "/settings",     icon: Settings },
    ],
  },
];
