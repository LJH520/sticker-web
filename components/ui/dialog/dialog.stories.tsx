import type { Meta, StoryObj } from '@storybook/nextjs';

import { Dialog } from './';
import { useState } from 'react';

const meta = {
  title: 'UI 组件/Dialog 默认弹框',
  component: Dialog,
  render: function Render(props) {
    const [open, setOpen] = useState(props?.open || false);
    const changeOpen = (newOpen: boolean) => {
      setOpen(newOpen);
    };

    return (
      <>
        <button className="text-primary" onClick={() => changeOpen(true)}>
          打开弹框
        </button>
        <Dialog {...props} open={open} onOpenChange={changeOpen}></Dialog>
      </>
    );
  },
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default 默认',
  args: {
    open: false,
    colors: 'default',
    size: 'default',
    title: '确定么？',
    description: '这个操作无法撤销',
  },
};
