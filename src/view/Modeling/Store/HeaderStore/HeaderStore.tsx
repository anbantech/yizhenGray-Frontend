import { create } from 'zustand'
import { produce } from 'immer'
import { newSetDataHander, newSetPeripheral, newSetRegister, newSetTimer } from 'Src/services/api/modelApi'
import { throwErrorMessage } from 'Src/util/message'
import { HeaderStoreType } from './HeaderStoreType'
import ToolBox from '../ToolBoxStore/ToolBoxStore'
import { LeftListStoreMap } from '../ModeleLeftListStore/LeftListStore'
import { LeftAndRightStore } from '../ModelLeftAndRight/leftAndRightStore'
import { LowCodeStore } from '../CanvasStore/canvasStore'

export const HeaderStore = create<HeaderStoreType>((set, get) => ({
  headerTabs: null,
  btnStatus: true,
  // 避免多次点击,触发loading
  loading: false,
  setHeaderTabs: val => {
    set({ headerTabs: val, btnStatus: true })
  },

  optionalParameters: {
    name: {
      value: undefined,
      validateStatus: undefined,
      errorMsg: null
    },
    peripheral_id: {
      value: undefined,
      validateStatus: undefined,
      errorMsg: null
    },
    kind: {
      value: 0,
      validateStatus: 'success',
      errorMsg: null
    },
    port: {
      value: undefined,
      validateStatus: undefined,
      errorMsg: null
    },
    period: {
      value: undefined,
      validateStatus: undefined,
      errorMsg: null
    },
    interrupt: {
      value: undefined,
      validateStatus: undefined,
      errorMsg: null
    },
    base_address: {
      value: undefined,
      validateStatus: undefined,
      errorMsg: null
    },
    address_length: {
      value: undefined,
      validateStatus: undefined,
      errorMsg: null
    },
    relative_address: {
      value: undefined,
      validateStatus: undefined,
      errorMsg: null
    },
    desc: {
      value: undefined,
      validateStatus: undefined,
      errorMsg: null
    }
  },

  params: {},
  toggle: () => {
    set({ loading: !get().loading })
  },
  getTabsFromData: () => {
    const { name, base_address, desc, interrupt, address_length, period, peripheral_id, port, relative_address, kind } = get().optionalParameters
    const periperalParams = {
      name: name?.value,
      kind: kind?.value,
      address_length: (address_length?.value as string)?.trim().length % 2 === 0 ? address_length?.value : `0${address_length?.value}`,
      base_address: (base_address?.value as string)?.trim().length % 2 === 0 ? base_address?.value : `0${base_address?.value}`
    }

    const timerParams = {
      name: name?.value,
      period: period?.value,
      interrupt: interrupt?.value
    }

    const dataHandParams = {
      name: name?.value,
      port: port?.value
    }
    // 0 状态寄存器 1 非状态寄存器
    const ProcessorParams = {
      name: name?.value,
      peripheral_id: peripheral_id?.value,
      kind: 1,
      relative_address: (relative_address?.value as string)?.trim().length % 2 === 0 ? relative_address?.value : `0${relative_address?.value}`
    }

    const mapParams = {
      customPeripheral: periperalParams,
      register: ProcessorParams,
      timer: timerParams,
      handlerData: dataHandParams
    }
    const optionalParametersCopy = get().optionalParameters
    const result = Object.keys(mapParams[get().headerTabs as keyof typeof mapParams]).every(item => {
      return optionalParametersCopy[item as keyof typeof optionalParametersCopy]?.validateStatus === 'success'
    })
    //  由于外设之中有desc字段，这里需要特殊处理
    if (get().headerTabs === 'customPeripheral') {
      if (desc?.value === undefined || (desc?.value as string)?.length <= 50) {
        return set({ btnStatus: !result, params: { ...mapParams[get().headerTabs as keyof typeof mapParams], desc: desc?.value } })
      }
      return set({ btnStatus: true, params: { ...mapParams[get().headerTabs as keyof typeof mapParams], desc: desc?.value } })
    }

    if (!result) {
      return set({ btnStatus: !result })
    }
    return set({ btnStatus: !result, params: mapParams[get().headerTabs as keyof typeof mapParams] })
  },

  messageInfoFn: () => {
    get().getTabsFromData()
  },
  onChangeFn: (keys, value) => {
    const validation = new ToolBox(value as string, true, keys).validate()
    const { message, status } = validation
    set(state =>
      produce(state, draft => {
        const updatedDraft = draft
        ;(updatedDraft.optionalParameters as any)[keys].validateStatus = status
        ;(updatedDraft.optionalParameters as any)[keys].errorMsg = message
        ;(updatedDraft.optionalParameters as any)[keys].value = value
      })
    )
    return new Promise(resolve => {
      resolve(get().getTabsFromData())
    })
  },
  // 创建外设,
  createPeripheral: async (params, tabs) => {
    const id = LeftAndRightStore.getState().platform_id
    try {
      const res = await newSetPeripheral(params)
      if (res.code !== 0) return
      if (res.data && id) {
        // 拉取列表 关闭弹框 切换tabs
        LeftListStoreMap.getList(tabs)
        LeftAndRightStore.getState().setSelect(res.data.id, res.data.flag)
        LowCodeStore.getState().updatateNodeInfo(res.data, String(id))
        get().setHeaderTabs(null)
      }
      return res
    } catch (error) {
      throwErrorMessage(error)
    }
  },
  // 创建寄存器
  createRegister: async params => {
    const id = LeftAndRightStore.getState().platform_id
    try {
      const res = await newSetRegister(params)
      if (res.data && id) {
        // 拉取列表 关闭弹框 切换tabs
        await LeftListStoreMap.getList('customPeripheral')
        await LeftAndRightStore.getState().setSelect(res.data.id, res.data.flag)
        // 打开树节点
        await LeftListStoreMap.updateTreeNodeData([String(res.data.peripheral_id), String(res.data.id)])
        LowCodeStore.getState().updatateNodeInfo(res.data, String(id))
        await get().setHeaderTabs(null)
      }
      return res
    } catch (error) {
      throwErrorMessage(error)
    }
  },
  // 创建数据处理器
  createDataHander: async (params, tabs) => {
    const id = LeftAndRightStore.getState().platform_id
    try {
      const res = await newSetDataHander(params)
      if (res.data && id) {
        // 拉取列表 关闭弹框 切换tabs
        LeftListStoreMap.getList(tabs)
        LeftAndRightStore.getState().setSelect(res.data.id, res.data.flag)
        LowCodeStore.getState().updatateNodeInfo(res.data, String(id))
        get().setHeaderTabs(null)
      }
      return res
    } catch (error) {
      throwErrorMessage(error)
    }
  },

  // 创建定时器
  createTimer: async (params, tabs) => {
    const id = LeftAndRightStore.getState().platform_id
    try {
      const res = await newSetTimer(params)

      if (res.data && id) {
        LeftListStoreMap.getList(tabs)
        LeftAndRightStore.getState().setSelect(res.data.id, res.data.flag)
        LowCodeStore.getState().updatateNodeInfo(res.data, String(id))
        get().setHeaderTabs(null)
        // 拉取列表 关闭弹框 切换tabs
      }
      return res
    } catch (error) {
      throwErrorMessage(error)
    }
  },

  // 创建节点
  createCustomNode: async (tabs, params) => {
    const { createPeripheral, createRegister, createDataHander, createTimer } = get()
    const id = LeftAndRightStore.getState().platform_id
    const componentFunctions = {
      customPeripheral: createPeripheral,
      register: createRegister,
      handlerData: createDataHander,
      timer: createTimer
    }
    await componentFunctions[tabs as keyof typeof componentFunctions](params, tabs)
    await LeftListStoreMap.getModelListDetails(id as number)
    await LeftListStoreMap.getAllLists()
    get().toggle()
  },
  // 初始化数据
  initFormValue: () => {
    set({
      headerTabs: null,
      btnStatus: true,
      optionalParameters: {
        name: {
          value: undefined,
          validateStatus: undefined,
          errorMsg: null
        },
        peripheral_id: {
          value: undefined,
          validateStatus: undefined,
          errorMsg: null
        },
        kind: {
          value: 0,
          validateStatus: 'success',
          errorMsg: null
        },
        port: {
          value: undefined,
          validateStatus: undefined,
          errorMsg: null
        },
        period: {
          value: undefined,
          validateStatus: undefined,
          errorMsg: null
        },
        interrupt: {
          value: undefined,
          validateStatus: undefined,
          errorMsg: null
        },
        base_address: {
          value: undefined,
          validateStatus: undefined,
          errorMsg: null
        },
        address_length: {
          value: undefined,
          validateStatus: undefined,
          errorMsg: null
        },
        relative_address: {
          value: undefined,
          validateStatus: undefined,
          errorMsg: null
        },
        desc: {
          value: undefined,
          validateStatus: undefined,
          errorMsg: null
        }
      }
    })
  }
}))
