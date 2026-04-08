'use client';
import { Dialog } from '@/components/ui/dialog';
import { useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import { Data, useAvatarSelectDialog, useData } from './useData';
import { RouteEnum } from '@/constants/route';
import CloseIcon from './assets/close-icon.svg';
import TopicIcon from './assets/topic-icon.svg';
import { useTranslations } from 'next-intl';
import { AvatarSelectList } from './avatar-select-list';
import { Button } from '@/components/ui/button';
import { AvatarLanguageSelect } from './avatar-language-select';
import { AdvancedInfiniteScroll } from '@/components/common/AdvancedInfiniteScroll';

/** 数字人选择弹框组件 */
function AvatarSelectDialog() {
  const t = useTranslations('app.AvatarSelectDialog');
  const open = useAvatarSelectDialog((state) => state.open);
  const onOpenChange = useAvatarSelectDialog((state) => state.onOpenChange);
  const title = useAvatarSelectDialog((state) => state.data?.title);
  const description = t('description');

  const { data, loading, hasMore, getData, initData } = useData({});

  const canConfirm = useAvatarSelectDialog((state) => state.data?.avatar?.avatarId);
  const selected = useAvatarSelectDialog((state) => state.data?.avatar?.avatarId);

  const router = useRouter();
  const onConfirm = async () => {
    const bizId = useAvatarSelectDialog.getState().data?.bizId;
    const bizTypeCurrent = useAvatarSelectDialog.getState().data?.bizType;
    const bizType = Array.isArray(bizTypeCurrent) ? bizTypeCurrent?.[0] : bizTypeCurrent;
    const avatarId = useAvatarSelectDialog.getState().data?.avatar?.avatarId;
    router.push(
      RouteEnum.tutorDetail
        .replace('[slug]', avatarId || '')
        .replace('[bizId]', bizId || '')
        .replace('[bizType]', bizType || ''),
    );
    onOpenChange?.(false);
  };

  const onCancel = async () => {
    onOpenChange?.(false);
  };

  /** 选择数字人 */
  const onSelectAvatar = (avatar: Data['avatar']) => {
    useAvatarSelectDialog.setState((state) => {
      if (!state.data) {
        state.data = {};
      }
      state.data.avatar = avatar;
    });
  };

  const languageCode = useAvatarSelectDialog((state) => state.data?.languageCode || 'all');
  /** 选择语言 */
  const onChangeLanguageCode = (languageCode: string) => {
    useAvatarSelectDialog.setState((state) => {
      if (!state.data) {
        state.data = {};
      }
      state.data.languageCode = languageCode;
    });
    initData();
  };

  useEffect(() => {
    if (!open) return;
    initData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      header={<></>}
      footer={<></>}
      closeButton={<></>}
      classNames={{
        base: 'w-full rounded-[32px] px-5 pt-5 pb-10 bg-[#f8f0ec] sm:w-218.5 max-w-full sm:max-w-full',
        body: 'flex-col sm:flex-col justify-start sm:justify-start gap-0',
      }}
    >
      <div className="absolute end-5 z-10">
        <CloseIcon
          className="flex size-8 cursor-pointer items-center justify-center border-none bg-transparent p-0 transition-opacity duration-300 hover:opacity-80"
          onClick={onCancel}
        />
      </div>

      {/* 标题区域 */}
      <div className="mb-3 flex items-start gap-2.5">
        <TopicIcon className="flex size-20.25 shrink-0 rounded-full" />
        <div className="flex flex-1 flex-col gap-1">
          <div className="text-xl font-semibold text-black [&_p]:line-clamp-1">
            <p>{title}</p>
          </div>
          <div className="text-sm font-normal text-[#5F5552] [&_p]:line-clamp-1">
            <p>{description}</p>
          </div>
        </div>
      </div>

      {/* 筛选区域 */}
      <div className="mb-5 flex flex-row items-center gap-5">
        <div className="cursor-pointer border-b-4 border-[#ff7e3e] pb-1 text-base font-medium text-[#F97316]">
          {t('allAvatar')}
        </div>
        <AvatarLanguageSelect value={languageCode} onValueChange={onChangeLanguageCode} />
      </div>

      <div className="mb-10 scrollbar-hidden flex h-100 max-h-100 w-full flex-col overflow-y-auto py-5">
        <AdvancedInfiniteScroll
          fetchData={getData}
          hasMore={hasMore}
          loading={loading}
          direction="vertical"
        >
          <AvatarSelectList dataSource={data} onClickItem={onSelectAvatar} selected={selected} />
        </AdvancedInfiniteScroll>
      </div>

      <footer className="mx-auto flex flex-row items-center gap-10">
        <Button className="w-43.5" size="53px" color="#DEEAEF" onClick={onCancel}>
          {t('cancel')}
        </Button>
        <Button
          className="w-43.5"
          size="53px"
          color="#062936"
          onClick={onConfirm}
          disabled={!canConfirm}
        >
          {t('ok')}
        </Button>
      </footer>
    </Dialog>
  );
}

export { AvatarSelectDialog };
