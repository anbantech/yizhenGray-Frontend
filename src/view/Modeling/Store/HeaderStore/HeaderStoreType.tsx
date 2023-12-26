import { newPeripheralsParams, newSetDataHanderParams, newSetRegisterParams, newSetTimerParams } from 'Src/globalType/Param'
import { BaseErrorType } from '../ModelLeftAndRight/leftAndRightStoreType'

export type optionalParametersType = {
  name?: BaseErrorType
  kind?: BaseErrorType
  port?: BaseErrorType
  period?: BaseErrorType
  interval?: BaseErrorType
  interrupt?: BaseErrorType
  base_address?: BaseErrorType
  address_length?: BaseErrorType
  peripheral_id?: BaseErrorType
  relative_address?: BaseErrorType
  desc?: BaseErrorType
}

export interface HeaderStoreType {
  headerTabs: null | string
  btnStatus: boolean
  params: any
  loading: boolean
  toggle: () => void
  optionalParameters: optionalParametersType
  setHeaderTabs: (val: string | null) => void
  initFormValue: () => void
  onChangeFn: (keys: string, value: string | string[] | undefined | number[] | number) => void
  messageInfoFn: () => void
  getTabsFromData: () => void
  createTimer: (params: newSetTimerParams, tabs: string) => void
  createDataHander: (params: newSetDataHanderParams, tabs: string) => void
  createRegister: (params: newSetRegisterParams) => void
  createPeripheral: (params: newPeripheralsParams, tabs: string) => void
  createCustomNode: (tabs: string, params: any) => void
}
