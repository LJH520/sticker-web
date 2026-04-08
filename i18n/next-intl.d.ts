// next-intl TS增强配置
import { routing } from '@/i18n/routing';
import { formats } from '@/i18n/request';

type Messages = {
  app: typeof import('../messages/zh/app.json');
  common: typeof import('../messages/zh/common.json');
  components: typeof import('../messages/zh/components.json');
};

declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: Messages;
    Formats: typeof formats;
  }
}
