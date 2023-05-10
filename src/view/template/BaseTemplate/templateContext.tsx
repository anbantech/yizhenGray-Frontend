import React, { useReducer, createContext, useCallback, useEffect } from 'react'
import API from 'Src/services/api'
import { throwErrorMessage } from 'Utils/common'
import { useEffectOnce } from 'Utils/Hooks/useEffectOnce'
import { TemplateDetailInfo } from 'src/globalType/Response'
import { Primitive } from '../PrimitiveList/primitiveList'
import { TemplateStatus } from './createTemplateWrapper'

/**
 * 当前版本号
 * 用于日后判断模板导入导出功能向前兼容
 */
export const { TEMPLATE_VERSION } = process.env

interface SetPtListAction {
  type: 'setPtList'
  value: Primitive[]
}

interface ClearData {
  type: 'clear'
}

interface InitTemplateDetail {
  type: 'initTemplateDetail'
  value: Pick<TemplateDetailInfo, 'elements' | 'name' | 'desc' | 'create_time'>
}

interface SetRef {
  type: 'setBaseInfoRef' | 'setTemplateRef'
  value: React.MutableRefObject<CheckerRef | null>
}

type TemplateReducerAction = SetPtListAction | ClearData | InitTemplateDetail | SetRef

/**
 * context 默认状态
 * @param ptList 原语列表，在显示、模板创建和模板校验等诸多功能中用到
 * @param status 模板状态，模板状态分为：创建、修改和查看
 * @param templateId 模板ID，修改模板时需要
 * @param baseInfo 模板基础信息，包括名称、描述和创建时间
 *    @param baseInfo.name
 *    @param baseInfo.description
 *    @param baseInfo.createTime
 * @param templateElements 模板列表，用于渲染模板树和传递给后端
 * @param responseTemplate 响应模板列表，用于渲染相应模板和传递给后端
 * @param baseInfoRef 表单 ref，用于暴露 validator 接口
 * @param templateRef 表单 ref，用于暴露 validator 接口
 */
const defaultTemplateContext = {
  template: {
    ptList: [] as Primitive[],
    status: 0,
    templateId: 0,
    protocolId: 0,
    projectId: 0,
    baseInfo: {} as any,
    templateElements: [] as any,
    responseTemplate: {} as any,
    // refs 子组件向 context 暴露接口
    baseInfoRef: null as React.RefObject<CheckerRef> | null,
    templateRef: null as React.RefObject<CheckerRef> | null,
    templateType: 'user_defined' as 'user_defined' | 'default' | 'recycle_bin'
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  templateDispatch: (action: TemplateReducerAction) => {}
}

export interface CheckerRef {
  validator: (...args: any) => Promise<any> | undefined
}

/**
 * 将闭包对象恢复初始状态（在 context 未初始化时）
 * 由于 defaultTemplateContext 存在于闭包中
 * 页面切换后，第二次重新渲染还会读取闭包中的值
 * 如果不清除，会有历史状态遗留
 */
export const resetDefaultTemplateContextValue = () => {
  defaultTemplateContext.template.status = 0
  defaultTemplateContext.template.templateId = 0
  defaultTemplateContext.template.baseInfo = {}
  defaultTemplateContext.template.templateElements = []
  defaultTemplateContext.template.responseTemplate = {}
  defaultTemplateContext.template.ptList = []
  defaultTemplateContext.template.baseInfoRef = null
  defaultTemplateContext.template.templateRef = null
}

const templateReducer = (state: any, action: TemplateReducerAction) => {
  const templateCopy = state.template
  if (action.type === 'setPtList') {
    templateCopy.ptList = action.value
    return { ...state, templateCopy }
  }
  // context 初始化完成后，调用 dispatch 来清空数据
  if (action.type === 'clear') {
    templateCopy.status = 0
    templateCopy.templateId = 0
    templateCopy.baseInfo = {}
    templateCopy.templateElements = []
    templateCopy.responseTemplate = {}
    templateCopy.ptList = []
    templateCopy.baseInfoRef = null
    templateCopy.templateRef = null
    return { ...state, templateCopy }
  }
  // 从接口或导入功能获得的数据，采用同构的方式初始化
  if (action.type === 'initTemplateDetail') {
    const templateDetailInfo = action.value
    templateCopy.baseInfo = {
      name: templateDetailInfo.name,
      description: templateDetailInfo.desc,
      createTime: templateDetailInfo.create_time
    }
    templateCopy.templateElements = templateDetailInfo.elements
    // templateCopy.responseTemplate = templateDetailInfo.expected_template

    return { ...state, templateCopy }
  }
  if (action.type === 'setBaseInfoRef') {
    templateCopy.baseInfoRef = action.value
    return { ...state, templateCopy }
  }
  if (action.type === 'setTemplateRef') {
    templateCopy.templateRef = action.value
    return { ...state, templateCopy }
  }
  return state
}

export const TemplateContext = createContext(defaultTemplateContext)

interface TemplateContextProviderProps {
  defaultContext?: {
    status: TemplateStatus
    templateId?: number
  }
}

function mergePropsIntoContext(from: TemplateContextProviderProps['defaultContext'], to: typeof defaultTemplateContext['template']) {
  if (!from) return to
  Object.assign(to, from)
}

const TemplateContextProvider: React.FC<TemplateContextProviderProps> = ({ children, defaultContext }) => {
  // 把 props 的参数与默认参数合并

  mergePropsIntoContext(defaultContext, defaultTemplateContext.template)
  const { templateId, templateType } = defaultTemplateContext.template

  const [{ template }, templateDispatch] = useReducer(templateReducer, defaultTemplateContext)

  /**
   * 拉取原语列表数据
   */
  const fetchListFormApi = useCallback(async () => {
    try {
      const res = await API.getPrimitivesList()
      if (res.data) {
        templateDispatch({ type: 'setPtList', value: res.data as any })
      }
    } catch (error) {
      throwErrorMessage(error)
    }
  }, [templateDispatch])

  /**
   * 拉取模板详情数据
   */
  const fetchTemplateInfo = useCallback(async () => {
    try {
      if (templateType === 'default') {
        // pass，仿真暂无系统内置模板
      } else {
        const res = await API.getTemplate(`${templateId}`, { type: templateType })
        if (res.data) {
          templateDispatch({ type: 'initTemplateDetail', value: res.data })
        }
      }
    } catch (error) {
      throwErrorMessage(error)
    }
  }, [templateId, templateType])

  /**
   * 数据初始化只做一次
   * 1. 拉取原语列表数据
   * 2. 如果时修改模板，拉取模板详情数据
   */
  useEffectOnce(() => {
    fetchListFormApi()
    if (templateId > 0) {
      fetchTemplateInfo()
    }
  })
  useEffect(() => {
    if (template?.isDetailWeb && template.status === 1) {
      fetchListFormApi()
      fetchTemplateInfo()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId, template?.isDetailWeb, template.status])

  return <TemplateContext.Provider value={{ template, templateDispatch }}>{children}</TemplateContext.Provider>
}

export default TemplateContextProvider
