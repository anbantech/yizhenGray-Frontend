import React from 'react'
import { Handle, NodeProps, Position } from 'reactflow'
import { IconMinus, IconYifuRegister } from '@anban/iconfonts'
import styles from '../model.less'
import { useFlowStore } from '../Store/ModelStore'

function CustomRegisterNode(Node: NodeProps) {
  const { changeView, setChangeView, setNodeId } = useFlowStore()
  const showNode = React.useCallback(() => {
    setNodeId(Node.id)
    setChangeView(!changeView)
  }, [Node.id, changeView, setChangeView, setNodeId])
  const expand = React.useMemo(() => {
    const isExpand = Node.data.expanded ? 1 : 0
    return isExpand
  }, [Node.data.expanded])
  const nums = React.useMemo(() => {
    return Node.data.nums
  }, [Node.data.nums])
  return (
    <>
      <div className={styles.registerNode}>
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
    </>
  )
}

export default CustomRegisterNode
