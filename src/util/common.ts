import { ElementOf, tuple } from 'antd/lib/_util/type'
import { message } from 'antd'

const paramsTypes = tuple('string', 'number', 'boolean', 'object')
type stringConfigType = { label: string; value: string }
interface RulesType<T> {
  type: ElementOf<typeof paramsTypes>
  checkers: ((parmas: T) => T | never)[]
}

/**
 * 生成唯一 ID
 */
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    // eslint-disable-next-line no-bitwise
    const r = (Math.random() * 16) | 0
    // eslint-disable-next-line no-bitwise
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * 校验参数并处理参数或报错
 * @param p 待验证的参数
 * @param rules 验证规则，接受一个对象，包含待验证参数的类型与校验函数；校验函数串行运行
 * @returns 经过校验函数处理的参数 p
 */
function validateParams<T>(p: T, rules: RulesType<T>) {
  // eslint-disable-next-line valid-typeof
  if (typeof p !== rules.type.toLocaleLowerCase()) {
    throw new TypeError(`类型错误：${p} 应该是 ${rules.type} 类型`)
  }

  let res = p

  if (rules.checkers) {
    rules.checkers.forEach(fn => {
      res = fn(res)
    })
  }

  return res
}

function checkStringLength(length: number) {
  return (rule: any, value: string) => {
    if (!value) return Promise.resolve()
    if (value.length > length) {
      return Promise.reject(new Error(`不能超过 ${length} 位`))
    }
    return Promise.resolve()
  }
}

function checkRule(value: string) {
  const reg = /^[\w\u4E00-\u9FA5]+$/
  if (reg.test(value)) {
    return Promise.resolve()
  }
  return Promise.reject(new Error('目标名称由汉字、数字、字母和下划线组成'))
}

export const validator = { validateParams, checkStringLength, checkRule }

export function warn(pop = false, msg: string) {
  if (pop) {
    message.error(msg)
  }

  // eslint-disable-next-line no-console
  console.warn(msg)
}

export function trimParams(params: any) {
  if (!params) return params
  if (typeof params === 'object') {
    Object.entries(params).forEach(([key, value]) => {
      if (typeof value === 'string') {
        // eslint-disable-next-line no-param-reassign
        params[key] = value.trim()
      }
    })
  } else if (typeof params === 'string') {
    return params.trim()
  } else {
    return params
  }

  return params
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

export function throwErrorMessage(errorMessage: ErrorMessage | string | Error, defaultErrorMessage?: DefaultErrorMessage, pop?: boolean) {
  if (typeof pop === 'undefined') {
    // eslint-disable-next-line no-param-reassign
    pop = true
  }

  // 标准化 errorMessage 对象，string 和 Error 类型全部转换成 ErrorMessage 对象
  if (typeof errorMessage === 'string' || errorMessage instanceof Error) {
    // eslint-disable-next-line no-param-reassign
    errorMessage = {
      code: -1,
      message: errorMessage instanceof Error ? errorMessage.message : errorMessage
    }
  }

  // 错误码 0 表示正常情况，不抛出异常，直接退出
  if (+errorMessage.code === 0) {
    return ''
  }
  // 没有自定义错误对象，直接抛出后端异常 message
  if (!defaultErrorMessage) {
    popErrorMessage(errorMessage.message, pop)
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
  popErrorMessage(errorMessage.message, pop)
  return errorMessage.message
}

// 睡眠函数，用于阻断异步函数
export async function sleep(ms: number) {
  await new Promise<void>(resolve =>
    setTimeout(() => {
      resolve()
    }, ms)
  )
}

type ObjectOrArray<T> = T[] | { [key: string | number]: T }

/**
 * 判断是不是一个有值的对象，是对象/数组，且有值返回 true
 * @param obj 可以是数组也可以是对象
 * @returns boolean
 */
export function isNotEmptyObject<T>(obj: ObjectOrArray<T>) {
  if (typeof obj !== 'object') return false
  return obj && Object.keys(obj).length > 0
}

export function showMessage(code: string, array: stringConfigType[]) {
  let message
  array.map((item: stringConfigType) => {
    if (item.label === code) {
      message = item.value
    }
    return item.label
  })
  return message
}

/**
 * 复制文本到剪贴板
 * @param text
 */
export function copyText(text: string) {
  try {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
    } else {
      const textarea = document.createElement('textarea')
      document.body.append(textarea)
      textarea.style.position = 'fixed'
      textarea.style.clip = 'rect(0 0 0 0)'
      textarea.style.top = '10px'
      textarea.value = text
      textarea.select()
      document.execCommand('copy', true)
      textarea.remove()
    }
  } catch {
    warn(true, '您的浏览器不支持复制功能')
  }
}

export function getHiddenPropertyName() {
  let eventName = ''
  const property = 'hidden' in document ? 'hidden' : 'webkitHidden' in document ? 'webkitHidden' : 'mozHidden' in document ? 'mozHidden' : ''
  if (property) {
    eventName = property.replace(/hidden/i, 'visibilitychange')
  }
  return {
    property,
    eventName
  }
}
