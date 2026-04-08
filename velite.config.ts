import { defineConfig, s } from 'velite';
import rehypeSlug from 'rehype-slug';

export default defineConfig({
  output: {
    data: '.velite',
    assets: 'public/blog-assets',
    base: '/blog-assets/',
    name: '[name]-[hash:8].[ext]',
    clean: false,
  },
  markdown: {
    rehypePlugins: [rehypeSlug],
  },
  collections: {
    posts: {
      name: 'Post',
      pattern: 'blog-md/**/*.md',
      schema: s
        .object({
          title: s.string().max(99),
          slug: s.slug('posts').optional(),
          // tags定义 字符串数组
          key: s.string().array().optional(),
          // 文章描述，选填，默认为空字符串
          description: s.string().optional(),
          date: s.isodate(),
          cover: s.image().optional(),
          metadata: s.metadata(),
          excerpt: s.excerpt({ length: 150 }),
          toc: s.toc({ maxDepth: 3 }),
          content: s.markdown(),
          path: s.path(),
        })
        .transform((data) => {
          const slug = data.slug ?? data.path.split('/').pop()!;
          return { ...data, slug, permalink: `/blog/${slug}` };
        }),
    },
  },
});
