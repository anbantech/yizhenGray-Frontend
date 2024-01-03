import classNames from 'classnames'
import React, { useMemo } from 'react'
import { Handle, NodeProps, Position } from 'reactflow'
import { IconClock } from '@anban/iconfonts'
import Close from 'Src/assets/drag/icon_close.svg'
import StyleSheet from '../model.less'
import { LeftAndRightStore } from '../Store/ModelLeftAndRight/leftAndRightStore'
import { LowCodeStore } from '../Store/CanvasStore/canvasStore'

function CustomTimerNode(Node: NodeProps) {
  const selectLeftId = LeftAndRightStore(state => state.selectLeftId)
  const foucsNodeStatus = useMemo(() => {
    if (selectLeftId && Node.id) {
      return String(selectLeftId) === Node.id
    }
    return false
  }, [Node.id, selectLeftId])

  const hasError = React.useMemo(() => {
    return Node.data.error_code === 0
  }, [Node])

  const style = classNames(
    { [StyleSheet.hasErrorRegisterNode]: !hasError },
    { [StyleSheet.borderNone]: !foucsNodeStatus },
    { [StyleSheet.borderShow]: foucsNodeStatus }
  )
  const name = useMemo(() => {
    return Node.data.label
  }, [Node])

  const { onNodesDelete, nodes, edges, getDeleteNodeInfo } = LowCodeStore()

  const deleteNode = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation()
      getDeleteNodeInfo([Node], nodes, edges)
      onNodesDelete(nodes, edges, [Node], [{ error_code: 0, id: Node.id }])
    },
    [Node, edges, getDeleteNodeInfo, nodes, onNodesDelete]
  )

  return (
    <div className={style}>
      <div className={StyleSheet.TimerNode}>
        <Handle type='target' className={StyleSheet.handle} position={Node.targetPosition || Position.Top} />
        <div className={StyleSheet.label}>
          <IconClock style={{ marginRight: '5px' }} />
          <span className={StyleSheet.labelName}>{name}</span>
        </div>
        <div
          className={StyleSheet.deleteIcon}
          role='time'
          onClick={e => {
            deleteNode(e)
          }}
        >
          <img src={Close} alt='' />
        </div>
      </div>
    </div>
  )
}

export default CustomTimerNode
