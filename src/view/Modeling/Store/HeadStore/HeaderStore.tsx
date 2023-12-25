import { create } from 'zustand'
import { produce } from 'immer'
import { HeaderStoreType } from './HeaderStoreType'
import ToolBox from '../ToolBoxStore/ToolBoxStore'

// 表单接口校验
export const HeaderStore = create<HeaderStoreType>((set, get) => ({
  headerTabs: null,
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
