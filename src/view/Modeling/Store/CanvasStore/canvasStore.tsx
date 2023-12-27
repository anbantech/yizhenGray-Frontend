import { create } from 'zustand'
import { applyEdgeChanges, applyNodeChanges } from 'reactflow'
import crc32 from 'crc-32'
import { throwErrorMessage } from 'Src/util/message'
import { getCanvas, saveCanvasAsync } from 'Src/services/api/modelApi'
import { LowCodeStoreType } from './canvasStoreType'

const pako = require('pako')

export const LowCodeStore = create<LowCodeStoreType>((set, get) => ({
  nodes: [],
  edges: [],
  onNodesChange(changes) {
    set({
      nodes: applyNodeChanges(changes, get().nodes)
    })
  },
  onEdgesChange(changes) {
    set({
      edges: applyEdgeChanges(changes, get().edges)
    })
  },

  addEdge(data) {},
  // 创建节点
  createNode(data) {},

  // 创建目标机时,生成原点,和 修改节点
  createTargetNode(data) {
    const { processor, id, flag } = data
    const node = [
      {
        data: {
          label: processor,
          id: String(id),
          error_code: 0,
          flag
        },
        type: 'TargetNode',
        id: String(id),
        position: { x: 0, y: 0 }
      }
    ]
    return get().saveCanvas(String(id), [...node])
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
  saveCanvas: async (id, node, edge) => {
    const { getSumNodeId } = get()
    // 计算校验和
    const sumId = getSumNodeId(node ?? [])
    // 使用pako进行压缩
    const jsonString = JSON.stringify({
      nodes: node,
      edges: edge
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
  }
}))
