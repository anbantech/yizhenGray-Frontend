import React from 'react'
import { IconPeripheral, IconYifuRegister, IconCommon, IconDelete } from '@anban/iconfonts'
import { NodeProps } from 'reactflow'
import styles from '../model.less'
import { formItemParamsCheckStore } from '../Store/ModelStore'
import MiddleStore from '../Store/ModelMiddleStore/MiddleStore'

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
  const { data, id } = Node
  const setTabs = formItemParamsCheckStore(state => state.setTabs)
  const setOpenMenu = MiddleStore(state => state.setOpenMenu)
  const processor = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    e.preventDefault()
    setTabs('processor')
    setOpenMenu()
  }
  const deleteTreeNode = MiddleStore(state => state.deleteTreeNode)
  const createNodeInfoAndOpenModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    e.preventDefault()
    const nodeInfo = { name: data.name, id, title: '删除自定义外设', concent: `是否确认删除该自定义外设${data.label}` }
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
  const { data, id } = Node
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
    const nodeInfo = { name: data.name, id, title: '删除寄存器', concent: `是否确认删除该寄存器${data.label}` }
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

const mapFlagCompoents = {
  5: Flag5,
  1: Flag1,
  2: Flag2
}

const mapFlagCompoentsStyle = {
  5: styles.contextMenu5,
  1: styles.contextMenu1,
  2: styles.contextMenu2
}
export default function ContextMenu(props: { flag: number; Node: NodeProps }) {
  const { flag, Node } = props
  return (
    <div className={mapFlagCompoentsStyle[flag as keyof typeof mapFlagCompoentsStyle]}>
      {mapFlagCompoents[flag as keyof typeof mapFlagCompoents](Node)}
    </div>
  )
}
