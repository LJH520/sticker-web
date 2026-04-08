import type { Meta, StoryObj } from '@storybook/nextjs';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../index';
import { title } from 'process';
import { cn } from 'tailwind-variants';
import { DefaultCard } from '../default-card';

const meta = {
  title: 'UI 组件/Card 卡片',
  component: DefaultCard,
  // argTypes: {
  //   variant: {
  //     control: {
  //       type: 'radio',
  //     },
  //   },
  //   size: {
  //     control: {
  //       type: 'radio',
  //     },
  //   },
  //   color: {
  //     control: {
  //       type: 'radio',
  //       options: ['default', 'primary', 'danger'],
  //     },
  //   },
  //   asChild: {
  //     control: {
  //       type: 'radio',
  //     },
  //   },
  //   loading: {
  //     control: {
  //       type: 'boolean',
  //     },
  //   },
  //   disabled: {
  //     control: {
  //       type: 'boolean',
  //     },
  //   },
  // },
} satisfies Meta<typeof DefaultCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // title: 'Default Card',
    // description: '卡片描述',
    // children: <p>卡片内容</p>,
  },
};
