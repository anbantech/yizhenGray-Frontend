import { Node, Edge } from 'reactflow'
import { CustomMadePeripheralListParams, ProcessorListParams, TimerListParams, paramsCheck } from 'Src/globalType/Param'

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
  getModelDetails: (number: id) => { nodeArray: any[]; edgeArray: any[] }
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
  foucsId: number | null
  cusomMadePeripheralListParams: CustomMadePeripheralListParams
  processorListParams: ProcessorListParams
  timerListParams: TimerListParams
  customMadePeripheralList: [] | CustomMadePeripheralListParams[]
  timerList: [] | TimerListParams[]
  processorList: [] | ProcessorListParams[]
  boardLevelPeripheralsList: [] | CustomMadePeripheralListParams[]
  cusomMadePeripheralNums: number
  timerNums: number
  handlerDataNums: number
  boardPeripheralNums: numbe
  hasMoreData: boolean
  fn: () => void
  setFousId: (val: number) => void
  clearKeyWord: (val: () => void) => any
  initStore: () => void
  setHasMore: (val: boolean) => void
  setParams: (tabs: string, val) => void
  setTabs: (val: string) => void
  setKeyWord: (val: string, tabs: string) => void
  baseKeyWordAndTagsGetList: (val: string, id: number) => void
  setTags: (val: string) => void
  getBoardCustomMadePeripheralStore: (id: number) => void
  getCustomMadePeripheralStore: (id: number) => void
  getProcessorListStore: (id: number) => void
  getTimeListStore: (id: number) => void
  getList: (val: string, id: number) => void
  getModelListDetails: (id: number, headertabs?: string) => void
  showNode: React.Key[] | []
  setExpand: (val: any) => void
  setItemExpand: (val: React.Key[]) => void
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

type valueParams = {
  value: number | string
  validateStatus?: '' | 'success' | 'error' | 'warning' | 'validating' | undefined
  errorMsg?: string | null
}

interface optionalParametersParams {
  name?: valueParams
  kind?: valueParams
  port?: valueParams
  period?: valueParams
  interrupt?: valueParams
  base_address?: valueParams
  address_length?: valueParams
  peripheral_id?: valueParams
  relative_address?: valueParams
  desc?: valueParams
}

export interface FormItemCheckStoreParams {
  tabs: string
  setTabs: (val: string) => void
  unSetTabs: () => void
  optionalParameters: optionalParametersParams
  changeValuePeripheralForm: (item: string, title: string, val: string) => void
  changeValueTimerForm: (item: string, title: string, val: string) => void
  checkFormValues: (type: string, id: number, title: string, value: string) => void
  changeValueRegisterForm: (item: string, title: string, val: string, id?: number) => void
  checkName: (item: string, title: string, val: string) => boolean
  changeValueHanderlForm: (item: string, title: string, val: string, id?: number, isBlur?: boolean) => void
  initFormValue: () => void
  getKey: (val: string) => boolean
  btnStatus: boolean
  baseBtnStatus: boolean
  setBaseBtnStatus: (val: boolean) => void
  setBtnStatus: (val: boolean) => void
  checkNameLength: (val: string) => boolean
  checkNameFormat: (val: string) => boolean
  checkInterval: (val: string) => boolean
  checkInterrupt: (val: string) => boolean
  checkHex: (val: string) => boolean
}
