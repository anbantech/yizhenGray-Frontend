// todo 什么情况要更新外设建模详情,重启

import * as React from 'react'
import { useLocation } from 'react-router'
import { useModelDetailsStore } from '../../Store/ModelStore'
import ModelingInput from './ModelingInput'
import ModelingLeftTabList from './ModelingLeftTabList'
import ModelLeftHeaderLeftMemo from './ModelItemTabsComponents'
import StyleSheet from './modelLeft.less'

export interface LoactionState {
  state: Record<any, any>
}

function ModelingLeftIndex() {
  const platformsId = (useLocation() as LoactionState).state?.id
  const platformsIdmemo = React.useMemo(() => platformsId, [platformsId])
  const getModelListDetails = useModelDetailsStore(state => state.getModelListDetails)
  const getList = useModelDetailsStore(state => state.getList)
  const tabs = useModelDetailsStore(state => state.tabs)
  React.useEffect(() => {
    if (platformsIdmemo) {
      getModelListDetails(platformsIdmemo)
      getList(tabs, platformsIdmemo)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platformsIdmemo])
  return (
    <div className={StyleSheet.ModelingLeftBody}>
      <ModelLeftHeaderLeftMemo />
      <ModelingInput />
      <ModelingLeftTabList />
    </div>
  )
}

export default ModelingLeftIndex
