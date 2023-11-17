import * as React from 'react'
import { useLocation } from 'react-router'
import { useLeftModelDetailsStore } from '../../Store/ModelStore'
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
  const getModelListDetails = useLeftModelDetailsStore(state => state.getModelListDetails)
  const getList = useLeftModelDetailsStore(state => state.getList)
  const tabs = useLeftModelDetailsStore(state => state.tabs)
  const { getAllPeripheral } = useLeftModelDetailsStore()

  React.useEffect(() => {
    if (platformsIdmemo) {
      getAllPeripheral(platformsIdmemo as number)
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
