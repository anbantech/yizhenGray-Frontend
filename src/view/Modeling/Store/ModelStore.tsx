// import { create } from 'zustand'
// import ModelDrawStoreType from './ModleStore'

import { create } from 'zustand'
import { produce } from 'immer'
import crc32 from 'crc-32'
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
import {
  createModelTarget,
  deleteModelTarget,
  getCanvas,
  getCustomMadePeripheralList,
  getModelTargetList,
  getProcessorList,
  getTargetDetails,
  getTimerList,
  newSetDataHander,
  newSetPeripheral,
  newSetRegister,
  newSetTimer,
  updateModelTarget,
  validatorParams
} from 'Src/services/api/modelApi'
import { getPortList } from 'Src/services/api/excitationApi'
import { throwErrorMessage } from 'Src/util/message'

import {
  ModelDetails,
  NewModelListStore,
  PublicAttributesStoreParams,
  RightDetailsAttributesStoreParams,
  FormItemCheckStoreParams
} from './ModleStore'

// import { message } from 'antd'

interface MyObject {
  object: string
  platform_id: number
  [key: string]: any
}

type RFState = {
  nodes: any
  edges: any
  menuStatusObj: { status: boolean; id: null | string }
  nodeId: null | number | string
  changeView: boolean
  setChangeView: (val: boolean) => void
  setMenuStatus: (id: string) => void
  setOpenMenu: () => void
  canvasData: any
  itemNodes: any
  itemEdges: any
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  targetId: null | number
  setNodeAndSetEdge: (node: any, edge: any) => void
  setTargetId: (id: number) => void
  getModelDetails: (id: number) => any
  setNodes: (nodesValue: any) => void
  setEdges: (edgesValue: Edge[]) => void
  getSumNodeId: () => void
  setNodeId: (val: string | number | null) => void
  upDateNodesAndEdges: (newNode: Node[], newEdge: Edge[]) => void
  expandNode: (nodeId: string) => void
  addChildNode: (info: any) => void
  createPeripheral: (params: any, fn: (val: number, tabs: string) => void, id: number, cancel: () => void, tabs: string) => void
  createRegister: (params: any, fn: (val: number, tabs: string) => void, id: number, cancel: () => void, tabs: string) => void
  createDataHandler: (params: any, fn: (val: number, tabs: string) => void, id: number, cancel: () => void, tabs: string) => void
  createTimer: (params: any, fn: (val: number, tabs: string) => void, id: number, cancel: () => void, tabs: string) => void
  createElement: (tabs: string, params: any, fn: (val: number, tabs: string) => void, id: number, cancel: () => void) => void
  zindexNode: (nodeId: string, zIndex: number) => void
}

const titleMap = {
  寄存器: 'register',
  数据处理器: 'processor',
  定时器: 'timer',
  外设: 'peripheral'
}

