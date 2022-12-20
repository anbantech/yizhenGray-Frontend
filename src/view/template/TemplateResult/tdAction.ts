import styles from './templateResult.less'

import { TreeNode } from './templateResult'

import Utils from './utils'

export type TdListReducerActionTypes = 'injectNode' | 'deleteNode' | 'configNode' | 'initNode'

export type TdListReducerConfigType = { attr: keyof TreeNode; value: string | boolean | any }

const injectNode = (nodeList: TreeNode[], uuid: string, node2Inject: TreeNode) => {
  const tempNodeList = [...nodeList]
  tempNodeList.forEach(node => {
    if (node.id === uuid) {
      // eslint-disable-next-line no-param-reassign
      node.opening = true
      if (node.children) {
        node.children.push(node2Inject)
      } else {
        // eslint-disable-next-line no-param-reassign
        node.children = [node2Inject]
      }
    } else if (node.children && node.children.length > 0) {
      // eslint-disable-next-line no-param-reassign
      node.children = injectNode(node.children, uuid, node2Inject)
    }
  })
  return tempNodeList
}

const deleteNode = (nodeList: TreeNode[], uuid: string) => {
  let tempNodeList = [...nodeList]
  tempNodeList = tempNodeList.filter(node => {
    if (node.id === uuid) {
      return false
    }
    if (node.children && node.children.length > 0) {
      // eslint-disable-next-line no-param-reassign
      node.children = deleteNode(node.children, uuid)
    }
    return true
  })
  return tempNodeList
}

const initNode = (nodeList: TreeNode[]) => {
  const tempNodeList = [...nodeList]
  return tempNodeList
}

const configNode = (nodeList: TreeNode[], uuid: string, config: TdListReducerConfigType) => {
  const tempNodeList = [...nodeList]
  tempNodeList.forEach(node => {
    if (node.id === uuid) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line no-param-reassign
      node[config.attr] = config.value
      // 如果不是只读模板，移除红色错误提示(只读模板没有错误高亮的功能)
      if (!node.readonly) {
        const errorDom = Utils.getElementByAttr('div', 'data-key', node.id) as HTMLDivElement
        if (errorDom.classList.contains(styles.error)) {
          errorDom.classList.remove(styles.error)
        }
      }
    } else if (node.children && node.children.length > 0) {
      // eslint-disable-next-line no-param-reassign
      node.children = configNode(node.children, uuid, config)
    }
  })
  return tempNodeList
}

const TDACTIONS = {
  initNode,
  configNode,
  injectNode,
  deleteNode
}

export default TDACTIONS
