import { createDialogStore } from '@/hooks/useDialog';
import { AvatarInfoResp, clientApi } from '@unipus/speakami-web-sdk';
import { useState } from 'react';

export type Data = {
  /** 业务类型 */
  bizType?: string;
  /** 业务ID */
  bizId?: string;
  /** 语言编码 */
  languageCode?: string;
  /** 选中的数字人 */
  avatar?: AvatarInfoResp;

  /** 标题 */
  title?: string;
};

export const useAvatarSelectDialog = createDialogStore<Data>('useAvatarSelectDialog');

const useData = ({
  size = 24,
}: {
  /** 每页数量 */
  size?: number;
}) => {
  const request = clientApi.pageBindAvatarList;
  const [data, setData] = useState<AvatarInfoResp[] | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    const bizId = useAvatarSelectDialog.getState().data?.bizId;
    const bizType = useAvatarSelectDialog.getState().data?.bizType;
    const languageCode = useAvatarSelectDialog.getState().data?.languageCode;
    const lastIndex = data?.[data.length - 1]?.avatarId || '';
    if (!lastIndex) return;
    setLoading(true);
    await request(
      {
        size: size,
        direction: 0,
        lastIndex: lastIndex,
        condition: {
          bizType,
          bizId,
          languageCode: languageCode === 'all' ? undefined : languageCode,
        },
      },
      {
        showToast: true,
      },
    )
      .then((res) => {
        const records = res?.data.data?.records;
        const newData = records ? [...(data || []), ...(records || [])] : data;
        const total = res?.data?.data?.total;
        if (newData?.length && total && newData?.length >= total) {
          setHasMore(false);
        }
        setData(newData);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const initData = async () => {
    const bizId = useAvatarSelectDialog.getState().data?.bizId;
    const bizType = useAvatarSelectDialog.getState().data?.bizType;
    const languageCode = useAvatarSelectDialog.getState().data?.languageCode;
    request({
      current: 1,
      size: size,
      condition: {
        bizType,
        bizId,
        languageCode,
      },
    })
      .then((res) => {
        const newData = res?.data.data?.records;
        const total = res?.data?.data?.total;
        if (newData?.length && total && newData?.length >= total) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
        setData(newData);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return {
    data,
    loading,
    hasMore,
    initData,
    getData,
  };
};

export { useData };
