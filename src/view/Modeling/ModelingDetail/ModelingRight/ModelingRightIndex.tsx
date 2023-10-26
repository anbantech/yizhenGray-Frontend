import * as React from 'react'
import { RightDetailsAttributesStore } from '../../Store/ModelStore'
import StyleSheet from './ModelingRight.less'
import TabsDetailsAttributes from './ModelingRightCompoents'

const Header = () => {
  return (
    <div className={StyleSheet.rightSideheaderBody}>
      <span className={StyleSheet.rightHeaderSpan}>属性</span>
      <span className={StyleSheet.rightHeaderSpan2} />
    </div>
  )
}

function ModelingRight() {
  const typeAttributes = RightDetailsAttributesStore(state => state.typeAttributes)
  return (
    <div className={StyleSheet.ModelingRightBody}>
      <Header />
      <div className={StyleSheet.rightConcent}>{TabsDetailsAttributes[typeAttributes as keyof typeof TabsDetailsAttributes]}</div>
    </div>
  )
}

export default ModelingRight
