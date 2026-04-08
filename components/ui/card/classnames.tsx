import { tv } from 'tailwind-variants';

export const cardClassNames = tv({
  slots: {
    base: 'inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  },
  variants: {
    variant: {
      default: '',
      destructive:
        'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40',
      outline:
        'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
      link: 'text-primary underline-offset-4 hover:underline',
    },
    size: {
      default: '[&_svg]size-4 h-9 px-4 py-2 has-[>svg]:px-3',
      sm: 'h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5',
      lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
      icon: 'size-9',
      'icon-sm': 'size-8',
      'icon-lg': 'size-10',
      '40px': 'h-10 gap-2 rounded-[12px] px-5 text-sm [&_svg]:size-5',
      '46px': 'h-11.5 rounded-[10px] px-5 text-xs',
      '48px': 'h-12 rounded-[16px] px-4 text-base',
      '52px': 'h-13 rounded-[12px] text-base [&_svg]:h-auto [&_svg]:w-5.5',
      '58px': 'not-only-of-type: h-14.5 rounded-[16px] px-3 py-2 text-lg',
    },
    color: {
      null: '',
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      '#062936':
        'bg-(--color-bg) text-(--color-text) outline-4 outline-[#F6FDFE] outline-solid [--color-bg-active:#062936] [--color-bg-hover:#062936cc] [--color-bg:#062936] [--color-text:#F1F9FF] hover:bg-(--color-bg-hover) active:bg-(--color-bg-active)',
      '#DEEAEF':
        'bg-(--color-bg) text-(--color-text) [--color-bg-active:#DEEAEF] [--color-bg-hover:#DEEAEFcc] [--color-bg:#DEEAEF] [--color-text:#0F3F6A] hover:bg-(--color-bg-hover) active:bg-(--color-bg-active)',
      '#3A8EE2-#3AB2E2':
        'bg-linear-to-r from-[#3A8EE2] to-[#3AC9E2] text-[#F1F9FF] hover:opacity-80 rtl:bg-linear-to-l',
      '#85A7FF-#466DFF':
        'bg-linear-to-r from-[#3B8EE2] to-[#44CCE4] text-[#F1F9FF] outline-4 outline-[#DAEEFF] outline-solid hover:opacity-80 rtl:bg-linear-to-l',
      '#D6FFF1-#CAEDFF':
        'bg-linear-to-r from-[#D6FFF1] to-[#CAEDFF] text-[#062936] hover:opacity-80 rtl:bg-linear-to-l',
      '#3A8EE2-#3AC9E2':
        'border-4 border-[#8EA3B2] bg-linear-to-r from-[#3A8EE2] to-[#3AC9E2] text-white hover:opacity-80 rtl:bg-linear-to-l',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
    color: 'default',
  },
});
