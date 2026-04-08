import { tv, VariantProps } from 'tailwind-variants';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const cardVariants = tv({
  slots: {
    base: 'flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm',
    header:
      '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
    title: 'leading-none font-semibold',
    description: 'text-sm text-muted-foreground',
    action: 'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
    content: 'px-6',
    footer: 'flex items-center px-6 [.border-t]:pt-6',
  },
  variants: {
    variant: {
      default: {
        // base: 'border-gray-200 shadow-sm [--color-card-foreground:#1f2937] [--color-card:#ffffff]',
      },
    },
    size: {
      default: {},
      sm: {},
      lg: {},
    },
    color: {
      default: {
        base: '[--color-card-foreground:#1f2937] [--color-card:#ffffff]',
        description: '@container/card-header text-card-foreground',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
    color: 'default',
  },
});

/**
 * 默认卡片组件
 *
 * @description 一个通用的卡片组件，包含标题、描述、内容和操作区域，支持多种变体和尺寸。
 */
function DefaultCard({
  className,
  classNames,
  variant = 'default',
  size = 'default',
  color = 'default',
  title = 'Default Card',
  description = 'This is a description of the default card.',
  children = 'The card component supports a size prop that defaults to "default" for standard spacing and sizing.',
  ...props
}: React.ComponentProps<typeof Card> &
  VariantProps<typeof cardVariants> & {
    title?: string;
    description?: string;
    classNames?: Record<keyof typeof cardVariants.slots, string>;
  }) {
  const slots = cardVariants({ variant, size, color });

  return (
    // <Card className={cn(slots.base({ className: classNames?.base }), className)} {...props}>
    //   <CardHeader className={cn(slots.header({ className: classNames?.header }))}>
    //     <CardTitle className={cn(slots.title({ className: classNames?.title }))}>{title}</CardTitle>
    //     <CardDescription className={cn(slots.description({ className: classNames?.description }))}>
    //       {description}
    //     </CardDescription>
    //     <CardAction className={cn(slots.action({ className: classNames?.action }))}>X</CardAction>
    //   </CardHeader>
    //   <CardContent className={cn(slots.content({ className: classNames?.content }))}>
    //     {children}
    //   </CardContent>
    //   {/* <CardFooter className={cn(slots.footer({ className: classNames?.footer }))}>
    //     <button>ok</button>
    //     <button>cancel</button>
    //   </CardFooter> */}
    // </Card>
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>Default Card</CardTitle>
        <CardDescription>This card uses the default size variant.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          The card component supports a size prop that defaults to &quot;default&quot; for standard
          spacing and sizing.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Action
        </Button>
      </CardFooter>
    </Card>
  );
}

export { DefaultCard };
