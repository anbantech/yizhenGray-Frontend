import * as React from 'react'
import ModelingLeftIndex from './ModelLeft/ModelingLeftIndex'
import MiddleHeaderBar from './ModelMiddle/ModeingMiddleHeader'
import StyleSheet from './ModelDetaiIsIndex.less'
import ModelingRight from './ModelingRight/ModelingRightIndex'

function ModelDetailsIndex() {
  return (
    <div className={StyleSheet.ModelDetailsBody}>
      <ModelingLeftIndex />
      <MiddleHeaderBar />
      <ModelingRight />
    </div>
  )
}

export default ModelDetailsIndex
