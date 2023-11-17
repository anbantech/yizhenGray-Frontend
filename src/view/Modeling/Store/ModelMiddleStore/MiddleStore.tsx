import { getCanvas, newSetDataHander, newSetPeripheral, newSetRegister, newSetTimer, saveCanvasAsync } from 'Src/services/api/modelApi'
import { throwErrorMessage } from 'Src/util/message'
import crc32 from 'crc-32'
// import pako from 'pako'

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

import { create } from 'zustand'
import { AttributesType, NodeType, NodeZindex } from '../MapStore'

const pako = require('pako')

type RFState = {
  platform_id: null | string
  nodes: any
  edges: any
  menuStatusObj: { status: boolean; id: null | string }
  nodeId: null | number | string
  changeView: boolean
  canvasData: any
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  setChangeView: (val: boolean) => void
  setMenuStatus: (id: string) => void
  setOpenMenu: () => void
  getModelDetails: (id: number) => any
  setNodes: (nodesValue: any) => void
  setEdges: (edgesValue: Edge[]) => void
  getSumNodeId: (nodeArray: Node[]) => string
  setNodeId: (val: string | number | null) => void
  upDateNodesAndEdges: (newNode: Node[], newEdge: Edge[]) => void
  expandNode: (nodeId: string) => void
  addChildNode: (Node: NodeProps, parentId: string) => void
  getChildernNums: (id: string) => number
  createPeripheral: (
    params: any,
    fn: (val: number, tabs: string) => void,
    id: number,
    cancel: () => void,
    tabs: string,
    fn2: (val: string, id: string) => void
  ) => void
  createRegister: (
    params: any,
    fn: (val: number, tabs: string) => void,
    id: number,
    cancel: () => void,
    tabs: string,
    fn2: (val: string, id: string) => void
  ) => void
  createDataHandler: (
    params: any,
    fn: (val: number, tabs: string) => void,
    id: number,
    cancel: () => void,
    tabs: string,
    fn2: (val: string, id: string) => void
  ) => void
  createTimer: (
    params: any,
    fn: (val: number, tabs: string) => void,
    id: number,
    cancel: () => void,
    tabs: string,
    fn2: (val: string, id: string) => void
  ) => void
  createElement: (
    tabs: string,
    params: any,
    fn: (val: number, tabs: string) => void,
    id: number,
    cancel: () => void,
    fn2: (val: string, id: string) => void
  ) => void
  initTreeToNodeAndToEedg: (initData: any) => void
  zindexNode: (nodeId: string, zIndex: number) => void
  nodeTemplate: (node: NodeProps, parentId: string) => any
  edgeTemplate: (node: NodeProps, source: string, target: string) => any
  saveCanvas: (nodes: any[], edges: Edge[], id: string) => void
  clearNodeAndEdge: () => void
}

