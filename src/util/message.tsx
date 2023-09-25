import { ElementOf, tuple } from 'antd/lib/_util/type'
import { message } from 'antd'
import { CodeMap } from './DataMap/dataMap'

const paramsTypes = tuple('string', 'number', 'boolean', 'object')

type stringConfigType = { label: string; value: string }

interface RulesType<T> {
  type: ElementOf<typeof paramsTypes>
  checkers: ((parmas: T) => T | never)[]
}

interface ErrorMessage {
  code: number
  message: string
}

interface DefaultErrorMessage {
  [key: number]: string
}

function popErrorMessage(msg: string, pop: boolean) {
  if (pop) {
    message.error(msg)
  }
}
export function throwErrorMessage(errorMessage: ErrorMessage, defaultErrorMessage?: DefaultErrorMessage, pop?: boolean) {
  if (typeof pop === 'undefined') {
    // eslint-disable-next-line no-param-reassign
    pop = true
  }
  // 错误码 0 表示正常情况，不抛出异常，直接退出
  if (+errorMessage.code === 0) {
    return ''
  }
  if (errorMessage.code === undefined) {
    return '网络波动,请检查网络'
  }
  // 没有自定义错误对象，直接抛出后端异常 message
  if (!defaultErrorMessage) {
    popErrorMessage(CodeMap[+errorMessage.code as keyof typeof CodeMap], pop)
    return errorMessage.message
  }

  // 遍历自定义错误码对象，如果捕获到 code 码相同，则抛出自定义错误信息
  const defaultErrorMessageKeys = Object.keys(defaultErrorMessage)
  // eslint-disable-next-line no-restricted-syntax
  for (const defaultErrorMessageKey of defaultErrorMessageKeys) {
    if (+defaultErrorMessageKey === +errorMessage.code) {
      popErrorMessage(defaultErrorMessage[+defaultErrorMessageKey], pop)
      return defaultErrorMessage[+defaultErrorMessageKey]
    }
  }

  // 遍历完自定义错误码对象，没有捕获到与 errorMessage 相同的错误码，直接抛出后端异常 message
  popErrorMessage(CodeMap[+errorMessage.code as keyof typeof CodeMap], pop)
  return errorMessage.message
}
