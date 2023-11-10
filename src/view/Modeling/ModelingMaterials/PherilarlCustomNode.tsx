import React, { useMemo } from 'react'
import { Handle, NodeProps, Position } from 'reactflow'
import { IconMinus, IconPeripheral } from '@anban/iconfonts'
import classNames from 'classnames'
import styles from '../model.less'
import { useFlowStore } from '../Store/ModelStore'
import ContextMenu from './Menus'

function PherilarlCustomNode(Node: NodeProps) {
  const { expandNode } = useFlowStore()

  const menuStatusObj = useFlowStore(state => state.menuStatusObj)
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

  const nums = React.useMemo(() => {
    return Node.data.nums
  }, [Node])
  const style = classNames({ [styles.pherilarNode]: !isOpen }, { [styles.pherilarNodeBorder]: isOpen })
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
      {nums !== 0 ? (
        <>
          <div className={!expand ? styles.handleNumsPerilarl : styles.handleNumsExpandPerilarl} role='time' onClick={showNode}>
            {!expand ? <span>{Node.data.nums}</span> : <IconMinus />}
          </div>
        </>
      ) : null}
      {isOpen && <ContextMenu flag={Node.data.flag} Node={Node} />}
    </div>
  )
}

export default PherilarlCustomNode
