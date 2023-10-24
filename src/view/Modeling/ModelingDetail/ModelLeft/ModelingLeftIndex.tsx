import * as React from 'react'
import ModelingInput from './ModelingInput'
import ModelLeftHeaderLeftMemo from './ModelItemTabsComponents'
import StyleSheet from './modelLeft.less'

function ModelingLeftIndex() {
  return (
    <div className={StyleSheet.ModelingLeftBody}>
      <ModelLeftHeaderLeftMemo />
      <ModelingInput />
      <span> 3 </span>
    </div>
  )
}

export default ModelingLeftIndex
