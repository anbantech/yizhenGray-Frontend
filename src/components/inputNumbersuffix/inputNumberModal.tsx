import * as React from 'react'
import stepStore from 'Src/view/Project/task/createTask/taskConfigCompents/sendListStore'
import StyleSheet from './inputNumberSuffix.less'

type porpsType = { type: string }
function InputNumberModalMemo({ type }: porpsType) {
  const increase = stepStore(state => state.increase)
  const decrease = stepStore(state => state.decrease)

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

const InputNumberSuffixModal = React.memo(InputNumberModalMemo)

export default InputNumberSuffixModal
