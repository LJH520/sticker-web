'use client';

import { cn } from '@/lib/utils';
import { RouteEnum } from '@/constants/route';
import { useTranslations } from 'next-intl';
import { BadgeHelp, BookOpen, FileText, ShieldCheck, Sparkles, Store } from 'lucide-react';
import { Link } from '../ui/link';

type LayoutTranslationKey =
  | 'nav.products'
  | 'nav.faq'
  | 'nav.blog'
  | 'sections.discover'
  | 'sections.support'
  | 'links.privacyPolicy'
  | 'links.termsOfUse';

export type LayoutTranslations = (key: LayoutTranslationKey) => string;

export type NavigationItem = {
  href: RouteEnum;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

export type NavigationGroup = {
  title: string;
  items: NavigationItem[];
};

export function isRouteActive(pathname: string, href: RouteEnum) {
  if (href === RouteEnum.home) {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getPrimaryNav(t: LayoutTranslations): NavigationItem[] {
  return [
    { href: RouteEnum.home, label: t('nav.products'), icon: Store },
    { href: RouteEnum.FAQ, label: t('nav.faq'), icon: BadgeHelp },
    { href: RouteEnum.blog, label: t('nav.blog'), icon: BookOpen },
  ];
}

export function getFooterLinkGroups(t: LayoutTranslations): NavigationGroup[] {
  return [
    {
      title: t('sections.discover'),
      items: getPrimaryNav(t),
    },
    {
      title: t('sections.support'),
      items: [
        {
          href: RouteEnum.privacyPolicy,
          label: t('links.privacyPolicy'),
          icon: ShieldCheck,
        },
        {
          href: RouteEnum.termsOfUse,
          label: t('links.termsOfUse'),
          icon: FileText,
        },
      ],
    },
  ];
}

export function BrandLink() {
  const t = useTranslations('app.layout');

  return (
    <Link href={RouteEnum.home} className="group flex min-w-0 items-center gap-3">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-3xl bg-[linear-gradient(135deg,#0a7ca8_0%,#38b6e2_52%,#7de3f4_100%)] text-white shadow-[0_12px_35px_-16px_rgba(10,124,168,0.9)] transition group-hover:scale-[1.03]">
        <Sparkles className="size-5" />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-base font-semibold tracking-[0.18em] text-[#062936] uppercase sm:text-lg">
          {t('brand.name')}
        </span>
        <span className="hidden truncate text-[11px] text-[#52707d] sm:block">
          {t('brand.slogan')}
        </span>
      </span>
    </Link>
  );
}

export function HeaderNavLink({
  item,
  active,
  onClick,
  mobile = false,
}: {
  item: NavigationItem;
  active: boolean;
  onClick?: () => void;
  mobile?: boolean;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        mobile
          ? 'flex w-full items-center justify-between rounded-[22px] px-4 py-4 text-sm font-medium tracking-[0.08em] uppercase transition'
          : 'inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium tracking-[0.14em] uppercase transition',
        active
          ? 'bg-[#062936] text-white shadow-[0_18px_40px_-24px_rgba(6,41,54,0.85)]'
          : 'text-[#52707d] hover:bg-[#edf5f8] hover:text-[#062936]',
      )}
    >
      <Icon className="size-4" />
      <span>{item.label}</span>
    </Link>
  );
}
