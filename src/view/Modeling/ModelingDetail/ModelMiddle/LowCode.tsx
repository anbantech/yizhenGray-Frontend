import React, { useCallback, useState } from 'react'
import ReactFlow, { Background, BackgroundVariant, Edge, Node, NodeOrigin, NodeTypes, ReactFlowProvider } from 'reactflow'
import { LowCodeStoreType } from '../../Store/CanvasStore/canvasStoreType'
import 'reactflow/dist/style.css'
import { LowCodeStore } from '../../Store/CanvasStore/canvasStore'
import CustomTargetNode from '../../ModelingMaterials/CustomTargetNode'
import CustomControls from '../../ModelingMaterials/CustomControls'

type ExpandCollapseExampleProps = {
  edges: Edge[]
  nodes: Node[]
}
const proOptions = { account: 'paid-pro', hideAttribution: true }

const selector = (state: LowCodeStoreType) => ({
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange
})

const nodeTypes: NodeTypes = {
  TargetNode: CustomTargetNode
}

// 保持原点在屏幕中心
// const nodeOrigin: NodeOrigin = [0.5, 0.5]

function ReactFlowPro({ edges, nodes }: ExpandCollapseExampleProps) {
  const { onNodesChange, onEdgesChange } = LowCodeStore(selector)
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)
  const onDragOver = useCallback(event => {
    event.preventDefault()
    // eslint-disable-next-line no-param-reassign
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    event => {
      event.preventDefault()

      const type = event.dataTransfer.getData('application/reactflow')

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return
      }

      // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY
      })

      // const newNode = {
      //   id: getId(),
      //   type,
      //   position,
      //   data: { label: `${type} node` }
      // }

      // setNodes(nds => nds.concat(newNode))
    },
    [reactFlowInstance]
  )
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onInit={setReactFlowInstance}
      onDrop={onDrop}
      onDragOver={onDragOver}
      proOptions={proOptions}
      // nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
    >
      <Background variant={BackgroundVariant.Dots} gap={24} size={1} />
      <CustomControls />
    </ReactFlow>
  )
}

function LowCodeWrapper() {
  const { nodes, edges } = LowCodeStore()

  return <ReactFlowProvider>{nodes.length && <ReactFlowPro nodes={nodes} edges={edges} />}</ReactFlowProvider>
}

export default LowCodeWrapper
