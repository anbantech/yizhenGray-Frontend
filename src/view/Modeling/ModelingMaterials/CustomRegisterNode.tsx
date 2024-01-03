import classNames from 'classnames'
import React, { useMemo } from 'react'
import { IconYifuRegister } from '@anban/iconfonts'
import { Handle, NodeProps, Position } from 'reactflow'
import Close from 'Src/assets/drag/icon_close.svg'
import StyleSheet from '../model.less'
import { LeftAndRightStore } from '../Store/ModelLeftAndRight/leftAndRightStore'
import { LowCodeStore } from '../Store/CanvasStore/canvasStore'

function CustomRegisterNode(Node: NodeProps) {
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
      <div className={StyleSheet.registerNode}>
        <Handle type='target' className={StyleSheet.handle} position={Position.Top} />
        <div className={StyleSheet.label}>
          <IconYifuRegister style={{ marginRight: '5px', color: '#333' }} />
          <span className={StyleSheet.labelName}>{Node.data.label}</span>
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

export default CustomRegisterNode
