'use client';

import { useEffect, useRef } from 'react';
import { TableOfContents } from './table-of-contents';
import './mdx.css';

interface TocItem {
  title: string;
  url: string;
  items: TocItem[];
}

interface BlogContentProps {
  content: string;
  toc: TocItem[];
  header: React.ReactNode;
}

export function BlogContent({ content, toc, header }: BlogContentProps) {
  const articleRef = useRef<HTMLElement>(null);

  // 刷新时手动滚动到 hash 对应的元素（浏览器原生 hash 滚动不作用于自定义滚动容器）
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash || !articleRef.current) return;

    const hashId = decodeURIComponent(hash);
    const target = articleRef.current.querySelector(`#${CSS.escape(hashId)}`);
    target?.scrollIntoView();
  }, []);

  return (
    <div className="flex h-full">
      <article ref={articleRef} className="h-full flex-1 overflow-y-auto px-8 py-12">
        <div className="mx-auto max-w-3xl">
          {header}
          <div className="mdx-content" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </article>
      {toc.length > 0 && <TableOfContents toc={toc} contentRef={articleRef} />}
    </div>
  );
}
