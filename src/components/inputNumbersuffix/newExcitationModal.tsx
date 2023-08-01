import * as React from 'react'
import { ArgeementDropListStore } from 'Src/view/NewExcitation/ExcitaionStore/ExcitaionStore'
import StyleSheet from './inputNumberSuffix.less'

type porpsType = { type: string; detaileStatus: boolean }
function InputNumberModalMemo({ type, detaileStatus }: porpsType) {
  const increase = ArgeementDropListStore(state => state.increase)
  const decrease = ArgeementDropListStore(state => state.decrease)

  const operationUpFn = React.useCallback(
    (type: string) => {
      if (!detaileStatus) {
        increase(type)
      }
    },
    [detaileStatus, increase]
  )

  const operationDownFn = React.useCallback(
    (type: string) => {
      if (!detaileStatus) {
        decrease(type)
      }
    },
    [decrease, detaileStatus]
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

const NewInputNumberSuffixModal = React.memo(InputNumberModalMemo)

export default NewInputNumberSuffixModal
