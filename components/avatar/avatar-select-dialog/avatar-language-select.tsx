import React from 'react';
import { useLanguageOptions } from '@/hooks/useLanguageOptions';
import { Select } from '@/components/ui/select';

/** 语言选择器 */
function AvatarLanguageSelect({
  value = 'all',
  onValueChange,
  ...props
}: React.ComponentProps<typeof Select>) {
  const { data: options } = useLanguageOptions();

  return (
    <Select
      data-slot="avatar-language-select"
      size="40px"
      color="white"
      value={value}
      onValueChange={onValueChange}
      options={options}
      autoComplete="off"
      {...props}
    />
  );
}

export { AvatarLanguageSelect };
