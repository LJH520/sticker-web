'use client';

import { createDialogStore } from '@/hooks/useDialog';
import { Dialog } from '../ui/dialog';
import GoogleIcon from './google-icon.svg';
import BackIcon from './back-icon.svg';
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { useApiClient } from '@/api';
import { SendButton } from './send-button';
import { useState } from 'react';
import useUserStore from '@/stores/useUserStore';

export const useLoginDialogStore = createDialogStore('useLoginDialogStore');

/** 登录弹框组件 */
export function LoginDialog(props: React.ComponentProps<typeof Dialog>) {
  const open = useLoginDialogStore((state) => state.open);
  const onOpenChange = useLoginDialogStore((state) => state.onOpenChange);
  const t = useTranslations('app.LoginDialog');
  const api = useApiClient();

  const onClose = () => {
    useLoginDialogStore.getState().closeDialog();
  };

  const formSchema = z.object({
    email: z.email(t('email.invalid')),
    verificationCode: z
      .string(t('verificationCode.invalid'))
      .length(6, t('verificationCode.invalid')),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      verificationCode: '',
    },
  });

  const onSend = async () => {
    await api.sendVerificationCode(
      {
        recipient: form.getValues('email'),
        verificationCodeSceneEnum: 'LOGIN',
      },
      {
        showToast: true,
      },
    );
    toast.success(t('sentSuccess'));
  };

  const [loading, setLoading] = useState(false);
  /** 提交表单 */
  const onSubmit = async () => {
    const isValid = await form.trigger();
    if (!isValid) return;
    const data = form.getValues();
    setLoading(true);
    await useUserStore
      .getState()
      .login({
        loginType: 2,
        username: data?.email,
        verificationCode: data?.verificationCode,
      })
      .finally(() => setLoading(false));
    toast.success(t('loginSuccess'));
  };

  React.useEffect(() => {
    const isInit = useUserStore.getState().isInit;
    if (isInit) return;
    // useUserStore.getState().init({});
  }, []);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      header={<></>}
      footer={<></>}
      closeButton={<></>}
      classNames={{
        overlay: 'bg-[#404A5680]',
        base: 'bg-linear-to-b w-[520px] rounded-[40px] p-7.5 from-[#F2F8FB] via-[#E7F6F9] to-[#D2F4FC]',
        body: 'flex-col sm:flex-col justify-start sm:justify-start',
      }}
      {...props}
    >
      <div className="mb-7 flex flex-row items-center gap-1">
        <BackIcon className="size-8 shrink-0 cursor-pointer" onClick={onClose} />
        <span className="flex-1 text-center text-2xl font-medium text-[#062936]">{t('title')}</span>
      </div>
      <Button className="mb-7 w-full" color="#DEEAEF" size="58px">
        <GoogleIcon className="size-11 shrink-0" />
        {t('googleLogin')}
      </Button>

      <div className="mb-4 flex flex-row items-center">
        <span className="h-0.5 flex-1 bg-[#266EAE33]"></span>
        <span className="text-[#0F3F6A)] shrink-0 rounded-[40px] bg-[#FFFFFF] px-5 py-2 text-base font-medium">
          {t('other')}
        </span>
        <span className="h-0.5 flex-1 bg-[#266EAE33]"></span>
      </div>

      <div className="mb-4 text-base font-medium text-[#0F3F6A]">{t('emailLogin')}</div>

      <form className="mb-7.5 flex flex-col">
        <FieldGroup className="gao-4">
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <LoginInput
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder={t('email.placeholder')}
                  autoComplete="off"
                >
                  <SendButton
                    onSend={onSend}
                    disabled={fieldState.invalid || !fieldState?.isDirty}
                  />
                </LoginInput>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="verificationCode"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <LoginInput
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder={t('verificationCode.placeholder')}
                  autoComplete="off"
                  type="number"
                  maxLength={6}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
      </form>
      <Button
        color="#062936"
        size="48px"
        className="mx-auto min-w-61.5"
        onClick={onSubmit}
        loading={loading}
      >
        {loading ? t('loggingIn') : t('title')}
      </Button>
    </Dialog>
  );
}

function LoginInput({ children, className, ...props }: React.ComponentProps<typeof Input>) {
  return (
    <div
      className={cn(
        'relative flex w-full flex-row items-center',
        'bg-white',
        'h-14.5 gap-1 rounded-[16px] p-1.5 ps-4',
        className,
      )}
    >
      <Input
        className={cn(
          'h-full border-none p-0 shadow-none ring-0 outline-none focus-visible:border-none focus-visible:ring-0',
          'bg-transparent text-[#386E9D]',
          'text-base font-normal sm:text-base',
        )}
        {...props}
      />
      {children}
    </div>
  );
}
