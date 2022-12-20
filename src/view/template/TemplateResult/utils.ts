/* eslint-disable unicorn/no-useless-undefined */
import { warn } from 'Src/utils/common'
import JSZip from 'jszip'
import { temDetails } from 'Src/Api/templateApi'
import { checkVersion } from 'Src/utils/env'
import { shouldHaveChildrenBlockNameList, blockNameList } from '../DragSFC/ItemTypes'
import { DefaultResponseTemplateListType } from '../ResponseTemplate/createResponseTemplate'
import { rcFile } from '../../project/arrgement/arrgementCompent/TemplateUpload'
import { TreeNode } from './templateResult'
import { Primitive } from '../PrimitiveList/primitiveList'
import { TEMPLATE_VERSION } from '../BaseTemplate/templateContext'

interface PrimitiveElement {
  elements?: PrimitiveElement[]
  [key: string]: string | boolean | number | any[] | undefined
}

type NodeTypes = 'leaf' | 'root'

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    // eslint-disable-next-line no-bitwise
    const r = (Math.random() * 16) | 0
    // eslint-disable-next-line no-bitwise
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * 根据 Dom 节点上的 key value 匹配值
 */
export function getElementByAttr(tag: string, attr: string, value: string) {
  // eslint-disable-next-line unicorn/prefer-query-selector
  const aElements = document.getElementsByTagName(tag)
  // eslint-disable-next-line no-restricted-syntax
  for (const aElement of aElements) {
    if (aElement.getAttribute(attr) === value) {
      return aElement
    }
  }
  return null
}

interface ErrorOptions {
  replaceDefaultMessage?: boolean
  locateElement?: boolean
  showErrorColor?: boolean
}

function throwError(errorMessage: string, childListItem: TreeNode, optinos?: ErrorOptions) {
  function getDefaultProperty(value: any, defaultValue: boolean) {
    if (typeof value === 'boolean') return value
    return defaultValue
  }

  /**
   * 初始化 opt 参数
   * 如果没有传递 options 参数，使用默认配置
   * 如果传递了 options 参数，判断是否有效，有效使用传递进来的参数
   */
  const opt: Required<ErrorOptions> = {
    replaceDefaultMessage: getDefaultProperty(optinos?.replaceDefaultMessage, false),
    locateElement: getDefaultProperty(optinos?.locateElement, true),
    showErrorColor: getDefaultProperty(optinos?.showErrorColor, true)
  }

  throw new Error(
    JSON.stringify({
      errorMessage,
      key: childListItem.ptName,
      value: childListItem.ptValue,
      rules: childListItem.rules,
      id: childListItem.id,
      ...opt
    })
  )
}

const stringfyEscapeCharacter = (character: string | boolean | number | Array<any>) => {
  if (Array.isArray(character)) {
    // eslint-disable-next-line no-param-reassign
    character = JSON.stringify(character)
  }
  let res = String(character)

  const replacerMap = {
    '\\b': /[\b]/g,
    '\\f': /\f/g,
    '\\n': /\n/g,
    '\\r': /\r/g,
    '\\t': /\t/g
  }

  type ReplacerType = keyof typeof replacerMap

  Object.keys(replacerMap).forEach(replacer => {
    res = res.replace(replacerMap[replacer as ReplacerType], replacer)
  })

  return res
}

const escapeStringCharacter = (character: string) => {
  let res = character

  const replacerMap = {
    '\b': /\\b/g,
    '\f': /\\f/g,
    '\n': /\\n/g,
    '\r': /\\r/g,
    '\t': /\\t/g
  }
  type ReplacerType = keyof typeof replacerMap

  Object.keys(replacerMap).forEach(replacer => {
    res = res.replace(replacerMap[replacer as ReplacerType], replacer)
  })

  return res
}

/**
 * 把 TreeNode 数据结构转换为后端需要的 Elements 数据结构
 * ! internalRecursion 为递归时内部变量，外部调用 transformTdList2Elements 函数时无须传入
 * internalRecursion 用于判断 transformTdList2Elements 函数是不是函数内部的递归调用
 * 从而能够在递归结束时，进行一些需要在最后才能进行的校验
 */
