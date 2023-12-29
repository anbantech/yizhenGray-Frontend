/* eslint-disable indent */
/* eslint-disable no-param-reassign */
import { create } from 'zustand'
import { MarkerType, applyEdgeChanges, applyNodeChanges, updateEdge } from 'reactflow'
import crc32 from 'crc-32'
import { throwErrorMessage } from 'Src/util/message'
import { getCanvas, saveCanvasAsync } from 'Src/services/api/modelApi'
import { LowCodeStoreType } from './canvasStoreType'
import Layout from '../../ModelingMaterials/useAutoLayout'

const pako = require('pako')

export function switchNodeType(flag: number) {
  switch (flag) {
    case 1:
      return 'peripheralNode'
    case 2:
      return 'registerNode'
    case 3:
      return 'HandlerNode'
    case 4:
      return 'TimerNode'
    default:
      return 'TargetNode'
  }
}

export const LowCodeStore = create<LowCodeStoreType>((set, get) => ({
  nodes: [],
  edges: [],
  deleteNodeInfo: { node: {}, visibility: false },

  setDeleNodeInfo: (node, visibility) => {
    set({ deleteNodeInfo: { node, visibility } })
  },

  onNodesChange: changes => {
    set({
      nodes: applyNodeChanges(changes, get().nodes)
    })
  },

  onEdgesChange: changes => {
    set({
      edges: applyEdgeChanges(changes, get().edges)
    })
  },

  onEdgeUpdate: (oldEdge, newConnection) => {
    const { source, target } = newConnection
    const sourceNode = get().nodes.find(item => item.id === source)
    const targetNode = get().nodes.find(item => item.id === target)

    if (sourceNode?.data.flag === 5 && [1, 4].includes(targetNode?.data.flag)) {
      set({
        edges: updateEdge(oldEdge, newConnection, get().edges)
      })
    }

    if (sourceNode?.data.flag === 1 && targetNode?.data.flag === 3) {
      set({
        edges: updateEdge(oldEdge, newConnection, get().edges)
      })
    }
  },

  addEdge: connection => {
    const { source, target } = connection
    // 获取链接的节点信息
    const sourceNode = get().nodes.find(item => item.id === source)
    const targetNode = get().nodes.find(item => item.id === target)

    const item = {
      id: `${source}-${target}`,
      source,
      target,
      type: 'smoothstep',
      markerEnd: {
        type: MarkerType.ArrowClosed
      }
    }
    const isEdge = get().edges.find(edge => edge.id === item.id)
    if (isEdge) {
      return
    }
    if (sourceNode?.data.flag === 5 && [1, 4].includes(targetNode?.data.flag)) {
      set({ edges: [...get().edges, item] })
    }

    if (sourceNode?.data.flag === 1 && targetNode?.data.flag === 3) {
      set({ edges: [...get().edges, item] })
    }
  },

  updatateNodeInfo: (data: Record<string, any>, platform_id: string) => {
    const { error_code, name, id } = data
    set({
      nodes: get().nodes.map((Node: any) => {
        if (String(id) === Node.id) {
          return { ...Node, data: { ...Node.data, label: name } }
        }
        const matchingItem = error_code.find((item2: any) => Node.id === String(item2.id))
        if (matchingItem) {
          return { ...Node, data: { ...Node.data, error_code: matchingItem.error_code } }
        }
        return Node
      })
    })
    get().saveCanvas(platform_id)
  },
  // 点击按钮 自动布局
  layout: () => {
    const { nodes, edges } = get()
    const { nodeArray, edgesArray } = Layout(nodes, edges)
    set({ nodes: nodeArray, edges: edgesArray })
  },

  // 创建节点
  createNode: data => {
    return set({ nodes: [...get().nodes, { ...data }] })
  },

  // 如果目标被折叠,调用此函数更新被遮挡目标Y轴
  updatePositionNode: (id, position) => {
    set({
      nodes: get().nodes.map(item => {
        if (item.id === id) {
          return { ...item, position }
        }
        return item
      })
    })
  },

  // 创建目标机时,生成原点,和 修改节点
  createTargetNode: data => {
    const { processor, id, flag } = data
    const node = [
      {
        data: {
          label: processor,
          id: String(id),
          error_code: 0,
          flag
        },
        type: switchNodeType(flag),
        id: String(id),
        position: { x: 0, y: 0 }
      }
    ]
    set({ nodes: node })
    return get().saveCanvas(String(id))
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

  // 保存画布
  saveCanvas: async id => {
    const { getSumNodeId } = get()
    // 计算校验和
    const sumId = getSumNodeId(get().nodes)
    // 使用pako进行压缩

    const jsonString = JSON.stringify({
      nodes: get().nodes,
      edges: get().edges
    })

    const compressed = pako.deflate(jsonString, { to: 'string' })
    const compressedStringfy = JSON.stringify(compressed)
    const params = {
      id,
      checksum: sumId,
      canvas: compressedStringfy
    }
    try {
      const res = await saveCanvasAsync(params)
      if (res.code === 0) return res
    } catch (error) {
      throwErrorMessage(error)
      return error
    }
  },

  // 进入页面 初始化 画布数据
  getModelDetails: async id => {
    if (!id) return
    try {
      const res = await getCanvas(id)
      if (res) {
        const deleteString = JSON.parse(res.data.canvas)
        const decompressed = pako.inflate(deleteString, { to: 'string' })
        const result = JSON.parse(decompressed)
        set({
          nodes: result.nodes ? result.nodes : [],
          edges: result.edges ? result.edges : []
        })
      }
    } catch (error) {
      throwErrorMessage(error)
    }
  },

  // 更新节点
  setEdgesAndNodes: (node, edge, id) => {
    set({ nodes: [...node], edges: [...edge] })
    get().saveCanvas(id)
  }
}))
