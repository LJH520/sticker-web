'use client';

import { usePathname } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import LayoutStudyIcon from './layout-study-icon.svg';
import LayoutStudyActiveIcon from './layout-study-active-icon.svg';
import { RouteEnum } from '@/constants/route';
import { Link } from '../ui/link';
import { useTranslations } from 'next-intl';

export function LayoutAsideMenu({ children, className, ...props }: React.ComponentProps<'div'>) {
  const t = useTranslations('app.home.aside');
  const pathname = usePathname();
  return (
    <div
      className={cn('mx-5 flex flex-col gap-2 overflow-hidden [&_svg]:size-6', className)}
      {...props}
    >
      <LayoutAsideMenuItem
        icon={<LayoutStudyIcon />}
        activeIcon={<LayoutStudyActiveIcon />}
        title={t('learningHall')}
        href={RouteEnum.home}
        isActive={pathname === RouteEnum.home}
      />

      {children}
    </div>
  );
}

/** 菜单组件 */
function LayoutAsideMenuItem({
  className,
  isActive = false,
  icon,
  activeIcon,
  title,
  href,
  ...props
}: React.ComponentProps<typeof Link> & {
  isActive?: boolean;
  icon?: React.ReactNode;
  activeIcon?: React.ReactNode;
  title?: string;
}) {
  return (
    <Link
      className={cn(
        'text-[#062936)] flex shrink-0 flex-row items-center gap-4 rounded-2xl bg-transparent p-3 text-base font-medium',
        isActive &&
          'bg-linear-to-r from-[#3A8EE2] to-[#3AB2E200] text-[#0F3F6A] rtl:bg-linear-to-l',
        className,
      )}
      href={href}
      {...props}
    >
      {isActive ? activeIcon || icon : icon}
      <span className="line-clamp-1" title={title}>
        {title}
      </span>
    </Link>
  );
}
