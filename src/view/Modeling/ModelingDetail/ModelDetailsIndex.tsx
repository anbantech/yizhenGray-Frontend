import * as React from 'react'
import ModelingLeftIndex from './ModelLeft/ModelingLeftIndex'
import MiddleHeaderBar from './ModelMiddle/ModeingMiddleHeader'
import StyleSheet from './ModelDetaiIsIndex.less'
import ModelingRight from './ModelingRight/ModelingRightIndex'
import FlowWrapper from './ModelMiddle/ModelingCanvas'
import { formItemParamsCheckStore } from '../Store/ModelStore'

function ModelDetailsIndex() {
  const unSetTabs = formItemParamsCheckStore(state => state.unSetTabs)
  React.useEffect(() => {
    return () => {
      unSetTabs()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className={StyleSheet.ModelDetailsBody}>
      <ModelingLeftIndex />
      <div className={StyleSheet.ModelDetailsMiddle}>
        <MiddleHeaderBar />
        <FlowWrapper />
      </div>
      <ModelingRight />
    </div>
  )
}

export default ModelDetailsIndex
