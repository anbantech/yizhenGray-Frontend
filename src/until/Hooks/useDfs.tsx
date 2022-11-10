import UseIsLength from 'Src/until/Hooks/useIsLength'

import UseIsType from 'Src/until/Hooks/useIsType'

interface ObjectType {
  [key: string]: any
}

type ArrayType = string[] | number[]

type baseType = number | string

type allType = ArrayType | baseType | ObjectType
function useIsSameObject(preVal: allType, curVal: allType) {
  const Recursion = (preVal: any, curVal: any) => {
    let recursionResult
    // 类型是否相同
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [boolType, basicOrComplex, preType, curType] = UseIsType(preVal, curVal)
    // 类型不同直接返回false
    if (!boolType) return false
    // 基本类型,并且值不相同返回fasle
    if (basicOrComplex === false && preVal !== curVal) {
      return false
    }
    // 如果类型是复杂类型 判断长度是否一致

    const length = UseIsLength(curType, preVal, curVal)

    if (!length) return false
    // 递归
    for (const item in curVal) {
      // 如果是复杂类型进行递归
      if (basicOrComplex === true) {
        recursionResult = Recursion(preVal[item], curVal[item])
      }
    }
    if (recursionResult === false) {
      return false
    }
    return true
  }
  return Recursion(preVal, curVal)
}

export default useIsSameObject
