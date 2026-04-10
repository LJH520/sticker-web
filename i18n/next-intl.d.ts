/* eslint-disable @typescript-eslint/no-empty-object-type */
// next-intl TS增强配置
import { routing } from '@/i18n/routing';
import { formats } from '@/i18n/request';

type Messages = {
  app: (typeof import('../messages/en/app.json'))['default'];
  common: (typeof import('../messages/en/common.json'))['default'];
  components: (typeof import('../messages/en/components.json'))['default'];
};

type IntlAppConfig = {
  Locale: (typeof routing.locales)[number];
  Messages: Messages;
  Formats: typeof formats;
};

declare module 'use-intl' {
  interface AppConfig extends IntlAppConfig {}
}

declare module 'use-intl/core' {
  interface AppConfig extends IntlAppConfig {}
}

declare module 'use-intl/core/AppConfig' {
  export default interface AppConfig extends IntlAppConfig {}
}

declare module 'use-intl/core/AppConfig.js' {
  export default interface AppConfig extends IntlAppConfig {}
}
