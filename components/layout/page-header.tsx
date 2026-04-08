import { Suspense } from 'react';
import { RouteEnum } from '@/constants/route';
import { cn } from '@/lib/utils';
import { Link } from '../ui/link';
import PageBackIcon from './page-back-icon.svg';
import { LocaleSelect } from '../locale-select';
import { tv } from 'tailwind-variants';
import { ComponentVariantsProps } from '../types/component';
import PageRibbonIcon from './page-ribbon-icon.svg';
import { Skeleton } from '../ui/skeleton';

const variant = tv({
  slots: {
    /** 卡片标题样式 */
    title: 'relative flex w-fit flex-col text-lg font-medium text-[#062936]',
    /** 卡片丝带图标样式 */
    ribbonIcon: 'h-auto w-30 -translate-y-1/2 transform',
  },
  variants: {
    color: {
      '#8DD4E7': {
        base: 'bg-linear-to-t from-[#FBFDFE] from-40% to-[#8DD4E7]',
        ribbonIcon: 'text-[#3AB2E2]',
      },
      '#8DEDDF': {
        base: 'bg-linear-to-t from-[#FBFDFE] from-40% to-[#8DEDDF]',
        ribbonIcon: 'text-[#36EFCA]',
      },
      '#9EC7F8': {
        base: 'bg-linear-to-t from-[#FBFDFE] from-40% to-[#9EC7F8]',
        ribbonIcon: 'text-[#1A66FF]',
      },
    },
  },
});

/** 页面头部 */
export function PageHeader({
  className,
  classNames,
  title,
  color = '#8DD4E7',
  ...props
}: React.ComponentProps<'div'> &
  ComponentVariantsProps<typeof variant> & {
    /** 页面标题 */
    title?: string;
  }) {
  const slots = variant({
    color,
  });

  return (
    <div
      className={cn(
        'relative z-10 flex w-full shrink-0 flex-row-reverse items-start justify-between gap-2 pb-7.5',
        className,
      )}
      {...props}
    >
      <Suspense fallback={<Skeleton className="h-10 min-w-30 rounded-full" />}>
        <LocaleSelect />
      </Suspense>
      {!title ? null : (
        <Link href={RouteEnum.home} className="flex flex-row items-start gap-3">
          <PageBackIcon className="size-8 shrink-0" />
          <span className={slots.title({ className: classNames?.title })}>
            <span>{title}</span>
            <PageRibbonIcon className={slots.ribbonIcon({ className: classNames?.ribbonIcon })} />
          </span>
        </Link>
      )}
    </div>
  );
}
