import type { Preview } from '@storybook/nextjs';
import { IntlDecorator } from '../i18n/intl-decorator';
import '../styles/globals.css';
import './index.css';

export const decorators = [IntlDecorator];

const preview: Preview = {
  tags: ['autodocs'],
  globalTypes: {
    locale: {
      description: 'Internationalization locale',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'en', right: '🇺🇸', title: 'English' },
          { value: 'zh', right: '🇨🇳', title: '中文' },
        ],
      },
    },
  },
  initialGlobals: {
    locale: 'zh',
    locales: {
      en: 'English',
      zh: '中文',
    },
  },
  parameters: {
    docs: {
      codePanel: true,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
