import classNames from 'classnames'
import React, { useMemo } from 'react'
import { IconYifuRegister } from '@anban/iconfonts'
import { Handle, NodeProps, Position, getOutgoers } from 'reactflow'
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

  const { onNodesDelete, nodes, edges } = LowCodeStore()
  //  框选删除更新界面
  const deleteNodeRef = React.useRef<any[]>([])
  // 待优化
  const getDeleteNodeAndAdge = React.useCallback(
    (deleted: any) => {
      // eslint-disable-next-line array-callback-return
      deleted.reduce((acc: any, node: any) => {
        const outgoers = getOutgoers(node, nodes, edges)
        if (outgoers.length > 0) {
          deleteNodeRef.current.push(outgoers)
          getDeleteNodeAndAdge(outgoers)
        }
      }, edges)
      return deleteNodeRef.current
    },
    [nodes, edges]
  )

  const deleteNode = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation()
      getDeleteNodeAndAdge([Node])
      onNodesDelete(nodes, edges, deleteNodeRef.current, [Node], [{ error_code: 0, id: Node.id }])
    },
    [Node, edges, getDeleteNodeAndAdge, nodes, onNodesDelete]
  )

  return (
    <div className={style}>
      <div className={StyleSheet.regiseterNode}>
        <Handle type='target' className={StyleSheet.handle} position={Node.targetPosition || Position.Top} />
        <div className={StyleSheet.label}>
          <IconYifuRegister style={{ marginRight: '5px' }} />
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
