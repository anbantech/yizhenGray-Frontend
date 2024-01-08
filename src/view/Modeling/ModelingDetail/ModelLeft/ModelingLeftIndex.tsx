import * as React from 'react'
import ModelingInput from './ModelingInput'
import ModelingLeftTabList from './ModelingLeftTabList'
import ModelLeftHeaderLeftMemo from './ModelItemTabsComponents'
import StyleSheet from './modelLeft.less'
import TImerAndDataHand from './TImerAndDataHand'
import { LeftListStore } from '../../Store/ModeleLeftListStore/LeftListStore'
import { HeaderStore } from '../../Store/HeaderStore/HeaderStore'

export interface LoactionState {
  state: Record<any, any>
}

function ModelingLeftIndex() {
  const tabs = LeftListStore(state => state.tabs)

  return (
    <div
      className={StyleSheet.ModelingLeftBody}
      role='time'
      onClick={e => {
        e.stopPropagation()
        HeaderStore.getState().setHeaderTabs(null)
      }}
    >
      <ModelLeftHeaderLeftMemo />
      <ModelingInput />
      {tabs && ['customPeripheral', 'boardPeripheral'].includes(tabs) ? <ModelingLeftTabList /> : <TImerAndDataHand />}
    </div>
  )
}

export default ModelingLeftIndex
