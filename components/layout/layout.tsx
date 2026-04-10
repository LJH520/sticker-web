import { cn } from '@/lib/utils';
import { tv } from 'tailwind-variants';
import { LoginDialog } from '../login-dialog';
import { ComponentVariantsProps } from '../types/component';
import { LayoutFooter } from './layout-footer';
import { LayoutHeader } from './layout-header';

async function getCurrentYear() {
  'use cache';

  return new Date().getFullYear();
}

const variants = tv({
  slots: {
    base: 'mx-auto flex min-h-dvh max-w-360 flex-col text-[#062936]',
    header:
      'box-border w-full max-w-340 min-w-[295px] rounded-full border-2 border-[#321403] bg-white',
    scrollArea: 'flex-1 overflow-y-auto overscroll-y-contain',
    shell: 'mx-auto flex min-h-full w-full max-w-400 flex-col',
    content: 'flex flex-1 flex-col',
    footer:
      'mt-8 rounded-t-[38px] bg-[#F3C738] px-[clamp(1rem,8vw,7.5rem)] py-[clamp(1rem,7vw,7.5rem)]',
  },
});

/** 默认官网布局 */
export async function Layout({
  children,
  classNames,
  className,
  ...props
}: ComponentVariantsProps<typeof variants> & React.ComponentProps<'div'>) {
  const slots = variants();
  const year = await getCurrentYear();

  return (
    <div
      data-slot="layout"
      className={cn(slots.base({ className: classNames?.base }), className)}
      {...props}
    >
      <div className="fixed inset-x-0 top-10 z-40 flex min-w-[375px] justify-center px-10 max-md:px-4">
        <LayoutHeader className={slots.header({ className: classNames?.header })} />
      </div>

      <div className={slots.scrollArea({ className: classNames?.scrollArea })}>
        <div className={slots.shell({ className: classNames?.shell })}>
          <LayoutContent className={slots.content({ className: classNames?.content })}>
            {children}
          </LayoutContent>
          <LayoutFooter className={slots.footer({ className: classNames?.footer })} year={year} />
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
