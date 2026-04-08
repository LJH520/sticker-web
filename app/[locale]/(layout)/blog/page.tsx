import { posts } from '#content';
import Link from 'next/link';
import dayjs from 'dayjs';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Locale } from '@/i18n/config';

export default async function BlogPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sortedPosts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const t = await getTranslations({
    locale,
    namespace: 'app.blog',
  });

  return (
    <section className="mx-auto h-full max-w-3xl overflow-y-auto px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold">Blog</h1>
      <ul className="space-y-8">
        {sortedPosts.map((post) => (
          <li key={post.slug}>
            <Link
              href={post.permalink}
              className="group block rounded-lg border border-border p-6 transition-colors hover:bg-gray-100"
            >
              {post.cover && (
                <img
                  src={post.cover.src}
                  alt={post.title}
                  className="mb-4 aspect-video max-h-60 w-full rounded-md object-cover object-center"
                />
              )}
              <h2 className="text-xl font-semibold group-hover:underline">{post.title}</h2>
              <time className="mt-1 block text-sm text-muted-foreground">
                {dayjs(post.date).format('YYYY-MM-DD')}
              </time>
              <div className="text-base">
                {t('tags')}：{post?.key?.join(', ')}
              </div>
              {post.excerpt && <p className="mt-2">{post.excerpt}</p>}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
