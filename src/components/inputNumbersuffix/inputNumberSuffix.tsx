import * as React from 'react'
import { LeftDropListStore } from 'Src/view/NewExcitation/ExcitaionStore/ExcitaionStore'
import StyleSheet from './inputNumberSuffix.less'

type porpsType = { type: string }
function InputNumberSuffixMemo({ type }: porpsType) {
  const increase = LeftDropListStore(state => state.increase)
  const decrease = LeftDropListStore(state => state.decrease)
  const setBtnStatus = LeftDropListStore(state => state.setBtnStatus)
  const operationUpFn = React.useCallback(
    (type: string) => {
      increase(type)
      setBtnStatus(false)
    },
    [increase, setBtnStatus]
  )

  const operationDownFn = React.useCallback(
    (type: string) => {
      decrease(type)
      setBtnStatus(false)
    },
    [decrease, setBtnStatus]
  )
  return (
    <div className={StyleSheet.inputNumberSuffix}>
      <div
        role='time'
        className={StyleSheet.inputTop}
        onClick={() => {
          operationUpFn(type)
        }}
      />
      <div
        role='time'
        className={StyleSheet.inputBottom}
        onClick={() => {
          operationDownFn(type)
        }}
      />
    </div>
  )
}

const InputNumberSuffix = React.memo(InputNumberSuffixMemo)

export default InputNumberSuffix