const checkAsyncMap = {
  peripheral: ['name', 'base_address'],
  timer: ['name'],
  processor: ['name', 'port'],
  register: ['name', 'relative_address']
}
// this is our useStore hook that we can use in our components to get parts of the store and call actions
// 目标机列表 侧边栏 顶部操作栏 右侧属性  表单校验 公共属性
const useFlowStore = create<RFState>((set, get) => ({
  nodes: [],
  edges: [],
  itemNodes: [],
  itemEdges: [],
  menuStatusObj: { status: false, id: null },
  setMenuStatus: (id: string) => {
    set({ menuStatusObj: { status: !get().menuStatusObj.status, id } })
  },
  setOpenMenu: () => {
    set({ menuStatusObj: { status: false, id: null } })
  },
  nodeId: null,
  changeView: false,
  setChangeView: val => {
    set({ changeView: val })
  },
  setNodeAndSetEdge: (nodes, edges) => {
    set({ itemNodes: nodes, itemEdges: edges })
  },
  // 获取节点id
  getSumNodeId: () => {
    const { nodes } = get()
    if (nodes.length === 0) return
    const idArray = nodes.map((item: { id: string }) => item.id).join(',')
    // eslint-disable-next-line no-bitwise
    const crc32Value = crc32.str(idArray) >>> 0
    const hex = crc32Value.toString(16).toUpperCase()
    return hex
  },
  canvasData: [],
  targetId: null,
  setTargetId: id => {
    set({ targetId: id })
  },
  setNodeId: val => {
    set({ nodeId: val })
  },
  setNodes: nodesValue => {
    set({ nodes: nodesValue })
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
  addChildNode: (node: any) => {
    const newNode = {
      data: {
        label: node.name,
        id: String(node.id),
        nums: 0,
        expanded: true,
        position: { x: 0, y: 0 },
        draggable: false,
        flag: 1,
        zIndex: 1002
      },
      type: 'peripheralNode',
      id: String(node.id),
      parentNode: String(node.platform_id),
      position: { x: 0, y: 0 },
      draggable: false
    }
    const newEdge = {
      id: `${String(node.platform_id)}->${String(node.id)}`,
      type: 'step',
      data: { label: '12' },
      source: String(node.platform_id),
      target: String(node.id)
    }
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
  converTreeToNode: () => {},
  // 初始化获取画布数据
  getModelDetails: async id => {
    if (!id) return
    try {
      const res = await getCanvas(id)
      if (res.data.canvas) {
        set({ canvasData: res.data.canvas })
        const converTreeToNode = (node: any, parentId: number) => {
          const result = []
          result.push({
            data: {
              label: `Node ${node.name}`,
              id: node.id,
              parentId,
              nums: node.children?.length,
              expanded: false,
              position: { x: 0, y: 0 },
              draggable: false,
              flag: node.flag
            },
            type: node.flag === 5 ? 'targetNode' : node.flag === 1 ? 'peripheralNode' : node.flag === 2 ? 'registerNode' : 'custom',
            id: node.id,
            position: { x: 0, y: 0 },
            draggable: false,
            zIndex: node.flag === 5 ? 1003 : node.flag === 1 ? 1002 : node.flag === 2 ? 1001 : 1001
          })
          if (node.children && node.children.length > 0) {
            node.children.forEach((item: any) => {
              result.push(...converTreeToNode(item, node.id))
            })
          }
          return result
        }
        const nodeArray = converTreeToNode(res.data.canvas, res.data.canvas.id)
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
        const edgeArray = converTreeToEdges(res.data.canvas)
        set({ nodes: [...nodeArray], edges: [...edgeArray] })
      }
    } catch {}
  },
  createPeripheral: async (params, fn, id, cancel, tabs) => {
    const { addChildNode } = get()
    try {
      const res = await newSetPeripheral(params)
      if (res.code !== 0) return
      if (res.data) {
        fn(id, tabs)
        cancel()
      }
      addChildNode(res.data)
    } catch (error) {
      throwErrorMessage(error)
    }
  },
  createRegister: async (params, fn, id, cancel, tabs) => {
    try {
      const res = await newSetRegister(params)
      if (res.data) {
        fn(id, tabs)
        cancel()
      }
    } catch (error) {
      throwErrorMessage(error)
    }
  },
  createDataHandler: async (params, fn, id, cancel, tabs) => {
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
  createTimer: async (params, fn, id, cancel, tabs) => {
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
  createElement: (tabs, params, fn, id, cancel) => {
    const { createPeripheral, createRegister, createDataHandler, createTimer } = get()
    const componentFunctions = {
      customMadePeripheral: createPeripheral,
      processor: createRegister,
      dataHandlerNotReferenced: createDataHandler,
      time: createTimer
    }
    componentFunctions[tabs as keyof typeof componentFunctions](params, fn, id, cancel, tabs)
  }
}))

// 目标机列表,建模首页
const useNewModelingStore = create<NewModelListStore>((set, get) => ({
  total: 0,
  modelId: null,
  loading: false,
  modelList: [],
  params: {
    key_word: '',
    page: 1,
    page_size: 10,
    sort_field: 'create_time',
    sort_order: 'descend'
  },
  initParams: () => {
    set({
      params: {
        key_word: '',
        page: 1,
        page_size: 10,
        sort_field: 'create_time',
        sort_order: 'descend'
      }
    })
  },
  setKeyWords: (key_words: string) => {
    const { params } = get()
    set({ params: { ...params, key_word: key_words, page: 1 } })
  },
  setPage: (page: Record<string, number>) => {
    const { params } = get()
    set({ params: { ...params, ...page } })
  },
  getModelListDetails: async (id: number) => {
    const res = await getTargetDetails(id)
    return res
  },
  setModelId: (val: number) => {
    set({ modelId: val })
  },
  createTarget: async (params: { name: string; processor: string; desc?: string }) => {
    const res = await createModelTarget(params)
    return res
  },
  getModelTargetList: async () => {
    const { toggleFn, params } = get()
    try {
      toggleFn()
      const res = await getModelTargetList(params)
      if (res.data) {
        set({ modelList: [...res.data.results], total: res.data.total })
      }
      toggleFn()
    } catch (error) {
      toggleFn()
      throwErrorMessage(error)
    }
  },
  updateModelTargetList: async (params: { name: string; processor: string; desc?: string }) => {
    const { modelId } = get()
    const res = await updateModelTarget(modelId, params)
    return res
  },
  deleteModelTarget: async () => {
    const { modelId } = get()
    try {
      const res = await deleteModelTarget(`${modelId}`)
      return res
    } catch (error) {
      throwErrorMessage(error)
      return error
    }
  },

  toggleFn: () => {
    const { loading } = get()
    set({ loading: !loading })
  }
}))

// 侧边栏获取列表store
const useModelDetailsStore = create<ModelDetails>((set, get) => ({
  keyWord: '',
  foucsId: null,
  showNode: [],
  tabs: 'customMadePeripheral',
  fn: () => {},
  hasMoreData: true, // 共用
  cusomMadePeripheralNums: 0,
  timerNums: 0,
  handlerDataNums: 0,
  boardPeripheralNums: 0,
  cusomMadePeripheralListParams: {
    variety: '0',
    platform_id: 0,
    tag: '0',
    key_word: '',
    page: 1,
    page_size: 25,
    sort_field: 'create_time',
    sort_order: 'descend'
  },
  timerListParams: {
    platform_id: 0,
    key_word: '',
    page: 1,
    page_size: 25,
    sort_field: 'create_time',
    sort_order: 'descend'
  },
  processorListParams: {
    platform_id: 0,
    used: 'false',
    key_word: '',
    page: 1,
    page_size: 25,
    sort_field: 'create_time',
    sort_order: 'descend'
  },
  customMadePeripheralList: [],
  timerList: [],
  processorList: [],
  boardLevelPeripheralsList: [],
  setExpand: (val: any) => {
    const idArray: [] | string[] = []
    const extractIdsFromTree = (tree: any, resultArray: any[]) => {
      // 遍历树结构
      for (const node of tree) {
        // 提取当前节点的id并添加到结果数组
        resultArray.push(node.id)

        // 如果当前节点有子节点，递归调用该函数
        if (node.children && node.children.length > 0) {
          extractIdsFromTree(node.children, resultArray)
        }
      }
    }
    extractIdsFromTree(val, idArray)
    set({ showNode: idArray })
  },

  setItemExpand: val => {
    set({ showNode: val })
  },
  setParams: (tabs: string, val) => {
    const { processorListParams, timerListParams, cusomMadePeripheralListParams } = get()
    switch (tabs) {
      case 'time':
        set({ timerListParams: { ...timerListParams, ...val } })
        break
      case 'boardLevelPeripherals':
        set({ cusomMadePeripheralListParams: { ...cusomMadePeripheralListParams, ...val } })
        break
      case 'customMadePeripheral':
        set({ cusomMadePeripheralListParams: { ...cusomMadePeripheralListParams, ...val } })
        break
      case 'dataHandlerNotReferenced':
        set({ processorListParams: { ...processorListParams, ...val } })
        break
      default:
        break
    }
  },

  setTabs: val => {
    set({ tabs: val })
  },

  setTags: val => {
    const { cusomMadePeripheralListParams } = get()
    set({ cusomMadePeripheralListParams: { ...cusomMadePeripheralListParams, tag: val, page: 1, page_size: 10 } })
  },

  setHasMore: (val: boolean) => {
    set(() => ({
      hasMoreData: val
    }))
  },

  setFousId: (val: number) => {
    set({ foucsId: val })
  },
  setKeyWord: (val: string, tabs: string) => {
    const { cusomMadePeripheralListParams, processorListParams, setTags, timerListParams, setExpand } = get()
    if (!val) {
      setTags('0')
    }
    if (['', undefined].includes(val)) {
      setExpand([])
    }
    switch (tabs) {
      case 'customMadePeripheral':
        set({ cusomMadePeripheralListParams: { ...cusomMadePeripheralListParams, key_word: val } })
        break
      case 'boardLevelPeripherals':
        set({ cusomMadePeripheralListParams: { ...cusomMadePeripheralListParams, key_word: val } })
        break
      case 'dataHandlerNotReferenced':
        set({ processorListParams: { ...processorListParams, key_word: val } })
        break
      case 'time':
        set({ timerListParams: { ...timerListParams, key_word: val } })
        break
      default:
        break
    }
    set({ keyWord: val })
  },
  getCustomMadePeripheralStore: async (id: number) => {
    const { cusomMadePeripheralListParams, setExpand } = get()
    try {
      const params = { ...cusomMadePeripheralListParams, platform_id: id }
      const res = await getCustomMadePeripheralList(params)

      if (res.data) {
        set({ customMadePeripheralList: [...res.data.results] })
      }
      if (!['', undefined].includes(cusomMadePeripheralListParams.key_word) && cusomMadePeripheralListParams.tag === '0') {
        setExpand(res.data.results)
      }
      return res
    } catch (error) {
      throwErrorMessage(error, { 1006: '参数错误' })
      return error
    }
  },
  getBoardCustomMadePeripheralStore: async (id: number) => {
    const { cusomMadePeripheralListParams, setExpand } = get()
    try {
      const params = { ...cusomMadePeripheralListParams, platform_id: id, variety: '1' }
      const res = await getCustomMadePeripheralList(params)
      if (res.data) {
        set({ boardLevelPeripheralsList: [...res.data.results] })
      }
      if (!['', undefined].includes(cusomMadePeripheralListParams.key_word) && cusomMadePeripheralListParams.tag === '0') {
        setExpand(res.data.results)
      }
      return res
    } catch (error) {
      throwErrorMessage(error, { 1006: '参数错误' })
      return error
    }
  },
  getTimeListStore: async (id: number) => {
    const { timerListParams, setHasMore } = get()
    try {
      const params = { ...timerListParams, platform_id: id }
      const res = await getTimerList(params)
      if (res.data) {
        const newList = [...res.data.results]
        if (newList.length === 0) {
          setHasMore(false)
          set({ timerList: [...res.data.results] })
          return
        }
        if (newList.length === res.data.total) {
          setHasMore(false)
        } else {
          setHasMore(true)
        }
        set({ timerList: [...res.data.results] })
      }
      return res
    } catch (error) {
      throwErrorMessage(error, { 1006: '参数错误' })
      return error
    }
  },
  getProcessorListStore: async (id: number) => {
    const { processorListParams, setHasMore } = get()
    try {
      const params = { ...processorListParams, platform_id: id }
      const res = await getProcessorList(params)
      if (res.data) {
        const newList = [...res.data.results]
        if (newList.length === 0) {
          setHasMore(false)
          set({ processorList: [...res.data.results] })
          return
        }
        if (newList.length === res.data.total) {
          setHasMore(false)
        } else {
          setHasMore(true)
        }
        set({ processorList: [...res.data.results] })
      }
      return res
    } catch (error) {
      throwErrorMessage(error, { 1006: '参数错误' })
      return error
    }
  },
  getList: (val: string, id: number) => {
    // 根据val获取对应的数据
    const { getProcessorListStore, getCustomMadePeripheralStore, getTimeListStore, getBoardCustomMadePeripheralStore } = get()
    set({ tabs: val })
    switch (val) {
      case 'customMadePeripheral':
        getCustomMadePeripheralStore(id)
        break
      case 'boardLevelPeripherals':
        getBoardCustomMadePeripheralStore(id)
        break
      case 'dataHandlerNotReferenced':
        getProcessorListStore(id)
        break
      case 'time':
        getTimeListStore(id)
        break
      default:
        break
    }
  },
  baseKeyWordAndTagsGetList: (val: string, id: number) => {
    // 根据val获取对应的数据
    const { getProcessorListStore, getCustomMadePeripheralStore, getTimeListStore, getBoardCustomMadePeripheralStore } = get()
    switch (val) {
      case 'customMadePeripheral':
        getCustomMadePeripheralStore(id)
        break
      case 'boardLevelPeripherals':
        getBoardCustomMadePeripheralStore(id)
        break
      case 'dataHandlerNotReferenced':
        getProcessorListStore(id)
        break
      case 'time':
        getTimeListStore(id)
        break
      default:
        break
    }
  },

  // 侧边栏数量获取详情
  getModelListDetails: async (id: number, headertabs) => {
    const { tabs, getList } = get()
    try {
      // 获取详情
      const res = await getTargetDetails(id)
      if (res.data) {
        const { processor_cnt, timer_cnt, default_peripheral_cnt, peripheral_cnt } = res.data
        set({
          cusomMadePeripheralNums: peripheral_cnt,
          timerNums: timer_cnt,
          handlerDataNums: processor_cnt,
          boardPeripheralNums: default_peripheral_cnt
        })
        // 画布添加数据和左侧列表所选tabs是否一致 如果一致更新列表
        if (headertabs === tabs) {
          getList(tabs, id)
        }
      }
    } catch (error) {
      throwErrorMessage(error)
    }
  },

  clearKeyWord: fn => {
    set({ fn })
  },

  initStore: () => {
    set({
      keyWord: '',
      foucsId: null,
      hasMoreData: true, // 共用
      showNode: [],
      cusomMadePeripheralListParams: {
        variety: '0',
        platform_id: 0,
        tag: '0',
        key_word: '',
        page: 1,
        page_size: 20,
        sort_field: 'create_time',
        sort_order: 'descend'
      },
      timerListParams: {
        platform_id: 0,
        key_word: '',
        page: 1,
        page_size: 20,
        sort_field: 'create_time',
        sort_order: 'descend'
      },
      processorListParams: {
        platform_id: 0,
        used: 'false',
        key_word: '',
        page: 1,
        page_size: 20,
        sort_field: 'create_time',
        sort_order: 'descend'
      }
    })
  }
}))

// 右侧属性
const RightDetailsAttributesStore = create<RightDetailsAttributesStoreParams>(set => ({
  typeAttributes: 'Processor',
  setTypeDetailsAttributes: val => {
    set({ typeAttributes: val })
  }
}))

// 公共变量
const publicAttributes = create<PublicAttributesStoreParams>(set => ({
  portList: [],
  setPortList: async () => {
    try {
      const result = await getPortList()
      if (result.data) {
        const results = result.data
        set({ portList: results })
      }
      return result
    } catch (error) {
      throwErrorMessage(error)
    }
  }
}))

// 表单接口校验
const formItemParamsCheckStore = create<FormItemCheckStoreParams>((set, get) => ({
  tabs: '',
  setTabs: val => {
    set({ tabs: val })
  },

  unSetTabs: () => {
    const { initFormValue } = get()
    set({ tabs: '' })
    initFormValue()
  },

  optionalParameters: {
    name: {
      value: '',
      validateStatus: ''
    },
    kind: {
      value: '',
      validateStatus: ''
    },
    port: {
      value: '',
      validateStatus: ''
    },
    period: {
      value: '',
      validateStatus: ''
    },
    interrupt: {
      value: '',
      validateStatus: ''
    },
    base_address: {
      value: '',
      validateStatus: ''
    },
    address_length: {
      value: '',
      validateStatus: ''
    },
    relative_address: {
      value: '',
      validateStatus: ''
    },
    desc: {
      value: '',
      validateStatus: ''
    }
  },
  btnStatus: true,
  baseBtnStatus: true,
  setBaseBtnStatus: val => {
    set({ baseBtnStatus: val })
  },

  setBtnStatus: val => {
    set({ btnStatus: val })
  },

  // 外设表单
  changeValuePeripheralForm: (item, title, val) => {
    const { checkName, checkHex, setBtnStatus } = get()

    if (item === 'name') {
      checkName(item, title, val)
    }

    if (item === 'base_address' || item === 'address_length') {
      const hexResult = checkHex(val)
      if (!hexResult) {
        setBtnStatus(true)
        return set(state =>
          produce(state, draft => {
            const updatedDraft = draft
            ;(updatedDraft.optionalParameters as any)[item].validateStatus = 'error'
            ;(updatedDraft.optionalParameters as any)[item].errorMsg = `请输入由0-9,A-F(或a-f)组成的16进制数`
          })
        )
      }
      set(state =>
        produce(state, draft => {
          const updatedDraft = draft
          ;(updatedDraft.optionalParameters as any)[item].validateStatus = ''
          ;(updatedDraft.optionalParameters as any)[item].errorMsg = null
        })
      )

      const hexLength = val.trim().length
      if (hexLength % 2 !== 0) {
        const hexValue0 = `0${val}`
        return set(state =>
          produce(state, draft => {
            const updatedDraft = draft
            ;(updatedDraft.optionalParameters as any)[item].value = hexValue0
          })
        )
      }
    }
    set(state =>
      produce(state, draft => {
        const updatedDraft = draft
        ;(updatedDraft.optionalParameters as any)[item].value = val
      })
    )
  },

  // 数据处理器表单
  changeValueHanderlForm: (item, title, val, id?: number, isBlur?: boolean) => {
    const { checkName, getKey, setBtnStatus, optionalParameters } = get()

    const params = {
      object: titleMap[title as keyof typeof titleMap],
      platform_id: id as number,
      [item]: val
    }

    const asyncCheck = async (params: MyObject) => {
      try {
        const res = await validatorParams(params)
        if (res.code === 0) {
          set(state =>
            produce(state, draft => {
              const updatedDraft = draft
              ;(updatedDraft.optionalParameters as any)[item].validateStatus = 'success'
              ;(updatedDraft.optionalParameters as any)[item].errorMsg = null
            })
          )
        }
      } catch (error) {
        setBtnStatus(true)
        if (error.code === 1005) {
          set(state =>
            produce(state, draft => {
              const updatedDraft = draft
              ;(updatedDraft.optionalParameters as any)[type].validateStatus = 'error'
              ;(updatedDraft.optionalParameters as any)[type].errorMsg = `${title}名称重复,请修改`
            })
          )
        }
        if (error.code === 7020) {
          set(state =>
            produce(state, draft => {
              const updatedDraft = draft
              ;(updatedDraft.optionalParameters as any)[item].validateStatus = 'error'
              ;(updatedDraft.optionalParameters as any)[item].errorMsg = `${title}地址被使用,请修改`
            })
          )
        }
        if (error.code === 7019) {
          set(state =>
            produce(state, draft => {
              const updatedDraft = draft
              ;(updatedDraft.optionalParameters as any)[item].validateStatus = 'error'
              ;(updatedDraft.optionalParameters as any)[item].errorMsg = `${title}端口被使用,请修改`
            })
          )
        }
        return
      }
      if (getKey(titleMap[title as keyof typeof titleMap]) && optionalParameters.name?.value) {
        setBtnStatus(false)
      } else {
        setBtnStatus(true)
      }
    }
    if (item === 'name') {
      const res = checkName(item, title, val)
      if (isBlur && res) {
        asyncCheck(params)
      }
    }
    if (item === 'port') {
      set(state =>
        produce(state, draft => {
          const updatedDraft = draft
          ;(updatedDraft.optionalParameters as any)[item].validateStatus = 'validating'
          ;(updatedDraft.optionalParameters as any)[item].errorMsg = null
        })
      )
      asyncCheck(params)
    }
    set(state =>
      produce(state, draft => {
        const updatedDraft = draft
        ;(updatedDraft.optionalParameters as any)[item].value = val
      })
    )
  },

  //  寄存器表单
  changeValueRegisterForm: (item, title, val) => {
    const { checkName, checkHex, setBtnStatus } = get()

    if (item === 'name') {
      checkName(item, title, val)
    }
    if (item === 'relative_address') {
      const hexResult = checkHex(val)
      if (!hexResult) {
        setBtnStatus(true)
        return set(state =>
          produce(state, draft => {
            const updatedDraft = draft
            ;(updatedDraft.optionalParameters as any)[item].validateStatus = 'error'
            ;(updatedDraft.optionalParameters as any)[item].errorMsg = `请输入由0-9,A-F(或a-f)组成的16进制数`
          })
        )
      }
      set(state =>
        produce(state, draft => {
          const updatedDraft = draft
          ;(updatedDraft.optionalParameters as any)[item].validateStatus = ''
          ;(updatedDraft.optionalParameters as any)[item].errorMsg = null
        })
      )
      const hexLength = val.trim().length
      if (hexLength % 2 !== 0) {
        const hexValue0 = `0${val}`
        return set(state =>
          produce(state, draft => {
            const updatedDraft = draft
            ;(updatedDraft.optionalParameters as any)[item].value = hexValue0
          })
        )
      }
    }

    set(state =>
      produce(state, draft => {
        const updatedDraft = draft
        ;(updatedDraft.optionalParameters as any)[item].value = val
      })
    )
  },

  // 定时器表单
  changeValueTimerForm: (item, title, val) => {
    const { checkName, checkInterval, checkInterrupt, setBtnStatus } = get()

    if (item === 'name') {
      checkName(item, title, val)
    }
    if (item === 'period') {
      const intervalResult = checkInterval(val)
      if (!intervalResult) {
        setBtnStatus(true)
        set(state =>
          produce(state, draft => {
            const updatedDraft = draft
            ;(updatedDraft.optionalParameters as any)[item].validateStatus = 'error'
            ;(updatedDraft.optionalParameters as any)[item].errorMsg = `请输入0~65535的整数`
          })
        )
      } else {
        set(state =>
          produce(state, draft => {
            const updatedDraft = draft
            ;(updatedDraft.optionalParameters as any)[item].validateStatus = ''
            ;(updatedDraft.optionalParameters as any)[item].errorMsg = null
          })
        )
      }
    }
    if (item === 'interrupt') {
      const interruptResult = checkInterrupt(val)
      if (!interruptResult) {
        setBtnStatus(true)
        set(state =>
          produce(state, draft => {
            const updatedDraft = draft
            ;(updatedDraft.optionalParameters as any)[item].validateStatus = 'error'
            ;(updatedDraft.optionalParameters as any)[item].errorMsg = `请输入0~255的整数`
          })
        )
      } else {
        set(state =>
          produce(state, draft => {
            const updatedDraft = draft
            ;(updatedDraft.optionalParameters as any)[item].validateStatus = ''
            ;(updatedDraft.optionalParameters as any)[item].errorMsg = null
          })
        )
      }
    }
    set(state =>
      produce(state, draft => {
        const updatedDraft = draft
        ;(updatedDraft.optionalParameters as any)[item].value = val
      })
    )
  },

  // 检查名字
  checkName: (item, title, val) => {
    const { checkNameLength, checkNameFormat, setBtnStatus } = get()
    if (!checkNameLength(val)) {
      setBtnStatus(true)
      set(state =>
        produce(state, draft => {
          const updatedDraft = draft
          ;(updatedDraft.optionalParameters as any)[item].validateStatus = 'error'
          ;(updatedDraft.optionalParameters as any)[item].errorMsg = `${title}名称长度在2-20个字符之间`
        })
      )
      return false
    }
    if (!checkNameFormat(val)) {
      setBtnStatus(true)
      set(state =>
        produce(state, draft => {
          const updatedDraft = draft
          ;(updatedDraft.optionalParameters as any)[item].validateStatus = 'error'
          ;(updatedDraft.optionalParameters as any)[item].errorMsg = `${title}名称由数字、字母和下划线组成,不能以数字开头`
        })
      )
      return false
    }

    set(state =>
      produce(state, draft => {
        const updatedDraft = draft
        ;(updatedDraft.optionalParameters as any)[item].validateStatus = 'success'
        ;(updatedDraft.optionalParameters as any)[item].errorMsg = null
      })
    )
    return true
  },

  // 检查间隔
  checkInterval: (val: string) => {
    if (!val) return false
    const checkoutResult = Number(val) >= 0 && Number(val) <= 65535
    return checkoutResult
  },

  // 检查中断号
  checkInterrupt: (val: string) => {
    if (!val) return false
    const checkoutResult = Number(val) >= 0 && Number(val) <= 255
    return checkoutResult
  },

  getKey: (val: string) => {
    const { optionalParameters } = get()
    const res = checkAsyncMap[val as keyof typeof checkAsyncMap].every(item => {
      return optionalParameters[item as keyof typeof optionalParameters]?.validateStatus === 'success'
    })
    return res
  },

  // 异步校验
  checkFormValues: async (type, id, title, value) => {
    const { checkNameLength, checkNameFormat, setBtnStatus, optionalParameters, baseBtnStatus, getKey } = get()
    if (type === 'name') {
      if (!checkNameFormat(value) || !checkNameLength(value)) {
        return false
      }
    }
    set(state =>
      produce(state, draft => {
        const updatedDraft = draft
        ;(updatedDraft.optionalParameters as any)[type].validateStatus = 'validating'
        ;(updatedDraft.optionalParameters as any)[type].errorMsg = null
      })
    )

    const params = {
      object: titleMap[title as keyof typeof titleMap],
      platform_id: id,
      [type]: value
    }

    const base_address = {
      object: titleMap[title as keyof typeof titleMap],
      platform_id: id,
      [type]: value,
      address_length: optionalParameters.address_length?.value
    }

    const address_length = {
      object: titleMap[title as keyof typeof titleMap],
      platform_id: id,
      [type]: value,
      base_address: optionalParameters.base_address?.value
    }

    const relative_address = {
      object: titleMap[title as keyof typeof titleMap],
      platform_id: id,
      [type]: value,
      relative_address: optionalParameters.relative_address?.value
    }

    try {
      const res = await validatorParams(
        type === 'address_length'
          ? { ...address_length }
          : type === 'base_address'
          ? { ...base_address }
          : type === 'relative_address '
          ? { ...relative_address }
          : params
      )
      if (res.code === 0) {
        set(state =>
          produce(state, draft => {
            const updatedDraft = draft
            ;(updatedDraft.optionalParameters as any)[type].validateStatus = 'success'
            ;(updatedDraft.optionalParameters as any)[type].errorMsg = null
          })
        )
      }
    } catch (error) {
      setBtnStatus(true)
      if (error.code === 1005) {
        set(state =>
          produce(state, draft => {
            const updatedDraft = draft
            ;(updatedDraft.optionalParameters as any)[type].validateStatus = 'error'
            ;(updatedDraft.optionalParameters as any)[type].errorMsg = `${title}名称重复,请修改`
          })
        )
      }
      if (error.code === 7020) {
        set(state =>
          produce(state, draft => {
            const updatedDraft = draft
            ;(updatedDraft.optionalParameters as any)[type].validateStatus = 'error'
            ;(updatedDraft.optionalParameters as any)[type].errorMsg = `${title}地址被使用,请修改`
          })
        )
      }
    }

    if (getKey(titleMap[title as keyof typeof titleMap]) && !baseBtnStatus) {
      setBtnStatus(false)
    } else {
      setBtnStatus(true)
    }
  },

  //  校验是否为16进制字符串
  checkHex: (val: string) => {
    if (!val) return false
    const reg = /^(0x)?([\da-f]{1,8})$/i
    return reg.test(`0x${val}`)
  },

  // 检查名字格式
  checkNameFormat: (val: string) => {
    if (!val) return false
    const reg = /^[A-Z_a-z]\w*$/
    return reg.test(val)
  },

  // 检查名字长度
  checkNameLength: (val: string) => {
    if (!val) return false
    const length = val.length >= 2 && val.length <= 20
    return length
  },

  // 初始化数据
  initFormValue: () => {
    set({
      btnStatus: true,
      baseBtnStatus: true,
      optionalParameters: {
        name: {
          value: '',
          validateStatus: ''
        },
        kind: {
          value: '',
          validateStatus: ''
        },
        port: {
          value: '',
          validateStatus: ''
        },
        period: {
          value: '',
          validateStatus: ''
        },
        interrupt: {
          value: '',
          validateStatus: ''
        },
        base_address: {
          value: '',
          validateStatus: ''
        },
        address_length: {
          value: '',
          validateStatus: ''
        },
        peripheral_id: {
          value: '',
          validateStatus: ''
        },
        relative_address: {
          value: '',
          validateStatus: ''
        },
        desc: {
          value: '',
          validateStatus: ''
        }
      }
    })
  }
}))
export { useFlowStore, formItemParamsCheckStore, useNewModelingStore, publicAttributes, useModelDetailsStore, RightDetailsAttributesStore }
