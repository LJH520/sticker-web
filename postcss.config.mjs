const config = {
  plugins: {
    '@tailwindcss/postcss': {},
    'postcss-pxtorem': {
      rootValue: 16, // 1rem = 16px
      propList: ['*'], // 转换所有属性
      selectorBlackList: ['.ignore', '.hairlines', 'html', 'body', 'rounded-full'], // (Array) 要忽略并保留为 px 的选择器.
      replace: true, // 是否直接替换属性值
      minPixelValue: 1, // 最小转换值，小于等于 1px 的值不转换
      mediaQuery: false, // 是否转换媒体查询中的 px
    },
  },
};

export default config;
