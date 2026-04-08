'use client';

import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { BrandLink, getFooterLinkGroups, NavigationItem } from './layout-shared';
import { Link } from '../ui/link';

export function LayoutFooter({ className, ...props }: React.ComponentProps<'footer'>) {
  const t = useTranslations('app.layout');
  const linkGroups = getFooterLinkGroups(t);

  return (
    <footer data-slot="layout-footer" className={cn(className)} {...props}>
      <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div className="rounded-[28px] border border-white/70 bg-white/75 p-6 shadow-[0_24px_70px_-48px_rgba(6,41,54,0.85)]">
          <BrandLink />
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#55727f]">
            {t('footer.description')}
          </p>
          <p className="mt-4 text-sm leading-7 text-[#55727f]">{t('footer.note')}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            {linkGroups.flatMap((group) =>
              group.items.map((item) => (
                <FooterIconLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                />
              )),
            )}
          </div>
        </div>

        {linkGroups.map((group) => (
          <div
            key={group.title}
            className="rounded-[28px] border border-white/70 bg-white/72 p-6 shadow-[0_24px_70px_-48px_rgba(6,41,54,0.85)]"
          >
            <h3 className="text-xs font-semibold tracking-[0.22em] text-[#7c97a5] uppercase">
              {group.title}
            </h3>
            <div className="mt-5 space-y-2">
              {group.items.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-[#35535f] transition hover:bg-[#eef5f8] hover:text-[#062936]"
                  >
                    <span className="inline-flex size-10 items-center justify-center rounded-full bg-[#edf5f8] text-[#062936] transition group-hover:bg-[#062936] group-hover:text-white">
                      <Icon className="size-4" />
                    </span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-[#d7e4eb] pt-5 text-sm text-[#6f8a97] sm:flex-row sm:items-center sm:justify-between">
        <span>
          {t('brand.name')} © {new Date().getFullYear()}
        </span>
        <span>{t('footer.shopWindow')}</span>
      </div>
    </footer>
  );
}

function FooterIconLink({
  href,
  label,
  icon: Icon,
}: Pick<NavigationItem, 'href' | 'label' | 'icon'>) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="inline-flex size-11 items-center justify-center rounded-full border border-[#d7e4eb] bg-white text-[#062936] shadow-[0_18px_50px_-36px_rgba(6,41,54,0.8)] transition hover:-translate-y-0.5 hover:bg-[#062936] hover:text-white"
    >
      <Icon className="size-4" />
    </Link>
  );
}
