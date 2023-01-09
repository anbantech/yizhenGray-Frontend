/* eslint-disable no-param-reassign */
/* eslint-disable no-case-declarations */
import * as React from 'react'
import { useState, useReducer, useCallback, useEffect, useContext } from 'react'
import { message } from 'antd'
import { useEffectOnce } from 'Utils/Hooks/useEffectOnce'
import { RouteComponentProps } from 'react-router-dom'
import { throwErrorMessage, warn } from 'Src/util/common'
import withRouterForwardRef from 'Src/components/HOC/ForwardRefWithRouter'
import styles from './templateResult.less'
import DropBoxWrapper from '../DragSFC/dropBoxWrapper'
import NoDataSection from './noDataSection'
import { ItemTypes } from '../DragSFC/ItemTypes'
import { TemplateContext, CheckerRef } from '../BaseTemplate/templateContext'
import TreeNodeSFC from './treeNode'
import { Primitive } from '../PrimitiveList/primitiveList'
import Utils from './utils'
import TdActions, { TdListReducerActionTypes, TdListReducerConfigType } from './tdAction'
import TemplateResultTitle from './templateResultTitle'
import { TemplateStatus } from '../BaseTemplate/createTemplateWrapper'

interface ValidatorRules {
  enum: string[]
  required: boolean
  // 是否使用枚举的第一个值作为默认值
  useEnumAsDefault: boolean
}

export interface TreeNode {
  id: string
  nodeType: 'leaf' | 'root'
  opening: boolean
  ptDesc: string
  ptName: string
  ptValue: string | null
  ptType: string | null
  rules: ValidatorRules | null
  children: TreeNode[] | null
  error: boolean
  [key: string]: any
}

interface GenerateTreeOptions {
  readonly: boolean
}

const shouldLocate = false

