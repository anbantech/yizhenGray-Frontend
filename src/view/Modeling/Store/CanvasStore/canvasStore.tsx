import { getCanvas, saveCanvasAsync } from 'Src/services/api/modelApi'
import {
  Edge,
  EdgeChange,
  Node,
  addEdge,
  NodeChange,
  OnConnect,
  OnNodesChange,
  Connection,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType
} from 'reactflow'
import { create } from 'zustand'
import crc32 from 'crc-32'
import { throwErrorMessage } from 'Src/util/message'
import { NodeType } from '../MapStore'

type NodeProps = {
  name: string
  id: string
  flag: 0 | 1 | 2 | 3 | 4 | 5
  error_code: number
  processor: string
  children?: NodeProps[]
}

const pako = require('pako')

export type RFState = {
  platform_id: string | null
  nodes: Node[]
  edges: Edge[]
  sumData: any
  updateLayout: boolean
  expandAndCollapse: (nodeId: string, oneOrMore: boolean) => void
  getSumNodeId: (nodeArray: Node[]) => string
  getModelDetails: (id: string) => void
  InitCanvas: (nodeArray: Node[], edgeArray: Edge[]) => void
  initTreeToNodeAndToEdge: (initData: any, isVersion?: boolean) => void
  saveCanvas: (nodes: any[], edges: Edge[], id: string) => void
  clearCanvas: () => void
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
}

const useCanvasStore = create<RFState>((set, get) => ({
  platform_id: null,
  sumData: null,
  nodes: [],
  edges: [],
  updateLayout: false,

  // 更新画布节点和边
  InitCanvas: (nodeArray, edgeArray) => {
    set({ nodes: [...nodeArray], edges: edgeArray })
  },

  // 打开或者折叠
  expandAndCollapse: (nodeId, oneOrMore) => {
    if (oneOrMore) {
      set({
        nodes: [
          ...get().nodes.map((node: Node) => {
            if (nodeId === node.id) {
              // it's important to create a new object here, to inform React Flow about the changes
              return { ...node, data: { ...node.data, expanded: !node.data.expanded } }
            }
            return node
          })
        ]
      })
    }
    set({ updateLayout: !get().updateLayout })
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

  // 获取节点ID生成checkSum
  getSumNodeId: nodeArray => {
    if (nodeArray.length === 0) return '0'
    const idArray = nodeArray.map((item: { id: string }) => item.id).join(',')
    // eslint-disable-next-line no-bitwise
    const crc32Value = crc32.str(idArray) >>> 0
    const hex = crc32Value.toString(16).toUpperCase()
    return hex
  },

  // 初始化获取画布数据
  getModelDetails: async id => {
    if (!id) return
    const { initTreeToNodeAndToEdge } = get()
    set({ platform_id: String(id) })
    try {
      const res = await getCanvas(+id)
      if (res.data.version === 0) {
        return initTreeToNodeAndToEdge(res.data.canvas, true)
      }
      const deleteString = JSON.parse(res.data.canvas)
      const decompressed = pako.inflate(deleteString, { to: 'string' })
      const result = JSON.parse(decompressed)
      const nodesArray = result.nodes
      const edgesArray = result.edges

      if (nodesArray) {
        set({
          nodes: [...nodesArray],
          edges: edgesArray
        })
      }
    } catch (error) {
      throwErrorMessage(error)
    }
  },

  // 初始化画布数据更新node edges
  initTreeToNodeAndToEdge: (initData, isVersion) => {
    const { saveCanvas } = get()
    const converTreeToNode = (node: NodeProps, parentId: string) => {
      const result = []
      result.push({
        data: {
          label: node.flag === 5 ? node.processor : `${node.name}`,
          id: node.id,
          parentId,
          builtIn: node.flag !== 5,
          expanded: true,
          error_code: 0,
          position: { x: 0, y: 0 },
          flag: node.flag,
          kind: 1,
          type: NodeType[node.flag as keyof typeof NodeType]
        },
        type: NodeType[node.flag as keyof typeof NodeType],
        id: node.id,
        position: { x: 0, y: 0 }
      })
      if (node.children && node.children.length > 0) {
        node.children.forEach((item: any) => {
          result.push(...converTreeToNode(item, node.id))
        })
      }
      return result
    }
    const nodeArray = converTreeToNode(initData, initData.id)

    const converTreeToEdges = (node: any) => {
      const links: any[] = []
      if (node.children && node.children.length > 0) {
        node.children.forEach((item: any) => {
          const source = node.id
          const target = item.id
          links.push({
            flag: node.flag,
            id: `${source}->${target}`,
            source,
            target,
            type: 'smoothstep',
            markerEnd: {
              type: MarkerType.ArrowClosed
            }
          })
          links.push(...converTreeToEdges(item))
        })
      }
      return links
    }
    const edgeArray = converTreeToEdges(initData)
    if (isVersion) {
      set({
        nodes: [...nodeArray],
        edges: edgeArray
      })
    }
    return saveCanvas(nodeArray, edgeArray, initData.id)
  },

  // 保存画布
  saveCanvas: async (nodes, edges, id) => {
    const { getSumNodeId } = get()
    // 计算校验和
    const sumId = getSumNodeId(nodes)

    // 使用pako进行压缩
    const jsonString = JSON.stringify({
      nodes: [...nodes],
      edges: [...edges]
    })

    const compressed = pako.deflate(jsonString, { to: 'string' })

    const compressedStringfy = JSON.stringify(compressed)

    const params = {
      id,
      checksum: sumId,
      canvas: compressedStringfy
    }

    set({ sumData: params.canvas })

    try {
      const res = await saveCanvasAsync(params)
      if (res.code === 0) return res
    } catch (error) {
      throwErrorMessage(error)
      return error
    }
  },

  // 清除画布
  clearCanvas: () => {
    set({ nodes: [], edges: [], platform_id: null })
  },

  // 返回画布信息
  getNode: () => {
    return get().nodes
  },
  getEdge: () => {
    return get().edges
  }
}))

export default useCanvasStore
