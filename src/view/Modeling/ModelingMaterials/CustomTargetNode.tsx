import classNames from 'classnames'
import React, { useMemo } from 'react'
import { Handle, NodeProps, Position } from 'reactflow'
import StyleSheet from '../model.less'
import { LeftAndRightStore } from '../Store/ModelLeftAndRight/leftAndRightStore'

function CustomTargetNode(Node: NodeProps) {
  const selectLeftId = LeftAndRightStore(state => state.selectLeftId)
  const foucsNodeStatus = useMemo(() => {
    if (selectLeftId && Node.id) {
      return String(selectLeftId) === Node.id
    }
    return false
  }, [Node.id, selectLeftId])
  const style = classNames({ [StyleSheet.borderNone]: !foucsNodeStatus }, { [StyleSheet.borderShow]: foucsNodeStatus })
  return (
    <div className={style}>
      <div className={StyleSheet.targetNode}>
        <Handle type='source' className={StyleSheet.handle} style={{ bottom: 0 }} position={Node.sourcePosition || Position.Bottom} />
        {Node.data.label}
      </div>
    </div>
  )
}

export default CustomTargetNode
