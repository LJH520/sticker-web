import { tv } from 'tailwind-variants';
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

// 定义LoginCard的样式变体
const loginCardVariants = tv({
  slots: {
    base: 'w-full max-w-sm',
    header: '',
    title: 'text-lg font-semibold md:text-xl',
    description: 'text-sm text-muted-foreground md:text-base',
    content: '',
    form: '',
    formContainer: 'flex flex-col gap-6',
    inputGroup: 'grid gap-2',
    labelContainer: 'flex items-center',
    forgotPassword: 'ms-auto inline-block text-sm underline-offset-4 hover:underline',
    footer: 'flex-col gap-2',
    loginButton: 'w-full',
    googleButton: 'w-full',
  },
  variants: {
    size: {
      sm: {
        base: 'max-w-xs',
        title: 'text-base md:text-lg',
        description: 'text-xs md:text-sm',
      },
      md: {
        base: 'max-w-sm',
        title: 'text-lg md:text-xl',
        description: 'text-sm md:text-base',
      },
      lg: {
        base: 'max-w-md',
        title: 'text-xl md:text-2xl',
        description: 'text-base md:text-lg',
      },
    },
    variant: {
      default: {
        base: 'border shadow-sm',
      },
      minimal: {
        base: 'border-0 shadow-none',
      },
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
  },
});

interface LoginCardProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal';
  className?: string;
}

/** 登录卡片 */
export function LoginCard({ size = 'md', variant = 'default', className }: LoginCardProps) {
  const styles = loginCardVariants({ size, variant });

  return (
    <Card className={styles.base({ class: className })}>
      <CardHeader className={styles.header()}>
        <CardTitle className={styles.title()}>Login to your account</CardTitle>
        <CardDescription className={styles.description()}>
          Enter your email below to login to your account
        </CardDescription>
        <CardAction>
          <Button variant="link">Sign Up</Button>
        </CardAction>
      </CardHeader>
      <CardContent className={styles.content()}>
        <form className={styles.form()}>
          <div className={styles.formContainer()}>
            <div className={styles.inputGroup()}>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className={styles.inputGroup()}>
              <div className={styles.labelContainer()}>
                <Label htmlFor="password">Password</Label>
                <a href="#" className={styles.forgotPassword()}>
                  Forgot your password?
                </a>
              </div>
              <Input id="password" type="password" required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className={styles.footer()}>
        <Button type="submit" className={styles.loginButton()}>
          Login
        </Button>
        <Button variant="outline" className={styles.googleButton()}>
          Login with Google
        </Button>
      </CardFooter>
    </Card>
  );
}
