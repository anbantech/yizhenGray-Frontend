import React, { useMemo } from 'react'
import { Handle, NodeProps, Position } from 'reactflow'
import { IconMinus } from '@anban/iconfonts'
import classNames from 'classnames'
import styles from '../model.less'
import { useFlowStore } from '../Store/ModelStore'
import ContextMenu from './Menus'

function CustomTargetNode(Node: NodeProps) {
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
  const style = classNames({ [styles.targetNode]: !isOpen }, { [styles.targetNodeBorder]: isOpen })
  const handleContextMenu = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])
  return (
    <>
      <div className={style}>
        <Handle className={styles.handle} type='source' position={Node.sourcePosition || Position.Bottom} />
        {Node.data.label}
      </div>
      {nums > 0 ? (
        <>
          <div className={!expand ? styles.handleNums : styles.handleNumsExpand} role='time' onClick={showNode} onContextMenu={handleContextMenu}>
            {!expand ? <span>{Node.data.nums}</span> : <IconMinus />}
          </div>
        </>
      ) : null}
      {isOpen && <ContextMenu flag={Node.data.flag} Node={Node} />}
    </>
  )
}

export default CustomTargetNode
