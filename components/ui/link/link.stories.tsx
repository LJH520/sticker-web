import { Meta, StoryObj } from '@storybook/nextjs';
import { Link } from './';

const meta = {
  title: 'UI 组件/Link 链接',
  component: Link,
} satisfies Meta<typeof Link>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default 默认',
  args: {
    href: '/',
    children: '首页',
    target: '_blank',
  },
};

export const Disabled: Story = {
  name: 'Disabled 禁用',
  args: {
    href: '/',
    children: '首页',
    target: '_blank',
    disabled: true,
  },
};
