import { create } from 'zustand'
import { throwErrorMessage } from 'Src/util/message'
import {
  getDataHandlerDetails,
  getPeripheralsDetails,
  getRegisterDetails,
  getTargetDetails,
  getTimerDetails,
  updateTimer
} from 'Src/services/api/modelApi'
import { produce } from 'immer'
import { RightStoreTypes, LeftStoreTypes } from './leftAndRightStoreType'
import ToolBox from '../ToolBoxStore/ToolBoxStore'

export const LeftAndRightStore = create<RightStoreTypes & LeftStoreTypes>((set, get) => ({
  // 目标机ID
  platform_id: null,
  // 默认是目标机属性
  flag: 5,
  // 注册工具函数
  selectLeftId: null,
  // 选择左侧数据的id 默认为目标机id
  setSelect: id => {
    set({ selectLeftId: id })
  },

  // 左侧数据
  setPlatFormId: id => {
    set({ platform_id: id })
  },
  // 右侧属性
  rightAttributes: {},
  rightPeripheral: {
    id: null,
    variety: null,
    name: {
      value: undefined,
      validateStatus: undefined,
      errorMsg: null
    },
    kind: {
      value: undefined,
      validateStatus: undefined,
      errorMsg: null
    },
    address_length: {
      value: undefined,
      validateStatus: undefined,
      errorMsg: null
    },
    base_address: {
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
  rightDataHandler: {
    id: null,
    name: { value: undefined, validateStatus: undefined, errorMsg: null },
    port: { value: undefined, validateStatus: undefined, errorMsg: null },
    interrupt: { value: undefined, validateStatus: undefined, errorMsg: null },
    sof: { value: undefined, validateStatus: undefined, errorMsg: null },
    eof: { value: undefined, validateStatus: undefined, errorMsg: null },
    algorithm: { value: [], validateStatus: undefined, errorMsg: null },
    length_member: { value: [], validateStatus: undefined, errorMsg: null },
    checksum_member: { value: [], validateStatus: undefined, errorMsg: null },
    framing_member: { value: [], validateStatus: undefined, errorMsg: null }
  },
  rightTimer: {
    id: null,
    name: { value: undefined, validateStatus: undefined, errorMsg: null },
    period: { value: undefined, validateStatus: undefined, errorMsg: null },
    interrupt: { value: undefined, validateStatus: undefined, errorMsg: null }
  },
  rightDataRegister: {
    id: null,
    name: { value: undefined, validateStatus: undefined, errorMsg: null },
    peripheral_id: { value: undefined, validateStatus: undefined, errorMsg: null },
    relative_address: { value: undefined, validateStatus: undefined, errorMsg: null },
    kind: { value: undefined, validateStatus: undefined, errorMsg: null },
    finish: { value: undefined, validateStatus: undefined, errorMsg: null },
    variety: { value: undefined, validateStatus: undefined, errorMsg: null },
    set_cmd: { value: undefined, validateStatus: undefined, errorMsg: null },
    restore_cmd: { value: undefined, validateStatus: undefined, errorMsg: null },
    set_value: { value: undefined, validateStatus: undefined, errorMsg: null },
    restore_value: { value: undefined, validateStatus: undefined, errorMsg: null }
  },
  rightTargetDetail: {
    name: { value: undefined, validateStatus: undefined, errorMsg: null },
    desc: { value: undefined, validateStatus: undefined, errorMsg: null },
    processor: { value: undefined, validateStatus: undefined, errorMsg: null }
  },
  // 更新右侧属性数据信息
  updateRightAttributes: (type, baseData, data) => {
    Object.keys(baseData).forEach(Element => {
      set(state =>
        produce(state, draft => {
          const updatedDraft = draft
          if (['id'].includes(Element)) {
            updatedDraft[type as keyof typeof updatedDraft].id = data.id
          } else if (['variety'].includes(Element)) {
            updatedDraft[type as keyof typeof updatedDraft].variety = data.variety
          } else {
            updatedDraft[type as keyof typeof updatedDraft][Element].validateStatus = null
            updatedDraft[type as keyof typeof updatedDraft][Element].errorMsg = null
            updatedDraft[type as keyof typeof updatedDraft][Element].value = data[Element]
          }
        })
      )
    })
  },
  // 获取数据处理器详情
  getDataHandlerDetail: async id => {
    try {
      const res = await getDataHandlerDetails(id)
      if (res.data) {
        // 填充数据处理器的值
        get().updateRightAttributes('rightDataHandler', get().rightDataHandler, res.data)
      }
    } catch (error) {
      throwErrorMessage(error)
    }
  },
  // 获取寄存器详情
  getRegisterDetail: async id => {
    try {
      const res = await getRegisterDetails(id)
      if (res.data) {
        // 填充数据处理器的值
        get().updateRightAttributes('rightDataRegister', get().rightDataRegister, res.data)
      }
    } catch (error) {
      throwErrorMessage(error)
    }
  },
  // 获取外设详情
  getPeripheralDetail: async id => {
    try {
      const res = await getPeripheralsDetails(id)
      if (res.data) {
        // 填充外设的值
        get().updateRightAttributes('rightPeripheral', get().rightPeripheral, res.data)
      }
    } catch (error) {
      throwErrorMessage(error)
    }
  },
  // 获取定时器详情
  getTimerDetail: async id => {
    try {
      const res = await getTimerDetails(id)
      if (res.data) {
        // 填充定时器
        get().updateRightAttributes('rightTimer', get().rightTimer, res.data)
      }
    } catch (error) {
      throwErrorMessage(error)
    }
  },
  // 获取目标机详情
  getTargetDetail: async (id: number) => {
    try {
      const res = await getTargetDetails(id)
      if (res.data) {
        if (res.data) {
          // 填充目标机
          get().updateRightAttributes('rightTargetDetail', get().rightTargetDetail, res.data)
        }
      }
    } catch (error) {
      throwErrorMessage(error)
    }
  },
  getRightAttributes: (id, flag) => {
    switch (flag) {
      case 1:
        get().getPeripheralDetail(id)
        break
      case 2:
        get().getRegisterDetail(id)
        break
      case 3:
        get().getDataHandlerDetail(id)
        break
      case 4:
        get().getTimerDetail(id)
        break
      default:
        get().getTargetDetail(id)
        break
    }
  },
  // 收集信息 校验函数 根据keys 选择不同函数进行校验 返回 {errorMsg validateStatus value}

  messageInfoFn: (type, keys, value) => {
    let validation
    if (keys === 'name') {
      validation = new ToolBox(value as string, true, keys).validate()
    } else {
      validation = new ToolBox(value as string, false, keys).validate()
    }
    const { message, status } = validation
    set(state =>
      produce(state, draft => {
        const updatedDraft = draft
        updatedDraft[type as keyof typeof updatedDraft][keys].validateStatus = status
        updatedDraft[type as keyof typeof updatedDraft][keys].errorMsg = message
        updatedDraft[type as keyof typeof updatedDraft][keys].value = value
      })
    )
  },

  // 更新外设信息

  // 更新数据处理器信息

  // 更新寄存器信息

  // 更新定时器信息
  updateTimer: async () => {
    const { rightTimer, platform_id } = get()
    const params = {
      platform_id,
      name: rightTimer.name.value as string,
      period: rightTimer.period.value,
      interrupt: rightTimer.interrupt.value
    }
    const res = await updateTimer(rightTimer.id, params)
    if (platform_id && res.data) {
      //   getListFn('time', +platform_id)
    }
  }
}))

export const leftAndRightMap = {
  platform_id: LeftAndRightStore.getState().platform_id
}
