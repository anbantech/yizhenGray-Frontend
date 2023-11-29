import React from 'react'
import { IconPeripheral, IconYifuRegister, IconCommon, IconDelete } from '@anban/iconfonts'
import { NodeProps } from 'reactflow'
import styles from '../model.less'
import { formItemParamsCheckStore } from '../Store/ModelStore'
import { MiddleStore } from '../Store/ModelMiddleStore/MiddleStore'
import { titleFlagMap } from '../Store/MapStore'

const Flag5 = () => {
  const setTabs = formItemParamsCheckStore(state => state.setTabs)
  const setOpenMenu = MiddleStore(state => state.setOpenMenu)
  const createPheripheral = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    e.preventDefault()
    setTabs('customMadePeripheral')
    setOpenMenu()
  }

  return (
    <div
      className={styles.Flag5}
      role='time'
      onClick={e => {
        createPheripheral(e)
      }}
    >
      <IconPeripheral style={{ width: '16px', height: '16px', color: '#666', marginRight: '4px' }} />
      <span> 添加自定义外设 </span>
    </div>
  )
}

const Flag1 = (Node: NodeProps) => {
  const setTabs = formItemParamsCheckStore(state => state.setTabs)
  const setOpenMenu = MiddleStore(state => state.setOpenMenu)
  const updateFormValue = formItemParamsCheckStore(state => state.updateFormValue)
  const processor = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation()
      e.preventDefault()
      updateFormValue('peripheral_id', Node.data.id, '', null, 'success')
      setTabs('processor')
      setOpenMenu()
    },
    [Node.data.id, setOpenMenu, setTabs, updateFormValue]
  )
  const deleteTreeNode = MiddleStore(state => state.deleteTreeNode)
  const createNodeInfoAndOpenModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    e.preventDefault()

    const nodeArray = [{ id: String(Node.data.id), data: { flag: Node.data.flag } }]
    const nodeInfo = {
      node: nodeArray,
      title: titleFlagMap[Node.data.flag as keyof typeof titleFlagMap][0],
      content: `${titleFlagMap[Node.data.flag as keyof typeof titleFlagMap][1]}${Node.data.label}`
    }

    deleteTreeNode(true, nodeInfo)
  }
  return (
    <div className={styles.Flag1}>
      <div
        className={styles.Flag5}
        role='time'
        onClick={e => {
          processor(e)
        }}
      >
        <IconYifuRegister style={{ width: '16px', height: '16px', color: '#666', marginRight: '4px' }} />
        <span>添加寄存器 </span>
      </div>
      <div className={styles.Flag_1} role='time' onClick={createNodeInfoAndOpenModal}>
        <IconDelete style={{ width: '16px', height: '16px', color: '#000', marginRight: '4px' }} />
        <span>删除</span>
      </div>
    </div>
  )
}

const Flag2 = (Node: NodeProps) => {
  const setTabs = formItemParamsCheckStore(state => state.setTabs)
  const setOpenMenu = MiddleStore(state => state.setOpenMenu)
  const deleteTreeNode = MiddleStore(state => state.deleteTreeNode)
  const dataHandeler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    e.preventDefault()
    setTabs('dataHandlerNotReferenced')
    setOpenMenu()
  }

  const createNodeInfoAndOpenModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    e.preventDefault()
    const nodeArray = [{ id: String(Node.data.id), data: { flag: Node.data.flag } }]
    const nodeInfo = {
      node: nodeArray,
      title: titleFlagMap[Node.data.flag as keyof typeof titleFlagMap][0],
      content: `${titleFlagMap[Node.data.flag as keyof typeof titleFlagMap][1]}${Node.data.label}`
    }
    deleteTreeNode(true, nodeInfo)
  }
  return (
    <div className={styles.Flag3}>
      <div
        className={styles.Flag5}
        role='time'
        onClick={e => {
          dataHandeler(e)
        }}
      >
        <IconCommon style={{ width: '16px', height: '16px', color: '#000', marginRight: '4px' }} />
        <span> 添加数据处理器 </span>
      </div>
      <div className={styles.Flag_1} role='time' onClick={createNodeInfoAndOpenModal}>
        <IconDelete style={{ width: '16px', height: '16px', color: '#000', marginRight: '4px' }} />
        <span>删除</span>
      </div>
    </div>
  )
}
const Flag3 = (Node: NodeProps) => {
  const deleteTreeNode = MiddleStore(state => state.deleteTreeNode)
  const createNodeInfoAndOpenModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    e.preventDefault()
    const nodeArray = [{ id: String(Node.data.id), data: { flag: Node.data.flag } }]
    const nodeInfo = {
      node: nodeArray,
      title: titleFlagMap[Node.data.flag as keyof typeof titleFlagMap][0],
      content: `${titleFlagMap[Node.data.flag as keyof typeof titleFlagMap][1]}${Node.data.label}`
    }
    deleteTreeNode(true, nodeInfo)
  }

  return (
    <div className={styles.Flag5} role='time' onClick={createNodeInfoAndOpenModal}>
      <IconCommon style={{ width: '16px', height: '16px', color: '#666', marginRight: '4px' }} />
      <span>删除 </span>
    </div>
  )
}
const mapFlagCompoents = {
  5: Flag5,
  1: Flag1,
  2: Flag2,
  3: Flag3
}

const mapFlagCompoentsStyle = {
  5: styles.contextMenu5,
  1: styles.contextMenu1,
  2: styles.contextMenu2,
  3: styles.contextMenu5
}
export default function ContextMenu(props: { flag: number; Node: NodeProps }) {
  const { flag, Node } = props
  return (
    <div className={mapFlagCompoentsStyle[flag as keyof typeof mapFlagCompoentsStyle]}>
      {mapFlagCompoents[flag as keyof typeof mapFlagCompoents](Node)}
    </div>
  )
}
