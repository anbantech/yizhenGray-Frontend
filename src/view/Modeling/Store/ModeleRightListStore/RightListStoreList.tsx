import { create } from 'zustand'
import { produce } from 'immer'
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
import { RightDetailsAttributesStoreParams, RightFormCheckStoreParams } from '../ModleStore'
import { rightFormCheckMap, titleMap } from '../MapStore'
import { saveCanvasAndUpdateNodeName } from '../../ModelingDetail/ModelingRight/ModelingRightCompoents'

// 右侧属性
const RightDetailsAttributesStore = create<RightDetailsAttributesStoreParams>((set, get) => ({
  typeAttributes: 'Target',
  focusNodeId: null,
  rightArrributes: {},
  register: [],
  setTypeDetailsAttributes: (val, id) => {
    set({ typeAttributes: val, focusNodeId: id })
  },

  getTimerAttributes: async id => {
    try {
      const res = await getTimerDetails(id)
      if (res.data) {
        set({ rightArrributes: res.data })
      }
    } catch (error) {
      // todo Error
      throwErrorMessage(error)
    }
  },
  getDataHandlerAttributes: async id => {
    try {
      const res = await getDataHandlerDetails(id)
      if (res.data) {
        set({ rightArrributes: res.data })
      }
    } catch (error) {
      // todo Error
      throwErrorMessage(error)
    }
  },
  getPeripheralAttributes: async (id, type) => {
    try {
      const res = await getPeripheralsDetails(id)
      if (res.data) {
        if (type === 'getList') {
          set({ register: res.data })
        } else {
          set({ rightArrributes: res.data })
        }
      }
    } catch (error) {
      // todo Error
      throwErrorMessage(error)
    }
  },
  getRegisterAttributes: async id => {
    try {
      const res = await getRegisterDetails(id)
      if (res.data) {
        set({ rightArrributes: res.data })
      }
    } catch (error) {
      // todo Error
      throwErrorMessage(error)
    }
  },
  getTargetAttributes: async id => {
    try {
      const res = await getTargetDetails(id)
      if (res.data) {
        set({ rightArrributes: res.data })
      }
    } catch (error) {
      throwErrorMessage(error)
    }
  },
  rightAttrubutesMap: (type, id) => {
    set({ typeAttributes: type, focusNodeId: id })
    const { getDataHandlerAttributes, getRegisterAttributes, getTimerAttributes, getPeripheralAttributes, getTargetAttributes } = get()
    switch (type) {
      case 'Target':
        getTargetAttributes(id as number)
        break
      case 'Processor':
        getDataHandlerAttributes(id as number)
        break
      case 'Peripheral':
        getPeripheralAttributes(id as number)
        break
      case 'Register':
        getRegisterAttributes(id as number)
        break
      case 'Timer':
        getTimerAttributes(id as number)
        break
      default:
        break
    }
  }
}))

