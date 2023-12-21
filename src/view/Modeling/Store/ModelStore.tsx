// import { create } from 'zustand'
// import ModelDrawStoreType from './ModleStore'

import { create } from 'zustand'
import { produce } from 'immer'

import {
  createModelTarget,
  deleteModelTarget,
  getCustomMadePeripheralList,
  getModelTargetList,
  getProcessorList,
  getTargetDetails,
  getTimerList,
  updateModelTarget,
  viewELT
} from 'Src/services/api/modelApi'
import { getPortList } from 'Src/services/api/excitationApi'
import { throwErrorMessage } from 'Src/util/message'
import {
  ModelDetails,
  NewModelListStore,
  PublicAttributesStoreParams,
  FormItemCheckStoreParams,
  CheckUtilFnStoreParams,
  ViewMarkDown
} from './ModleStore'
import { AssembleDataHandlerFn, getAllIds } from './MapStore'

interface MyObject {
  object: string
  platform_id: number
  [key: string]: any
}

// 目标机列表 侧边栏 顶部操作栏 右侧属性  表单校验 公共属性

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
const useLeftModelDetailsStore = create<ModelDetails>((set, get) => ({
  keyWord: '',
  tabs: 'customMadePeripheral',
  fn: () => {},
  expandNodeArray: [],
  targetDetails: { name: '', desc: '', processor: '' },
  hasMoreData: true, // 共用
  cusomMadePeripheralNums: 0,
  timerNums: 0,
  handlerDataNums: 0,
  boardPeripheralNums: 0,
  loading: true,
  // 全部外设数据参数获取
  AllPeripheral: {
    platform_id: 0,
    tag: '1',
    key_word: '',
    page: 1,
    page_size: 99999,
    sort_field: 'create_time',
    sort_order: 'descend'
  },
  cusomMadePeripheralListParams: {
    variety: '0',
    platform_id: 0,
    tag: '0',
    key_word: '',
    page: 1,
    page_size: 30,
    sort_field: 'create_time',
    sort_order: 'descend'
  },

  timerListParams: {
    platform_id: 0,
    key_word: '',
    page: 1,
    page_size: 30,
    sort_field: 'create_time',
    sort_order: 'descend'
  },

  processorListParams: {
    platform_id: 0,
    key_word: '',
    page: 1,
    page_size: 30,
    sort_field: 'create_time',
    sort_order: 'descend'
  },
  customMadePeripheralList: [],
  customAllPeripheralList: [],
  timerList: [],
  processorList: [],
  boardLevelPeripheralsList: [],
  AllPeripheralList: [],

  setParams: (tabs: string, val) => {
    const { processorListParams, timerListParams, cusomMadePeripheralListParams } = get()
    switch (tabs) {
      case 'time':
        set({ timerListParams: { ...timerListParams, ...val } })
        break
      case 'boardLevelPeripherals':
        set({ cusomMadePeripheralListParams: { ...cusomMadePeripheralListParams, ...val } })
        break
      case 'customMadePeripheral':
        set({ cusomMadePeripheralListParams: { ...cusomMadePeripheralListParams, ...val } })
        break
      case 'dataHandlerNotReferenced':
        set({ processorListParams: { ...processorListParams, ...val } })
        break
      default:
        break
    }
  },

  setTabs: val => {
    set({ tabs: val })
  },
  setLoading: val => {
    set({ loading: val })
  },

  setTags: val => {
    set({
      cusomMadePeripheralListParams: { ...get().cusomMadePeripheralListParams, tag: val, page: 1, page_size: val === '1' ? 9999 : 30 }
    })
  },

  setHasMore: (val: boolean) => {
    set(() => ({
      hasMoreData: val
    }))
  },

  setKeyWord: (val: string, tabs: string) => {
    const { processorListParams, setTags, timerListParams } = get()
    if (!val) {
      setTags('0')
    }
    switch (tabs) {
      case 'customMadePeripheral':
        set({ cusomMadePeripheralListParams: { ...get().cusomMadePeripheralListParams, key_word: val } })
        break
      case 'boardLevelPeripherals':
        set({ cusomMadePeripheralListParams: { ...get().cusomMadePeripheralListParams, key_word: val } })
        break
      case 'dataHandlerNotReferenced':
        set({ processorListParams: { ...processorListParams, key_word: val } })
        break
      case 'time':
        set({ timerListParams: { ...timerListParams, key_word: val } })
        break
      default:
        break
    }
    set({ keyWord: val })
  },

  getCustomMadePeripheralStore: async (id: number) => {
    const { cusomMadePeripheralListParams, setLoading } = get()
    try {
      const params = { ...cusomMadePeripheralListParams, platform_id: id }
      const res = await getCustomMadePeripheralList(params)
      if (res.data) {
        if (['2', '3'].includes(params.tag)) {
          const result = AssembleDataHandlerFn(res.data.results, params.tag)

          const allIds = getAllIds(result)
          set({ expandNodeArray: allIds })

          set({ customMadePeripheralList: [...result] })
          return setLoading(false)
        }
        if (params.tag === '0' && params.key_word !== '') {
          const allIds = getAllIds(res.data.results)
          set({ expandNodeArray: allIds })
        }
        set({ customMadePeripheralList: [...res.data.results] })
        return setLoading(false)
      }
      return res
    } catch (error) {
      setLoading(false)
      throwErrorMessage(error, { 1006: '参数错误' })
      return error
    }
  },

  getCustomMadePeripheralStoreFn: async (id: number) => {
    try {
      const params = {
        variety: '0',
        tag: '0',
        key_word: '',
        page: 1,
        page_size: 99999,
        sort_field: 'create_time',
        sort_order: 'descend',
        platform_id: id
      }
      const res = await getCustomMadePeripheralList(params)
      if (res.data) {
        set({ customAllPeripheralList: [...res.data.results] })
      }
      return res
    } catch (error) {
      throwErrorMessage(error, { 1006: '参数错误' })
      return error
    }
  },
  getBoardCustomMadePeripheralStore: async (id: number) => {
    const { cusomMadePeripheralListParams, setLoading } = get()
    try {
      const params = { ...cusomMadePeripheralListParams, platform_id: id, variety: '1' }
      const res = await getCustomMadePeripheralList(params)
      // 2 寄存器  3 数据处理器
      if (res.data) {
        if (['2', '3'].includes(params.tag)) {
          const result = AssembleDataHandlerFn(res.data.results, params.tag)
          const allIds = getAllIds(result)
          set({ expandNodeArray: allIds })
          set({ boardLevelPeripheralsList: [...result] })
          return setLoading(false)
        }
        if (params.tag === '0' && params.key_word !== '') {
          const allIds = getAllIds(res.data.results)
          set({ expandNodeArray: allIds })
        }
        set({ boardLevelPeripheralsList: res.data.results })
        return setLoading(false)
      }
      return res
    } catch (error) {
      setLoading(false)
      throwErrorMessage(error, { 1006: '参数错误' })
      return error
    }
  },
  getTimeListStore: async (id: number) => {
    const { timerListParams, setHasMore } = get()
    try {
      const params = { ...timerListParams, platform_id: id }
      const res = await getTimerList(params)
      if (res.data) {
        const newList = [...res.data.results]
        if (newList.length === 0) {
          setHasMore(false)
          set({ timerList: [...res.data.results] })
          return
        }
        if (newList.length === res.data.total) {
          setHasMore(false)
        } else {
          setHasMore(true)
        }
        set({ timerList: [...res.data.results] })
      }
      return res
    } catch (error) {
      throwErrorMessage(error, { 1006: '参数错误' })
      return error
    }
  },

  getProcessorListStore: async (id: number) => {
    const { processorListParams, setHasMore } = get()
    try {
      const params = { ...processorListParams, platform_id: id }
      const res = await getProcessorList(params)
      if (res.data) {
        const newList = [...res.data.results]
        if (newList.length === 0) {
          setHasMore(false)
          set({ processorList: [...res.data.results] })
          return
        }
        if (newList.length === res.data.total) {
          setHasMore(false)
        } else {
          setHasMore(true)
        }
        set({ processorList: [...res.data.results] })
      }
      return res
    } catch (error) {
      throwErrorMessage(error, { 1006: '参数错误' })
      return error
    }
  },

  // 获取所有外设数据
  getAllPeripheral: async (id: number) => {
    const { AllPeripheral } = get()
    try {
      const params = { ...AllPeripheral, platform_id: id }
      const res = await getCustomMadePeripheralList(params)
      if (res.data) {
        set({ AllPeripheralList: [...res.data.results] })
      }
      return res
    } catch (error) {
      throwErrorMessage(error, { 1006: '参数错误' })
      return error
    }
  },

  getList: (val: string, id: number) => {
    // 根据val获取对应的数据
    const {
      getProcessorListStore,
      getCustomMadePeripheralStoreFn,
      getCustomMadePeripheralStore,
      getTimeListStore,
      getBoardCustomMadePeripheralStore
    } = get()
    set({ tabs: val })
    switch (val) {
      case 'customMadePeripheral':
        getCustomMadePeripheralStore(id)
        getCustomMadePeripheralStoreFn(id)
        break
      case 'boardLevelPeripherals':
        getBoardCustomMadePeripheralStore(id)
        getCustomMadePeripheralStoreFn(id)
        break
      case 'dataHandlerNotReferenced':
        getProcessorListStore(id)
        getCustomMadePeripheralStoreFn(id)
        break
      case 'time':
        getTimeListStore(id)
        getCustomMadePeripheralStoreFn(id)
        break
      default:
        break
    }
  },

  baseKeyWordAndTagsGetList: (val: string, id: number) => {
    // 根据val获取对应的数据
    const {
      setLoading,
      getProcessorListStore,
      getCustomMadePeripheralStoreFn,
      getCustomMadePeripheralStore,
      getTimeListStore,
      getBoardCustomMadePeripheralStore
    } = get()
    switch (val) {
      case 'customMadePeripheral':
        setLoading(true)
        getCustomMadePeripheralStore(id)
        getCustomMadePeripheralStoreFn(id)
        break
      case 'boardLevelPeripherals':
        setLoading(true)
        getBoardCustomMadePeripheralStore(id)
        getCustomMadePeripheralStoreFn(id)
        break
      case 'dataHandlerNotReferenced':
        getProcessorListStore(id)
        getCustomMadePeripheralStoreFn(id)
        break
      case 'time':
        getTimeListStore(id)
        getCustomMadePeripheralStoreFn(id)
        break
      default:
        break
    }
  },

  // 侧边栏数量获取详情
  getModelListDetails: async (id: number, headertabs) => {
    const { tabs, getList } = get()
    try {
      // 获取详情
      const res = await getTargetDetails(id)
      if (res.data) {
        const { processor_cnt, timer_cnt, default_peripheral_cnt, peripheral_cnt } = res.data
        set({
          targetDetails: res.data,
          cusomMadePeripheralNums: peripheral_cnt,
          timerNums: timer_cnt,
          handlerDataNums: processor_cnt,
          boardPeripheralNums: default_peripheral_cnt
        })
        // 画布添加数据和左侧列表所选tabs是否一致 如果一致更新列表
        if (headertabs === tabs) {
          getList(tabs, id)
        }
      }
    } catch (error) {
      throwErrorMessage(error)
    }
  },

  // 清除关键字
  clearKeyWord: fn => {
    set({ fn })
  },

  initStore: () => {
    set({
      keyWord: '',
      hasMoreData: true, // 共用
      expandNodeArray: [],
      customMadePeripheralList: [],
      timerList: [],
      processorList: [],
      boardLevelPeripheralsList: [],
      AllPeripheralList: [],
      AllPeripheral: {
        platform_id: 0,
        tag: '1',
        key_word: '',
        page: 1,
        page_size: 3000,
        sort_field: 'create_time',
        sort_order: 'descend'
      },
      cusomMadePeripheralListParams: {
        variety: '0',
        platform_id: 0,
        tag: '0',
        key_word: '',
        page: 1,
        page_size: 30,
        sort_field: 'create_time',
        sort_order: 'descend'
      },
      timerListParams: {
        platform_id: 0,
        key_word: '',
        page: 1,
        page_size: 30,
        sort_field: 'create_time',
        sort_order: 'descend'
      },
      processorListParams: {
        platform_id: 0,
        key_word: '',
        page: 1,
        page_size: 30,
        sort_field: 'create_time',
        sort_order: 'descend'
      }
    })
  },
  // 创建目标元素 打开侧边栏 聚焦侧边id
  openSiderMenu: (tabs: string) => {
    const { fn, initStore } = get()
    fn()
    initStore()
    set({ tabs })
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
  tabs: '',
  setTabs: val => {
    set({ tabs: val })
  },

  unSetTabs: () => {
    const { initFormValue } = get()
    set({ tabs: '' })
    initFormValue()
  },

  optionalParameters: {
    name: {
      value: '',
      validateStatus: '',
      errorMsg: null
    },
    peripheral_id: {
      value: '',
      validateStatus: '',
      errorMsg: null
    },
    kind: {
      value: 0,
      validateStatus: '',
      errorMsg: null
    },
    port: {
      value: '',
      validateStatus: '',
      errorMsg: null
    },
    period: {
      value: '',
      validateStatus: '',
      errorMsg: null
    },
    interrupt: {
      value: '',
      validateStatus: '',
      errorMsg: null
    },
    base_address: {
      value: '',
      validateStatus: '',
      errorMsg: null
    },
    address_length: {
      value: '',
      validateStatus: '',
      errorMsg: null
    },
    relative_address: {
      value: '',
      validateStatus: '',
      errorMsg: null
    },
    desc: {
      value: '',
      validateStatus: '',
      errorMsg: null
    }
  },
  checkEveryItem: optionalParameters => {
    const { tabs } = get()
    const { name, base_address, desc, interrupt, address_length, period, peripheral_id, port, relative_address, kind } = get().optionalParameters
    const bol = Object.values(optionalParameters).every((item: any) => {
      if (item.validateStatus === 'error') {
        return false
      }
      return true
    })
    let btnStatus
    if (tabs === 'dataHandlerNotReferenced') {
      btnStatus = bol && port?.value && name?.value
    }
    if (tabs === 'time') {
      btnStatus = bol && name?.value && interrupt?.value && period?.value
    }
    if (tabs === 'customMadePeripheral') {
      btnStatus =
        bol &&
        base_address?.value &&
        address_length?.value &&
        kind?.value !== '' &&
        name?.value &&
        ((desc?.value as string).length <= 50 || desc?.value === '')
    }
    if (tabs === 'processor') {
      btnStatus = bol && name?.value && relative_address?.value && peripheral_id?.value
    }
    return !btnStatus
  },
  updateFormValue: (item, val, title, errorMsg, validateStatus) => {
    set(state =>
      produce(state, draft => {
        const updatedDraft = draft
        ;(updatedDraft.optionalParameters as any)[item].validateStatus = validateStatus
        ;(updatedDraft.optionalParameters as any)[item].errorMsg = errorMsg === null ? null : `${errorMsg}`
        ;(updatedDraft.optionalParameters as any)[item].value = val
      })
    )
  },
  onChange: (item, val, title, fn1, fn2) => {
    const { updateFormValue } = get()
    if (item === 'name' && fn2 && fn1) {
      if (!val) {
        return updateFormValue(item, val, title, `请输入${title}名称`, 'error')
      }
      if (!fn2(val)) {
        return updateFormValue(item, val, title, '名称长度在2-20个字符之间', 'error')
      }
      if (!fn1(val)) {
        return updateFormValue(item, val, title, '名称以字母或下划线开头，并仅限使用字母、数字和下划线', 'error')
      }
    }

    if (item === 'interrupt' && fn1 && !fn1(val)) {
      return updateFormValue(item, val, title, '请输入0~255的整数', 'error')
    }

    if (item === 'period' && fn1 && !fn1(val)) {
      return updateFormValue(item, val, title, '请输入0~65535的整数', 'error')
    }

    if (['relative_address', 'address_length', 'base_address'].includes(item) && fn1 && !fn1(val)) {
      return updateFormValue(item, val, title, '请输入由0-9,A-F(或a-f)组成的16进制数', 'error')
    }
    updateFormValue(item, val, title, null, 'success')
  },
  // 初始化数据
  initFormValue: () => {
    set({
      tabs: '',
      optionalParameters: {
        name: {
          value: '',
          validateStatus: '',
          errorMsg: ''
        },
        kind: {
          value: 0,
          validateStatus: '',
          errorMsg: ''
        },
        port: {
          value: '',
          validateStatus: '',
          errorMsg: ''
        },
        period: {
          value: '',
          validateStatus: '',
          errorMsg: ''
        },
        interrupt: {
          value: '',
          validateStatus: '',
          errorMsg: ''
        },
        base_address: {
          value: '',
          validateStatus: '',
          errorMsg: ''
        },
        address_length: {
          value: '',
          validateStatus: '',
          errorMsg: ''
        },
        relative_address: {
          value: '',
          validateStatus: '',
          errorMsg: ''
        },
        peripheral_id: {
          value: '',
          validateStatus: '',
          errorMsg: ''
        },
        desc: {
          value: '',
          validateStatus: '',
          errorMsg: ''
        }
      }
    })
  }
}))

// 校验函数仓库

const checkUtilFnStore = create<CheckUtilFnStoreParams>(() => ({
  //  校验是否为16进制字符串
  checkHex: (val: string) => {
    if (!val) return false
    const reg = /^(0x)?([\da-f]{1,8})$/i
    return reg.test(`0x${val}`)
  },
  //  校验是否为16进制字符串 并且空置可以通过校验
  checkNullAndHex: (val: string) => {
    const reg = /^(0x)?([\da-f]{1,8})$/i
    return !val || reg.test(`0x${val}`)
  },
  // 检查名字格式
  checkNameFormat: (val: string) => {
    if (!val) return false
    const reg = /^[A-Z_a-z]\w*$/
    return reg.test(val)
  },
  // 检查名字长度
  checkNameLength: (val: string) => {
    if (!val) return false
    const length = val.length >= 2 && val.length <= 20
    return length
  },
  // 检查间隔
  checkInterval: (val: string) => {
    if (!val) return false
    const regex = /^\d+$/
    const checkoutResult = Number(val) >= 0 && Number(val) <= 65535 && regex.test(val)
    return checkoutResult
  },

  // 检查中断号
  checkInterrupt: (val: string) => {
    if (!val) return false
    const regex = /^\d+$/
    const checkoutResult = Number(val) >= 0 && Number(val) <= 255 && regex.test(val)
    return checkoutResult
  }
}))

const vieMarkDown = create<ViewMarkDown>((set, get) => ({
  open: false,
  markDown: '',
  setOpen: () => {
    set({ open: !get().open })
  },
  getMarkDown: async id => {
    const res = await viewELT(id)
    if (res.data) {
      set({ markDown: res.data, open: true })
    }
  }
}))

export { checkUtilFnStore, formItemParamsCheckStore, useNewModelingStore, publicAttributes, useLeftModelDetailsStore, vieMarkDown }
