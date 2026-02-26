/**
 * 前端密码加密：使用 SHA-256 对密码做哈希后再发送，避免明文传输
 * 后端统一对收到的值做 bcrypt 存储/校验
 */

/**
 * 将字符串转为 SHA-256 十六进制摘要（小写）
 * @param {string} str - 原始密码
 * @returns {Promise<string>}
 */
export function sha256Hex(str) {
  return crypto.subtle
    .digest('SHA-256', new TextEncoder().encode(str))
    .then((buf) => Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join(''));
}
