'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

interface TocItem {
  title: string;
  url: string;
  items: TocItem[];
}

function flattenToc(items: TocItem[]): { url: string }[] {
  return items.flatMap((item) => [{ url: item.url }, ...flattenToc(item.items)]);
}

export function TableOfContents({
  toc,
  contentRef,
}: {
  toc: TocItem[];
  contentRef: React.RefObject<HTMLElement | null>;
}) {
  const [activeId, setActiveId] = useState('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  const t = useTranslations('app.blog');

  // 初始化：从 URL hash 设置选中态
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const hashId = decodeURIComponent(hash);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveId(hashId);
    }
  }, []);

  // 监听滚动，更新选中态
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const headingIds = flattenToc(toc).map((item) => item.url.slice(1));
    const headings = headingIds
      .map((id) => container.querySelector(`#${CSS.escape(id)}`))
      .filter(Boolean) as Element[];

    if (headings.length === 0) return;

    // 延迟启动 observer，等待初始 scrollIntoView 完成
    const timer = setTimeout(() => {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

          if (visible.length > 0) {
            setActiveId(visible[0].target.id);
          }
        },
        {
          root: container,
          rootMargin: '0px 0px -80% 0px',
          threshold: 1,
        },
      );

      headings.forEach((el) => observerRef.current!.observe(el));
    }, 100);

    return () => {
      clearTimeout(timer);
      observerRef.current?.disconnect();
    };
  }, [toc, contentRef]);

  const linkClass = (url: string) => {
    const id = url.slice(1);
    return id === activeId
      ? 'text-foreground font-medium transition-colors'
      : 'text-muted-foreground transition-colors hover:text-foreground';
  };

  return (
    <nav className="hidden h-full w-64 shrink-0 overflow-y-auto border-l border-border px-4 py-12 lg:block">
      <h2 className="mb-3 text-base font-semibold">{t('tableOfContents')}</h2>
      <ul className="space-y-1.5 text-base">
        {toc.map((h1) => (
          <li key={h1.url}>
            <a href={h1.url} className={linkClass(h1.url)}>
              {h1.title}
            </a>
            {h1.items.length > 0 && (
              <ul className="mt-1.5 ml-3 space-y-1.5">
                {h1.items.map((h2) => (
                  <li key={h2.url}>
                    <a href={h2.url} className={linkClass(h2.url)}>
                      {h2.title}
                    </a>
                    {h2.items.length > 0 && (
                      <ul className="mt-1.5 ml-3 space-y-1.5">
                        {h2.items.map((h3) => (
                          <li key={h3.url}>
                            <a href={h3.url} className={linkClass(h3.url)}>
                              {h3.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
