import React, { useMemo } from 'react'
import { Handle, NodeProps, Position } from 'reactflow'
import { IconMinus, IconYifuRegister } from '@anban/iconfonts'
import classNames from 'classnames'
import styles from '../model.less'
import MiddleStore from '../Store/ModelMiddleStore/MiddleStore'
import ContextMenu from './Menus'
import { RightDetailsAttributesStore } from '../Store/ModelMiddleStore/ModeleRightListStore/RightListStoreList'

function CustomRegisterNode(Node: NodeProps) {
  const { expandNodeTree } = MiddleStore()
  const menuStatusObj = MiddleStore(state => state.menuStatusObj)
  const focusNodeId = RightDetailsAttributesStore(state => state.focusNodeId)

  const foucusStatus = React.useMemo(() => {
    return focusNodeId === Node.data.id
  }, [focusNodeId, Node])

  const hasError = React.useMemo(() => {
    return Node.data.error_code !== 0
  }, [Node])

  const isOpen = useMemo(() => {
    const idBol = menuStatusObj.id === Node.data.id
    return idBol && menuStatusObj.status
  }, [menuStatusObj, Node])

  const showNode = React.useCallback(() => {
    expandNodeTree(Node.id)
  }, [Node.id, expandNodeTree])

  const expand = React.useMemo(() => {
    const isExpand = Node.data.expanded
    return isExpand
  }, [Node])

  const nums = React.useMemo(() => {
    return Node.data.nums
  }, [Node])

  const style = classNames(
    { [styles.hasErrorRegisterNode]: hasError },
    { [styles.registerNode]: !foucusStatus },
    { [styles.registerNodeBorder]: foucusStatus }
  )
  return (
    <>
      <div className={style}>
        <Handle className={styles.handle} type='target' position={Node.targetPosition || Position.Top} />
        <Handle className={styles.handle} type='source' position={Node.sourcePosition || Position.Bottom} />
        <div className={styles.label}>
          {' '}
          <IconYifuRegister style={{ width: '14px', height: '14px', color: '#333333' }} />
          <span className={styles.labelName}> {Node.data.label}</span>
        </div>
      </div>
      {nums > 0 ? (
        <>
          <div className={!expand ? styles.handleNums : styles.handleNumsExpand} role='time' onClick={showNode}>
            {!expand ? <span>{Node.data.nums}</span> : <IconMinus />}
          </div>
        </>
      ) : null}
      {isOpen && <ContextMenu flag={Node.data.flag} Node={Node} />}
    </>
  )
}

export default CustomRegisterNode
