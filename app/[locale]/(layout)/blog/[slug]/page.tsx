import { posts } from '#content';
import { notFound } from 'next/navigation';
import dayjs from 'dayjs';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { BlogContent } from './blog-content';

import { Locale } from '@/i18n/config';

interface TocItem {
  title: string;
  url: string;
  items: TocItem[];
}

interface Props {
  params: Promise<{ locale: Locale; slug: string }>;
}

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    // description: post.excerpt || '',
    description: post.description || '',
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = posts.find((p) => p.slug === slug);

  if (!post) notFound();

  const t = await getTranslations({
    locale,
    namespace: 'app.blog',
  });
  const toc = post.toc as TocItem[];

  const header = (
    <header className="mb-4">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <time className="mt-2 block text-base text-muted-foreground">
        {dayjs(post.date).format('YYYY-MM-DD')}
      </time>
      {Array.isArray(post.key) && (
        <div className="mt-2 text-base">
          {t('tags')}：{post?.key?.join(', ')}
        </div>
      )}

      {post.cover && (
        <img
          src={post.cover.src}
          alt={post.title}
          className="mt-4 aspect-video w-full rounded-lg object-cover"
        />
      )}
    </header>
  );

  return <BlogContent content={post.content} toc={toc} header={header} />;
}