const transformTdList2Elements = (tempTdList: TreeNode[], internalRecursion?: boolean) => {
  const elements: PrimitiveElement[] = []
  // 全局 context 变量存入 localstorage 中，校验完成后移除（此处没有使用闭包，因为移除需要在 transformTdList2Elements 完全运行完成后执行）
  const contextVariables = JSON.parse(localStorage.getItem('contextVariables') || '[]')
  const nameVariables = [] as string[]

  // Special characters that do not support
  const DEPRECATED_CHECKER = (res: string, childListItem: TreeNode) => {
    const DEPRECATED_REPLACER = [/\\u/, /\\v/, /\\x/, /\\0/, /\\a/]
    DEPRECATED_REPLACER.forEach(replacer => {
      if (res.match(replacer)) {
        throwError('不支持的编码：不支持转义u,v,x,0,a的特殊字符', childListItem)
      }
    })
  }

  // Whether the verification is required
  const isRequired = (treeNode: TreeNode) => {
    return treeNode.rules && treeNode.rules.required
  }

  // Check if CONTEXT is repeated
  const CONTEXT_CHECKER = (res: string, childListItem: TreeNode, parentListItem?: TreeNode) => {
    if (parentListItem && childListItem.ptName === 'value') {
      const matchers = res.match(/context_\d+/g) || []
      matchers.forEach(matcher => {
        if (parentListItem.ptName !== 'static') {
          throwError(`不支持的编码：${matcher} 不允许出现在非 static 的原语中`, childListItem)
        }
        if (contextVariables.includes(matcher)) {
          throwError(`不支持的编码：${matcher} 已经在上下文中存在`, childListItem)
        } else {
          contextVariables.push(matcher)
          localStorage.setItem('contextVariables', JSON.stringify(contextVariables))
        }
      })
    }
  }

  // Check if same-level NAME is repeated
  const NAME_CHECKER = (res: string, childListItem: TreeNode, nameList: string[]) => {
    if (childListItem.ptName === 'name') {
      if (nameList.includes(res)) {
        throwError(`不支持的编码：${res} 已经在上下文中存在`, childListItem)
      } else {
        nameList.push(res)
      }
    }
  }

  // Check if size or checksum has corresponding names reffering from block
  // !Delay the check until all checker has been finished
  const DEPENDENCIES_CHECKER = {
    // 收集所有的块名称
    collectedBlockNames: new Set<string>(),
    // 收集所有依赖块的原语
    blockNameDependencies: [] as { blockName: string; childListItem: TreeNode }[],
    collectBlockName(blockName: string) {
      // 重复性校验交给 NAME_CHECKER 动态完成
      DEPENDENCIES_CHECKER.collectedBlockNames.add(blockName)
    },
    collectDependency(blockNameList: string | string[], childListItem: TreeNode) {
      if (typeof blockNameList === 'string') {
        DEPENDENCIES_CHECKER.blockNameDependencies.push({ blockName: blockNameList, childListItem })
      } else {
        DEPENDENCIES_CHECKER.blockNameDependencies.push(
          ...blockNameList.map(blockName => ({
            blockName,
            childListItem
          }))
        )
      }
    },
    validateBlockName() {
      DEPENDENCIES_CHECKER.blockNameDependencies.forEach(dependency => {
        if (!DEPENDENCIES_CHECKER.collectedBlockNames.has(dependency.blockName)) {
          throwError(`不支持的编码：上下文中不存在名称为 ${dependency.blockName} 的块`, dependency.childListItem)
        }
      })
    }
  }

  const NormalizeString = (v: string, childListItem: TreeNode, parentListItem?: TreeNode) => {
    if (!v && !isRequired(childListItem)) return undefined

    let res = String(v)

    DEPRECATED_CHECKER(res, childListItem)

    res = escapeStringCharacter(res)

    CONTEXT_CHECKER(res, childListItem, parentListItem)

    NAME_CHECKER(res, childListItem, nameVariables)

    return res
  }

  const NormalizeBytesString = (v: string, childListItem: TreeNode) => {
    if (!v && !isRequired(childListItem)) return undefined

    const res = String(v).toUpperCase()

    if (res.length % 2) {
      throwError(`不支持的编码：${v} 填写的内容不是有效的16进制字节`, childListItem)
    }

    DEPRECATED_CHECKER(res, childListItem)

    const isHexadecimal = (str: string) => /^[\dA-F]+$/.test(str)

    if (!isHexadecimal(res)) {
      throwError('不支持的编码：仅支持输入16进制字符', childListItem)
    }

    return res
  }

  const NormalizeIntString = (v: string, childListItem: TreeNode) => {
    if (!v && !isRequired(childListItem)) return undefined

    const res = Number(v)
    if (Number.isNaN(res)) {
      throwError(`不支持的编码：${v} 包含无法转换为 int 类型的字符`, childListItem)
    }

    if (Math.floor(res) !== res) {
      throwError(`不支持的编码：${v} 包含无法转换为 int 类型的字符`, childListItem)
    }

    if (res < 0) {
      throwError(`不支持的编码：${v} 不能为负数`, childListItem)
    }

    return res
  }

  const NormalizeListString = (v: string, childListItem: TreeNode) => {
    if (!v && !isRequired(childListItem)) return undefined

    const isListString = (str: string) => /^\[(.+?)]$/.test(str)

    let res = v

    if (!isListString(res)) {
      throwError(`不支持的编码：${v} 不符合数组格式规范，请尝试以 [] 包裹，正确范例：[value]`, childListItem)
    }

    try {
      res = JSON.parse(res)
    } catch {
      throwError(`不支持的编码：${v} 无法转换为 list 类型`, childListItem)
    }

    return res
  }

  const NormalizeBoolString = (v: string, childListItem: TreeNode) => {
    if (!v && !isRequired(childListItem)) return undefined

    switch (v) {
      case 'true':
        return true
      case 'false':
        return false
      default:
        throwError(`不支持的编码：${v} 无法转换为 bool 类型`, childListItem)
    }
    return true
  }

  const NumberSizeChecker = (tempElementsItem: any, tempTdListItem: TreeNode) => {
    const { min_num: min = 0, max_num: max } = tempElementsItem
    if (min >= max) {
      throwError(
        '参数不符合规定，【max_num】必须大于【min_num】',
        tempTdListItem.children!.filter(childListItem => childListItem.ptName === 'max_num')[0]
      )
    }
  }

  /**
   * Cause only primitive "random" has max_length and min_length attributes,
   * special handling for maximum and minimum values can be equal.
   *
   * If a new primitive appears, do the adaptation using "tempTdListItem.ptName"
   *
   * ===========================================================================
   * below are primitive "random" rules:
   *
   * foreahead rules
   * min >= 0 and max >= 1
   *
   * normal rules
   * 1. if min and max both are null, then set min to 0, set max to 1
   * 2. if min is null and max is int, then set min to 0
   * 3. if min is int and max is null, then set max = min
   */
  const LengthSizeChecker = (tempElementsItem: any, tempTdListItem: TreeNode) => {
    const { min_length: min = 0, max_length: max } = tempElementsItem
    if (max != null && max < 1) {
      throwError(
        '参数不符合规定，【max_length】必须大于 0',
        tempTdListItem.children!.filter(childListItem => childListItem.ptName === 'max_length')[0]
      )
    }
    if (min > max) {
      throwError(
        '参数不符合规定，【max_length】必须大于或等于【min_length】',
        tempTdListItem.children!.filter(childListItem => childListItem.ptName === 'max_length')[0]
      )
    }
  }

  const SIZE_CHECKER = {
    checkNumber: NumberSizeChecker,
    checkLength: LengthSizeChecker
  }

  // 避免给后端传字符串，用户填写的原语值根据对应的类型包装一下返回
  const WrapperFunction = {
    string: NormalizeString,
    bool: NormalizeBoolString,
    int: NormalizeIntString,
    bytes: NormalizeBytesString,
    list: NormalizeListString
  }

  const checkRules = (childListItem: TreeNode) => {
    if (childListItem.rules) {
      if (childListItem.rules.required && !childListItem.ptValue) {
        throwError('参数不符合规定：缺少必填参数', childListItem)
      }
      if (childListItem.rules.useEnumAsDefault && childListItem.rules.enum && !childListItem.ptValue) {
        Object.assign(childListItem, { ptValue: childListItem.rules.enum[0] })
      }
      if (childListItem.rules.enum && childListItem.ptValue && !childListItem.rules.enum.includes(childListItem.ptValue)) {
        throwError('参数不符合规定：不符合枚举规则', childListItem)
      }
    }
  }

  tempTdList.forEach(tempTdListItem => {
    const tempElementsItem: any = {}
    /**
     * 如果 tempTdListItem 是块，则可能包含子原语，递归调用 transformTdList2Elements 进行转换
     * 如果 tempTdListItem 是原语，则不可能包含子原语
     * 无论是块还是原语，其本质都是原语，自身可以包含属性，原语属性校验同构
     */
    if (blockNameList.has(tempTdListItem.ptName) && tempTdListItem.children) {
      tempTdListItem.children
        .filter(childListItem => childListItem.nodeType === 'leaf')
        .forEach(childListItem => {
          checkRules(childListItem)
          tempElementsItem[childListItem.ptName] = WrapperFunction[childListItem.ptType as keyof typeof WrapperFunction](
            childListItem.ptValue || '',
            childListItem,
            tempTdListItem
          )
        })
      const rootChildrenNodes = tempTdListItem.children.filter(childListItem => childListItem.nodeType === 'root')
      if (shouldHaveChildrenBlockNameList.has(tempTdListItem.ptName) && rootChildrenNodes.length === 0) {
        throwError(`不支持的编码：${tempTdListItem.ptName} 至少含有一个原语`, tempTdListItem, { replaceDefaultMessage: true, showErrorColor: false })
      }
      tempElementsItem.elements = transformTdList2Elements(rootChildrenNodes, true)
      // 收集所有块原语名称
      DEPENDENCIES_CHECKER.collectBlockName(tempElementsItem.name)
    } else if (tempTdListItem.children) {
      tempTdListItem.children.forEach(childListItem => {
        checkRules(childListItem)
        tempElementsItem[childListItem.ptName] = WrapperFunction[childListItem.ptType as keyof typeof WrapperFunction](
          childListItem.ptValue || '',
          childListItem,
          tempTdListItem
        )
        // 如果依赖 block_name，收集起来
        if (childListItem.ptName === 'block_name') {
          DEPENDENCIES_CHECKER.collectDependency(tempElementsItem.block_name, childListItem)
        }
      })
      SIZE_CHECKER.checkNumber(tempElementsItem, tempTdListItem)
      SIZE_CHECKER.checkLength(tempElementsItem, tempTdListItem)
    }
    elements.push({ [tempTdListItem.ptName]: tempElementsItem })
  })

  if (!internalRecursion) {
    DEPENDENCIES_CHECKER.validateBlockName()
  }

  return elements
}

