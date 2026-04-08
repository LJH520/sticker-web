import { Link as RouteLink } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { ComponentProps } from 'react';
import { UrlObject } from 'url';
import { LinkProps as RouteLinkProps } from 'next/link';

export type LinkProps = Omit<ComponentProps<'a'>, 'href'> & {
  href: string | UrlObject;
  /** 是否开启滚动, 导航到新页面时，只要该页面在视口中可见，滚动位置就会保持不变。但是，如果该页面在视口中不可见，Next.js 将滚动到第一个页面元素的顶部。 */
  scroll?: boolean;
  /** 是否预请求，当组件进入用户视口（初始或滚动时）时，会发生预取
   * null 预取行为取决于路由是静态还是动态。对于静态路由，将预取完整路由（包括其所有数据）。对于动态路由，loading.js将预取到最近有边界的网段的部分路由。
   * true：静态和动态路由都将预取完整路由。
   * false：进入视口和悬停时都不会发生预取。
   */
  prefetch?: RouteLinkProps['prefetch'];
  /** 是否禁用 */
  disabled?: boolean;
  replace?: boolean | undefined;
};

/** 链接组件，支持国际化会自动添加国际化前缀
 * @see [next-intl-link](https://next-intl.dev/docs/routing/navigation)
 * @see [next-link](https://nextjs.org/docs/app/api-reference/components/link#reference)
 */
export function Link({
  className,
  href,
  scroll = true,
  prefetch = null,
  disabled = false,
  replace = false,
  ...props
}: LinkProps) {
  return (
    <RouteLink
      data-slot="link"
      className={cn(disabled ? 'pointer-events-none' : '', className)}
      href={href}
      scroll={scroll}
      prefetch={prefetch}
      replace={replace}
      {...props}
    />
  );
}
