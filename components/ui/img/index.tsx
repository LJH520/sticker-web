import NextImage, { ImageProps } from 'next/image';

export type ImgProps = Omit<
  ImageProps,
  | 'src'
  | 'alt'
  | 'fill'
  | 'width'
  | 'height'
  | 'quality'
  | 'loader'
  | 'priority'
  | 'loading'
  | 'layout'
  | 'lazyBoundary'
  | 'lazyRoot'
  | 'objectFit'
  | 'objectPosition'
  | 'onLoadingComplete'
> & {
  /**
   * 图片地址
   *  - 本地图片：存放首屏关键图片、应用专属图片，放到`/public/images/`目录
   *    - 静态导入使用，不需要设置宽高，使用nextjs配置自动设置及优化图片格式和大小。
   *  - url图片：存放业务及第三方资源、需要全球加速的图片、大图&背景图
   *    - url动态导入使用，需要设置宽高来计算宽高推断图像纵横比，使用cdn优化优化图片格式和大小。
   *    - 必须配置 [remotePatterns](https://nextjs.org/docs/app/api-reference/components/image#remotepatterns) 后才能访问。
   * @default ''
   */
  src?: ImageProps['src'];
  /** 图片地址，覆盖src，用于seo优化，无意义图标、背景可不用设置 */
  overrideSrc?: ImageProps['overrideSrc'];
  /** 图片描述，无意义图标、背景可不用设置
   * @default ''
   */
  alt?: ImageProps['alt'];
  /** 图片是否为父元素大小。父元素必须设置position: "relative""fixed""absolute"
   * @default false
   */
  fill?: ImageProps['fill'];
  /** 图片的固有宽度（以像素为单位）。静态导入的图片或具有fill属性的图片外必填。此属性用于推断图片的正确宽高比，并避免加载过程中的布局偏移 */
  width?: ImageProps['width'];
  /** 图片的固有高度（以像素为单位）。静态导入的图片或具有fill属性的图片外必填。此属性用于推断图片的正确宽高比，并避免加载过程中的布局偏移 */
  height?: ImageProps['height'];
  /** 定义不同断点处的图像大小
   * @example '(max-width: 640px) 100vw, 50vw';
   * @example '(max-width: 640px) 20rem, 40rem'
   */
  sizes?: ImageProps['sizes'];
  /** 图片的质量
   * @default 75
   */
  quality?: ImageProps['quality'];
  /** 图片是否预加载，
   * @default false
   * @see [loading](https://nextjs.org/docs/app/api-reference/components/image#loading)
   */
  loading?: ImageProps['loading'];
  /** 解析图片 URL 的自定义函数  */
  loader?: ImageProps['loader'];
  /** 是否不优化图片，以下情况可不优化：cdn资源、小图像（小于 1KB）、矢量图像 （SVG） 或动画图像 （GIF）
   * @default false
   */
  unoptimized?: boolean;
  /** 图片占位符，'empty' 加载图像时没有占位符, 'blur' 使用图像的模糊版本作为占位符。必须与blurDataURL财产，data:image/...：使用数据网址作为占位符。
   * @default 'empty'
   */
  placeholder?: ImageProps['placeholder'];
};

/** 图片组件
 * @see [next/image](https://nextjs.org/docs/app/api-reference/components/image)
 */
export function Img({ src = '', alt = '', fill = false, quality = 75, ...props }: ImgProps) {
  return <NextImage src={src} alt={alt} fill={fill} quality={quality} {...props} />;
}
