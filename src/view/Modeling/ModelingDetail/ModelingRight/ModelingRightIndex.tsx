import * as React from 'react'
import StyleSheet from './ModelingRight.less'
import { DataHanderComponents, PeripheralComponents, RegisterComponents, TargetComponents, TimerCompoents } from './RightAttributes'
import { LeftAndRightStore } from '../../Store/ModelLeftAndRight/leftAndRightStore'

const Header = () => {
  return (
    <div className={StyleSheet.rightSideheaderBody}>
      <span className={StyleSheet.rightHeaderSpan}>属性</span>
      <span className={StyleSheet.rightHeaderSpan2} />
    </div>
  )
}

function ModelingRight() {
  const flag = LeftAndRightStore(state => state.flag)
  const Cms = React.useMemo(() => {
    switch (flag) {
      case 1:
        return <PeripheralComponents />
      case 2:
        return <RegisterComponents />
      case 3:
        return <DataHanderComponents />
      case 4:
        return <TimerCompoents />
      default:
        return <TargetComponents />
    }
  }, [flag])
  return (
    <div className={StyleSheet.ModelingRightBody} role='time'>
      <Header />
      <>{Cms}</>
    </div>
  )
}

export default ModelingRight
