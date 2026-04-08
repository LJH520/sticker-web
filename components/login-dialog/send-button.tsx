'use client';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';

/** 发送按钮 */
export function SendButton({
  onSend,
  title,
  sentTitle,
  resendTitle,
  initialCountdown = 60, // 默认倒计时60秒
  disabled,
  ...props
}: React.ComponentProps<typeof Button> & {
  /** 按钮的标题 */
  title?: string;
  /** 发送成功后的标题 */
  sentTitle?: string;
  /** 重新发送验证码后的标题 */
  resendTitle?: string;
  /** 倒计时的初始值（默认值为 60 秒） */
  initialCountdown?: number;
  /** 点击发送验证码时的回调函数 */
  onSend: () => Promise<void>;
}) {
  const t = useTranslations('app.LoginDialog');

  const [countdown, setCountdown] = useState(initialCountdown); // 当前倒计时值
  const [isSend, setIsSend] = useState(false); // 是否发送过
  const [isCounting, setIsCounting] = useState(false); // 内部倒计时状态

  useEffect(() => {
    if (!isCounting) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCounting(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCounting]);

  const onClick = async () => {
    if (!isCounting) {
      setIsSend(true); // 标记为已发送
      setCountdown(initialCountdown); // 设置倒计时为传入的初始值
      setIsCounting(true); // 开始倒计时
      await onSend().catch(() => {
        setIsCounting(false);
      });
    }
  };

  // 确定按钮显示的文本
  const getButtonText = () => {
    if (!isSend) {
      return title || t('sendVerifyCode');
    }
    if (!isCounting) {
      return resendTitle || t('resend');
    }
    return sentTitle ? `${sentTitle} ${countdown}s` : `${t('sent')} ${countdown}s`;
  };

  return (
    <Button
      variant="default"
      size="46px"
      color="#3A8EE2-#3AB2E2"
      onClick={onClick}
      disabled={disabled || isCounting}
      {...props}
    >
      {getButtonText()}
    </Button>
  );
}
