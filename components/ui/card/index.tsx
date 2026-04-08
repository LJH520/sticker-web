import * as React from 'react';

import { cn } from '@/lib/utils';
import { tv, VariantProps } from 'tailwind-variants';
import { Slot } from '@radix-ui/react-slot';

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn(
        'flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm',
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('leading-none font-semibold', className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-content" className={cn('px-6', className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
      {...props}
    />
  );
}

// const cardVariants = tv({
//   slots: {
//     base: 'flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm',
//     header:
//       '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
//     title: 'leading-none font-semibold',
//     description: 'text-sm text-muted-foreground',
//     action: 'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
//     content: 'px-6',
//     footer: 'flex items-center px-6 [.border-t]:pt-6',
//   },
//   variants: {
//     variant: {
//       default: '',
//     },
//     size: {
//       default: '',
//     },
//     color: {
//       default: '',
//     },
//   },
//   defaultVariants: {
//     variant: 'default',
//     size: 'default',
//     color: 'default',
//   },
// });

// function DefaultCard({
//   className,
//   classNames,
//   variant = 'default',
//   size = 'default',
//   color = 'default',
//   title = 'Default Card',
//   description = 'This is a description of the default card.',
//   children = 'The card component supports a size prop that defaults to "default" for standard spacing and sizing.',
//   ...props
// }: React.ComponentProps<typeof Card> &
//   VariantProps<typeof cardVariants> & {
//     title?: string;
//     description?: string;
//     classNames?: Record<keyof typeof cardVariants.slots, string>;
//   }) {
//   const slots = cardVariants({ variant, size, color });

//   return (
//     <Card className={cn(slots.base({ className: classNames?.base }), className)} {...props}>
//       <CardHeader className={cn(slots.header({ className: classNames?.header }))}>
//         <CardTitle className={cn(slots.title({ className: classNames?.title }))}>{title}</CardTitle>
//         <CardDescription className={cn(slots.description({ className: classNames?.description }))}>
//           {description}
//         </CardDescription>
//         <CardAction className={cn(slots.action({ className: classNames?.action }))}>X</CardAction>
//       </CardHeader>
//       <CardContent className={cn(slots.content({ className: classNames?.content }))}>
//         {children}
//       </CardContent>
//       <CardFooter className={cn(slots.footer({ className: classNames?.footer }))}>
//         <button>ok</button>
//         <button>cancel</button>
//       </CardFooter>
//     </Card>
//   );
// }

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  // DefaultCard,
  // cardVariants,
};
