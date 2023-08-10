import * as React from 'react'
import { ArgeementDropListStore } from 'Src/view/NewExcitation/ExcitaionStore/ExcitaionStore'
import StyleSheet from './inputNumberSuffix.less'

type porpsType = { type: string }
function InputNumberModalMemo({ type }: porpsType) {
  const increase = ArgeementDropListStore(state => state.increase)
  const decrease = ArgeementDropListStore(state => state.decrease)

  const operationUpFn = React.useCallback(
    (type: string) => {
      increase(type)
    },
    [increase]
  )

  const operationDownFn = React.useCallback(
    (type: string) => {
      decrease(type)
    },
    [decrease]
  )
  return (
    <div className={StyleSheet.inputNumberSuffix}>
      <div
        role='time'
        className={StyleSheet.inputTop}
        onClick={(e: any) => {
          e.stopPropagation()
          operationUpFn(type)
        }}
      />
      <div
        role='time'
        className={StyleSheet.inputBottom}
        onClick={(e: any) => {
          e.preventDefault()
          operationDownFn(type)
        }}
      />
    </div>
  )
}

const NewInputNumberSuffixModal = React.memo(InputNumberModalMemo)

export default NewInputNumberSuffixModal
