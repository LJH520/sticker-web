'use client';

/** 接口在客户端打日志 */
function ClientLog({
  res,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  res?: any;
}) {
  console.info('[API]', res);
  return null;
}

export { ClientLog };
