import { cn } from '@/lib/utils';
import { tv } from 'tailwind-variants';
import { LoginDialog } from '../login-dialog';
import { ComponentVariantsProps } from '../types/component';
import { LayoutFooter } from './layout-footer';
import { LayoutHeader } from './layout-header';

const variants = tv({
  slots: {
    base: 'flex h-dvh min-h-dvh flex-col overflow-hidden bg-[radial-gradient(circle_at_top,#f7fbfd_0%,#eff7fa_32%,#edf4f7_62%,#e8f0f4_100%)] text-[#062936]',
    header:
      'sticky top-0 z-40 border-b border-[#d5e4eb] bg-[#f9fcfe]/92 shadow-[0_12px_30px_-24px_rgba(6,41,54,0.55)] backdrop-blur-xl',
    scrollArea: 'flex-1 overflow-y-auto overscroll-y-contain',
    shell: 'mx-auto flex min-h-full w-full max-w-400 flex-col',
    content: 'flex flex-1 flex-col px-4 pt-4 pb-10 sm:px-6 sm:pt-6 sm:pb-12 md:px-10 lg:px-8',
    footer:
      'mt-8 border-t border-[#d7e4eb] bg-[linear-gradient(180deg,rgba(255,255,255,0.55)_0%,rgba(232,240,244,0.9)_100%)] px-4 py-8 sm:px-6 md:px-10 lg:px-8',
  },
});

/** 默认官网布局 */
export function Layout({
  children,
  classNames,
  className,
  ...props
}: ComponentVariantsProps<typeof variants> & React.ComponentProps<'div'>) {
  const slots = variants();

  return (
    <div
      data-slot="layout"
      className={cn(slots.base({ className: classNames?.base }), className)}
      {...props}
    >
      <LayoutHeader className={slots.header({ className: classNames?.header })} />

      <div className={slots.scrollArea({ className: classNames?.scrollArea })}>
        <div className={slots.shell({ className: classNames?.shell })}>
          <LayoutContent className={slots.content({ className: classNames?.content })}>
            {children}
          </LayoutContent>
          <LayoutFooter className={slots.footer({ className: classNames?.footer })} />
        </div>
      </div>

      <LoginDialog />
    </div>
  );
}

/** 布局内容 */
function LayoutContent({ children, className, ...props }: React.ComponentProps<'main'>) {
  return (
    <main data-slot="layout-content" className={cn(className)} {...props}>
      {children}
    </main>
  );
}
