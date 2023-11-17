import { Node, Edge } from 'reactflow'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
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
  AllPeripheral: any
  AllPeripheralList: [] | CustomMadePeripheralListParams[]
  customMadePeripheralList: [] | CustomMadePeripheralListParams[]
  timerList: [] | TimerListParams[]
  processorList: [] | ProcessorListParams[]
  boardLevelPeripheralsList: [] | CustomMadePeripheralListParams[]
  cusomMadePeripheralNums: number
  timerNums: number
  handlerDataNums: number
  boardPeripheralNums: numbe
  hasMoreData: boolean
  targetDetails: {
    name: string
    processor: string
    desc: string
  }
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
  getAllPeripheral: (id: number) => void
  setExpand: (val: any) => void
  setItemExpand: (val: React.Key[]) => void
}

export interface RightDetailsAttributesStoreParams {
  typeAttributes: string
  focusNodeId: number | null | string
  rightArrributes: any
  register: any
  setTypeDetailsAttributes: (val: string, id: number) => void
  getTimerAttributes: (id: number) => void
  getDataHandlerAttributes: (id: number) => void
  getPeripheralAttributes: (id: number, type?: string) => void
  getRegisterAttributes: (id: number) => void
  getTargetAttributes: (val: number) => void
  rightAttrubutesMap: (type: string, val: number | string | null) => void
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

type valueParamsArray = {
  value: string[]
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
  updateFormValue: (item: string, val: string, title: string, errorMsg: string | null, validateStatus: string | null) => void
  optionalParameters: optionalParametersParams
  initFormValue: () => void
  onChange: (item: string, val: string, title: string, fn1?: (val: string) => boolean, fn2?: (val: string) => boolean) => void
  checkEveryItem: (optionalParameters: any) => boolean
}

export interface RightFormCheckStoreParams {
  platform_id: string | number | null
  registerList: any[]
  timer: {
    id: string | number | null
    name: valueParams
    period: valueParams
    interrupt: valueParams
  }
  processor: {
    id: string | number | null
    name: valueParams
    port: valueParams
    interrupt: valueParams
    sof: valueParams
    eof: valueParams
    algorithm: valueParamsArray
    length_member: valueParamsArray
    checksum_member: valueParamsArray
    framing_member: valueParamsArray
    peripheral_id: valueParams
    register_id: valueParams
  }
  peripheral: {
    id: string | number | null
    variety: number | null
    name: valueParams
    kind: valueParams
    address_length: valueParams
    base_address: valueParams
    desc: valueParams
  }

  register: {
    id: null
    name: valueParams
    peripheral_id: valueParams
    relative_address: valueParams
    kind: valueParams
    finish: valueParams
    variety: valueParams
    peripheral: any
    set_cmd: valueParams
    restore_cmd: valueParams
    set_value: valueParams
    restore_value: valueParams
    sr_id: valueParams
    sr_peri_id: valueParams
  }

  updateTimerFormValue: (title: string, type: string, value: any) => void
  frontendCheckoutName: (val: string, title: string, type: string, fn1: (val: string) => boolean, fn2: (val: string) => boolean) => void
  checkoutBase_addreeAndLength: (val: string, title: string, type: string, fn1: (val: string) => boolean) => void
  onBlurAsyncCheckoutNameFormValues: (val: string, title: name, type: string, fn1: () => void, params?: any) => void
  updateTimer: () => void
  updateProcessor: () => void
  updatePeripheral: () => void
  checkoutTimerPeriodAndInterrupt: (val: string, title: string, type: string, fn1: (val: string) => boolean) => void
  updateOnceFormValue: (val: string | string[] | CheckboxValueType[], title: string, type: string) => void
  checkoutProcessor: (val: string, title: string, type: string, fn1: (val: string) => boolean, fn2: () => void) => void
  checkEveryItemIsError: (val: string) => boolean
  filterObject: (obj: any) => any
  updateRegister: () => void
  messageInfoFn: (item, type, title, validateStatus, errorMsg, val) => any
}

export interface CheckUtilFnStoreParams {
  checkNameLength: (val: string) => boolean
  checkNameFormat: (val: string) => boolean
  checkInterval: (val: string) => boolean
  checkInterrupt: (val: string) => boolean
  checkHex: (val: string) => boolean
  // asyncCheckUtil: (val: string, title: string, type: string, id: string | number | null, params?: any) => any
}
