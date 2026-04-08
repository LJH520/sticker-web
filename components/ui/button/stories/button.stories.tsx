import type { Meta, StoryObj } from '@storybook/nextjs';
import { Button, buttonVariants } from '../';

const meta = {
  title: 'UI 组件/Button 按钮',
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'radio' },
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: { type: 'radio' },
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    color: {
      control: { type: 'radio' },
      table: {
        defaultValue: { summary: 'default' },
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '默认按钮',
  },
};

export const Variants: Story = {
  render: function (props) {
    return (
      <div className="flex flex-row gap-2">
        <Button {...props} variant="default">
          默认按钮
        </Button>
        <Button {...props} variant="secondary">
          次要按钮
        </Button>
        <Button {...props} variant="outline">
          描边按钮
        </Button>
        <Button {...props} variant="ghost">
          幽灵按钮
        </Button>
        <Button {...props} variant="link">
          链接按钮
        </Button>
        <Button {...props} variant="destructive">
          危险按钮
        </Button>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: function (props) {
    return (
      <>
        <section className="flex flex-row flex-wrap gap-2">
          <Button {...props} size="sm">
            小按钮
          </Button>
          <Button {...props} size="default">
            默认按钮
          </Button>
          <Button {...props} size="lg">
            大按钮
          </Button>
          <Button {...props} size="icon-sm">
            🔍
          </Button>
          <Button {...props} size="icon">
            🔍
          </Button>
          <Button {...props} size="icon-lg">
            🔍
          </Button>
        </section>

        <section className="mt-4 flex flex-row flex-wrap gap-2">
          {(
            Object.keys(buttonVariants.variants.size)?.filter(
              (key) => !['sm', 'default', 'lg', 'icon-sm', 'icon', 'icon-lg'].includes(key),
            ) as Array<keyof typeof buttonVariants.variants.size>
          ).map((size) => (
            <Button key={size} {...props} size={size}>
              {size}
            </Button>
          ))}
        </section>
      </>
    );
  },
};

export const Colors: Story = {
  render: function (props) {
    return (
      <>
        <section className="flex flex-row flex-wrap gap-2">
          <Button {...props} color="default">
            默认颜色
          </Button>
        </section>

        <section className="mt-4 flex flex-row flex-wrap gap-2">
          {(
            Object.keys(buttonVariants.variants.color)?.filter(
              (key) => !['default'].includes(key),
            ) as Array<keyof typeof buttonVariants.variants.color>
          )?.map((color) => (
            <Button key={color} {...props} color={color}>
              {color}
            </Button>
          ))}
        </section>
      </>
    );
  },
};
