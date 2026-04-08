'use client';

import { usePathname, useRouter } from '@/i18n/routing';
import { ImConversationList } from '@unipus/speakami-web-sdk';
import { RouteEnum } from '@/constants/route';
import { useSearchParams } from 'next/navigation';

export function ConversationList({ children, className, ...props }: React.ComponentProps<'div'>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 使用 .get('参数名') 获取对应的值
  const id = searchParams?.get('id') ?? '';

  const isShowActive = pathname === RouteEnum.tutor;

  const router = useRouter();
  const handleConversationChange = (avatarId: string) => {
    router.push(
      RouteEnum.tutorDetail
        .replace('[slug]', avatarId)
        .replace('[bizId]', '')
        .replace('[bizType]', ''),
    );
  };
  return (
    <ImConversationList
      key={'ImConversationList'}
      activeAvatarId={id}
      isShowActive={isShowActive}
      onAvatarChange={handleConversationChange}
    />
  );
}