/**
 * 把后端传来的原语结构转换为 TreeNode 结构
 */
const transformItem2TreeNode = (item: Primitive, element?: any) => {
  const ptName = item.attrs && item.attrs.length > 0 ? item.type : item.name
  const treeNode = {
    id: generateUUID(),
    nodeType: (item.attrs && item.attrs.length > 0 ? 'root' : 'leaf') as NodeTypes,
    ptName,
    ptValue: element && ptName in element ? stringfyEscapeCharacter(element[ptName] as string) : null,
    ptDesc: item.desc,
    ptType: item.attrs && item.attrs.length > 0 ? null : item.type,
    rules: item.attrs && item.attrs.length > 0 ? null : { required: item.required, enum: JSON.parse(item.value_enum), useEnumAsDefault: false },
    children: null,
    opening: true,
    error: false
  }

  if (item.attrs) {
    item.attrs.forEach(attr => {
      const subTreeNode = transformItem2TreeNode(attr, element)
      if (treeNode.children) {
        ;(treeNode.children as any).push(subTreeNode)
      } else {
        ;(treeNode.children as any) = [subTreeNode]
      }
    })
  }

  return treeNode
}
type TransformElements2TdListFn = (elements: any[], ptList: Primitive[]) => [TreeNode[], boolean]
const transformElements2TdList: TransformElements2TdListFn = (elements, ptList) => {
  if (!ptList || ptList.length === 0) return [[], false]

  const tdList: TreeNode[] = []
  let flag = false

  try {
    elements.forEach(element => {
      const [primitiveName] = Object.keys(element)
      const tempTreeNode = transformItem2TreeNode(ptList.filter(pt => pt.type === primitiveName)[0], element[primitiveName])
      if ('elements' in element[primitiveName] && element[primitiveName].elements && element[primitiveName].elements.length > 0) {
        const [childTdList] = transformElements2TdList(element[primitiveName].elements, ptList)
        tempTreeNode.children = (tempTreeNode.children as any).concat(childTdList)
      }
      tdList.push(tempTreeNode)
    })
    flag = true
  } catch (error) {
    flag = false
    warn(false, error)
  }

  return [tdList, flag]
}

