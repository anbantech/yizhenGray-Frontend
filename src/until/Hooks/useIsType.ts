// 任意类型数据结构
// return:返回改数据类型(字符串)

interface ObjectType {
  [key: string]: any
}

type ArrayType = string[] | number[]
type paramsType = ArrayType | ObjectType | mixType
type mixType = string | boolean | number
type responseType = [boolean, mixType, string, string]
function useIsType(preVal: paramsType, curVal: paramsType): responseType {
  const type = (val: any) => {
    const type_ObjectString = Object.prototype.toString.call(val)
    const typeParams = type_ObjectString.slice(8, -1)
    return typeParams
  }
  if (type(preVal) === type(curVal)) {
    if (type(preVal) === 'Object' || type(preVal) === 'Array') {
      return [true, true, type(preVal), type(curVal)]
    }
    return [true, false, type(preVal), type(curVal)]
  }
  return [false, 'other', type(preVal), type(curVal)]
}

export default useIsType
