// import { create } from 'zustand'
// import ModelDrawStoreType from './ModleStore'

import { create } from 'zustand'
import { produce } from 'immer'
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
  HeaderStoreParams,
  PublicAttributesStoreParams,
  RightDetailsAttributesStoreParams,
  FormItemCheckStoreParams
} from './ModleStore'

// import { message } from 'antd'

interface MyObject {
  [key: string]: any
}

type RFState = {
  nodes: any
  edges: Edge[]
  nodeId: null | number | string
  changeView: boolean
  setChangeView: (val: boolean) => void
  canvasData: any
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  targetId: null | number
  setTargetId: (id: number) => void
  getModelDetails: (id: number) => any
  setNodes: (nodesValue: any) => void
  setEdges: (edgesValue: Edge[]) => void
  setNodeId: (val: string | number | null) => void
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
  nodeId: null,
  changeView: false,
  setChangeView: val => {
    set({ changeView: val })
  },
  canvasData: [],
  targetId: null,
  setTargetId: id => {
    set({ targetId: id })
  },
  setNodeId: val => {
    set({ nodeId: val })
  },
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
  converTreeToNode: () => {},
  getModelDetails: async id => {
    if (!id) return
    try {
      const res = await getCanvas(id)
      if (res.data.canvas) {
        set({ canvasData: res.data.canvas })
        const converTreeToNode = (node: any) => {
          const result = []
          result.push({
            data: {
              label: `Node ${node.name}`,
              id: node.id,
              nums: node.children?.length,
              expanded: false,
              position: { x: 0, y: 0 },
              draggable: false,
              flag: node.flag
            },
            type: node.flag === 5 ? 'targetNode' : node.flag === 1 ? 'peripheralNode' : node.flag === 2 ? 'registerNode' : 'custom',
            id: node.id,
            position: { x: 0, y: 0 },
            draggable: false
          })
          if (node.children && node.children.length > 0) {
            node.children.forEach((item: any) => {
              result.push(...converTreeToNode(item))
            })
          }
          return result
        }
        const nodeArray = converTreeToNode(res.data.canvas)
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
  getModelListDetails: async (id: number) => {
    try {
      const res = await getTargetDetails(id)
      if (res.data) {
        const { processor_cnt, timer_cnt, default_peripheral_cnt, peripheral_cnt } = res.data
        set({
          cusomMadePeripheralNums: peripheral_cnt,
          timerNums: timer_cnt,
          handlerDataNums: processor_cnt,
          boardPeripheralNums: default_peripheral_cnt
        })
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

// 顶部操作栏 创建定时器 外设 数据处理器
const HeaderStore = create<HeaderStoreParams>((set, get) => ({
  checkSum: '0',
  tabs: '',
  setCheckSum: val => {
    set({ checkSum: val })
  },
  setTabs: val => {
    set({ tabs: val })
  },
  unSetTabs: () => {
    set({ tabs: '' })
  },
  createPeripheral: async (idSum, params) => {
    try {
      const res = await newSetPeripheral(params)
    } catch (error) {
      throwErrorMessage(error)
    }
  },
  createRegister: async (idSum, params) => {
    try {
      const res = await newSetRegister(params)
    } catch (error) {
      throwErrorMessage(error)
    }
  },
  createDataHandler: async (idSum, params) => {
    try {
      const res = await newSetDataHander(params)
    } catch (error) {
      throwErrorMessage(error)
    }
  },
  createTimer: async (idSum, params) => {
    try {
      const res = await newSetTimer(params)
    } catch (error) {
      throwErrorMessage(error)
    }
  },
  createElement: (idSum, params) => {
    const { tabs, createPeripheral, createRegister, createDataHandler, createTimer } = get()
    switch (tabs) {
      case 'customMadePeripheral':
        createPeripheral(idSum, params)
        break
      case 'processor':
        createRegister(idSum, params)
        break
      case 'dataHandlerNotReferenced':
        createDataHandler(idSum, params)
        break
      case 'time':
        createTimer()
        break
      default:
        break
    }
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
  btnStatus: true,
  baseBtnStatus: true,
  setBaseBtnStatus: val => {
    set({ baseBtnStatus: val })
  },

  setBtnStatus: val => {
    set({ btnStatus: val })
  },
  optionalParameters: {
    name: {
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
    kind: {
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

  // 外设表单
  changeValuePeripheralForm: (item, title, val) => {
    const { checkName, checkHex, setBtnStatus } = get()
    if (item === 'name') {
      return checkName(item, title, val)
    }
    if (item === 'base_address' || item === 'address_length') {
      const hexResult = checkHex(val)
      if (!hexResult) {
        setBtnStatus(true)
        set(state =>
          produce(state, draft => {
            const updatedDraft = draft
            ;(updatedDraft.optionalParameters as any)[item].validateStatus = 'error'
            ;(updatedDraft.optionalParameters as any)[item].errorMsg = `请输入由0-9,A-F(或a-f)组成的16进制数`
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
        if ((updatedDraft.optionalParameters as any)[item] !== undefined) {
          ;(updatedDraft.optionalParameters as any)[item].value = val
        }
      })
    )
  },

  // 数据处理器表单
  changeValueHanderlForm: (item, title, val) => {
    const { checkName } = get()
    if (item === 'name') {
      checkName(item, title, val)
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
        set(state =>
          produce(state, draft => {
            const updatedDraft = draft
            ;(updatedDraft.optionalParameters as any)[item].validateStatus = 'error'
            ;(updatedDraft.optionalParameters as any)[item].errorMsg = `请输入由0-9,A-F(或a-f)组成的16进制数`
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
          ;(updatedDraft.optionalParameters as any)[item].errorMsg = `${title}名称由汉字、数字、字母和下划线组成`
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

    if (!checkNameFormat(value) || !checkNameLength(value)) {
      return false
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

    try {
      const res = await validatorParams(type === 'address_length' ? { ...address_length } : type === 'base_address' ? { ...base_address } : params)
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
    const reg = /^[\w\u4E00-\u9FA5]+$/
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
export {
  useFlowStore,
  formItemParamsCheckStore,
  useNewModelingStore,
  publicAttributes,
  useModelDetailsStore,
  HeaderStore,
  RightDetailsAttributesStore
}
