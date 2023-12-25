import { BaseErrorType } from '../ModelLeftAndRight/leftAndRightStoreType'

type optionalParametersType = {
  name?: BaseErrorType
  kind?: BaseErrorType
  port?: BaseErrorType
  period?: BaseErrorType
  interrupt?: BaseErrorType
  base_address?: BaseErrorType
  address_length?: BaseErrorType
  peripheral_id?: BaseErrorType
  relative_address?: BaseErrorType
  desc?: BaseErrorType
}

export interface HeaderStoreType {
  headerTabs: null | string
  optionalParameters: optionalParametersType
  setHeaderTabs: (val: string | null) => void
  initFormValue: () => void
  messageInfoFn: (keys: string, value: string | string[] | undefined | number[]) => void
}