const { toString, hasOwnProperty } = Object.prototype
const forEach = (o: any, fn: (args0: any, args1: string, args2?: any) => void) => {
  if (toString.call(o) !== '[object Array]' && toString.call(o) !== '[object Object]') {
    throw new Error('不能遍历非 Object 或 Array 的对象')
  } else if (toString.call(o) === '[object Array]') {
    // eslint-disable-next-line no-restricted-syntax
    for (const index of o) {
      fn(o[index], index, o)
    }
  } else {
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(o)) {
      fn(value, key, o)
    }
  }
}

const hasALLProperty = (source: any, properties: string[]) => {
  let flag = true
  for (const property of properties) {
    if (!hasOwnProperty.call(source, property)) {
      flag = false
      break
    }
  }
  return flag
}

const responseTemplateChecker = (responseTemplateList: DefaultResponseTemplateListType[]) => {
  let flag = true
  if (!Array.isArray(responseTemplateList)) {
    flag = false
    return flag
  }
  /**
   * v2.4.000.20220701 新增匹配规则组的概念，校验时把规则组打平
   * v2.4.000.20220701 之前的版本没有匹配规则，数组里直接是对象，对象里也没有 rules
   */
  const flattedResponseTemplateList = responseTemplateList.flat()
  flattedResponseTemplateList.forEach(rt => {
    if (!hasOwnProperty.call(rt, 'rules') || Object.keys(rt.rules).length === 0) {
      // eslint-disable-next-line no-param-reassign
      rt.rules = {
        condition: '',
        alg: '',
        rule: ''
      }
    }
  })
  /**
   * 校验 rt 对象是否都包含对应的属性
   */
  flattedResponseTemplateList.forEach(rt => {
    if (hasALLProperty(rt, ['name', 'size', 'value', 'rules'])) {
      // pass
    } else {
      flag = false
      return flag
    }
  })

  return flag
}

