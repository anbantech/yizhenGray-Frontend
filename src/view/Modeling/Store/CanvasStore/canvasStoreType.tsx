import { Edge, EdgeChange, Node, NodeChange } from 'reactflow'

export interface LowCodeStoreType {
  nodes: Node[]
  edges: Edge[]
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  addEdge: (edges: any) => void
  createNode: (data: any) => void
  updatePositionNode: (id: string, position: { x: number; y: number }) => void
  createTargetNode: (data: { flag: number; id: number; processor: string }) => void
  getSumNodeId: (nodeArray: Node[]) => string
  onEdgeUpdate: (oldEdge: any, newConnection: any) => void
  saveCanvas: (id: string, node?: Node[], edge?: Edge[]) => void
  getModelDetails: (id: number) => void
  layout: () => void
  updatateNodeInfo: (data: Record<string, any>, platform_id: string) => void
  deleteNodeInfo: { node: any; visibility: boolean }
  setDeleNodeInfo: (node: any, visibility: boolean) => void
  setEdgesAndNodes: (node: any, edge: any, id: string) => void
}
