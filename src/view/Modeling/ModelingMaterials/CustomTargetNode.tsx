import classNames from 'classnames'
import React, { useMemo } from 'react'
import { Handle, NodeProps, Position } from 'reactflow'
import StyleSheet from '../model.less'

function CustomTargetNode(Node: NodeProps) {
  const style = classNames([StyleSheet.baseNode], [StyleSheet.targetNode])
  return (
    <div className={style}>
      <Handle type='source' position={Node.sourcePosition || Position.Bottom} />
      {Node.data.label}
    </div>
  )
}

export default CustomTargetNode