interface SingleTemplateData {
  name: string
  description: string
  parser: string
  elements: any[]
  expected_elements: any[]
  exportTime: string
  version: string
}

const requiredParams = {
  name: 'string',
  parser: 'string',
  elements: 'array',
  expected_elements: 'array'
} as const

const capitalsize = (input: string) => input.replace(/\S/, s => s.toUpperCase())

const templateDataChecker = {
  /**
   * 单模板对象校验
   */
  singleTemplateChecker(std: SingleTemplateData) {
    if (typeof std !== 'object') {
      throw new TypeError(`校验失败 => ${typeof std}不能转换为有效的模板数据`)
    }
    if (Array.isArray(std)) {
      throw new TypeError('校验失败 => 单个模板数据不能用数组包裹')
    }
    if (!checkVersion(std.version)) {
      throw new Error(`校验失败 => 模板与当前版本不匹配`)
    }
    forEach(requiredParams, (requiredType, requiredKey) => {
      if (!std[requiredKey as keyof SingleTemplateData]) {
        throw new Error(`校验失败 => 必要参数 ${requiredKey} 不能为空`)
      }
      if (toString.call(std[requiredKey as keyof SingleTemplateData]) !== `[object ${capitalsize(requiredType)}]`) {
        throw new Error(`校验失败 => 必要参数 ${requiredKey} 必须为 ${requiredType} 类型`)
      }
    })
  },
  /**
   * 多模板对象校验
   */
  templateChecker(stdList: SingleTemplateData[]) {
    if (!Array.isArray(stdList)) {
      throw new TypeError('校验失败 => 多个模板必须用数组包裹')
    }
    const nameList: string[] = []
    forEach(stdList, std => {
      templateDataChecker.singleTemplateChecker(std)
      if (!nameList.includes(std.name)) {
        nameList.push(std.name)
      } else {
        throw new Error('校验失败 => 不能有相同名称的模板')
      }
    })
  },
  async readFileText(file: string | number[] | Uint8Array | ArrayBuffer | Blob | NodeJS.ReadableStream | rcFile) {
    const readFile = () => {
      return new Promise((resolve: (value: string) => void) => {
        const reader = new FileReader()
        let text = ''
        reader.addEventListener('load', e => {
          text = (e.target?.result || '') as string
          resolve(text)
        })
        reader.readAsText(file as any)
      })
    }
    const result = await readFile()
    return result
  }
}

