import React, { useMemo } from 'react'
import { Handle, NodeProps, Position } from 'reactflow'
import { IconMinus } from '@anban/iconfonts'
import classNames from 'classnames'
import styles from '../model.less'
import { MiddleStore } from '../Store/ModelMiddleStore/MiddleStore'
import ContextMenu from './Menus'
import { RightDetailsAttributesStore } from '../Store/ModeleRightListStore/RightListStoreList'

function CustomTargetNode(Node: NodeProps) {
  const { expandNodeTree, getChildernNums } = MiddleStore()
  const menuStatusObj = MiddleStore(state => state.menuStatusObj)
  const nodes = MiddleStore(state => state.nodes)

  const focusNodeId = RightDetailsAttributesStore(state => state.focusNodeId)

  const foucusStatus = React.useMemo(() => {
    return String(focusNodeId) === Node.data.id
  }, [focusNodeId, Node])

  const isOpen = useMemo(() => {
    const idBol = menuStatusObj === Node.data.id
    return idBol
  }, [menuStatusObj, Node])

  const showNode = React.useCallback(
    e => {
      e.stopPropagation()
      expandNodeTree(Node.id)
    },
    [Node.id, expandNodeTree]
  )
  const NodeNums = React.useMemo(() => {
    return getChildernNums(Node.id) - 1
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes.length])
  const expand = React.useMemo(() => {
    const isExpand = Node.data.expanded
    return isExpand
  }, [Node])

  const style = classNames({ [styles.borderNone]: !foucusStatus || !isOpen }, { [styles.borderShow]: foucusStatus || isOpen })
  const handleContextMenu = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  return (
    <>
      <div className={style}>
        <div className={styles.targetNode}>
          <Handle type='source' position={Node.sourcePosition || Position.Bottom} />
          {Node.data.label}
        </div>
      </div>
      {NodeNums > 0 ? (
        <div
          className={!expand ? styles.handleNums : styles.handleNumsExpand}
          role='time'
          onClick={e => {
            showNode(e)
          }}
          onContextMenu={handleContextMenu}
        >
          {!expand ? <span>{NodeNums}</span> : <IconMinus />}
        </div>
      ) : null}
      {isOpen && <ContextMenu flag={Node.data.flag} Node={Node} />}
    </>
  )
}

export default CustomTargetNode
