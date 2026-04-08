const Authorization_COOKIE_NAME = 'Authorization';

/** 获取用户当前授权 */
export function getUserAuthorization() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(Authorization_COOKIE_NAME) || '';
  }
  return '';
}

/** 设置用户当前授权 */
export function setUserAuthorization(authorization = '') {
  if (typeof window !== 'undefined') {
    localStorage.setItem(Authorization_COOKIE_NAME, authorization);
  }
}
