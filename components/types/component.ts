import { VariantProps } from 'tailwind-variants';

/** 组件默认props定义 */
export interface ComponentProps {
  /** 是否作为子组件 */
  asChild?: boolean;
  /** 自定义颜色, 十六进制不含透明度, eg, #69DBB3 */
  customColor?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 图标 */
  icon?: React.ReactNode;
  /** 是否只有图标 */
  iconOnly?: boolean;
  /** 图标的位置 */
  iconPosition?: 'start' | 'end';
  /** 是否显示为加载状态 */
  loading?: boolean;
  /** 加载图标 */
  loadingIcon?: React.ReactNode;

  /** 样式变体 */
  variant?: string;
  /** 尺寸大小, sm 小, md 中, lg 大 */
  size?: 'sm' | 'md' | 'lg';
  /** 颜色 */
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  /** 形状 */
  shape?: 'round' | 'circle' | 'square';
  /** 自定义结构样式 */
  classNames?: Record<string, string>;

  /** 子元素 */
  children?: React.ReactNode;
  /** 标题 */
  title?: string;
  /** 描述 */
  description?: string;
  /** 副标题 */
  subTitle?: string;
  /** 副描述 */
  subDescription?: string;
  /** 头部容器 */
  header?: React.ReactNode;
  /** 内容容器 */
  content?: React.ReactNode;
  /** 底部容器 */
  footer?: React.ReactNode;
  /** 列表项 */
  items?: React.ReactNode[];

  /** 值 */
  value?: string;
  /** 默认值 */
  defaultValue?: string;
  /** 数据源 */
  // dataSource?: any[];
  /** 配置选项 */
  options?: {
    /** 数据源项的 label 字段 */
    label?: string;
    /** 数据源项的 value 字段 */
    value?: string;
  }[];

  /** 值改变时的回调 */
  onChange?: (value: string) => void;
  /** 按下回车时的回调 */
  onPressEnter?: (value: string) => void;
  /** 搜索时的回调 */
  onSearch?: (value: string) => void;
}

/** 组件结构 */
export interface ComponentDom {
  /** 根元素，包含描述列表容器的基础样式、重置样式、边框样式、布局方向等整体样式 */
  root: React.ReactNode;
  /** 头部元素，包含flex布局、对齐方式、下边距等头部区域的布局和样式控制 */
  header: React.ReactNode;
  /** 标题元素，包含文本省略、flex占比、颜色、字体权重、字体大小、行高等标题文字样式 */
  title: React.ReactNode;
  /** 包含内边距、字体大小等内容展示的基础样式 */
  body: React.ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ComponentVariantsProps<T extends (...args: any) => any> = VariantProps<T> & {
  /** 自定义插槽样式 */
  classNames?: Partial<Record<keyof ReturnType<T>, string>>;
  /** 自定义样式，会覆盖插槽样式 */
  className?: string;
};
