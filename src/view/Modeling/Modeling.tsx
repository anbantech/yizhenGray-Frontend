import React from 'react'
import ReactFlow, { Background, SelectionMode, BackgroundVariant, Controls, ReactFlowProvider } from 'reactflow'
import 'reactflow/dist/style.css'

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Input Node' },
    position: { x: 250, y: 25 },
    draggable: true
  },

  {
    id: '2',
    // you can also pass a React component as a label
    data: { label: <div>Default Node</div> },
    position: { x: 100, y: 125 },
    draggable: true
  },
  {
    id: '3',
    type: 'output',
    data: { label: 'Output Node' },
    position: { x: 250, y: 250 }
  }
]

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true }
]
const panOnDrag = [1, 2]
function Flow() {
  return (
    <div style={{ width: '100vw', height: '80vh' }}>
      <ReactFlowProvider>
        <ReactFlow
          defaultNodes={initialNodes}
          panOnDrag={panOnDrag}
          selectionMode={SelectionMode.Partial}
          panOnScroll
          selectionOnDrag
          defaultEdges={initialEdges}
          fitView
        >
          <Background variant={BackgroundVariant.Dots} gap={24} size={1} />
          <Controls />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  )
}

export default Flow
