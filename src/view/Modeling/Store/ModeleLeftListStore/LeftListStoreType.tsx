export interface BaseList {
  key_word: string
  page: number
  page_size: number
  sort_field: 'create_time'
  sort_order: 'descend'
}

export interface defalutAndPeripheralParams extends BaseList {
  tag: string
  variety: string
  platform_id: null | number
}

export interface LeftListStoreType {
  // 设置loading
  loading: boolean
  toggle: () => void
  // 选择tabs
  tabs: string
  // 更新tabs函数
  setTabs: (val: string) => void
  // 存储列表数据
  tabsList: any
  // 筛选树的节点
  treeNodeData: string[]
  // 顶部导航栏数据
  headerBarList: string[]
  // 是否还有更多数据
  hasMoreData: boolean // 共用
  // 自定义外设,内置外设
  customAndDefaultPeripheral: defalutAndPeripheralParams // 暂定
  // 列表请求数据信息
  timerAndHandData: BaseList
  // 自定义数量
  customPeripheralNums: number
  // 内置数量
  boardPeripheralNums: number
  // 定时器数量
  timerNums: number
  // 数据处理器数量
  handlerDataNums: number
  // 更新hasMoreData
  setHasMore: (val: boolean) => void
  // 更新tag 关键字搜索
  updateTagOrKeyWord: (val: string, type: string, whichOneParams: boolean) => void
  // 获取目标机详情
  getModelListDetails: (id: number) => void

  getCustomAndDefaultPeripheral: (tabs: string) => void
  // 获取定时器列表或者数据处理器列表 切换tabs时 一定要重置请求参数
  getTimerListAndDataHandlerList: (tabs: string) => void
  // 更新节点
  updateTreeNodeData: (val: string[]) => void
  // 获取列表
  getList: (tabs: string) => void
  // 获取外设列表
  getPeripheralList: (variety: string) => void
  // 清除列表请求数据
  initStore: () => void
}
