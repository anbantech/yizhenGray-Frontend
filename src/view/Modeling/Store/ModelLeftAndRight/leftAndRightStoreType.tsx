export type BaseErrorType = {
  value: undefined | string | number
  validateStatus: undefined | 'success' | 'error' | 'warning' | 'validating' | ''
  errorMsg: null | string
}

export type BaseDataHandler = {
  value: [] | string[] | number[]
  validateStatus: undefined | 'success' | 'error' | 'warning' | 'validating' | ''
  errorMsg: null | string
}

type RightPeripheralType = {
  id: string | null
  variety: number | null
  name: BaseErrorType
  kind: BaseErrorType
  address_length: BaseErrorType
  base_address: BaseErrorType
  desc: BaseErrorType
}

type TimerType = {
  id: string | null
  name: BaseErrorType
  period: BaseErrorType
  interrupt: BaseErrorType
}

type RightDataHandlerType = {
  id: string | null
  name: BaseErrorType
  interrupt: BaseErrorType
  sof: BaseErrorType
  port: BaseErrorType
  eof: BaseErrorType
  peripheral_id: BaseErrorType
  register_id: BaseErrorType
  algorithm: BaseErrorType
  length_member: BaseDataHandler
  checksum_member: BaseDataHandler
  framing_member: BaseDataHandler
}

type RightTargetType = {
  name: BaseErrorType
  desc: BaseErrorType
  processor: BaseErrorType
}

type RightRegisterType = {
  id: string | null
  name: BaseErrorType
  peripheral_id: BaseErrorType
  peripheral: BaseErrorType
  relative_address: BaseErrorType
  sr_peri_id: BaseErrorType
  sr_id: BaseErrorType
  kind: BaseErrorType
  finish: BaseErrorType
  variety: BaseErrorType
  set_cmd: BaseErrorType
  restore_cmd: BaseErrorType
  set_value: BaseErrorType
  restore_value: BaseErrorType
}

export interface RightStoreTypes {
  rightAttributes: any
  getTimerDetail: (id: number) => void
  getPeripheralDetail: (id: number) => void
  getRegisterDetail: (id: number) => void
  getDataHandlerDetail: (id: number) => void
  getTargetDetail: (id: number) => void
  getRightAttributes: (id: number, flag: number) => void
  rightPeripheral: RightPeripheralType
  rightTimer: TimerType
  rightDataHandler: RightDataHandlerType
  rightDataRegister: RightRegisterType
  rightTargetDetail: RightTargetType
  updateRightAttributes: (
    type: string,
    baseData: RightDataHandlerType | RightRegisterType | RightPeripheralType | TimerType | RightTargetType,
    data: any
  ) => void
  // 失焦校验 是否有error 信息
  onBlurFn: (status: string | undefined, type: string) => void
  closeMenu: (visibility: boolean, status: string | undefined, type: string) => void
  updateRegister: () => void
  // 更新外设信息
  updatePeripheral: () => void
  // 更新数据处理器信息
  updateHandlerData: (isBaseOnCanvas?: boolean, inputParams?: any) => void
  updateTimer: () => void
  updateFn: (type: string) => void
  onChangeFn: (type: string, keys: string, value: string | string[] | undefined | number[] | number | undefined | null, isValue?: boolean) => void
  // 外部直接调用更新数据处理器接口
  updateHandlerOut: (id: number, output: any) => void
}

export interface LeftStoreTypes {
  platform_id: null | number
  registerList: any
  flag: number
  selectLeftId: null | number
  setSelect: (id: number, flag?: number) => void
  setPlatFormId: (id: number) => void
  clearFn: (type: string, keys: string, value: string | null | undefined | []) => void
  initLeftAndRight: () => void
}
