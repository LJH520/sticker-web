'use client';

import { cn } from '@/lib/utils';
import { usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { LogOut, Menu, ShoppingCart, UserRound } from 'lucide-react';
import useUserStore from '@/stores/useUserStore';
import { useLoginDialogStore } from '../login-dialog';
import { Dialog, DialogCloseButton } from '../ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Img } from '../ui/img';
import { Link } from '../ui/link';
import {
  BrandLink,
  getFooterLinkGroups,
  getPrimaryNav,
  HeaderNavLink,
  isRouteActive,
  NavigationItem,
} from './layout-shared';

export function LayoutHeader({ className, ...props }: React.ComponentProps<'header'>) {
  const t = useTranslations('app.layout');
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = getPrimaryNav(t);

  return (
    <header data-slot="layout-header" className={cn(className)} {...props}>
      <div className="mx-auto flex h-18 max-w-400 items-center gap-3 px-4 sm:h-20 sm:px-6 md:px-10 lg:px-8">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border border-[#d7e6ec] bg-white/85 text-[#062936] shadow-[0_10px_30px_-22px_rgba(6,41,54,0.7)] transition hover:-translate-y-0.5 hover:bg-[#edf6fa] md:hidden"
            aria-label={t('drawer.title')}
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="size-5" />
          </button>
          <BrandLink />
        </div>

        <nav className="hidden flex-1 items-center justify-center md:flex">
          <div className="flex items-center gap-2 rounded-full border border-[#d8e6ec] bg-white/82 p-2 shadow-[0_18px_60px_-36px_rgba(6,41,54,0.55)]">
            {navItems.map((item) => (
              <HeaderNavLink
                key={item.href}
                item={item}
                active={isRouteActive(pathname, item.href)}
              />
            ))}
          </div>
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <CartButton label={t('actions.cart')} count={t('actions.cartCount')} />
          <AccountButton
            accountLabel={t('actions.account')}
            loginLabel={t('actions.login')}
            logoutLabel={t('actions.logout')}
          />
        </div>
      </div>

      <MobileNavigationDrawer
        drawerHint={t('drawer.hint')}
        supportTitle={t('sections.support')}
        navItems={navItems}
        open={isMenuOpen}
        onOpenChange={setIsMenuOpen}
      />
    </header>
  );
}

function CartButton({ label, count }: { label: string; count: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="relative inline-flex size-11 items-center justify-center rounded-full border border-[#d7e6ec] bg-white/85 text-[#062936] shadow-[0_10px_30px_-22px_rgba(6,41,54,0.7)] transition hover:-translate-y-0.5 hover:bg-[#edf6fa]"
    >
      <ShoppingCart className="size-5" />
      <span className="absolute -top-0.5 -right-0.5 inline-flex min-w-5 items-center justify-center rounded-full bg-[#062936] px-1.5 py-0.5 text-[10px] font-semibold text-white">
        {count}
      </span>
    </button>
  );
}

function AccountButton({
  accountLabel,
  loginLabel,
  logoutLabel,
}: {
  accountLabel: string;
  loginLabel: string;
  logoutLabel: string;
}) {
  const isInit = useUserStore((state) => state.isInit);
  const userId = useUserStore((state) => state.userInfo?.userId);
  const name = useUserStore((state) => state.userInfo?.nickname);
  const src = useUserStore((state) => state.userInfo?.headPortrait);
  const [loading, setLoading] = useState(false);

  if (!isInit || !userId) {
    return (
      <button
        type="button"
        aria-label={loginLabel}
        title={loginLabel}
        onClick={() => useLoginDialogStore.getState().openDialog()}
        className="inline-flex size-11 items-center justify-center rounded-full border border-[#d7e6ec] bg-white/85 text-[#062936] shadow-[0_10px_30px_-22px_rgba(6,41,54,0.7)] transition hover:-translate-y-0.5 hover:bg-[#edf6fa]"
      >
        <UserRound className="size-5" />
      </button>
    );
  }

  const handleLogout = async () => {
    setLoading(true);
    await useUserStore
      .getState()
      .logout()
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={name || accountLabel}
          className="inline-flex size-11 items-center justify-center overflow-hidden rounded-full border border-[#d7e6ec] bg-white/90 text-[#062936] shadow-[0_10px_30px_-22px_rgba(6,41,54,0.7)] transition hover:-translate-y-0.5 hover:bg-[#edf6fa]"
        >
          {src ? (
            <span className="relative block size-full">
              <Img
                src={src}
                alt={name || accountLabel}
                fill
                sizes="44px"
                className="object-cover"
              />
            </span>
          ) : (
            <UserRound className="size-5" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 rounded-2xl border-[#d7e4eb] bg-white/98 p-2 shadow-[0_28px_80px_-42px_rgba(6,41,54,0.85)]"
      >
        <DropdownMenuLabel className="px-3 py-2">
          <span className="block text-xs tracking-[0.16em] text-[#7c97a5] uppercase">
            {accountLabel}
          </span>
          <span className="mt-1 block truncate text-sm font-semibold text-[#062936]">
            {name || loginLabel}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#e3edf2]" />
        <DropdownMenuItem
          disabled={loading}
          className="rounded-xl px-3 py-2 text-[#062936]"
          onSelect={(event) => {
            event.preventDefault();
            void handleLogout();
          }}
        >
          <LogOut className="size-4" />
          <span>{logoutLabel}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileNavigationDrawer({
  drawerHint,
  supportTitle,
  navItems,
  open,
  onOpenChange,
}: {
  drawerHint: string;
  supportTitle: string;
  navItems: NavigationItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const t = useTranslations('app.layout');
  const footerLinks = getFooterLinkGroups(t).flatMap((group) => group.items);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      // closeButton={
      //   <DialogCloseButton className="top-4 right-4 rounded-full border border-[#d7e6ec] bg-white text-[#062936] shadow-sm" />
      // }
      footer={<></>}
      classNames={{
        overlay: 'bg-[#062936]/35 backdrop-blur-sm',
        base: 'left-0 top-0 h-dvh w-[86vw] max-w-[360px] translate-x-0 translate-y-0 rounded-none rounded-r-[28px] border-0 bg-[linear-gradient(180deg,#fbfeff_0%,#eef6fa_100%)] p-0 shadow-[0_40px_120px_-46px_rgba(6,41,54,0.95)] data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
        header: 'hidden',
        body: 'block h-full p-0',
      }}
    >
      <div className="flex h-full flex-col overflow-hidden">
        <div className="border-b border-[#dbe8ee] px-5 pt-6 pb-5">
          <BrandLink />
          <p className="mt-4 max-w-88 text-sm leading-6 text-[#5e7a87]">{drawerHint}</p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5">
          <div className="space-y-2">
            {navItems.map((item) => (
              <HeaderNavLink
                key={item.href}
                item={item}
                active={isRouteActive(pathname, item.href)}
                mobile
                onClick={() => onOpenChange(false)}
              />
            ))}
          </div>

          <div className="mt-8 rounded-[24px] border border-[#d8e5ec] bg-white/80 p-4 shadow-[0_18px_60px_-40px_rgba(6,41,54,0.7)]">
            <span className="text-xs font-semibold tracking-[0.22em] text-[#7c97a5] uppercase">
              {supportTitle}
            </span>
            <div className="mt-4 space-y-2">
              {footerLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => onOpenChange(false)}
                    className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-[#32505d] transition hover:bg-[#edf5f8] hover:text-[#062936]"
                  >
                    <span className="inline-flex size-9 items-center justify-center rounded-full bg-[#edf5f8] text-[#062936]">
                      <Icon className="size-4" />
                    </span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
