/* eslint-disable array-callback-return */
/* eslint-disable indent */
/* eslint-disable no-param-reassign */
import { create } from 'zustand'
import { Edge, MarkerType, applyEdgeChanges, applyNodeChanges, getOutgoers, updateEdge, Node, XYPosition, getConnectedEdges } from 'reactflow'
import crc32 from 'crc-32'
import { throwErrorMessage } from 'Src/util/message'
import { getCanvas, saveCanvasAsync } from 'Src/services/api/modelApi'
import { LowCodeStoreType } from './canvasStoreType'
import Layout from '../../ModelingMaterials/useAutoLayout'
import { LeftAndRightStore } from '../ModelLeftAndRight/leftAndRightStore'
import { LeftListStore } from '../ModeleLeftListStore/LeftListStore'

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
  deleteNode: [],
  deleteNodeInfo: { node: {}, visibility: false },
  setNodes: (nodes: Node[]) => {
    set({ nodes })
  },

  setEdges: (edges: Edge[]) => {
    set({ edges })
  },

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

  addEdge: async connection => {
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
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20
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
      // 如果外设和数据处理器连接,更新数据处理器外设的状态  1.调用更新数据处理器接口 2.修改右侧属性接口数据
      await LeftAndRightStore.getState().onChangeFn('rightDataHandler', 'peripheral_id', +source)
      LeftAndRightStore.getState().updateHandlerData(true, { peripheral_id: +source })
      set({ edges: [...get().edges, item] })
    }

    if (LeftAndRightStore.getState().platform_id) {
      const id = LeftAndRightStore.getState().platform_id
      get().saveCanvas(String(id))
    }
  },

  updatateNodeInfo: (data: Record<string, any>, platform_id: string) => {
    const { error_code, name, id } = data
    set({
      nodes: get().nodes.map((Node: any) => {
        if (String(id) === Node.id && Node.data.label !== name) {
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

  // 点击按钮 自动布局 todo
  layout: nodes => {
    const { edges } = get()
    const targetNode = nodes.filter((item: any) => item.data.flag === 5)
    const info: any = []
    const getDeleteNodeAndAdge = (deleted: any, nodes: Node[], edges: Edge[]) => {
      // eslint-disable-next-line array-callback-return
      deleted.reduce((acc: any, node: any) => {
        const outgoers = getOutgoers(node, nodes, edges)
        if (outgoers.length > 0) {
          info.push(outgoers)
          getDeleteNodeAndAdge(outgoers, nodes, edges)
        }
      }, edges)
      return false
    }
    getDeleteNodeAndAdge(targetNode, nodes, edges)
    const layoutNode = info.concat(targetNode).flat(Infinity)
    const connectedEdges = getConnectedEdges(layoutNode, edges)
    const differentNode = nodes.filter((objA: { id: string }) => !layoutNode.some((objB: { id: string }) => objB.id === objA.id))
    const differentEdge = edges.filter(objA => !connectedEdges.some((objB: { id: string }) => objB.id === objA.id))
    const { nodeArray, edgesArray } = Layout(layoutNode, connectedEdges)
    const node = nodeArray.concat(differentNode)
    const edge = edgesArray.concat(differentEdge)
    // console.log(differentEdge, differentNode, nodeArray, edgesArray, bounds)
    set({ nodes: node, edges: edge })
  },

  // 创建节点
  createNode: data => {
    return set({ nodes: [...get().nodes, { ...data }] })
  },

  // 创建寄存器节点
  createRegisterNode: data => {
    const { id, register_id } = data

    // 1.直接过滤节点
    const parentNode = get().nodes.filter((item: any) => item?.parentId !== String(id))
    const parentEdge = get().edges.filter((item: any) => String(id) !== item.source)

    // 2.获取父节点位置信息
    const parentNodeInfo = get().nodes.find(item => {
      return item.id === String(id)
    })

    //  获取寄存器信息
    const registerInfo = LeftAndRightStore.getState().registerList.filter((item: any) => {
      return item.id === register_id.value
    })

    const position = parentNodeInfo?.position as XYPosition

    const newNode = {
      id: String(register_id.value),
      data: {
        label: registerInfo[0].name,
        id: String(register_id.value),
        error_code: 0,
        flag: 2,
        tabs: '',
        parentId: String(id)
      },
      parentId: String(id),
      type: switchNodeType(2),
      position: { ...position, y: position?.y + 60 }
    }

    const newEdge = {
      id: `${id}-${register_id.value}`,
      source: String(id),
      target: String(register_id.value),
      type: 'smoothstep',
      markerEnd: {
        type: MarkerType.ArrowClosed
      }
    }

    set({ nodes: [...parentNode, newNode], edges: [...parentEdge, newEdge] })
    const platform_idS = LeftAndRightStore.getState().platform_id
    return get().saveCanvas(String(platform_idS))
  },

  // 如果目标被折叠,调用此函数更新被遮挡目标Y轴
  updatePositionNode: (target, source) => {
    set({
      nodes: get().nodes.map(item => {
        if (item.id === source.id) {
          // 如果 item.id 与 source.id 相同，则使用 target 的位置
          return {
            ...item,
            position: { x: source.position.x, y: source.position.y }
          }
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
        deletable: false,
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
  },

  // 获取相关节点信息
  getDeleteNodeInfo: (deleted, nodes, edges) => {
    const info: Node[][] = []
    const getDeleteNodeAndAdge = (deleted: any, nodes: Node[], edges: Edge[]) => {
      // eslint-disable-next-line array-callback-return
      deleted.reduce((acc: any, node: any) => {
        const outgoers = getOutgoers(node, nodes, edges)
        if (outgoers.length > 0) {
          info.push(outgoers)
          getDeleteNodeAndAdge(outgoers, nodes, edges)
        }
      }, edges)
      return false
    }

    getDeleteNodeAndAdge(deleted, nodes, edges)
    set({ deleteNode: info })
  },

  // 画布的删除
  onNodesDelete: async (nodeData, edgesData, deletedArray, error_code) => {
    const deleteNodeInfo = get().deleteNode.concat(deletedArray).flat(Infinity) as any
    if (deletedArray.length === 1 && deletedArray[0].data.flag === 2) {
      await LeftAndRightStore.getState().getDataHandlerDetail(deletedArray[0].data.parentId)
      LeftAndRightStore.getState().updateHandlerData(true, { register_id: null })
    }
    const node = nodeData
      .map((Node1: any) => {
        const matchingItem = error_code.find((item2: any) => Node1.id === String(item2.id))
        if (matchingItem) {
          // eslint-disable-next-line no-param-reassign
          Node1.data.error_code = matchingItem.error_code
        }
        return Node1
      })
      .filter((item: { id: any }) => {
        return !deleteNodeInfo.some((data: { id: any; data: { flag: number } }) => {
          if (data.data.flag === 3 && item.id === data.id) {
            LeftAndRightStore.getState().getDataHandlerDetail(data.id)
            LeftAndRightStore.getState().updateHandlerData(true, { register_id: null, peripheral_id: null })
          }

          return data.id === item.id
        })
      })

    const edge = edgesData.filter((item: { target: any }) => {
      return !deleteNodeInfo.some((data: { id: any }) => data.id === item.target)
    })
    const platform_idS = LeftAndRightStore.getState().platform_id

    if (platform_idS) {
      // 保存画布
      get().setEdgesAndNodes(node, edge, String(platform_idS))
      LeftAndRightStore.getState().setSelect(platform_idS, 5)
    }
    LeftListStore.getState().getList('customPeripheral')
  }
}))
