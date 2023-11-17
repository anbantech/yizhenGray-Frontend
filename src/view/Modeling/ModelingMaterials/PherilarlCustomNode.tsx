import React, { useMemo } from 'react'
import { Handle, NodeProps, Position } from 'reactflow'
import { IconMinus, IconPeripheral } from '@anban/iconfonts'
import classNames from 'classnames'
import styles from '../model.less'
import MiddleStore from '../Store/ModelMiddleStore/MiddleStore'
import ContextMenu from './Menus'
import { RightDetailsAttributesStore } from '../Store/ModeleRightListStore/RightListStoreList'

function PherilarlCustomNode(Node: NodeProps) {
  const { expandNode, getChildernNums } = MiddleStore()
  const nodes = MiddleStore(state => state.nodes)
  const menuStatusObj = MiddleStore(state => state.menuStatusObj)
  const focusNodeId = RightDetailsAttributesStore(state => state.focusNodeId)

  const foucusStatus = React.useMemo(() => {
    return focusNodeId === Node.data.id
  }, [focusNodeId, Node])
  const isOpen = useMemo(() => {
    const idBol = menuStatusObj.id === Node.data.id
    return idBol && menuStatusObj.status
  }, [menuStatusObj, Node])

  const showNode = React.useCallback(() => {
    expandNode(Node.id)
  }, [Node.id, expandNode])

  const expand = React.useMemo(() => {
    const isExpand = Node.data.expanded
    return isExpand
  }, [Node])
  const NodeNums = React.useMemo(() => {
    return getChildernNums(Node.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes.length])
  const style = classNames({ [styles.pherilarNode]: !foucusStatus }, { [styles.pherilarNodeBorder]: foucusStatus })
  const menuLoookStyle = classNames({ [styles.menuPostion]: isOpen })
  return (
    <div className={menuLoookStyle}>
      <div className={style}>
        {/* <NodeBar isOpen={isOpen} Node={Node} /> */}
        <Handle className={styles.handle} type='target' position={Node.targetPosition || Position.Top} />
        <Handle className={styles.handle} type='source' position={Node.sourcePosition || Position.Bottom} />
        <div className={styles.label}>
          {' '}
          <IconPeripheral style={{ width: '14px', height: '14px', color: '#Ffffff' }} />
          <span className={styles.labelName}> {Node.data.label}</span>
        </div>
      </div>
      {NodeNums !== 0 ? (
        <>
          <div className={!expand ? styles.handleNumsPerilarl : styles.handleNumsExpandPerilarl} role='time' onClick={showNode}>
            {!expand ? <span>{NodeNums}</span> : <IconMinus />}
          </div>
        </>
      ) : null}
      {isOpen && <ContextMenu flag={Node.data.flag} Node={Node} />}
    </div>
  )
}

export default PherilarlCustomNode
