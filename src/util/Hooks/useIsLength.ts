type valType = string
type paramsType = string
type requestType = boolean

interface ObjectType {
  [key: string]: any
}

type ArrayType = string[] | number[]

type baseType = number | string

type allType = ArrayType | baseType | ObjectType
function useIsLength(type: paramsType, preVal: allType, curVal: allType): requestType {
  // 对象的长度返回值
  const objectLength = (val: allType) => {
    const obj_length = Object.keys(val)
    return obj_length.length
  }
  // 数组的长度返回值
  const ArrayLength = (val: ArrayType) => {
    const arr_length = val.length
    return arr_length
  }
  if (type === 'Object') {
    return objectLength(preVal) === objectLength(curVal)
  }
  if (type === 'Array') {
    return ArrayLength(preVal as ArrayType) === ArrayLength(curVal as ArrayType)
  }
  if (['String', 'Number'].includes(type)) return true
  return false
}

export default useIsLength
