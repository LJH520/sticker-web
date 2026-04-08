'use client';
import { Select } from '@/components/ui/select';
import { Locale } from '@/i18n/config';
import { useLocale } from 'next-intl';
import { changeClientLocale } from '@/i18n/utils';
import React, { useState } from 'react';

/**
 * 语言切换Select（客户端）
 */
function LocaleSelectClient({ options, ...props }: React.ComponentProps<typeof Select>) {
  const locale = useLocale();

  const [value, setValue] = useState<Locale | undefined>(locale);
  const onValueChange = (v: Locale) => {
    setValue(v);
    changeClientLocale(v);
  };

  return <Select value={value} onValueChange={onValueChange} options={options} {...props} />;
}

export { LocaleSelectClient };
