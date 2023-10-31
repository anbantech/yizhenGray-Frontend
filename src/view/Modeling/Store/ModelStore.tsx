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
  tabs: 'customMadePeripheral',
  cusomMadePeripheralNums: 0,
  timerNums: 0,
  handlerDataNums: 0,
  boardPeripheralNums: 0,
  cusomMadePeripheralListParams: {
    variety: '1',
    platform_id: 0,
    tag: '0',
    key_word: '',
    page: 1,
    page_size: 10,
    sort_field: 'create_time',
    sort_order: 'descend'
  },
  timerListParams: {
    platform_id: 0,
    key_word: '',
    page: 1,
    page_size: 10,
    sort_field: 'create_time',
    sort_order: 'descend'
  },
  processorListParams: {
    platform_id: 0,
    used: 'false',
    key_word: '',
    page: 1,
    page_size: 10,
    sort_field: 'create_time',
    sort_order: 'descend'
  },
  customMadePeripheralList: [],
  timerList: [],
  processorList: [],
  boardLevelPeripherals: [],
  keyWord: '',
  setTabs: val => {
    set({ tabs: val })
  },
  setKeyWord: val => {
    set({ keyWord: val })
  },
  getCustomMadePeripheralStore: async (id: number) => {
    const { cusomMadePeripheralListParams } = get()
    try {
      const params = { ...cusomMadePeripheralListParams, platform_id: id }
      const res = await getCustomMadePeripheralList(params)
      if (res.data) {
        set({ customMadePeripheralList: [...res.data] })
      }
    } catch (error) {
      throwErrorMessage(error, { 1006: '参数错误' })
    }
  },
  getBoardCustomMadePeripheralStore: async (id: number) => {
    const { cusomMadePeripheralListParams } = get()
    try {
      const params = { ...cusomMadePeripheralListParams, platform_id: id, variety: '1' }
      const res = await getCustomMadePeripheralList(params)
      if (res.data) {
        set({ boardLevelPeripherals: [...res.data.results] })
      }
    } catch (error) {
      throwErrorMessage(error, { 1006: '参数错误' })
    }
  },
  getTimeListStore: async (id: number) => {
    const { timerListParams } = get()
    try {
      const params = { ...timerListParams, platform_id: id }
      const res = await getTimerList(params)
      if (res.data) {
        set({ timerList: [...res.data.results] })
      }
    } catch (error) {
      throwErrorMessage(error, { 1006: '参数错误' })
    }
  },
  getProcessorListStore: async (id: number) => {
    const { processorListParams } = get()
    try {
      const params = { ...processorListParams, platform_id: id }
      const res = await getProcessorList(params)
      if (res.data) {
        set({ processorList: [...res.data.results] })
      }
    } catch (error) {
      throwErrorMessage(error, { 1006: '参数错误' })
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
  }
}))

const HeaderStore = create<HeaderStoreParams>((set, get) => ({
  tabs: '',
  params: {},
  setTabs: val => {
    set({ tabs: val })
  },
  unSetTabs: () => {
    set({ tabs: '' })
  },
  createPeripheral: async () => {
    const { params } = get()
    try {
      const res = await newSetPeripheral(params)
    } catch (error) {
      throwErrorMessage(error)
    }
  },
  createRegister: async () => {
    const { params } = get()
    try {
      const res = await newSetRegister(params)
    } catch (error) {
      throwErrorMessage(error)
    }
  },
  createDataHandler: async () => {
    const { params } = get()
    try {
      const res = await newSetDataHander(params)
    } catch (error) {
      throwErrorMessage(error)
    }
  },
  createTimer: async () => {
    const { params } = get()
    try {
      const res = await newSetTimer(params)
    } catch (error) {
      throwErrorMessage(error)
    }
  }
}))

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
    const { checkName, checkHex } = get()
    if (item === 'name') {
      checkName(item, title, val)
    }
    if (item === 'base_address' || item === 'address_length') {
      const hexResult = checkHex(val)
      if (!hexResult) {
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
    set(state =>
      produce(state, draft => {
        const updatedDraft = draft
        ;(updatedDraft.optionalParameters as any)[item].value = val
      })
    )
  },

  //  寄存器表单
  changeValueRegisterForm: (item, title, val) => {
    const { checkName, checkHex } = get()

    if (item === 'name') {
      checkName(item, title, val)
    }
    if (item === 'relative_address') {
      const hexResult = checkHex(val)
      if (!hexResult) {
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
    const { checkName, checkInterval, checkInterrupt } = get()

    if (item === 'name') {
      checkName(item, title, val)
    }
    if (item === 'period') {
      const intervalResult = checkInterval(val)
      if (!intervalResult) {
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
    const { checkNameLength, checkNameFormat } = get()
    if (!checkNameLength(val)) {
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
        ;(updatedDraft.optionalParameters as any)[item].validateStatus = ''
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

  // 异步校验
  checkFormValues: async params => {
    const res = await validatorParams(params)
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
        desc: ''
      }
    })
  }
}))
export { useStore, formItemParamsCheckStore, useNewModelingStore, publicAttributes, useModelDetailsStore, HeaderStore, RightDetailsAttributesStore }
