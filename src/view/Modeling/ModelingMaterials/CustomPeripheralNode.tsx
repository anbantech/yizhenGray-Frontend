import classNames from 'classnames'
import React, { useMemo } from 'react'
import { IconPeripheral } from '@anban/iconfonts'
import { Handle, NodeProps, Position, getConnectedEdges, useNodeId, useStore } from 'reactflow'
import Close from 'Src/assets/drag/icon_close.svg'
import StyleSheet from '../model.less'

import { LeftAndRightStore } from '../Store/ModelLeftAndRight/leftAndRightStore'
import { LowCodeStore } from '../Store/CanvasStore/canvasStore'

const selector = (s: { nodeInternals: any; edges: any }) => ({
  nodeInternals: s.nodeInternals
})

function CustomPeripheralNode(Node: NodeProps) {
  const selectLeftId = LeftAndRightStore(state => state.selectLeftId)
  const nodeId = useNodeId()
  const { nodeInternals } = useStore(selector)
  const { onNodesDelete, nodes, edges, getDeleteNodeInfo } = LowCodeStore()

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

  const deleteNode = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation()
      getDeleteNodeInfo([Node], nodes, edges)
      onNodesDelete(nodes, edges, [Node], [{ error_code: 0, id: Node.id }])
    },
    [Node, edges, getDeleteNodeInfo, nodes, onNodesDelete]
  )

  const isHandleConnectableStart = useMemo(() => {
    const node = nodeInternals.get(nodeId)
    const connectedEdges = getConnectedEdges([node], edges).find(item => item.target === nodeId)
    return !connectedEdges
  }, [edges, nodeId, nodeInternals])

  const isHandleConnectableEnd = useMemo(() => {
    const node = nodeInternals.get(nodeId)
    const connectedEdges = getConnectedEdges([node], edges).find(item => item.source === nodeId)
    return !connectedEdges
  }, [edges, nodeId, nodeInternals])

  return (
    <div className={style}>
      <div className={StyleSheet.peripheralNode}>
        <Handle type='source' className={StyleSheet.handle} isConnectable={isHandleConnectableEnd} position={Position.Bottom} />
        <Handle type='target' className={StyleSheet.handle} position={Position.Top} isConnectable={isHandleConnectableStart} />
        <div className={StyleSheet.label}>
          <IconPeripheral style={{ marginRight: '5px' }} />
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

export default CustomPeripheralNode
