import * as React from 'react'
import stepStore from 'Src/view/Project/task/createTask/taskConfigCompents/sendListStore'
import StyleSheet from './inputNumberSuffix.less'

type porpsType = { type: string }
function InputNumberModalMemo({ type }: porpsType) {
  const increase = stepStore(state => state.increase)
  const decrease = stepStore(state => state.decrease)

  const gu_w0 = stepStore(state => state.gu_w0)
  const gu_cnt0 = stepStore(state => state.gu_cnt0)
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

  const styleFnDown = React.useMemo(() => {
    if (type === 'gu_cnt0') {
      return gu_cnt0 === 1
    }
    return gu_w0 === 0
  }, [gu_w0, gu_cnt0, type])

  const styleFnTop = React.useMemo(() => {
    if (type === 'gu_cnt0') {
      return gu_cnt0 === 20
    }
    return gu_w0 === 100
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

const InputNumberSuffixModal = React.memo(InputNumberModalMemo)

export default InputNumberSuffixModal
