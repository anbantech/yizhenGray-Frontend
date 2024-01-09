import { Edge, EdgeChange, Node, NodeChange } from 'reactflow'

export interface LowCodeStoreType {
  nodes: Node[]
  edges: Edge[]
  deleteNode: Node[][]
  setEdges: (edges: Edge[]) => void
  setNodes: (nodes: Node[]) => void
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  addEdge: (edges: any) => void
  createNode: (data: any) => void
  updatePositionNode: (target: Node, source: Node) => void
  createTargetNode: (data: { flag: number; id: number; processor: string }) => void
  getSumNodeId: (nodeArray: Node[]) => string
  onEdgeUpdate: (oldEdge: any, newConnection: any) => void
  saveCanvas: (id: string, node?: Node[], edge?: Edge[]) => void
  getModelDetails: (id: number) => void
  layout: (nodes: any) => boolean
  updatateNodeInfo: (data: Record<string, any>, platform_id: string) => void
  deleteNodeInfo: { node: any; visibility: boolean }
  setDeleNodeInfo: (node: any, visibility: boolean) => void
  setEdgesAndNodes: (node: any, edge: any, id: string) => void
  getDeleteNodeInfo: (deleted: any, nodes: Node[], edges: Edge[]) => void
  createRegisterNode: (data: any) => void
  initLowCodeStore: () => void
  onNodeRightCanvasDelete: (id: string | number) => void
  onNodesDelete: (nodeData: any, edgesData: any, deletedArray: any, error_code: [{ error_code: number; id: string }]) => void
  getTreeNode: () => void
}
