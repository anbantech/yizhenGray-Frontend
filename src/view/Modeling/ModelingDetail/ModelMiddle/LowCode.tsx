import React from 'react'
import ReactFlow, { Background, BackgroundVariant, Edge, Node, NodeOrigin, NodeTypes, ReactFlowProvider } from 'reactflow'
import { LowCodeStoreType } from '../../Store/CanvasStore/canvasStoreType'
import 'reactflow/dist/style.css'
import { LowCodeStore } from '../../Store/CanvasStore/canvasStore'
import CustomTargetNode from '../../ModelingMaterials/CustomTargetNode'

type ExpandCollapseExampleProps = {
  edges: Edge[]
  nodes: Node[]
}

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

  return (
    <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} fitView>
      <Background variant={BackgroundVariant.Dots} gap={24} size={1} />
    </ReactFlow>
  )
}

function LowCodeWrapper() {
  const { nodes, edges } = LowCodeStore()

  return <ReactFlowProvider>{nodes.length && <ReactFlowPro nodes={nodes} edges={edges} />}</ReactFlowProvider>
}

export default LowCodeWrapper