type NodeProps = {
  name: string
  id: string
  flag: 0 | 1 | 2 | 3 | 4 | 5
  children?: NodeProps[]
}
//  1. 外设 2. 寄存器 3.数据处理器 4.定时器，5 建模任务
const MiddleStore = create<RFState>((set, get) => ({
  platform_id: null,
  nodes: [],
  edges: [],
  canvasData: [],
  menuStatusObj: { status: false, id: null },
  nodeId: null,
  changeView: false,
  setMenuStatus: (id: string) => {
    set({ menuStatusObj: { status: !get().menuStatusObj.status, id } })
  },
  setOpenMenu: () => {
    set({ menuStatusObj: { status: false, id: null } })
  },

  setChangeView: val => {
    set({ changeView: val })
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
  // 节点模版
  nodeTemplate: (node: NodeProps, parentId: string) => {
    const newNode = {
      data: {
        label: `${node.name}`,
        id: String(node.id),
        expanded: false,
        position: { x: 0, y: 0 },
        draggable: false,
        flag: node.flag,
        zIndex: NodeZindex[node.flag as keyof typeof NodeZindex],
        parentId: String(parentId)
      },
      type: 'peripheralNode',
      id: String(node.id),
      position: { x: 0, y: 0 },
      draggable: false
    }
    return newNode
  },
  // 边模版
  edgeTemplate: (node: NodeProps, source: string, target: string) => {
    return {
      flag: node.flag,
      id: `${source}->${target}`,
      source,
      target,
      type: 'step',
      data: {
        label: 'edge label'
      }
    }
  },

  setNodeId: val => {
    set({ nodeId: val })
  },

  setNodes: nodesValue => {
    set({ nodes: nodesValue })
  },

  getChildernNums: (id: string) => {
    const res = get().nodes.filter((item: { data: { parentId: string } }) => {
      return item.data.parentId === id
    })
    return res.length
  },

  setEdges: (edgesValue: Edge[]) => {
    set({
      edges: edgesValue
    })
  },

  upDateNodesAndEdges: (newNode, newEdge) => {
    set({
      nodes: newNode,
      edges: newEdge
    })
  },

  expandNode: (nodeId: string) => {
    set({
      nodes: get().nodes.map((node: Node) => {
        if (node.id === nodeId) {
          // it's important to create a new object here, to inform React Flow about the changes
          return { ...node, data: { ...node.data, expanded: !node.data.expanded } }
        }
        return node
      })
    })
  },

  zindexNode: (nodeId: string, zIndex) => {
    set({
      nodes: get().nodes.map((node: Node) => {
        if (node.id === nodeId) {
          // it's important to create a new object here, to inform React Flow about the changes
          return { ...node, style: { ...node.style, zIndex } }
        }
        return node
      })
    })
  },

  addChildNode: (node: NodeProps, parentId: string) => {
    const { saveCanvas, platform_id } = get()
    const newNode = {
      data: {
        label: node.name,
        id: String(node.id),
        expanded: true,
        position: { x: 0, y: 0 },
        draggable: false,
        flag: node.flag,
        zIndex: NodeZindex[node.flag as keyof typeof NodeZindex],
        parentId: String(parentId)
      },
      type: 'peripheralNode',
      id: String(node.id),
      position: { x: 0, y: 0 },
      draggable: false
    }
    const newEdge = {
      id: `${String(parentId)}->${String(node.id)}`,
      type: 'step',
      data: { label: '12' },
      source: String(parentId),
      target: String(node.id)
    }
    const nodesOBJ = [...get().nodes, newNode]
    const edgesOBJ = [...get().edges, newEdge]
    saveCanvas(nodesOBJ, edgesOBJ, platform_id as string)
    set({
      nodes: [...get().nodes, newNode],
      edges: [...get().edges, newEdge]
    })
  },

  onNodesChange: (changes: NodeChange[]) => {
    const { nodes } = get()
    set({
      nodes: applyNodeChanges(changes, nodes)
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
  // 创建目标机时初始化节点和边
  initTreeToNodeAndToEedg: initData => {
    const { saveCanvas } = get()

    const converTreeToNode = (node: NodeProps, parentId: string) => {
      const result = []
      result.push({
        data: {
          label: `${node.name}`,
          id: node.id,
          parentId,
          expanded: false,
          position: { x: 0, y: 0 },
          draggable: false,
          flag: node.flag
        },
        type: NodeType[node.flag as keyof typeof NodeType],
        id: node.id,
        position: { x: 0, y: 0 },
        draggable: false,
        zIndex: NodeZindex[node.flag as keyof typeof NodeZindex]
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
            type: 'step',
            data: {
              label: 'edge label'
            }
          })
          links.push(...converTreeToEdges(item))
        })
      }
      return links
    }

    const edgeArray = converTreeToEdges(initData)
    saveCanvas(nodeArray, edgeArray, initData.id)
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
    try {
      const res = await saveCanvasAsync(params)
    } catch (error) {
      throwErrorMessage(error)
    }
  },

  // 初始化获取画布数据
  getModelDetails: async id => {
    if (!id) return

    set({ platform_id: String(id) })
    try {
      const res = await getCanvas(id)
      const decompressed = pako.inflate(res.data.canvas, { to: 'string' })
      const result = JSON.parse(decompressed)
      const nodesArray = result.nodes
      const edgesArray = result.edges
      if (nodesArray) {
        set({
          nodes: nodesArray,
          edges: edgesArray
        })
      }
    } catch (error) {
      throwErrorMessage(error)
    }
  },

  createPeripheral: async (params, fn, id, cancel, tabs, fn2) => {
    const { addChildNode } = get()
    try {
      const res = await newSetPeripheral(params)
      if (res.code !== 0) return
      if (res.data) {
        fn(id, tabs)
        cancel()
        addChildNode(res.data, res.data.platform_id)
      }
      fn2(AttributesType[res.data.flag as keyof typeof AttributesType], res.data.id)
    } catch (error) {
      throwErrorMessage(error)
    }
  },

  createRegister: async (params, fn, id, cancel, tabs, fn2) => {
    const { addChildNode } = get()
    try {
      const res = await newSetRegister(params)
      if (res.data) {
        fn(id, tabs)
        cancel()
        addChildNode(res.data, res.data.peripheral_id)
        fn2(AttributesType[res.data.flag as keyof typeof AttributesType], res.data.id)
      }
    } catch (error) {
      throwErrorMessage(error)
    }
  },

  createDataHandler: async (params, fn, id, cancel, tabs, fn2) => {
    try {
      const res = await newSetDataHander(params)
      if (res.data) {
        fn(id, tabs)
        cancel()
      }
    } catch (error) {
      throwErrorMessage(error)
    }
  },

  createTimer: async (params, fn, id, cancel, tabs, fn2) => {
    try {
      const res = await newSetTimer(params)
      if (res.data) {
        fn(id, tabs)
        cancel()
      }
    } catch (error) {
      throwErrorMessage(error)
    }
  },

  createElement: (tabs, params, fn, id, cancel, fn2) => {
    const { createPeripheral, createRegister, createDataHandler, createTimer } = get()
    const componentFunctions = {
      customMadePeripheral: createPeripheral,
      processor: createRegister,
      dataHandlerNotReferenced: createDataHandler,
      time: createTimer
    }
    componentFunctions[tabs as keyof typeof componentFunctions](params, fn, id, cancel, tabs, fn2)
  },
  clearNodeAndEdge: () => {
    set({ nodes: [], edges: [] })
  }
}))

export default MiddleStore
