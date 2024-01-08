import * as React from 'react'
import { ReactFlowProvider } from 'reactflow'
import { useLocation } from 'react-router'
import ModelingLeftIndex, { LoactionState } from './ModelLeft/ModelingLeftIndex'

import MiddleHeaderBar from './ModelMiddle/ModeingMiddleHeader'
import StyleSheet from './ModelDetaiIsIndex.less'
import ModelingRight from './ModelingRight/ModelingRightIndex'
import LowCodeWrapper from './ModelMiddle/LowCode'
import { publicAttributes, vieMarkDown } from '../Store/ModelStore'

import ViewMarkdown from './ViewMkdown'
import { LeftAndRightStore } from '../Store/ModelLeftAndRight/leftAndRightStore'
import { LeftListStore } from '../Store/ModeleLeftListStore/LeftListStore'

import { LowCodeStore } from '../Store/CanvasStore/canvasStore'

function ModelDetailsIndex() {
  const open = vieMarkDown(state => state.open)
  const markDown = vieMarkDown(state => state.markDown)
  const platformsId = (useLocation() as LoactionState).state?.id
  const setPlatFormId = LeftAndRightStore(state => state.setPlatFormId)

  // 首次加载自定义外设列表
  const getList = LeftListStore(state => state.getList)
  const setPortList = publicAttributes(state => state.setPortList)
  // 初始化画布数据
  const getModelDetails = LowCodeStore(state => state.getModelDetails)

  React.useEffect(() => {
    if (platformsId) {
      getModelDetails(platformsId)
      setPortList()
      setPlatFormId(platformsId)
    }
  }, [getList, getModelDetails, platformsId, setPlatFormId, setPortList])

  React.useEffect(() => {
    LeftListStore.getState().getAllList()
    return () => {
      LeftAndRightStore.getState().initLeftAndRight()
    }
  }, [])

  return (
    <div className={StyleSheet.ModelDetailsBody}>
      <div className={StyleSheet.ModelDetailsBodyLeft}>
        <MiddleHeaderBar />
        <ReactFlowProvider>
          <div className={StyleSheet.ModelDetailsMiddle}>
            <ModelingLeftIndex />
            <LowCodeWrapper />
          </div>
        </ReactFlowProvider>
      </div>
      <ModelingRight />
      <ViewMarkdown open={open} markDown={markDown} />
    </div>
  )
}

export default ModelDetailsIndex
