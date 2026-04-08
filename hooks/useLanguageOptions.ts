import { useEffect, useState } from 'react';
import { clientApi } from '@unipus/speakami-web-sdk';
import { useTranslations } from 'next-intl';

interface LanguageOption {
  value: string;
  label: string;
}

/**
 * 获取数字人支持的语言选项列表
 */
const useLanguageOptions = () => {
  const t = useTranslations('common');
  const [data, setData] = useState<LanguageOption[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    /** 获取数字人支持的语言选项列表 */
    const getData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await clientApi.getSupportedLanguageOptions();
        const languageList: LanguageOption[] = [];
        res?.data?.data?.forEach((item) => {
          if (item?.languageCode && item?.languageName) {
            languageList.push({
              value: item.languageCode,
              label: item.languageName,
            });
          }
        });
        setData([{ value: 'all', label: t('language.allLanguage') }, ...languageList]);
      } catch (err) {
        console.error('获取语言选项失败:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [t]);

  return {
    data,
    loading,
    error,
  };
};

export { useLanguageOptions };
export type { LanguageOption };
