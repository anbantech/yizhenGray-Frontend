/**
 * 标准化 query 参数
 * 后端处理 ?key[]=1&key[]=2&key[]=3 形式的数组存在问题
 * 前端标准化成 ?key=1,2,3
 */
export function normalizeQueryParams(params: Record<string, any>) {
  const result: Record<string, any> = {}
  Object.keys(params).forEach(key => {
    const value = params[key]
    if (value) {
      if (Array.isArray(value)) {
        result[key] = value.toString()
      } else {
        result[key] = value
      }
    }
  })
  return result
}
