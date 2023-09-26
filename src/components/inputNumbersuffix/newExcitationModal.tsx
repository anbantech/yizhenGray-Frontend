import * as React from 'react'
import { ArgeementDropListStore } from 'Src/view/NewExcitation/ExcitaionStore/ExcitaionStore'
import StyleSheet from './inputNumberSuffix.less'

type porpsType = { type: string }
function InputNumberModalMemo({ type }: porpsType) {
  const increase = ArgeementDropListStore(state => state.increase)
  const decrease = ArgeementDropListStore(state => state.decrease)
  const { gu_cnt0, gu_w0 } = ArgeementDropListStore()
  const operationUpFn = React.useCallback(
    (type: string) => {
      increase(type)
    },
    [increase]
  )
  const styleFnTop = React.useMemo(() => {
    if (type === 'gu_cnt0') {
      return gu_cnt0 === 20
    }
    return gu_w0 === 100
  }, [gu_w0, gu_cnt0, type])

  const styleFnDown = React.useMemo(() => {
    if (type === 'gu_cnt0') {
      return gu_cnt0 === 1
    }
    return gu_w0 === 0
  }, [gu_w0, gu_cnt0, type])

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
        className={styleFnTop ? StyleSheet.inputTopLast : StyleSheet.inputTop}
        onClick={(e: any) => {
          e.stopPropagation()
          operationUpFn(type)
        }}
      />
      <div
        role='time'
        className={styleFnDown ? StyleSheet.inputBottomLower : StyleSheet.inputBottom}
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
