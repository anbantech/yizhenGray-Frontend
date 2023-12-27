import { create } from 'zustand'
import { getCustomMadePeripheralList, getProcessorList, getTargetDetails, getTimerList } from 'Src/services/api/modelApi'
import { throwErrorMessage } from 'Src/util/message'
import { LeftListStoreType } from './LeftListStoreType'
import { LeftAndRightStore } from '../ModelLeftAndRight/leftAndRightStore'
import { getAllIds } from '../MapStore'

export const LeftListStore = create<LeftListStoreType>((set, get) => ({
  // 骨架屏加载
  loading: false,
  // 选择tabs
  tabs: 'customPeripheral',
  // 更新tabs函数
  setTabs: (val: string) => {
    set({ tabs: val })
  },
  // 列表数据
  tabsList: [],
  // 操作栏数据
  headerBarList: [],
  // 筛选树的节点
  treeNodeData: [],
  // 是否还有更多数据
  hasMoreData: true,
  // 自定义外设,内置外设
  customAndDefaultPeripheral: {
    variety: '0', // 0自定义 1内置
    platform_id: null,
    tag: '0', // 0 全部 1 外设 2 寄存器 3 已用数据处理器
    key_word: '',
    page: 1,
    page_size: 99999,
    sort_field: 'create_time',
    sort_order: 'descend'
  },
  // 定时器 数据处理器 params
  timerAndHandData: {
    key_word: '',
    page: 1,
    page_size: 10,
    sort_field: 'create_time',
    sort_order: 'descend'
  },
  // 自定义外设 内置外设接口
  // 自定义数量
  customPeripheralNums: 0,

  // 内置数量
  boardPeripheralNums: 0,

  // 定时器数量
  timerNums: 0,

  // 数据处理器数量
  handlerDataNums: 0,

  // 更新hasMoreData
  setHasMore: (val: boolean) => {
    set(() => ({
      hasMoreData: val
    }))
  },
  toggle() {
    set(state => ({ loading: !state.loading }))
  },
  // 更新树节点
  updateTreeNodeData: value => {
    set({ treeNodeData: value })
  },
  // 更新tag 关键字搜索
  updateTagOrKeyWord: (val, type, whichOneParams) => {
    switch (type) {
      case 'key_word':
        if (whichOneParams) {
          return set({ customAndDefaultPeripheral: { ...get().customAndDefaultPeripheral, key_word: val } })
        }
        return set({ timerAndHandData: { ...get().timerAndHandData, key_word: val } })
      case 'tag':
        return set({ customAndDefaultPeripheral: { ...get().customAndDefaultPeripheral, tag: val } })
      default:
        if (whichOneParams) {
          return set({ customAndDefaultPeripheral: { ...get().customAndDefaultPeripheral, key_word: val } })
        }
        return set({ timerAndHandData: { key_word: '', page: 1, page_size: 10, sort_field: 'create_time', sort_order: 'descend' } })
    }
  },

  // 获取目标机详情
  getModelListDetails: async (id: number) => {
    try {
      // 获取详情
      const res = await getTargetDetails(id)
      if (res.data) {
        const { processor_cnt, timer_cnt, default_peripheral_cnt, peripheral_cnt } = res.data
        set({
          customPeripheralNums: peripheral_cnt,
          timerNums: timer_cnt,
          handlerDataNums: processor_cnt,
          boardPeripheralNums: default_peripheral_cnt
        })
      }
    } catch (error) {
      throwErrorMessage(error)
    }
  },

  //  获取内置或自定义外设列表
  getCustomAndDefaultPeripheral: async tabs => {
    const { customAndDefaultPeripheral } = get()
    const { platform_id } = LeftAndRightStore.getState()
    get().toggle()
    try {
      let res: any
      if (platform_id) {
        const variety = tabs === 'boardPeripheral' ? '1' : '0'
        res = await getCustomMadePeripheralList({ ...customAndDefaultPeripheral, variety, platform_id })
      }

      if (res.data) {
        set({ tabsList: [...res.data.results] })
        if (['2', '3'].includes(customAndDefaultPeripheral.tag)) {
          const allIds = getAllIds(res.data.results)
          set({ treeNodeData: allIds })
        }
        if (customAndDefaultPeripheral.tag === '0' && customAndDefaultPeripheral.key_word !== '') {
          const allIds = getAllIds(res.data.results)
          set({ treeNodeData: allIds })
        }
      }
      get().toggle()
      return res
    } catch (error) {
      get().toggle()
      throwErrorMessage(error, { 1006: '参数错误' })
      return error
    }
  },

  // 获取外设列表
  getPeripheralList: async variety => {
    const { platform_id } = LeftAndRightStore.getState()
    try {
      let res: any
      if (platform_id) {
        res = await getCustomMadePeripheralList({
          variety, // 0自定义 1内置
          platform_id,
          tag: '0', // 0 全部 1 外设 2 寄存器 3 已用数据处理器
          key_word: '',
          page: 1,
          page_size: 99999,
          sort_field: 'create_time',
          sort_order: 'descend'
        })
      }
      if (res.data) {
        set({ headerBarList: [...res.data.results] })
      }
      return res
    } catch (error) {
      throwErrorMessage(error, { 1006: '参数错误' })
      return error
    }
  },

  //  获取定时器列表或者数据处理器列表 切换tabs 一定要重置请求参数
  getTimerListAndDataHandlerList: async tabs => {
    const { timerAndHandData, setHasMore } = get()
    const { platform_id } = LeftAndRightStore.getState()
    try {
      let res: any
      if (platform_id) {
        res =
          tabs === 'timer' ? await getTimerList({ ...timerAndHandData, platform_id }) : await getProcessorList({ ...timerAndHandData, platform_id })
      }
      if (res && res.data) {
        const newList = [...res.data.results]

        if (newList.length === 0) {
          setHasMore(false)
          set({ tabsList: [...res.data.results] })
          return
        }
        if (newList.length === res.data.total) {
          setHasMore(false)
        } else {
          setHasMore(true)
        }
        set({ tabsList: [...res.data.results] })
      }
      return res
    } catch (error) {
      throwErrorMessage(error, { 1006: '参数错误' })
      return error
    }
  },

  //  获取各个列表函数接口
  getList: async tabs => {
    get().setTabs(tabs)
    switch (tabs) {
      case 'customPeripheral':
        get().getCustomAndDefaultPeripheral(tabs)
        break
      case 'boardPeripheral':
        get().getCustomAndDefaultPeripheral(tabs)
        break
      case 'handlerData':
        get().getTimerListAndDataHandlerList(tabs)
        break
      case 'timer':
        get().getTimerListAndDataHandlerList(tabs)
        break
      default:
        break
    }
  },

  // 获取全部外设列表
  getAllList: async () => {
    const { platform_id } = LeftAndRightStore.getState()
    try {
      let res: any
      if (platform_id) {
        res = await getCustomMadePeripheralList({
          platform_id,
          tag: '1', // 0 全部 1 外设 2 寄存器 3 已用数据处理器
          key_word: '',
          page: 1,
          page_size: 99999,
          sort_field: 'create_time',
          sort_order: 'descend'
        })
      }
      if (res.data) {
        set({ headerBarList: [...res.data.results] })
      }
      return res
    } catch (error) {
      throwErrorMessage(error, { 1006: '参数错误' })
      return error
    }
  },
  // 初始化列表请求参数
  initStore: () => {
    set({
      timerAndHandData: { key_word: '', page: 1, page_size: 10, sort_field: 'create_time', sort_order: 'descend' },
      customAndDefaultPeripheral: {
        variety: '0', // 0自定义 1内置
        platform_id: null,
        tag: '0', // 0 全部 1 外设 2 寄存器 3 已用数据处理器
        key_word: '',
        page: 1,
        page_size: 99999,
        sort_field: 'create_time',
        sort_order: 'descend'
      }
    })
  }
}))

export const LeftListStoreMap = {
  getList: LeftListStore.getState().getList,
  getModelListDetails: LeftListStore.getState().getModelListDetails,
  updateTreeNodeData: LeftListStore.getState().updateTreeNodeData
}
