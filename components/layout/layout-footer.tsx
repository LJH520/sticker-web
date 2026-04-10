'use client';

import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { BrandLink, getFooterLinkGroups, NavigationGroup } from './layout-shared';
import { Link } from '../ui/link';
import { RouteEnum } from '@/constants/route';
import AppleIcon from './svg/apple.svg';
import GooglePlayIcon from './svg/googlePlay.svg';

type LayoutFooterProps = React.ComponentProps<'footer'> & {
  year: number;
};

export function LayoutFooter({ className, year, ...props }: LayoutFooterProps) {
  const t = useTranslations('app.layout');
  const linkGroups = getFooterLinkGroups();

  return (
    <footer data-slot="layout-footer" className={cn(className)} {...props}>
      <div className="flex flex-row items-stretch justify-between gap-10 max-md:flex-col max-md:items-center">
        {/* 底部第一块 */}
        <div className="flex flex-col">
          <BrandLink className="h-auto w-[clamp(180px,25vw,361px)] max-md:h-4" />

          <div className="my-6 flex flex-wrap gap-[clamp(1rem,3.5vw,50px)]">
            {linkGroups.flatMap((item) => (
              <FooterIconLink
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
              />
            ))}
          </div>

          <div className="mt-auto">
            {t('footer.companyName')} @{year}
          </div>
        </div>

        {/* 底部第二块 */}
        <div className="flex gap-6">
          <div className="flex flex-col gap-3">
            <div className="font-sigmar text-xl text-[#321403] uppercase">
              {t('footer.aboutUs')}
            </div>
            {[
              {
                href: RouteEnum.aboutUs,
                label: t('footer.aboutUs'),
              },
              {
                href: RouteEnum.blog,
                label: t('footer.blog'),
              },
              {
                href: RouteEnum.contactUs,
                label: t('footer.contactUs'),
              },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="text-base text-[#602F13]">
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <div className="font-sigmar text-xl text-[#321403] uppercase">
              {t('footer.parentZone')}
            </div>
            {[
              {
                href: RouteEnum.returnPolicy,
                label: t('footer.deliveryAndReturns'),
              },
              {
                href: RouteEnum.FAQ,
                label: t('footer.FAQ'),
              },
              {
                href: RouteEnum.privacyPolicy,
                label: t('footer.privacyPolicy'),
              },
              {
                href: RouteEnum.termsOfUse,
                label: t('footer.termsOfUse'),
              },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="text-base text-[#602F13]">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* 底部第三块 */}
        <div className="flex flex-col gap-3 max-md:items-center">
          <div className="font-sigmar text-xl text-[#321403] uppercase">
            {t('footer.stayInLoop')}
          </div>

          <div className="w-[clamp(200px,26vw,377px)] rounded-3xl border-2 border-[#321403] bg-[#fff] p-5">
            email address
          </div>

          <div className="mt-3 mb-8 self-end rounded-[24px] bg-[#321403] px-15 py-5 font-sigmar text-[26px] text-[#FAF5F1]">
            {t('footer.subscribe')}
          </div>

          <div className="flex gap-5 self-end">
            <AppleIcon className="h-auto w-30"></AppleIcon>
            <GooglePlayIcon className="h-auto w-30"></GooglePlayIcon>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterIconLink({ href, label, icon: Icon }: NavigationGroup) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="inline-flex items-center justify-center transition hover:-translate-y-0.5"
    >
      <Icon className="h-auto w-[clamp(42px,5.5vw,80px)]" />
    </Link>
  );
}
