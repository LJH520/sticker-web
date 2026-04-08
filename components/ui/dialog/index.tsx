'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { tv } from 'tailwind-variants';
import { ComponentVariantsProps } from '@/components/types/component';

/** 弹框组件样式 */
export const DialogVariants = tv({
  slots: {
    /** 遮罩层元素 */
    overlay:
      'fixed inset-0 z-50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0',
    /** 根元素 */
    base: 'fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:max-w-lg',
    /** 头部元素 */
    header: 'flex flex-col gap-2 text-center sm:text-left',
    /** 头部标题元素 */
    title: 'text-lg leading-none font-semibold',
    /** 头部描述元素 */
    description: 'text-sm',
    /** 内容元素 */
    body: 'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
    /** 底部元素 */
    footer: 'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
    /** 关闭按钮 */
    closeButton:
      "absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  },
  variants: {
    /** 弹框颜色 */
    colors: {
      /** 默认颜色 */
      default: {
        overlay: 'bg-black/50',
        base: 'bg-background',
        description: 'text-muted-foreground',
        closeButton:
          'ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground',
      },
    },
    /** 弹框大小 */
    size: {
      default: '',
    },
  },
});

/** 弹框组件 */
export function Dialog({
  children,
  className,
  classNames,
  colors = 'default',
  size = 'default',
  open = false,
  title,
  description,
  header,
  footer,
  closeButton,
  ...props
}: ComponentVariantsProps<typeof DialogVariants> &
  React.ComponentProps<typeof DialogRoot> & {
    /** 弹框标题 */
    title?: string;
    /** 弹框描述 */
    description?: string;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    closeButton?: React.ReactNode;
  }) {
  const slots = DialogVariants({
    colors,
    size,
  });

  return (
    <DialogRoot data-slot="dialog" open={open} {...props}>
      <DialogPortal>
        <DialogOverlay className={slots.overlay({ className: classNames?.overlay })} />
        <DialogContent className={slots.base({ className: cn(className, classNames?.base) })}>
          {closeButton ? (
            closeButton
          ) : (
            <DialogCloseButton
              className={slots.closeButton({ className: classNames?.closeButton })}
            />
          )}

          <DialogHeader className={slots.header({ className: classNames?.header })}>
            {header}
            <DialogTitle
              className={cn(slots.title({ className: classNames?.title }), header && 'hidden')}
            >
              {title}
            </DialogTitle>
            <DialogDescription
              className={cn(
                slots.description({ className: classNames?.description }),
                header && 'hidden',
              )}
            >
              {description}
            </DialogDescription>
          </DialogHeader>

          <DialogBody className={slots.body({ className: classNames?.body })}>
            {children}
          </DialogBody>

          {footer ? (
            footer
          ) : (
            <DialogFooter
              className={slots.footer({ className: classNames?.footer })}
            ></DialogFooter>
          )}
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
}

export function DialogRoot({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog-root" {...props} />;
}

export function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

export function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

export function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

export function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay data-slot="dialog-overlay" className={cn(className)} {...props} />
  );
}

export function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content data-slot="dialog-content" className={cn(className)} {...props}>
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

export function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="dialog-header" className={cn(className)} {...props} />;
}

export function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title data-slot="dialog-title" className={cn(className)} {...props} />;
}

export function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(className)}
      {...props}
    />
  );
}

export function DialogBody({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="dialog-body" className={cn(className)} {...props} />;
}

export function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="dialog-footer" className={cn(className)} {...props} />;
}

export function DialogCloseButton({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return (
    <DialogPrimitive.Close data-slot="dialog-close" className={cn(className)} {...props}>
      <XIcon />
      <span className="sr-only">Close</span>
    </DialogPrimitive.Close>
  );
}
