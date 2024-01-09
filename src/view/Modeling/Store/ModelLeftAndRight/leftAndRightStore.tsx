/* eslint-disable indent */
import { create } from 'zustand'
import { throwErrorMessage } from 'Src/util/message'
import {
  getDataHandlerDetails,
  getPeripheralsDetails,
  getRegisterDetails,
  getTargetDetails,
  getTimerDetails,
  updateDataHandler,
  updatePeripherals,
  updateRegister,
  updateTimer
} from 'Src/services/api/modelApi'
import { produce } from 'immer'
import { RightStoreTypes, LeftStoreTypes } from './leftAndRightStoreType'
import ToolBox from '../ToolBoxStore/ToolBoxStore'
import { LeftListStore, LeftListStoreMap } from '../ModeleLeftListStore/LeftListStore'
import { LowCodeStore } from '../CanvasStore/canvasStore'

export const LeftAndRightStore = create<RightStoreTypes & LeftStoreTypes>((set, get) => ({
  // 目标机ID
  platform_id: null,
  // 默认是目标机属性
  flag: 5,
  // 注册工具函数
  selectLeftId: null,

  // 寄存器列表
  registerList: [],
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
    algorithm: { value: undefined, validateStatus: undefined, errorMsg: null },
    register_id: { value: undefined, validateStatus: undefined, errorMsg: null },
    peripheral_id: { value: undefined, validateStatus: undefined, errorMsg: null },
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
    peripheral: { value: undefined, validateStatus: undefined, errorMsg: null },
    peripheral_id: { value: undefined, validateStatus: undefined, errorMsg: null },
    relative_address: { value: undefined, validateStatus: undefined, errorMsg: null },
    kind: { value: undefined, validateStatus: undefined, errorMsg: null },
    sr_peri_id: { value: undefined, validateStatus: undefined, errorMsg: null },
    sr_id: { value: undefined, validateStatus: undefined, errorMsg: null },
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
  // 选择左侧数据的id 默认为目标机id
  setSelect: (id, flag) => {
    set({ selectLeftId: id, flag: flag || get().flag })
  },

  // 左侧数据
  setPlatFormId: id => {
    set({ platform_id: id })
  },
  // 失焦检查每一项是否有error信息
  onBlurFn: (status, type) => {
    if (status === 'error') return

    get().updateFn(type)
  },

  // 关闭菜单 更新数据
  closeMenu: (visibility: boolean, status: string | undefined, type: string) => {
    if (!visibility) {
      if (status === 'error') return
      get().updateFn(type)
    }
  },

  // 更新右侧属性数据信息
  updateRightAttributes: (type, baseData, data) => {
    const rightAttributesInfo: any = {}
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
      rightAttributesInfo[Element] = data[Element]
    })
    set({ rightAttributes: rightAttributesInfo })
  },

  // 获取数据处理器详情
  getDataHandlerDetail: async id => {
    try {
      const res = await getDataHandlerDetails(id)
      if (res.data) {
        // 填充数据处理器的值
        get().updateRightAttributes('rightDataHandler', get().rightDataHandler, res.data)
      }
      return res
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
        set({ registerList: res.data.registers })
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
  updateFn: type => {
    const { updateRegister, updateHandlerData, updatePeripheral, updateTimer } = get()
    const fnMap = {
      rightDataRegister: updateRegister,
      rightTimer: updateTimer,
      rightDataHandler: updateHandlerData,
      rightPeripheral: updatePeripheral
    }
    fnMap[type as keyof typeof fnMap]()
  },

  // 输入过程中进行校验
  onChangeFn: (type, keys, value) => {
    const validation = ['name', 'base_address', 'address_length', 'relative_address', 'interrupt', 'period'].includes(keys)
      ? new ToolBox(value as string, true, keys).validate()
      : new ToolBox(value as string, false, keys).validate()
    const { message, status } = validation
    set(state =>
      produce(state, draft => {
        const updatedDraft = draft
        updatedDraft[type as keyof typeof updatedDraft][keys].validateStatus = status
        updatedDraft[type as keyof typeof updatedDraft][keys].errorMsg = message
        updatedDraft[type as keyof typeof updatedDraft][keys].value = value
      })
    )
    if (keys === 'register_id') {
      LowCodeStore.getState().createRegisterNode(get().rightDataHandler)
    }
    // 更新是否为状态寄存器时,更新画布
    if (type === 'rightDataRegister' && keys === 'kind') {
      const isKindParams = !value
        ? {
            set_cmd: { value: undefined, validateStatus: undefined, errorMsg: null },
            restore_cmd: { value: undefined, validateStatus: undefined, errorMsg: null },
            set_value: { value: undefined, validateStatus: undefined, errorMsg: null },
            restore_value: { value: undefined, validateStatus: undefined, errorMsg: null }
          }
        : {
            sr_id: { value: undefined, validateStatus: undefined, errorMsg: null },
            sr_peri_id: { value: undefined, validateStatus: undefined, errorMsg: null }
          }
      set({ rightDataRegister: { ...get().rightDataRegister, ...isKindParams } })
      if (value === 0) {
        const id = get().platform_id
        const targetId = get().rightDataRegister.id
        const idExists = LowCodeStore.getState().nodes.some(item => item.id === String(targetId))

        if (idExists && id) {
          const node = LowCodeStore.getState().nodes.filter(item => String(targetId) !== item.id)
          const edge = LowCodeStore.getState().edges.filter(item => String(targetId) !== item.target)
          LowCodeStore.getState().setEdgesAndNodes(node, edge, String(id))
        }
      }
    }
  },

  // 更新外设信息
  updatePeripheral: async () => {
    const { rightPeripheral, platform_id } = get()
    const params = {
      platform_id,
      name: rightPeripheral.name.value,
      kind: rightPeripheral.kind.value,
      base_address:
        (rightPeripheral.base_address.value as string)?.trim().length % 2 === 0
          ? rightPeripheral.base_address.value
          : `0${rightPeripheral.base_address.value}`,
      id: rightPeripheral.id,
      address_length:
        (rightPeripheral.address_length.value as string).trim().length % 2 === 0
          ? rightPeripheral.address_length.value
          : `0${rightPeripheral.address_length.value}`,
      desc: rightPeripheral.desc.value
    }
    const res = await updatePeripherals(rightPeripheral.id as string, params)
    if (platform_id && res.data) {
      await LowCodeStore.getState().updatateNodeInfo(res.data, String(platform_id))
      LeftListStoreMap.getList('customPeripheral')
      set({ rightAttributes: params })
    }
  },

  // 更新数据处理器信息
  updateHandlerData: async (isBaseOnCanvas, inputParams) => {
    const { rightDataHandler, platform_id } = get()
    const params = {
      name: rightDataHandler.name.value as string,
      port: rightDataHandler.port.value as string,
      platform_id,
      interrupt: rightDataHandler.interrupt?.value ? rightDataHandler.interrupt?.value : null,
      sof:
        (rightDataHandler.sof.value as string)?.trim().length % 2 === 0
          ? rightDataHandler.sof.value
          : rightDataHandler.sof.value
          ? `0${rightDataHandler.sof.value}`
          : undefined,
      eof:
        (rightDataHandler.eof.value as string)?.trim().length % 2 === 0
          ? rightDataHandler.eof.value
          : rightDataHandler.eof.value
          ? `0${rightDataHandler.eof.value}`
          : undefined,
      algorithm: rightDataHandler.algorithm.value,
      length_member: rightDataHandler.length_member.value,
      checksum_member: rightDataHandler.checksum_member.value,
      framing_member: rightDataHandler.framing_member.value,
      peripheral_id: rightDataHandler.peripheral_id.value ? rightDataHandler.peripheral_id.value : null,
      register_id: rightDataHandler.register_id.value ? rightDataHandler.register_id.value : null
    }
    const res = isBaseOnCanvas
      ? await updateDataHandler(rightDataHandler.id, { ...params, ...inputParams })
      : await updateDataHandler(rightDataHandler.id, params)
    if (platform_id && res.data) {
      await LowCodeStore.getState().updatateNodeInfo(res.data, String(platform_id))
      get().updateRightAttributes('rightDataHandler', get().rightDataHandler, res.data)
      LeftListStoreMap.getList('handlerData')
      set({ rightAttributes: params })
    }
  },

  updateHandlerOut: async (id, output) => {
    const { rightDataHandler, platform_id } = get()
    const params = {
      name: rightDataHandler.name.value as string,
      port: rightDataHandler.port.value as string,
      platform_id,
      interrupt: rightDataHandler.interrupt?.value ? rightDataHandler.interrupt?.value : null,
      sof:
        (rightDataHandler.sof.value as string)?.trim().length % 2 === 0
          ? rightDataHandler.sof.value
          : rightDataHandler.sof.value
          ? `0${rightDataHandler.sof.value}`
          : undefined,
      eof:
        (rightDataHandler.eof.value as string)?.trim().length % 2 === 0
          ? rightDataHandler.eof.value
          : rightDataHandler.eof.value
          ? `0${rightDataHandler.eof.value}`
          : undefined,
      algorithm: rightDataHandler.algorithm.value,
      length_member: rightDataHandler.length_member.value,
      checksum_member: rightDataHandler.checksum_member.value,
      framing_member: rightDataHandler.framing_member.value,
      peripheral_id: rightDataHandler.peripheral_id.value ? rightDataHandler.peripheral_id.value : null,
      register_id: rightDataHandler.register_id.value ? rightDataHandler.register_id.value : null
    }
    const res = await updateDataHandler(id, { ...params, ...output })
    if (platform_id && res.data) {
      set({ rightAttributes: params })
    }
  },

  // 更新寄存器信息
  updateRegister: async () => {
    const { rightDataRegister, platform_id } = get()
    const baseParams = {
      platform_id,
      name: rightDataRegister.name.value as string,
      peripheral_id: rightDataRegister.peripheral_id.value,
      relative_address:
        (rightDataRegister.relative_address.value as string)?.trim().length % 2 === 0
          ? rightDataRegister.relative_address.value
          : rightDataRegister.relative_address.value
          ? `0${rightDataRegister.relative_address.value}`
          : undefined,
      finish: rightDataRegister.finish.value,
      kind: rightDataRegister.kind.value
    }

    const isKindParams = !rightDataRegister.kind.value
      ? {
          restore_cmd: rightDataRegister.restore_cmd.value,
          set_cmd: rightDataRegister.set_cmd.value,
          set_value:
            (rightDataRegister.set_value.value as string)?.trim().length % 2 === 0
              ? rightDataRegister.set_value.value
              : rightDataRegister.set_value.value
              ? `0${rightDataRegister.set_value.value}`
              : undefined,
          restore_value:
            (rightDataRegister.restore_value.value as string)?.trim().length % 2 === 0
              ? rightDataRegister.restore_value.value
              : rightDataRegister.restore_value.value
              ? `0${rightDataRegister.restore_value.value}`
              : undefined
        }
      : { sr_id: rightDataRegister.sr_id.value, sr_peri_id: rightDataRegister?.sr_peri_id.value || null }

    const params = { ...baseParams, ...isKindParams }
    const res = await updateRegister(rightDataRegister.id, params)
    if (platform_id && res.data) {
      await LowCodeStore.getState().updatateNodeInfo(res.data, String(platform_id))
      const tab = LeftListStore.getState().tabs
      // get().updateRightAttributes('rightDataRegister', get().rightDataRegister, res.data)
      LeftListStoreMap.getList(tab)
      set({ rightAttributes: params })
    }
  },

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
      await LowCodeStore.getState().updatateNodeInfo(res.data, String(platform_id))
      LeftListStoreMap.getList('timer')
      set({ rightAttributes: params })
    }
  },

  // 根据type,keys 清除值
  clearFn: (type, keys, value) => {
    set(state =>
      produce(state, draft => {
        const updatedDraft = draft
        updatedDraft[type as keyof typeof updatedDraft][keys].validateStatus = undefined
        updatedDraft[type as keyof typeof updatedDraft][keys].errorMsg = undefined
        updatedDraft[type as keyof typeof updatedDraft][keys].value = value
      })
    )
    if (type === 'rightDataHandler') {
      get().updateHandlerData()
    }
  },

  initLeftAndRight: () => {
    set({
      // 目标机ID
      platform_id: null,
      // 默认是目标机属性
      flag: 5,
      // 注册工具函数
      selectLeftId: null,

      // 寄存器列表
      registerList: [],
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
        algorithm: { value: undefined, validateStatus: undefined, errorMsg: null },
        register_id: { value: undefined, validateStatus: undefined, errorMsg: null },
        peripheral_id: { value: undefined, validateStatus: undefined, errorMsg: null },
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
        peripheral: { value: undefined, validateStatus: undefined, errorMsg: null },
        peripheral_id: { value: undefined, validateStatus: undefined, errorMsg: null },
        relative_address: { value: undefined, validateStatus: undefined, errorMsg: null },
        kind: { value: undefined, validateStatus: undefined, errorMsg: null },
        sr_peri_id: { value: undefined, validateStatus: undefined, errorMsg: null },
        sr_id: { value: undefined, validateStatus: undefined, errorMsg: null },
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
      }
    })
  }
}))
