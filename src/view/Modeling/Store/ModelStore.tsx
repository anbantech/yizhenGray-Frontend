// import { create } from 'zustand'
// import ModelDrawStoreType from './ModleStore'

import { create } from 'zustand'

import { createModelTarget, deleteModelTarget, getModelTargetList, updateModelTarget, viewELT } from 'Src/services/api/modelApi'
import { getPortList } from 'Src/services/api/excitationApi'
import { throwErrorMessage } from 'Src/util/message'
import { NewModelListStore, PublicAttributesStoreParams, ViewMarkDown } from './ModleStore'

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

export { useNewModelingStore, publicAttributes, vieMarkDown }