const TemplateResult: React.FC<RouteComponentProps<any, any, any>> = () => {
  const { template, templateDispatch } = useContext(TemplateContext)
  const { status, templateElements } = template
  const readonly = status === TemplateStatus.READ

  /**
   * 模板 Reducer
   * 对模板进行增删改查和初始化操作
   * shouldLocate 控制是否在增加元素后进行定位行为
   * rootUUID 为根节点ID，标识唯一性，首次选然后不变
   *
   * Reducer Action:
   * initNode 接受一个参数 initValue
   *    initValue => tdList
   * inijectNode 接受两个参数 item index
   * deleteNode 接受一个参数 index
   * configNode 接受两个参数 index config
   *    config => { attr, value }
   */
  const [rootUUID] = useState(Utils.generateUUID())
  const memoizedReducer = useCallback(
    function tdListReducer(
      state: TreeNode[],
      action: { type: TdListReducerActionTypes; item?: Primitive; index?: string; config?: TdListReducerConfigType; initValue?: TreeNode[] }
    ) {
      let treeNodeList = [...state]
      switch (action.type) {
        case 'injectNode':
          if (!action.index) {
            throw new Error('插入 action 参数必须要包含 index.')
          }
          if (action.item) {
            const treeNode = Utils.transformItem2TreeNode(action.item)
            if (action.index === rootUUID) {
              treeNodeList.push(treeNode)
            } else {
              treeNodeList = TdActions.injectNode(treeNodeList, action.index, treeNode)
            }
            if (shouldLocate) {
              // after treeNode has been injected, move the viewport into the dom section
              setTimeout(() => {
                try {
                  const currentDom = Utils.getElementByAttr('div', 'data-key', treeNode.id)
                  if (currentDom) {
                    currentDom.scrollIntoView({ behavior: 'smooth', inline: 'center' })
                  }
                } catch {
                  warn(false, '定位失败')
                }
              }, 0)
            }
            return treeNodeList
          }
          throw new Error('插入节点 action 参数必须要包含 item.')
        case 'deleteNode':
          if (!action.index) {
            throw new Error('删除 action 参数必须要包含 index.')
          }
          treeNodeList = TdActions.deleteNode(treeNodeList, action.index)
          return treeNodeList
        case 'configNode':
          if (!action.index) {
            throw new Error('配置 action 参数必须要包含 index.')
          }
          if (action.config) {
            treeNodeList = TdActions.configNode(treeNodeList, action.index, action.config)
          } else {
            throw new Error('缺少 config 参数，config 参数当中应当至少包含 attr 和 value.')
          }
          return treeNodeList
        case 'initNode':
          if (action.initValue) {
            return TdActions.initNode(action.initValue)
          }
          return []
        default:
          return []
      }
    },
    [rootUUID]
  )
  const [tdList, tdListDiapatch] = useReducer(memoizedReducer, [])

  /**
   * merge options into every treeNode recursively
   */
  const mergeOptions = (treeNode: TreeNode, options: GenerateTreeOptions) => {
    Object.assign(treeNode, options)
    if (treeNode.children) {
      treeNode.children.forEach(treeNodeChildren => {
        mergeOptions(treeNodeChildren, options)
      })
    }
    return treeNode
  }

  /**
   * generate tree recursively
   */
  const generateTree = (treeNodeList: TreeNode[], options?: GenerateTreeOptions) => {
    try {
      const tree: JSX.Element[] = []
      treeNodeList.forEach(treeNode => {
        let treeHtml
        // if has GenerateTreeOptions, merge GenerateTreeOptions recursively
        if (options) {
          mergeOptions(treeNode, options)
        }
        if (treeNode.children) {
          const { children, ...ohterProps } = treeNode
          treeHtml = (
            <TreeNodeSFC.Root key={treeNode.id} tdListDiapatch={tdListDiapatch} {...ohterProps}>
              {generateTree(children)}
            </TreeNodeSFC.Root>
          )
        } else {
          treeHtml = <TreeNodeSFC.Leaf key={treeNode.id} tdListDiapatch={tdListDiapatch} {...treeNode} />
        }
        tree.push(treeHtml)
      })
      return tree
    } catch (error) {
      throwErrorMessage(error)
    }
    return []
  }

  const initTemplateFromContext = useCallback(() => {
    if (template.ptList && template.ptList.length > 0 && templateElements && templateElements.length > 0) {
      const [tempOriginalTdList] = Utils.transformElements2TdList(templateElements, template.ptList)
      tdListDiapatch({ type: 'initNode', initValue: tempOriginalTdList })
    }
  }, [template.ptList, templateElements])

  /**
   * 无论是初始化拉接口的预期模板数据，还是导入模板的预期模板数据
   * 都调用 initTemplateFromContext
   */
  useEffect(() => {
    initTemplateFromContext()
  }, [initTemplateFromContext, template.ptList])

  // 创建模板函数
  const createTemplate = () => {
    let elements
    try {
      elements = Utils.transformTdList2Elements(tdList)
      if (elements.length === 0) {
        message.error('校验错误 => 缺少模板配置信息，请先配置模板')
        return Promise.resolve([false])
      }
    } catch (error) {
      const errorMessageString = error.message
      // 解析错误显示红色高亮，定位到表单位置
      const errorMessageObj = JSON.parse(errorMessageString)
      if (errorMessageObj.replaceDefaultMessage) {
        message.error(`${errorMessageObj.errorMessage}`)
      } else {
        // 紫琼说不要感叹号，2022年9月23日15点58分
        message.error(`${errorMessageObj.errorMessage} => 关键字 "${errorMessageObj.key}" 的值 "${errorMessageObj.value}" 不符合规则`)
      }
      const errorDom = Utils.getElementByAttr('div', 'data-key', errorMessageObj.id) as HTMLDivElement
      if (errorDom && errorMessageObj.locateElement) {
        errorDom.scrollIntoView({ behavior: 'smooth', inline: 'center' })
        if (errorMessageObj.showErrorColor) {
          errorDom.classList.add(styles.error)
        }
      }
      localStorage.removeItem('contextVariables')
      return Promise.resolve([false])
    }
    localStorage.removeItem('contextVariables')
    return Promise.resolve([true, { elements }])
  }

  /**
   * 向页面 context 暴露 ref
   * 暴露 validator 方法
   */
  const templateResultRef = React.useRef<CheckerRef>(null)

  React.useImperativeHandle(templateResultRef, () => ({
    validator: async () => {
      const res = createTemplate()
      return res
    }
  }))

  useEffectOnce(() => {
    Object.assign(window, { templateResultRef })
    templateDispatch({ type: 'setTemplateRef', value: templateResultRef })
  })

  const options = { readonly: readonly || false }
  const baseTemplateTip = `基础模板${!readonly ? '(无法删除，可在此区域内添加原语或块)' : ''}`

  const Tree = (
    <div style={{ paddingLeft: '48px' }}>
      <h1 className={styles.base_template_title}>{baseTemplateTip}</h1>
      {generateTree(tdList, options)}
    </div>
  )

  return (
    <div className={styles.result_wrapper} style={readonly ? { width: '100%', margin: '0' } : {}}>
      {!readonly && <TemplateResultTitle />}
      <div className={styles.result_body} style={readonly ? { border: 'none' } : {}}>
        {!readonly ? (
          <DropBoxWrapper
            uuid={rootUUID}
            greedy={tdList.length === 0}
            full={tdList.length === 0}
            afterDrop={(item, index) => tdListDiapatch({ type: 'injectNode', item, index })}
            type={ItemTypes.BLOCK}
          >
            {tdList.length > 0 ? Tree : <NoDataSection />}
          </DropBoxWrapper>
        ) : (
          Tree
        )}
      </div>
    </div>
  )
}

TemplateResult.displayName = 'TemplateResult'

export default withRouterForwardRef(TemplateResult)
