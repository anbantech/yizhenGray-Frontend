// import { create } from 'zustand'
// import ModelDrawStoreType from './ModleStore'

import { create } from 'zustand'
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges
} from 'reactflow'

type RFState = {
  nodes: Node[]
  edges: Edge[]
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  getModelDetails: () => void
  setNodes: (nodesValue: Node[]) => void
  setEdges: (edgesValue: Edge[]) => void
}

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create<RFState>((set, get) => ({
  nodes: [],
  edges: [],
  setNodes: (nodesValue: Node[]) => {
    set({ nodes: nodesValue })
  },
  setEdges: (edgesValue: Edge[]) => {
    set({
      edges: edgesValue
    })
  },
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes)
    })
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges)
    })
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges)
    })
  },
  getModelDetails: () => {
    const treeNode = {
      name: 'dsp4198231',
      id: '1',
      children: [
        {
          name: '外设1',
          id: '1-1',
          children: [
            {
              name: '寄存器',
              id: '1-1-1'
            },
            {
              name: '寄存器2',
              id: '1-1-2'
            }
          ]
        },
        {
          name: '外设2',
          id: '1-2'
        }
      ]
    }
    const converTreeToNode = (node: any) => {
      const result = []
      result.push({
        data: { label: `Node ${node.name}` },
        type: 'custom',
        id: node.id as string,
        position: { x: 0, y: 0 }
      })
      if (node.children && node.children.length > 0) {
        node.children.forEach((item: any) => {
          result.push(...converTreeToNode(item))
        })
      }
      return result
    }
    const nodeArray = converTreeToNode(treeNode)
    const converTreeToEdges = (node: any) => {
      const links: any[] = []
      if (node.children && node.children.length > 0) {
        node.children.forEach((item: any) => {
          const source = node.id
          const target = item.id
          links.push({ id: `${source}->${target}`, source, target, type: 'smoothstep' })
          links.push(...converTreeToEdges(item))
        })
      }
      return links
    }
    const edgeArray = converTreeToEdges(treeNode)
    set({ nodes: [...nodeArray], edges: [...edgeArray] })
    // onNodesChange(nodeArray as NodeChange[])
    // onEdgesChange(edgeArray)
  }
}))

export default useStore
