import { getCanvas, newSetDataHander, newSetPeripheral, newSetRegister, newSetTimer, saveCanvasAsync } from 'Src/services/api/modelApi'
import { throwErrorMessage } from 'Src/util/message'
import crc32 from 'crc-32'
// import pako from 'pako'

import { Connection, Edge, EdgeChange, Node, NodeChange, addEdge, applyNodeChanges, applyEdgeChanges, updateEdge } from 'reactflow'

import { create } from 'zustand'

import { AttributesType, NodeType, NodeZindex } from '../MapStore'
import { useLeftModelDetailsStore } from '../ModelStore'
import { RFState } from '../ModleStore'

// 切换tabs 并且拉数据
const setTabsFn = useLeftModelDetailsStore.getState().setTabs
export const getAll = useLeftModelDetailsStore.getState().getAllPeripheral

const pako = require('pako')

type NodeProps = {
  name: string
  id: string
  flag: 0 | 1 | 2 | 3 | 4 | 5
  error_code: number
  processor: string
  children?: NodeProps[]
}

//  1. 外设 2. 寄存器 3.数据处理器 4.定时器，5 建模任务
const MiddleStore = create<RFState>((set, get) => ({
  platform_id: null,
  expandTreeArray: [],
  nodes: [],
  edges: [],
  sumData: null,
  canvasData: [],
  menuStatusObj: null,
  nodeId: null,
  changeView: false,
  leftListExpandArray: [],
  deleteInfo: { node: {}, visibility: false },
  upDateLeftExpandArrayFn: (val: string[]) => {
    set({ leftListExpandArray: val })
  },
  collapseOtherNode: id => {
    const hasThisNode = get().nodes.find((item: Node) => item.id === String(id))

    if (!hasThisNode) return
    const selectId: string[] = []

    const getAllParentId = (id: string, item: Node[]) => {
      item.map(element => {
        if (element.id === id && id !== element.data.parentId) {
          selectId.push(element.id)
          if (element.data.parentId) {
            getAllParentId(element.data.parentId, get().nodes)
          }
          return
        }
        return []
      })
    }
    getAllParentId(hasThisNode.id, get().nodes)

    set({ leftListExpandArray: selectId })
  },
  setMenuStatus: (id: string) => {
    if (id === get().menuStatusObj) {
      return set({ menuStatusObj: null })
    }
    set({ menuStatusObj: id })
  },

  setOpenMenu: () => {
    set({ menuStatusObj: null })
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

  expandNodeTree: (nodeId: string) => {
    set({
      nodes: get().nodes.map((node: Node) => {
        if (nodeId === node.id) {
          // it's important to create a new object here, to inform React Flow about the changes
          return { ...node, data: { ...node.data, expanded: !node.data.expanded } }
        }
        return node
      })
    })
  },
  expandNode: (nodeId: string[]) => {
    set({
      nodes: get().nodes.map((node: Node) => {
        if (nodeId.includes(node.id)) {
          // it's important to create a new object here, to inform React Flow about the changes
          return { ...node, data: { ...node.data, expanded: true } }
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

  // 非状态寄存器
  addChildNode: (node: NodeProps, parentId: string) => {
    const { saveCanvas, platform_id, expandNode } = get()
    const newNode = {
      data: {
        label: node.name,
        id: String(node.id),
        expanded: true,
        error_code: 0,
        position: { x: 0, y: 0 },
        draggable: false,
        builtIn: false,
        flag: node.flag,
        zIndex: NodeZindex[node.flag as keyof typeof NodeZindex],
        parentId: String(parentId),
        kind: 1
      },
      type: NodeType[node.flag as keyof typeof NodeType],
      zIndex: NodeZindex[node.flag as keyof typeof NodeZindex],
      id: String(node.id),
      position: { x: 0, y: 0 },
      draggable: false
    }
    const newEdge = {
      id: `${String(parentId)}->${String(node.id)}`,
      type: 'smoothstep',
      data: { label: '12' },
      source: String(parentId),
      target: String(node.id)
    }
    const nodesOBJ = [...get().nodes, newNode].map((Node1: Node) => {
      const matchingItem = ((node.error_code as unknown) as { error_code: number; id: string }[]).find((item2: any) => Node1.id === String(item2.id))

      if (matchingItem) {
        // eslint-disable-next-line no-param-reassign
        Node1.data.error_code = matchingItem.error_code
      }
      return Node1
    })
    const edgesOBJ = [...get().edges, newEdge]
    saveCanvas(nodesOBJ, edgesOBJ, platform_id as string)
    set({
      nodes: [...get().nodes, newNode],
      edges: [...get().edges, newEdge]
    })
    expandNode([String(parentId)])
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

  onEdgeUpdate: (oldEdge: Edge, newConnection: Connection) => {
    set({
      edges: updateEdge(oldEdge, newConnection, get().edges)
    })
  },
  // 创建目标机时初始化节点和边 非状态寄存器
  initTreeToNodeAndToEedg: (initData, isVersion) => {
    const { saveCanvas } = get()
    const converTreeToNode = (node: NodeProps, parentId: string) => {
      const result = []
      result.push({
        data: {
          label: node.flag === 5 ? node.processor : `${node.name}`,
          id: node.id,
          parentId,
          builtIn: node.flag !== 5,
          expanded: node.flag === 5,
          error_code: 0,
          position: { x: 0, y: 0 },
          draggable: false,
          flag: node.flag,
          kind: 1
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
            type: node.children.length > 1 ? 'smoothstep' : 'straight'
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

  // 初始化获取画布数据
  getModelDetails: async id => {
    if (!id) return
    const { initTreeToNodeAndToEedg } = get()
    set({ platform_id: String(id) })
    try {
      const res = await getCanvas(id)
      if (res.data.version === 0) {
        return initTreeToNodeAndToEedg(res.data.canvas, true)
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

  createPeripheral: async (params, fn, id, cancel, fn2) => {
    setTabsFn('customMadePeripheral')
    const { addChildNode } = get()
    try {
      const res = await newSetPeripheral(params)
      if (res.code !== 0) return
      if (res.data) {
        fn(id, 'customMadePeripheral')
        cancel()
        addChildNode(res.data, String(res.data.platform_id))
      }
      fn2(AttributesType[res.data.flag as keyof typeof AttributesType], String(res.data.id))
    } catch (error) {
      throwErrorMessage(error)
    }
  },

  updateRegisterNodeDraw: detailes => {
    const { nodes, expandNode, saveCanvas, platform_id } = get()
    const { peripheral_id, id, name, error_code, flag, kind } = detailes

    if (flag === 1) {
      const hasThisNode = nodes.some((item: Node) => name === item.data.label)
      if (hasThisNode) return
      const updatedNodes = get().nodes.filter((item: { id: string }) => item.id !== String(id))
      const updatedEdges = get().edges.filter((item: { target: string }) => item.target !== String(id))
      const newNode = {
        data: {
          label: `${name}`,
          id: String(id),
          parentId: String(flag === 1 ? platform_id : peripheral_id),
          builtIn: false,
          expanded: false,
          error_code: 0,
          position: { x: 0, y: 0 },
          draggable: false,
          flag
        },
        type: NodeType[flag as keyof typeof NodeType],
        id: String(id),
        position: { x: 0, y: 0 },
        draggable: false,
        zIndex: NodeZindex[flag as keyof typeof NodeZindex]
      }
      const newEdge = {
        flag,
        id: `${flag === 1 ? platform_id : peripheral_id}->${id}`,
        source: String(flag === 1 ? platform_id : peripheral_id),
        target: String(id),
        type: 'smoothstep'
      }
      set({
        nodes: [...updatedNodes, newNode].map((Node1: Node) => {
          const matchingItem = ((error_code as unknown) as any).find((item2: any) => Node1.id === String(item2.id))
          if (matchingItem) {
            // eslint-disable-next-line no-param-reassign
            Node1.data.error_code = matchingItem.error_code
          }
          return Node1
        }),
        edges: [...updatedEdges, newEdge]
      })
      expandNode([String(flag === 1 ? platform_id : peripheral_id), String(id)])
      saveCanvas([...get().nodes], [...get().edges], platform_id as string)
    } else {
      const hasNoStatusRegister = nodes.some((item: Node) => item.data.kind === kind)

      const hasThisNode = nodes.some((item: Node) => {
        return item.data.parentId === String(peripheral_id) && name === item.data.label
      })

      if (hasThisNode && hasNoStatusRegister) return

      if (!hasThisNode) {
        const updatedNodes = get().nodes.filter((item: { id: string }) => item.id !== String(id))
        const updatedEdges = get().edges.filter((item: { target: string }) => item.target !== String(id))
        const newNode = {
          data: {
            label: `${name}`,
            id: String(id),
            parentId: String(flag === 1 ? platform_id : peripheral_id),
            builtIn: false,
            expanded: false,
            error_code,
            position: { x: 0, y: 0 },
            draggable: false,
            flag
          },
          type: NodeType[flag as keyof typeof NodeType],
          id: String(id),
          position: { x: 0, y: 0 },
          draggable: false,
          zIndex: NodeZindex[flag as keyof typeof NodeZindex]
        }

        const newEdge = {
          flag,
          id: `${flag === 1 ? platform_id : peripheral_id}->${id}`,
          source: String(flag === 1 ? platform_id : peripheral_id),
          target: String(id),
          type: 'smoothstep'
        }
        set({
          nodes: [...updatedNodes, newNode].map((Node1: Node) => {
            const matchingItem = ((error_code as unknown) as any).find((item2: any) => Node1.id === String(item2.id))
            if (matchingItem) {
              // eslint-disable-next-line no-param-reassign
              Node1.data.error_code = matchingItem.error_code
            }
            return Node1
          }),
          edges: [...updatedEdges, newEdge]
        })
        expandNode([String(flag === 1 ? platform_id : peripheral_id), String(id)])
        saveCanvas([...get().nodes], [...get().edges], platform_id as string)
      }
      if (!hasNoStatusRegister) {
        let updatedNodes
        if (kind === 0) {
          updatedNodes = get()
            .nodes.filter((item: { data: any }) => item.data.parentId !== String(id))
            .map((node: { id: string; data: any }) => {
              if (node.id === id) {
                // it's important to create a new object here, to inform React Flow about the changes
                return { ...node, data: { ...node.data, kind } }
              }
              return node
            })
        } else {
          updatedNodes = get().nodes.map((node: { id: string; data: any }) => {
            if (node.id === id) {
              // it's important to create a new object here, to inform React Flow about the changes
              return { ...node, data: { ...node.data, kind } }
            }
            return node
          })
        }

        const updatedEdges = get().edges.filter((item: { source: string }) => item.source !== String(id))
        set({
          nodes: [...updatedNodes].map((Node1: Node) => {
            const matchingItem = ((error_code as unknown) as any).find((item2: any) => Node1.id === String(item2.id))
            if (matchingItem) {
              // eslint-disable-next-line no-param-reassign
              Node1.data.error_code = matchingItem.error_code
            }
            return Node1
          }),
          edges: [...updatedEdges]
        })
        expandNode([String(flag === 1 ? platform_id : peripheral_id), String(id)])
        saveCanvas([...get().nodes], [...get().edges], platform_id as string)
      }
    }
  },

  // 根据id更新节点和边
  baseOnUpdateNodeAndEdge: (preParentId, parentId, id, rightArrributesInfo) => {
    const { nodes, expandNode, saveCanvas, platform_id } = get()

    const hasThisNode = nodes.some((item: Node) => item.id === String(id))

    if (!parentId && !hasThisNode) return
    const newNode = {
      data: {
        label: `${rightArrributesInfo.name}`,
        id: String(id),
        parentId: String(parentId),
        builtIn: false,
        expanded: false,
        error_code: 0,
        position: { x: 0, y: 0 },
        draggable: false,
        flag: 3
      },
      type: NodeType[3 as keyof typeof NodeType],
      id: String(id),
      position: { x: 0, y: 0 },
      draggable: false,
      zIndex: NodeZindex[3 as keyof typeof NodeZindex]
    }

    const newEdge = {
      flag: 3,
      id: `${parentId}->${id}`,
      source: String(parentId),
      target: String(id),
      type: 'smoothstep'
    }

    const updatedNodes = get().nodes.filter((item: { id: string }) => item.id !== String(id))
    const updatedEdges = get().edges.filter((item: { target: string }) => item.target !== String(id))

    if ((!parentId && hasThisNode) || (parentId && hasThisNode)) {
      set({
        nodes: parentId ? [...updatedNodes, newNode] : [...updatedNodes],
        edges: parentId ? [...updatedEdges, newEdge] : [...updatedEdges]
      })
    }

    if (parentId && !hasThisNode) {
      set({
        nodes: [...get().nodes, newNode].map((Node1: Node) => {
          const matchingItem = ((rightArrributesInfo.error_code as unknown) as any).find((item2: any) => Node1.id === String(item2.id))
          if (matchingItem) {
            // eslint-disable-next-line no-param-reassign
            Node1.data.error_code = matchingItem.error_code
          }
          return Node1
        }),
        edges: [...get().edges, newEdge]
      })
    }
    expandNode([String(preParentId), String(parentId), String(id)])
    saveCanvas([...get().nodes], [...get().edges], platform_id as string)
  },

  // fn : 更新侧边栏 拉数据  cancel  关闭弹窗  addChildNode 画布中添加节点 非状态寄存器
  createRegister: async (params, fn, id, cancel, fn2) => {
    setTabsFn('customMadePeripheral')
    const { addChildNode, upDateLeftExpandArrayFn } = get()
    try {
      const res = await newSetRegister(params)
      if (res.data) {
        fn(id, 'customMadePeripheral')
        cancel()
        addChildNode(res.data, String(res.data.peripheral_id))
      }
      const { peripheral_id } = res.data
      const registerId = res.data.id
      // 生成打开树节点
      const TreeKeyArray = [String(registerId), String(peripheral_id)]
      upDateLeftExpandArrayFn([...TreeKeyArray])
      // 更新右侧数据详情
      fn2(AttributesType[res.data.flag as keyof typeof AttributesType], String(res.data.id))
    } catch (error) {
      throwErrorMessage(error)
    }
  },

  createDataHandler: async (params, fn, id, cancel, fn2) => {
    setTabsFn('dataHandlerNotReferenced')
    try {
      const res = await newSetDataHander(params)
      if (res.data) {
        fn(id, 'dataHandlerNotReferenced')
        cancel()
      }
      fn2(AttributesType[res.data.flag as keyof typeof AttributesType], String(res.data.id))
    } catch (error) {
      throwErrorMessage(error)
    }
  },

  createTimer: async (params, fn, id, cancel, fn2) => {
    setTabsFn('time')
    try {
      const res = await newSetTimer(params)
      if (res.data) {
        fn(id, 'time')
        cancel()
      }
      fn2(AttributesType[res.data.flag as keyof typeof AttributesType], String(res.data.id))
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
    componentFunctions[tabs as keyof typeof componentFunctions](params, fn, id, cancel, fn2)
  },

  clearNodeAndEdge: () => {
    set({ nodes: [], edges: [] })
  },

  // 更新画布中节点的名称
  updateNodeName: (id: string, typeAndValue) => {
    set({
      nodes: get().nodes.map((node: Node) => {
        if (node.id === id) {
          // it's important to create a new object here, to inform React Flow about the changes
          return { ...node, data: { ...node.data, ...typeAndValue } }
        }
        return node
      })
    })
  },

  // 保存画布并且更新数据
  saveCanvasAndUpdateNodeName: (id: string, platform_id, typeAndValue) => {
    const { saveCanvas, updateNodeName } = get()
    updateNodeName(id, typeAndValue)
    saveCanvas(get().nodes, get().edges, platform_id as string)
  },

  // 根据选中的id 展开画布子树,同时更新右侧属性
  selectIdExpandDrawTree: id => {
    const { platform_id, expandNode } = get()
    if (!platform_id) return
    if (id) {
      const NodeTreeArray = [String(platform_id), String(id)]
      expandNode([...NodeTreeArray])
    } else {
      expandNode([String(platform_id)])
    }
  },

  // 删除节点
  deleteTreeNode: (visibility, node) => {
    const { deleteInfo } = get()
    if (node) {
      set({ deleteInfo: { node, visibility } })
    } else {
      set({ deleteInfo: { ...deleteInfo, visibility } })
    }
  },

  // 更新节点属性
  updateNodeAttributeInfo: (Details: Record<string, any>) => {
    const { saveCanvas, platform_id } = get()
    const { error_code, name, id } = Details
    set({
      nodes: get().nodes.map((Node1: Node) => {
        if (String(id) === Node1.id && Node1.data.label !== name) {
          // eslint-disable-next-line no-param-reassign
          Node1.data.label = name
        }
        const matchingItem = error_code.find((item2: any) => Node1.id === String(item2.id))
        if (matchingItem) {
          // eslint-disable-next-line no-param-reassign
          Node1.data.error_code = matchingItem.error_code
        }
        return Node1
      })
    })
    saveCanvas([...get().nodes], [...get().edges], platform_id as string)
  }
}))

export { MiddleStore }
