import * as React from 'react'
import { GlobalStatusStore, LeftDropListStore } from 'Src/view/NewExcitation/ExcitaionStore/ExcitaionStore'
import StyleSheet from './inputNumberSuffix.less'

type porpsType = { type: string }
function InputNumberSuffixMemo({ type }: porpsType) {
  const increase = LeftDropListStore(state => state.increase)
  const decrease = LeftDropListStore(state => state.decrease)

  const { setParamsChange, gu_cnt0, gu_w0 } = LeftDropListStore()
  const setSendBtnStatus = GlobalStatusStore(state => state.setSendBtnStatus)
  const operationUpFn = React.useCallback(
    (type: string) => {
      increase(type)
      setParamsChange(true)
      setSendBtnStatus(false)
    },
    [increase, setParamsChange, setSendBtnStatus]
  )

  const operationDownFn = React.useCallback(
    (type: string) => {
      decrease(type)
      setParamsChange(true)
      setSendBtnStatus(false)
    },
    [decrease, setParamsChange, setSendBtnStatus]
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
  return (
    <div className={StyleSheet.inputNumberSuffix}>
      <div
        role='time'
        className={styleFnTop ? StyleSheet.inputTopLast : StyleSheet.inputTop}
        onClick={() => {
          operationUpFn(type)
        }}
      />
      <div
        role='time'
        className={styleFnDown ? StyleSheet.inputBottomLower : StyleSheet.inputBottom}
        onClick={() => {
          operationDownFn(type)
        }}
      />
    </div>
  )
}

const InputNumberSuffix = React.memo(InputNumberSuffixMemo)

export default InputNumberSuffix
