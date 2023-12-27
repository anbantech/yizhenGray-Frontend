import { Edge, EdgeChange, Node, NodeChange } from 'reactflow'

export interface LowCodeStoreType {
  nodes: Node[]
  edges: Edge[]
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  addEdge: (edges: Edge[]) => void
  createNode: (data: any) => void
  createTargetNode: (data: { flag: number; id: number; processor: string }) => void
  getSumNodeId: (nodeArray: Node[]) => string
  saveCanvas: (id: string, node?: Node[], edge?: Edge[]) => void
  getModelDetails: (id: number) => void
}
