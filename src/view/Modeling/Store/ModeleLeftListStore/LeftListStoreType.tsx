export type BaseList = {
  key_word: string
  page: number
  page_size: number
  sort_field: 'create_time'
  sort_order: 'descend'
}

export interface LeftListStoreType {
  // 选择tabs
  tabs: string
  // 更新tabs函数
  setTabs: (val: string) => void
  // 存储列表数据
  tabsList: any
  // 是否还有更多数据
  hasMoreData: boolean // 共用
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
  // 获取目标机详情
  getModelListDetails: (id: number) => void
  // 获取定时器列表或者数据处理器列表 切换tabs时 一定要重置请求参数
  getTimerListAndDataHandlerList: (params: BaseList, tabs: string) => void
  // 获取列表
  getList: (params: BaseList, tabs: string) => void
}
