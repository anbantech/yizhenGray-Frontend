import * as React from 'react'
import StyleSheet from './inputNumberSuffix.less'

type porpsType = { increase: any; decrease: any }
function InputNumberSuffixMemo({ increase, decrease }: porpsType) {
  return (
    <div className={StyleSheet.inputNumberSuffix}>
      <div role='time' className={StyleSheet.inputTop} onClick={increase} />
      <div role='time' className={StyleSheet.inputBottom} onClick={decrease} />
    </div>
  )
}

const CommonInputNumberSuffix = React.memo(InputNumberSuffixMemo)

export default CommonInputNumberSuffix