// 右侧表单校验
const RightListStore = create<RightFormCheckStoreParams>((set, get) => ({
  // 目标机id
  platform_id: null,
  // 寄存器列表
  registerList: [],
  // 定时器表单数据
  timer: {
    id: null,
    name: {
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
    }
  },
  // 数据处理器表单数据
  processor: {
    id: null,
    name: { value: '', validateStatus: '', errorMsg: '' },
    port: { value: '', validateStatus: '', errorMsg: '' },
    interrupt: { value: '', validateStatus: '', errorMsg: '' },
    sof: { value: '', validateStatus: '', errorMsg: '' },
    eof: { value: '', validateStatus: '', errorMsg: '' },
    algorithm: { value: [], validateStatus: '', errorMsg: '' },
    length_member: { value: [], validateStatus: '', errorMsg: '' },
    checksum_member: { value: [], validateStatus: '', errorMsg: '' },
    framing_member: { value: [], validateStatus: '', errorMsg: '' },
    peripheral_id: { value: '', validateStatus: '', errorMsg: '' },
    register_id: { value: '', validateStatus: '', errorMsg: '' }
  },
  // 外设
  peripheral: {
    id: null,
    variety: null,
    name: {
      value: '',
      validateStatus: '',
      errorMsg: ''
    },
    kind: {
      value: '',
      validateStatus: '',
      errorMsg: ''
    },
    address_length: {
      value: '',
      validateStatus: '',
      errorMsg: ''
    },
    base_address: {
      value: '',
      validateStatus: '',
      errorMsg: ''
    },
    desc: {
      value: '',
      validateStatus: '',
      errorMsg: ''
    }
  },
  // 寄存器  Register: ['peripheral_id', 'name', 'relative_address', 'kind', 'finish', 'variety']
  register: {
    id: null,
    name: { value: '', validateStatus: '', errorMsg: '' },
    peripheral: { value: '', validateStatus: '', errorMsg: '' },
    peripheral_id: { value: '', validateStatus: '', errorMsg: '' },
    relative_address: { value: '', validateStatus: '', errorMsg: '' },
    kind: { value: '', validateStatus: '', errorMsg: '' },
    finish: { value: '', validateStatus: '', errorMsg: '' },
    variety: { value: '', validateStatus: '', errorMsg: '' },
    set_cmd: { value: '', validateStatus: '', errorMsg: '' },
    restore_cmd: { value: '', validateStatus: '', errorMsg: '' },
    set_value: { value: '', validateStatus: '', errorMsg: '' },
    restore_value: { value: '', validateStatus: '', errorMsg: '' },
    sr_id: { value: '', validateStatus: '', errorMsg: '' },
    sr_peri_id: { value: '', validateStatus: '', errorMsg: '' }
  },
  messageInfoFn: (item, type, title, validateStatus, errorMsg, val) => {
    set(state =>
      produce(state, draft => {
        const updatedDraft = draft
        ;(updatedDraft[item as keyof typeof updatedDraft] as any)[type].validateStatus = validateStatus
        ;(updatedDraft[item as keyof typeof updatedDraft] as any)[type].errorMsg = errorMsg === null ? null : `${title}${errorMsg}`
        ;(updatedDraft[item as keyof typeof updatedDraft] as any)[type].value = val
      })
    )
  },
  // 校验名称格式
  frontendCheckoutName: (val, title, type, fn1, fn2) => {
    const item = titleMap[title as keyof typeof titleMap]
    const { messageInfoFn } = get()
    if (!fn1(val)) {
      return messageInfoFn(item, type, title, 'error', '名称长度在2-20个字符之间', val)
    }

    if (!fn2(val)) {
      return messageInfoFn(item, type, title, 'error', '名称由数字、字母和下划线组成,不能以数字开头', val)
    }

    messageInfoFn(item, type, title, 'success', null, val)
  },
  // 校验基地址,地址大小
  checkoutBase_addreeAndLength: (val, title, type, fn1) => {
    const { messageInfoFn } = get()
    const item = titleMap[title as keyof typeof titleMap]
    if (!fn1(val)) {
      return messageInfoFn(item, type, title, 'error', '请输入由0-9,A-F(或a-f)组成的16进制数', val)
    }
    messageInfoFn(item, type, title, '', null, val)
  },
  // 失焦异步校验  fn1 更新函数
  onBlurAsyncCheckoutNameFormValues: async (val, title, type, fn1) => {
    const { checkEveryItemIsError, messageInfoFn } = get()
    const item = titleMap[title as keyof typeof titleMap]
    if (val.length === 0) return
    if (!checkEveryItemIsError(title)) {
      messageInfoFn(item, type, title, '', null, val)
      fn1()
    }
  },

  // 检查数据处理器是否含有error数据
  checkEveryItemIsError: title => {
    const item = titleMap[title as keyof typeof titleMap]
    const val = get()?.[item as keyof typeof get]
    const res = Object.keys(val).some(item => {
      return (val[item as keyof typeof val] as { validateStatus: string }).validateStatus === 'error'
    })
    return res
  },

  // 用户点击左侧列表,或者失焦更新表单数据
  updateTimerFormValue: (title, type, value) => {
    const item = titleMap[title as keyof typeof titleMap]
    const { platform_id, id } = value
    set({ platform_id })
    if (value?.registers?.length > 0) {
      set({ registerList: value.registers })
    }
    if ([0, 1].includes(value.variety) && value.variety !== undefined && item === 'peripheral') {
      set(state =>
        produce(state, draft => {
          const updatedDraft: any = draft
          updatedDraft[item as keyof typeof updatedDraft].variety = value.variety
        })
      )
    }
    set(state =>
      produce(state, draft => {
        const updatedDraft: any = draft
        updatedDraft[item as keyof typeof updatedDraft].id = id
      })
    )
    rightFormCheckMap[type as keyof typeof rightFormCheckMap].forEach(element => {
      set(state =>
        produce(state, draft => {
          const updatedDraft = draft
          ;(updatedDraft[item as keyof typeof updatedDraft] as any)[element].validateStatus = ''
          ;(updatedDraft[item as keyof typeof updatedDraft] as any)[element].errorMsg = null
          ;(updatedDraft[item as keyof typeof updatedDraft] as any)[element].value = value[element as keyof typeof value]
        })
      )
    })
  },

  // 只有一次校验的元素使用次方法更新值
  updateOnceFormValue: (val, title, type) => {
    const { messageInfoFn } = get()
    const item = titleMap[title as keyof typeof titleMap]
    messageInfoFn(item, type, title, '', null, val)
  },
  // 校验定时器的中断号,间隔
  checkoutTimerPeriodAndInterrupt: (val, title, type, fn1) => {
    if (val.length === 0) return
    const { updateTimer, checkEveryItemIsError, messageInfoFn } = get()
    const item = titleMap[title as keyof typeof titleMap]
    if (type === 'period' && !fn1(val)) {
      return messageInfoFn(item, type, title, 'error', '请输入0-65535的整数', val)
    }
    if (type === 'interrupt' && !fn1(val)) {
      return messageInfoFn(item, type, title, 'error', '请输入0-255的整数', val)
    }
    messageInfoFn(item, type, title, '', null, val)
    if (checkEveryItemIsError(title)) return
    updateTimer()
  },
  // 校验数据处理器 中断号 ,帧头, 帧尾 基地址
  checkoutProcessor: (val, title, type, fn1, fn2) => {
    if (val.length === 0) return
    const { checkEveryItemIsError, messageInfoFn } = get()
    const item = titleMap[title as keyof typeof titleMap]
    if (type === 'interrupt' && !fn1(val)) {
      return messageInfoFn(item, type, title, 'error', '请输入0~255的整数', val)
    }
    if (['sof', 'eof'].includes(type)) {
      if (!fn1(val)) {
        return messageInfoFn(item, type, title, 'error', '请输入由0-9,A-F(或a-f)组成的16进制数', val)
      }
      const hexLength = val.trim().length
      if (hexLength % 2 !== 0) {
        const hexValue0 = `0${val}`
        messageInfoFn(item, type, title, '', null, hexValue0)
      }
    }
    messageInfoFn(item, type, title, '', null, val)
    if (checkEveryItemIsError(title)) return
    fn2()
  },
  // 过滤有值的key
  filterObject: (obj: any) => {
    const result = {} as any
    for (const key in obj) {
      if (obj[key] !== null && obj[key] !== undefined) {
        result[key] = obj[key]
      }
    }
    return result
  },
  // 更新定时器
  updateTimer: async () => {
    const { timer, platform_id } = get()
    const params = {
      platform_id,
      name: timer.name.value as string,
      period: timer.period.value,
      interrupt: timer.interrupt.value
    }
    const res = await updateTimer(timer.id, params)
    // return res
  },
  // 更新数据处理器
  updateProcessor: async () => {
    const { processor, platform_id } = get()
    const params = {
      name: processor.name.value as string,
      port: processor.port.value as string,
      platform_id,
      interrupt: processor.interrupt?.value,
      sof: processor.sof.value,
      eof: processor.eof.value,
      algorithm: processor.algorithm.value,
      length_member: processor.length_member.value,
      checksum_member: processor.checksum_member.value,
      framing_member: processor.framing_member.value,
      peripheral_id: processor.peripheral_id.value,
      register_id: processor.register_id.value
    }

    const res = await updateDataHandler(processor.id, params)
  },
  // 更新外设
  updatePeripheral: async () => {
    const { peripheral, platform_id } = get()
    const params = {
      platform_id,
      name: peripheral.name.value,
      kind: peripheral.kind.value,
      base_address:
        (peripheral.base_address.value as string)?.trim().length % 2 === 0 ? peripheral.base_address.value : `0x${peripheral.base_address.value}`,
      id: peripheral.id,
      address_length:
        (peripheral.address_length.value as string).trim().length % 2 === 0
          ? peripheral.address_length.value
          : `0x${peripheral.address_length.value}`,
      desc: peripheral.desc.value
    }

    const res = await updatePeripherals(peripheral.id as string, params)
    if (res.data) {
      saveCanvasAndUpdateNodeName(String(res.data.id), { label: res.data.name })
      console.log(res.data)
    }
  },
  // 更新寄存器
  updateRegister: async () => {
    const { register } = get()
    const params = {
      name: register.name.value,
      kind: register.kind.value,
      finish: register.finish.value,
      peripheral_id: register.peripheral_id.value,
      relative_address: register.relative_address.value,
      variety: register.variety.value
    }
    const additionalParamsTrue = {
      set_cmd: register.set_cmd.value,
      restore_cmd: register.restore_cmd.value,
      set_value: register.set_value.value,
      restore_value: register.restore_value.value
    }
    const additionalParamsFalse = {
      sr_id: register.sr_id.value
    }

    const paramsIsOrNot = register.kind.value === 0 ? additionalParamsFalse : additionalParamsTrue
    const paramsObject = { ...params, ...paramsIsOrNot }
    const res = await updateRegister(register.id, paramsObject)
  }
}))

export { RightListStore, RightDetailsAttributesStore }
