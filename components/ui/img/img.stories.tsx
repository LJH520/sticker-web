import type { Meta, StoryObj } from '@storybook/nextjs';

import { Img } from './index';
import localImageSrc from '@images/gogopher.jpg';
import { cn } from '@/lib/utils';

const src = 'https://dora-doc.qiniu.com/gogopher.jpg';

const meta = {
  title: 'UI 组件/Img 图片',
  component: Img,
} satisfies Meta<typeof Img>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default 默认',
  args: {
    src,
    overrideSrc: src,
    width: 640,
    height: 427,
    alt: '小鼹鼠',
  },
};

export const Local: Story = {
  name: 'Local 本地图片',
  args: {
    src: localImageSrc,
    overrideSrc: localImageSrc?.src,
    alt: '小鼹鼠',
  },
};

export const Eager: Story = {
  name: 'Eager 预加载',
  args: {
    src: localImageSrc,
    alt: '小鼹鼠',
    fetchPriority: 'high',
    loading: 'eager',
  },
};

export const Unoptimized: Story = {
  name: 'Unoptimized 不优化',
  args: {
    src,
    width: 640,
    height: 427,
    alt: '小鼹鼠',
    unoptimized: true,
  },
};

export const Placeholder: Story = {
  name: 'Placeholder 占位符',
  args: {
    src: localImageSrc,
    alt: '小鼹鼠',
    placeholder:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=',
  },
};

export const Sizes: Story = {
  name: 'Sizes 自适应图像',
  args: {
    src: localImageSrc,
    alt: '小鼹鼠',
    className: 'w-50 sm:w-100',
    sizes: '(max-width: 640px) 12.5rem, 25rem',
  },
};

export const FillSizes: Story = {
  name: 'FillSizes 填充自适应图像',
  args: {
    src,
    overrideSrc: src,
    alt: '小鼹鼠',
    fill: true,
    className: 'w-50 sm:w-100 aspect-square',
    sizes: '(max-width: 640px) 12.5rem, 25rem',
  },
  render: ({ className, ...props }) => {
    return (
      <div className={cn('relative overflow-hidden rounded-full bg-gray-400', className)}>
        <Img className="object-cover" {...props} />
      </div>
    );
  },
};
