import React from 'react'
import { Handle, NodeProps, Position } from 'reactflow'
import { IconMinus } from '@anban/iconfonts'
import styles from '../model.less'
import { useFlowStore } from '../Store/ModelStore'

function CustomTargetNode(Node: NodeProps) {
  const { changeView, setChangeView, setNodeId } = useFlowStore()
  const showNode = React.useCallback(() => {
    setNodeId(Node.id)
    setChangeView(!changeView)
  }, [Node.id, changeView, setChangeView, setNodeId])
  const expand = React.useMemo(() => {
    const isExpand = changeView ? 1 : 0
    return isExpand
  }, [changeView])
  const nums = React.useMemo(() => {
    return Node.data.nums
  }, [Node.data.nums])
  return (
    <>
      <div className={styles.targetNode}>
        <Handle className={styles.handle} type='source' position={Node.sourcePosition || Position.Bottom} />
        {Node.data.label}
      </div>
      {nums > 0 ? (
        <>
          <div className={!expand ? styles.handleNums : styles.handleNumsExpand} role='time' onClick={showNode}>
            {!expand ? <span>{Node.data.nums}</span> : <IconMinus />}
          </div>
        </>
      ) : null}
    </>
  )
}

export default CustomTargetNode
