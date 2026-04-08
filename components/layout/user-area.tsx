'use client';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { useTranslations } from 'next-intl';
import { useLoginDialogStore } from '../login-dialog';
import useUserStore from '@/stores/useUserStore';
import { Img } from '../ui/img';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';

/** 用户区域 */
export function UserArea() {
  const isInit = useUserStore((state) => state.isInit);
  const userId = useUserStore((state) => state.userInfo?.userId);
  return !isInit ? null : !userId ? (
    <LoginButton />
  ) : (
    <LogoutDropdownMenu>
      <UserCard />
    </LogoutDropdownMenu>
  );
}

/** 登录按钮 */
export function LoginButton({ className, ...props }: React.ComponentProps<typeof Button>) {
  const t = useTranslations('app.home.aside');

  const onClick = () => {
    useLoginDialogStore.getState().openDialog();
  };

  return (
    <Button
      className={cn('w-full', className)}
      size="48px"
      color="#062936"
      onClick={onClick}
      {...props}
    >
      {t('loginRegister')}
    </Button>
  );
}

/** 用户卡片 */
export function UserCard({ className, ...props }: React.ComponentProps<'div'>) {
  const name = useUserStore((state) => state.userInfo?.nickname);
  const src = useUserStore((state) => state.userInfo?.headPortrait);

  return (
    <div
      className={cn(
        'flex w-full cursor-pointer flex-row items-center gap-2 rounded-[12px] bg-[#FFFFFFCC] p-1.5',
        className,
      )}
      {...props}
    >
      <div className="relative size-11 overflow-hidden rounded-full bg-[#34D4EA] [&_img]:object-cover [&_img]:object-top">
        {!src ? null : <Img src={src} fill />}
      </div>
      <span className="text-base font-medium text-[#062936]">{name}</span>
    </div>
  );
}

/** 退出登录下拉菜单 */
export function LogoutDropdownMenu({
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenu>) {
  const t = useTranslations('app.home.aside');

  const [loading, setLoading] = useState(false);
  const onClick = async () => {
    setLoading(true);
    await useUserStore
      .getState()
      .logout()
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger className="w-full">{children}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Button
            className="w-full border-none bg-transparent outline-none"
            loading={loading}
            onClick={onClick}
            color={'null'}
          >
            {t('logout')}
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
