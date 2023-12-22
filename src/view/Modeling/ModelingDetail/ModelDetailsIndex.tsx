import * as React from 'react'
import { useLocation } from 'react-router'
import ModelingLeftIndex, { LoactionState } from './ModelLeft/ModelingLeftIndex'
import MiddleHeaderBar from './ModelMiddle/ModeingMiddleHeader'
import StyleSheet from './ModelDetaiIsIndex.less'
import ModelingRight from './ModelingRight/ModelingRightIndex'
import FlowWrapper from './ModelMiddle/ModelingCanvas'
import { vieMarkDown } from '../Store/ModelStore'
import ViewMarkdown from './ViewMkdown'
import { LeftAndRightStore } from '../Store/ModelLeftAndRight/leftAndRightStore'

function ModelDetailsIndex() {
  const open = vieMarkDown(state => state.open)
  const markDown = vieMarkDown(state => state.markDown)
  const platformsId = (useLocation() as LoactionState).state?.id
  const platformsIdmemo = React.useMemo(() => platformsId, [platformsId])
  const setPlatFormId = LeftAndRightStore(state => state.setPlatFormId)

  React.useEffect(() => {
    if (platformsIdmemo) {
      setPlatFormId(platformsIdmemo)
    }
    return () => {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platformsIdmemo])

  return (
    <div className={StyleSheet.ModelDetailsBody}>
      <ModelingLeftIndex />
      <div className={StyleSheet.ModelDetailsMiddle}>
        <MiddleHeaderBar />
        <FlowWrapper />
      </div>
      <ModelingRight />
      <ViewMarkdown open={open} markDown={markDown} />
    </div>
  )
}

export default ModelDetailsIndex
