import { Select } from '@/components/ui/select';
import { LocaleOptions } from '@/i18n/config';
import { cn } from '@/lib/utils';
import React from 'react';
import { getTranslations } from 'next-intl/server';
import { serverApi } from '@unipus/speakami-web-sdk';
import { LocaleSelectClient } from './locale-select-client';

/** 语言切换Select
 * @see [getSystemConfigs - 获取系统全局配置](https://dev-speakami.golingo.cn/speakami-sdk/components/api#1-getsystemconfigs---%E8%8E%B7%E5%8F%96%E7%B3%BB%E7%BB%9F%E5%85%A8%E5%B1%80%E9%85%8D%E7%BD%AE)
 */
async function LocaleSelect({ className, ...props }: React.ComponentProps<typeof Select>) {
  const t = await getTranslations('common.language');

  const res = await serverApi
    .getSystemConfigs({
      next: {
        revalidate: 60 * 60, // 1 hour
      },
    })
    .catch(() => undefined);
  const i18nSupportedLanguages = res?.data?.data?.i18nSupportedLanguages;
  const options = !i18nSupportedLanguages
    ? LocaleOptions
    : LocaleOptions?.filter((item) =>
        i18nSupportedLanguages?.find(
          (lang) => lang?.languageCode && lang?.languageCode === item.value,
        ),
      );

  const optionsComp = options?.map(({ label, value, icon }) => ({
    value,
    label: (
      <span className="flex flex-row items-center gap-2">
        <span className="inline shrink-0 [&_svg]:h-[1em]! [&_svg]:w-auto!">{icon}</span>
        {label}
      </span>
    ),
  }));

  return (
    <LocaleSelectClient
      className={cn('min-w-30', className)}
      placeholder={t('placeholder')}
      color="white"
      size="40px"
      options={optionsComp}
      {...props}
    />
  );
}

export { LocaleSelect };
