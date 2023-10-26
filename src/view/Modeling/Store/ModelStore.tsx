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
import {
  deleteModelTarget,
  getCustomMadePeripheralList,
  getModelTargetList,
  getProcessorList,
  getTimerList,
  newSetDataHander,
  newSetPeripheral,
  newSetRegister,
  newSetTimer,
  updateModelTarget
} from 'Src/services/api/modelApi'
import { getPortList } from 'Src/services/api/excitationApi'
import { throwErrorMessage } from 'Src/util/message'
import { ModelDetails, NewModelListStore, HeaderStoreParams, PublicAttributesStoreParams, RightDetailsAttributesStoreParams } from './ModleStore'

// import { message } from 'antd'

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
  setKeyWords: (key_words: string) => {
    const { params } = get()
    set({ params: { ...params, key_word: key_words, page: 1 } })
  },
  setPage: (page: Record<string, number>) => {
    const { params } = get()
    set({ params: { ...params, ...page } })
  },
  getModelList: () => {},
  setModelId: (val: number) => {
    set({ modelId: val })
  },
  getModelTargetList: async () => {
    const { toggleFn } = get()
    try {
      toggleFn()
      const res = await getModelTargetList()
      if (res.data) {
        set({ modelList: [...res.data.results], total: res.data.total })
      }
      toggleFn()
    } catch (error) {
      toggleFn()
      throwErrorMessage(error)
    }
  },
  updateModelTargetList: async () => {
    const { modelId } = get()
    try {
      const res = await updateModelTarget(modelId)
    } catch {}
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
        set({ customMadePeripheralList: [...res.data.results] })
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
    const { getProcessorListStore, getCustomMadePeripheralStore, getTimeListStore } = get()
    set({ tabs: val })
    switch (val) {
      case 'customMadePeripheral':
        getCustomMadePeripheralStore(id)
        break
      case 'boardLevelPeripherals':
        getCustomMadePeripheralStore(id)
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

export { useStore, useNewModelingStore, publicAttributes, useModelDetailsStore, HeaderStore, RightDetailsAttributesStore }
