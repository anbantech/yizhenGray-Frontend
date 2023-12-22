import { create } from 'zustand'
import { getTargetDetails, getTimerList } from 'Src/services/api/modelApi'
import { throwErrorMessage } from 'Src/util/message'
import { LeftListStoreType } from './LeftListStoreType'
import { leftAndRightMap } from '../ModelLeftAndRight/leftAndRightStore'

export const LeftListStore = create<LeftListStoreType>((set, get) => ({
  // 选择tabs
  tabs: 'customPeripheral',
  // 更新tabs函数
  setTabs: (val: string) => {
    set({ tabs: val })
  },
  // 列表数据
  tabsList: [],
  // 是否还有更多数据
  hasMoreData: true,
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

  //  获取定时器列表或者数据处理器列表 切换tabs 一定要重置请求参数
  getTimerListAndDataHandlerList: async (params, tabs) => {
    const { timerAndHandData, setHasMore } = get()
    const { platform_id } = leftAndRightMap
    try {
      const params = { ...timerAndHandData, platform_id }
      let res: any
      if (tabs === 'timer') {
        await getTimerList(params)
      } else {
        await getTimerList(params)
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
  getList: async (params, tabs) => {
    switch (tabs) {
      case 'customMadePeripheral':
        break
      case 'boardPeripheral':
        break
      case 'handlerData':
        get().getTimerListAndDataHandlerList(params, tabs)
        break
      case 'timer':
        get().getTimerListAndDataHandlerList(params, tabs)
        break
      default:
        break
    }
  }
}))
