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
  loading: boolean
  keyWord: string
  customAllPeripheralList: [] | CustomMadePeripheralListParams[]
  expandNodeArray: string[]
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
  setLoading: (val: boolean) => void
  openSiderMenu: (tabs: string) => void
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
  getCustomMadePeripheralStoreFn: (id: number) => void
  getProcessorListStore: (id: number) => void
  getTimeListStore: (id: number) => void
  getList: (val: string, id: number) => void
  getModelListDetails: (id: number, headertabs?: string) => void
  getAllPeripheral: (id: number) => void
  // setExpand: (val: any) => void
  // setItemExpand: (val: React.Key[]) => void
}

export interface RightDetailsAttributesStoreParams {
  typeAttributes: string
  focusNodeId: number | null | string
  rightArrributes: any
  register: any
  updateRegister: (val: any) => void
  setTypeDetailsAttributes: (val: string, id: number | null) => void
  getTimerAttributes: (id: number) => void
  getDataHandlerAttributes: (id: number, fn?: (val: string | string[]) => void) => void
  getPeripheralAttributes: (id: number, type?: string, fn1?: any) => void
  getRegisterAttributes: (id: number, fn?: (val: string | string[]) => void) => void
  getTargetAttributes: (val: number) => void
  rightAttributeMap: (type: string, val: number | string | null, fn?: (val: string | string[]) => void) => void
}

// 端口列表
export interface PublicAttributesStoreParams {
  portList: any
  setPortList: () => void
}

type valueParams = {
  value: number | string | any
  validateStatus?: '' | 'success' | 'error' | 'warning' | 'validating' | undefined
  errorMsg?: string | null
}

type valueParamsArray = {
  value: string[]
  validateStatus?: '' | 'success' | 'error' | 'warning' | 'validating' | undefined
  errorMsg?: string | null
}

interface RFState {
  platform_id: null | string
  nodes: any
  edges: any
  InitCanvas: (nodeArray, edgeArray) => void
  collapseOtherNode: (id: string) => void
  menuStatusObj: null | string
  changeView: boolean
  canvasData: any
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  leftListExpandArray: string[]
  updateRegisterNodeDraw: (detailes: {
    error_code: { error_code: number; id: number }
    name: string
    id: string
    peripheral_id: string
    flag: number
    kind: number
  }) => void
  upDateLeftExpandArrayFn: (val: string[]) => void
  setChangeView: (val: boolean) => void
  setMenuStatus: (id: string) => void
  setOpenMenu: () => void
  getModelDetails: (id: number) => any
  setNodes: (nodesValue: any) => void
  setEdges: (edgesValue: Edge[]) => void
  getSumNodeId: (nodeArray: Node[]) => string
  upDateNodesAndEdges: (newNode: Node[], newEdge: Edge[]) => void
  expandNode: (nodeId: string[]) => void
  expandNodeTree: (nodeId: string) => void
  addChildNode: (Node: NodeProps, parentId: string) => void
  getChildernNums: (id: string) => number
  onEdgeUpdate: any
  baseOnUpdateNodeAndEdge: (preParentId, parentId, id, rightArrributesInfo) => void
  createPeripheral: (
    params: any,
    fn: (val: number, tabs: string) => void,
    id: number,
    cancel: () => void,
    fn2: (val: string, id: string) => void
  ) => void
  createRegister: (
    params: any,
    fn: (val: number, tabs: string) => void,
    id: number,
    cancel: () => void,
    fn2: (val: string, id: string) => void
  ) => void
  createDataHandler: (
    params: any,
    fn: (val: number, tabs: string) => void,
    id: number,
    cancel: () => void,
    fn2: (val: string, id: string) => void
  ) => void
  createTimer: (params: any, fn: (val: number, tabs: string) => void, id: number, cancel: () => void, fn2: (val: string, id: string) => void) => void
  createElement: (
    tabs: string,
    params: any,
    fn: (val: number, tabs: string) => void,
    id: number,
    cancel: () => void,
    fn2: (val: string, id: string) => void
  ) => void
  initTreeToNodeAndToEedg: (initData: any, isVersion?: boolean) => void
  zindexNode: (nodeId: string, zIndex: number) => void
  nodeTemplate: (node: NodeProps, parentId: string) => any
  edgeTemplate: (node: NodeProps, source: string, target: string) => any
  saveCanvas: (nodes: any[], edges: Edge[], id: string) => void
  clearNodeAndEdge: () => void
  updateNodeName: (id: string, typeAndValue?: Record<string, any>) => void
  saveCanvasAndUpdateNodeName: (id: string, platform_id?: string, typeAndValue?: Record<string, any>) => void
  selectIdExpandDrawTree: (id: string | string[]) => void
  deleteTreeNode: (visibility: boolean, node?: any) => void
  deleteInfo: { node: any; visibility: boolean }
  expandTreeArray: string[]
  sumData: any
  updateNodeAttributeInfo: (Details: Record<string, any>) => void
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
  setPlatFormId: (val: string) => void
  initRightListStore: () => void
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
    set_cmd: any
    restore_cmd: valueParams
    set_value: valueParams
    restore_value: valueParams
    sr_id: valueParams
    sr_peri_id: valueParams
  }

  clickLeftListAndFoucsIdAndRightAtturbuites: (title: string, type: string, value: any) => void
  frontendCheckoutName: (val: string, title: string, type: string, fn1: (val: string) => boolean, fn2: (val: string) => boolean) => void
  checkoutBase_addreeAndLength: (val: string, title: string, type: string, fn1: (val: string) => boolean) => void
  onBlurAsyncCheckoutNameFormValues: (val: string, title: name, type: string, fn1: (type?: string) => void, params?: any) => void
  updateTimer: () => void
  updateProcessor: (type?: string) => void
  updatePeripheral: () => void
  checkoutTimerPeriodAndInterrupt: (val: string, title: string, type: string, fn1: (val: string) => boolean) => void
  updateOnceFormValue: (val: string | string[] | CheckboxValueType[] | any, title: string, type: string) => void
  checkoutProcessor: (val: string, title: string, type: string, fn1: (val: string) => boolean, fn2: () => void) => void
  checkEveryItemIsError: (val: string) => boolean
  filterObject: (obj: any) => any
  updateRegister: (type?: string) => void
  messageInfoFn: (item, type, title, validateStatus, errorMsg, val) => any
}

export interface CheckUtilFnStoreParams {
  checkNameLength: (val: string) => boolean
  checkNameFormat: (val: string) => boolean
  checkInterval: (val: string) => boolean
  checkInterrupt: (val: string) => boolean
  checkHex: (val: string) => boolean
  checkNullAndHex: (val: string) => boolean
  // asyncCheckUtil: (val: string, title: string, type: string, id: string | number | null, params?: any) => any
}

export interface ViewMarkDown {
  markDown: string
  open: boolean
  setOpen: () => void
  getMarkDown: (id: string | number, allId: any) => void
}
