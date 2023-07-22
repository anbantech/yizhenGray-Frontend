import * as React from 'react'
import StyleSheet from './inputNumberSuffix.less'

function InputNumberSuffixMemo() {
  return (
    <div className={StyleSheet.inputNumberSuffix}>
      <div className={StyleSheet.inputTop} />
      <div className={StyleSheet.inputBottom} />
    </div>
  )
}

const InputNumberSuffix = React.memo(InputNumberSuffixMemo)

export default InputNumberSuffix
