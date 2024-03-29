import React, { useMemo } from 'react'
import { Handle, NodeProps, Position } from 'reactflow'
import { IconMinus, IconPeripheral } from '@anban/iconfonts'
import classNames from 'classnames'
import styles from '../model.less'
import { MiddleStore } from '../Store/ModelMiddleStore/MiddleStore'
import ContextMenu from './Menus'
import { RightDetailsAttributesStore } from '../Store/ModeleRightListStore/RightListStoreList'

function PherilarlCustomNode(Node: NodeProps) {
  const { expandNodeTree, getChildernNums } = MiddleStore()
  const nodes = MiddleStore(state => state.nodes)
  const menuStatusObj = MiddleStore(state => state.menuStatusObj)
  const focusNodeId = RightDetailsAttributesStore(state => state.focusNodeId)
  const foucusStatus = React.useMemo(() => {
    return focusNodeId === Node.data.id
  }, [focusNodeId, Node])

  const isOpen = useMemo(() => {
    const idBol = menuStatusObj === Node.data.id
    return idBol
  }, [menuStatusObj, Node])

  const showNode = React.useCallback(() => {
    expandNodeTree(Node.id)
  }, [Node.id, expandNodeTree])

  const expand = React.useMemo(() => {
    const isExpand = Node.data.expanded
    return isExpand
  }, [Node])

  const NodeNums = React.useMemo(() => {
    return getChildernNums(Node.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes.length])

  const hasError = React.useMemo(() => {
    return Node.data.error_code !== 0
  }, [Node])

  const style = classNames(
    { [styles.hasErrorRegisterNode]: hasError },
    { [styles.borderNone]: !foucusStatus || !isOpen },
    { [styles.borderShow]: foucusStatus || isOpen }
  )

  const menuLoookStyle = classNames({ [styles.menuPostion]: isOpen })

  return (
    <div className={menuLoookStyle}>
      <div className={style}>
        <div className={styles.pherilarNode}>
          {/* <NodeBar isOpen={isOpen} Node={Node} /> */}
          <Handle className={styles.handle} type='target' position={Node.targetPosition || Position.Top} />
          <Handle className={styles.handle} type='source' position={Node.sourcePosition || Position.Bottom} />
          <div className={styles.label}>
            {' '}
            <IconPeripheral style={{ width: '14px', height: '14px', color: '#Ffffff' }} />
            <span className={styles.labelName}> {Node.data.label}</span>
          </div>
        </div>
      </div>
      {NodeNums !== 0 ? (
        <>
          <div className={!expand ? styles.handleNumsPerilarl : styles.handleNumsExpandPerilarl} role='time' onClick={showNode}>
            {!expand ? <span>{NodeNums}</span> : <IconMinus />}
          </div>
        </>
      ) : null}
      {isOpen && !Node.data.builtIn && <ContextMenu flag={Node.data.flag} Node={Node} />}
    </div>
  )
}

export default PherilarlCustomNode
