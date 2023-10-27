import { Node, Edge } from 'reactflow'
import { CustomMadePeripheralListParams, ProcessorListParams, TimerListParams } from 'Src/globalType/Param'

type NodeItem = {
  id: string
  data: Record<string, string>
  position: Record<string, number>
  type: string
}

type EdgeItem = {
  id: string
  source: string
  target: string
}

type ModelData = {
  name: string
  id: string
  children?: ModelData[]
}

export interface ModelDrawStoreType {
  nodesItem: Node[]
  edgesItem: Edge[]
  setNodes: (nodes: Node[]) => void
  setEdges: (edges: Edge[]) => void
  getModelDetails: () => void
}

type ModelListType = {
  id: number
  name: string
  desc: string | null
  processor: string
}[]

type ModelParams = {
  key_word?: string
  page: number
  page_size: number
  sort_field?: string
  sort_order?: string
}

export interface NewModelListStore {
  modelId: number | null
  loading: boolean
  total: number
  params: ModelParams
  modelList: [] | ModelListType
  createTarget: (params: { name: string; processor: string; desc?: string }) => void
  setKeyWords: (key_words: string) => void
  setPage: (page: Record<string, number>) => void
  getModelTargetList: () => void
  getModelListDetails: (id: number) => void
  updateModelTargetList: (params: { name: string; processor: string; desc?: string }) => void
  deleteModelTarget: () => Promise
  setModelId: (val: number) => void
  toggleFn: () => void
  initParams: () => void
}

export interface ModelDetails {
  tabs: string
  keyWord: string
  cusomMadePeripheralListParams: CustomMadePeripheralListParams
  processorListParams: ProcessorListParams
  timerListParams: TimerListParams
  customMadePeripheralList: [] | CustomMadePeripheralListParams[]
  timerList: [] | TimerListParams[]
  processorList: [] | ProcessorListParams[]
  boardLevelPeripherals: [] | CustomMadePeripheralListParams[]
  cusomMadePeripheralNums: number
  timerNums: number
  handlerDataNums: number
  boardPeripheralNums: number
  setTabs: (val: string) => void
  setKeyWord: (val: string) => void
  getBoardCustomMadePeripheralStore: (id: number) => void
  getCustomMadePeripheralStore: (id: number) => void
  getProcessorListStore: (id: number) => void
  getTimeListStore: (id: number) => void
  getList: (val: string, id: number) => void
  getModelListDetails: (id: number) => void
}

export interface HeaderStoreParams {
  tabs: string
  setTabs: (val: string) => void
  unSetTabs: () => void
  params: any
  createPeripheral: () => void
  createRegister: () => void
  createDataHandler: () => void
  createTimer: () => void
}

export interface RightDetailsAttributesStoreParams {
  typeAttributes: string
  setTypeDetailsAttributes: (val: string) => void
}

// 端口列表
export interface PublicAttributesStoreParams {
  portList: any
  setPortList: () => void
}
