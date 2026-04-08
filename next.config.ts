import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import dotenv from 'dotenv';
import path from 'path';
import bundleAnalyzer from '@next/bundle-analyzer';

class VeliteWebpackPlugin {
  static started = false;
  apply(compiler: {
    hooks: { beforeCompile: { tapPromise: (name: string, fn: () => Promise<void>) => void } };
  }) {
    compiler.hooks.beforeCompile.tapPromise('VeliteWebpackPlugin', async () => {
      if (VeliteWebpackPlugin.started) return;
      VeliteWebpackPlugin.started = true;
      const { build } = await import('velite');
      await build({ watch: process.env.NODE_ENV === 'development', clean: true });
    });
  }
}

// 加载 .env 文件
const envFile = `./env/.env.${process.env.APP_ENV || 'production'}`;
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

if (!process.env.API_URL) {
  throw new Error('API_URL is not defined in the environment variables.');
}

console.log(`Loaded environment variables from ${envFile}`);

const nextConfig: NextConfig = {
  cacheComponents: true,
  output: 'standalone',
  // basePath: '/server',
  outputFileTracingIncludes: {
    '/*': ['./public/**/*'],
  },
  // React 编译器，自动 memoize 组件减少不必要的 re-render
  reactCompiler: true,
  experimental: {
    // 关键 CSS 内联到 HTML，消除渲染阻塞的 CSS 请求
    inlineCss: true,
    // 优化大型库的 barrel file tree-shaking
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      'lodash-es',
    ],
    // 更细粒度 CSS 分块，只加载当前页面需要的 CSS
    cssChunking: 'strict',
  },
  env: {
    APP_ENV: process.env.APP_ENV || 'production',
    API_URL: process.env.API_URL || '',
    APP_URL: process.env.APP_URL,
    SPEAKAMI_APP_ID: process.env.SPEAKAMI_APP_ID || '',
  },
  async rewrites() {
    const defaultRewrites = [
      // 接口重写路径
      {
        source: '/api/:path*',
        destination: process.env.API_URL + '/api/:path*',
        basePath: false as const,
      },
      {
        source: '/open/:path*',
        destination: process.env.API_URL + '/open/:path*',
        basePath: false as const,
      },
    ];
    return defaultRewrites;
  },
  turbopack: {
    // 配置turbopack根目录
    root: path.join('./'),
    // 配置svg加载器
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: {
              dimensions: false,
              typescript: true,
            },
          },
        ],
        as: '*.js',
      },
    },
  },
  webpack: (config) => {
    config.plugins.push(new VeliteWebpackPlugin());
    return config;
  },
  images: {
    unoptimized: false,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'glsp-img.unipus.cn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dora-doc.qiniu.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'global-speakami.obs.cn-north-4.myhuaweicloud.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'global-speakami.golingo.cn',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});
const withNextIntl = createNextIntlPlugin();
export default withBundleAnalyzer(withNextIntl(nextConfig));