// 纯前端创建文件下载
const browserDownload = {
  ifHasDownloadAPI: 'download' in document.createElement('a'),
  createFrontendDownloadAction(name: string, content: Blob) {
    if ('download' in document.createElement('a')) {
      const link = document.createElement('a')
      link.download = `${name}`
      link.href = URL.createObjectURL(content)
      link.click()
    } else {
      warn(true, '您的浏览器不支持下载方法，请更新您的浏览器到最新版本')
    }
  }
}

const templateDataLoader = {
  /**
   * 单模板导出
   * 导出单个 json 文件
   */
  async singleExporter(templateId: number, name: string) {
    if (!browserDownload.ifHasDownloadAPI) {
      warn(true, '您的浏览器不支持下载方法，请更新您的浏览器到最新版本')
      return
    }
    const exportJson = {}
    try {
      const res = await temDetails(`${templateId}`, { type: 'user_defined' })
      if (res.data) {
        const defaultRules = {
          condition: '',
          alg: '',
          rule: ''
        }
        res.data.expected_template.elements.flat().forEach(ele => {
          Object.assign(ele, {
            rules: Object.keys(ele.rules).length > 0 ? ele.rules : defaultRules
          })
        })
        Object.assign(exportJson, {
          name: res.data.name,
          description: res.data.desc,
          elements: res.data.elements,
          expected_elements: res.data.expected_template.elements,
          parser: res.data.expected_template.parser,
          exportTime: new Date(),
          version: TEMPLATE_VERSION
        })
      }
    } catch {
      warn(false, '拉取模板列表失败')
    }
    const blob = new Blob([JSON.stringify(exportJson, null, 2) as string])
    browserDownload.createFrontendDownloadAction(`${name}.json`, blob)
  },
  /**
   * 多模板导出
   * 导出包含多个 json 文件的 zip 文件
   */
  async exporter(
    templateIdList: number[],
    name: string,
    callback?: (current: number, all: number) => void,
    getTemplate?: (id: number, error: any) => void
  ) {
    if (!browserDownload.ifHasDownloadAPI) {
      warn(true, '您的浏览器不支持下载方法，请更新您的浏览器到最新版本')
      return
    }
    const all = templateIdList.length
    let current = 0
    const zipInstance = new JSZip()
    // eslint-disable-next-line no-restricted-syntax
    for (const templateId of templateIdList) {
      const exportJson = {} as any
      try {
        // eslint-disable-next-line no-await-in-loop
        const res = await temDetails(`${templateId}`, { type: 'user_defined' })
        if (res.data) {
          Object.assign(exportJson, {
            id: res.data.id,
            name: res.data.name,
            description: res.data.desc,
            elements: res.data.elements,
            expected_elements: res.data.expected_template.elements,
            parser: res.data.expected_template.parser,
            exportTime: new Date(),
            version: TEMPLATE_VERSION
          })
        }
      } catch (error) {
        getTemplate?.(templateId, error)
      }
      // console.log(Object.hasOwnProperty.call(exportJson, 'name'), exportJson)
      // if fetch template detail fail, skip this template
      if (Object.hasOwnProperty.call(exportJson, 'name')) {
        const blob = new Blob([JSON.stringify(exportJson, null, 2) as string])
        zipInstance.file(`${exportJson.name}.json`, blob)
      }
      callback?.(++current, all)
    }
    const content = await zipInstance.generateAsync({ type: 'blob' })
    browserDownload.createFrontendDownloadAction(`${name}.zip`, content)
  },
  /**
   * 给测试生成高编译性模板数据
   */
  async ep() {
    const zipInstance = new JSZip()
    // eslint-disable-next-line no-restricted-syntax
    for (let i = 0; i < 50; i++) {
      const exportJson = {
        name: `ywbNB${i}`,
        description: '',
        elements: [
          {
            word: {
              name: 'word',
              value: 99999,
              output_format: 'ascii',
              signed: true,
              full_range: true,
              fuzzable: true,
              max_num: 99999
            }
          }
        ],
        expected_elements: [
          {
            name: 'data',
            size: 1000,
            value: ''
          }
        ],
        parser: 'TCP'
      }
      const blob = new Blob([JSON.stringify(exportJson, null, 2) as string])
      zipInstance.file(`${exportJson.name}.json`, blob)
    }
    const content = await zipInstance.generateAsync({ type: 'blob' })
    browserDownload.createFrontendDownloadAction(`rc.zip`, content)
  },
  /**
   * 模板导入
   * @param from 支持 zip 或 json 两种格式
   * @param file 文件流
   * @returns 返回 templateList 数据
   */
  async importer(from: 'zip' | 'json', file: string | number[] | Uint8Array | ArrayBuffer | Blob | NodeJS.ReadableStream | rcFile) {
    const templateList = []
    if (from === 'zip') {
      const zipInstance = new JSZip()
      const zip = await zipInstance.loadAsync(file)
      // eslint-disable-next-line no-restricted-syntax
      for (const filename of Object.keys(zip.files)) {
        // eslint-disable-next-line no-await-in-loop
        const base = (await zipInstance.file(filename)?.async('string')) || ''
        const template = JSON.parse(base)
        try {
          templateDataChecker.singleTemplateChecker(template)
          templateList.push(template)
        } catch (error) {
          throw new Error(error)
        }
      }
    } else {
      const readFile = () => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.addEventListener('load', e => {
            let std
            try {
              std = JSON.parse(e.target?.result as string)
            } catch {
              warn(true, '导入失败，请检查 JSON 格式是否正确')
              return
            }
            try {
              templateDataChecker.singleTemplateChecker(std)
              if (typeof file === 'object' && (file as rcFile).uid) {
                Object.assign(std, { uid: (file as rcFile).uid })
              }
              templateList.push(std)
              resolve(std)
              // eslint-disable-next-line prefer-destructuring
            } catch (error) {
              reject()
              throw new Error(error)
            }
          })
          reader.readAsText(file as any)
        })
      }
      await readFile()
    }
    return templateList
  }
}

export default {
  forEach,
  templateDataChecker,
  templateDataLoader,
  browserDownload,
  generateUUID,
  getElementByAttr,
  throwError,
  transformTdList2Elements,
  transformItem2TreeNode,
  transformElements2TdList,
  responseTemplateChecker
}
