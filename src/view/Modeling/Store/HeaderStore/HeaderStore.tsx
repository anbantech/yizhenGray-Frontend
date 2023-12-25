import { create } from 'zustand'
import { produce } from 'immer'
import { HeaderStoreType } from './HeaderStoreType'
import ToolBox from '../ToolBoxStore/ToolBoxStore'

// 表单接口校验
export const HeaderStore = create<HeaderStoreType>((set, get) => ({
  headerTabs: null,
  btnStatus: true,
  setHeaderTabs: val => {
    set({ headerTabs: val })
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
      validateStatus: undefined,
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
  getTabsFromData: () => {
    const { name, base_address, desc, interrupt, address_length, period, peripheral_id, port, relative_address, kind } = get().optionalParameters
    const periperalParams = {
      platform_id: null,
      name: name?.value,
      kind: kind?.value,
      desc: desc?.value,
      address_length: (address_length?.value as string)?.trim().length % 2 === 0 ? address_length?.value : `0${address_length?.value}`,
      base_address: (base_address?.value as string)?.trim().length % 2 === 0 ? base_address?.value : `0${base_address?.value}`
    }

    const timerParams = {
      platform_id: null,
      name: name?.value,
      period: period?.value,
      interrupt: interrupt?.value
    }

    const dataHandParams = {
      platform_id: null,
      name: name?.value,
      port: port?.value
    }
    // 0 状态寄存器 1 非状态寄存器
    const ProcessorParams = {
      platform_id: null,
      name: name?.value,
      peripheral_id: peripheral_id?.value,
      kind: 1,
      relative_address: (relative_address?.value as string)?.trim().length % 2 === 0 ? relative_address?.value : `0${relative_address?.value}`
    }

    const mapParams = {
      customMadePeripheral: periperalParams,
      processor: ProcessorParams,
      time: timerParams,
      dataHandlerNotReferenced: dataHandParams
    }

    if (get().headerTabs) {
      return mapParams[get().headerTabs as keyof typeof mapParams]
    }
  },
  messageInfoFn: (keys, value) => {
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
    get().getTabsFromData()
  },

  // 初始化数据
  initFormValue: () => {
    set({
      headerTabs: null,
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
          validateStatus: undefined,
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
