import React, { useMemo } from 'react'
import { Handle, NodeProps, Position } from 'reactflow'
import { IconMinus, IconYifuRegister } from '@anban/iconfonts'
import classNames from 'classnames'
import styles from '../model.less'
import { MiddleStore } from '../Store/ModelMiddleStore/MiddleStore'
import ContextMenu from './Menus'
import { RightDetailsAttributesStore } from '../Store/ModeleRightListStore/RightListStoreList'

function CustomRegisterNode(Node: NodeProps) {
  const { expandNodeTree, getChildernNums } = MiddleStore()
  const menuStatusObj = MiddleStore(state => state.menuStatusObj)
  const focusNodeId = RightDetailsAttributesStore(state => state.focusNodeId)
  const nodes = MiddleStore(state => state.nodes)
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

  const NodeNums = React.useMemo(() => {
    return getChildernNums(Node.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes.length])

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
      {NodeNums !== 0 ? (
        <>
          <div className={!expand ? styles.handleNums : styles.handleNumsExpand} role='time' onClick={showNode}>
            {!expand ? <span>{NodeNums}</span> : <IconMinus />}
          </div>
        </>
      ) : null}
      {isOpen && !Node.data.builtIn && <ContextMenu flag={Node.data.flag} Node={Node} />}
    </>
  )
}

export default CustomRegisterNode
