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
  const getRightAttributes = LeftAndRightStore(state => state.getRightAttributes)
  const platform_id = LeftAndRightStore(state => state.platform_id)
  const selectLeftId = LeftAndRightStore(state => state.selectLeftId)
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

  React.useEffect(() => {
    if (platform_id || selectLeftId) {
      getRightAttributes(flag === 5 ? (platform_id as number) : (selectLeftId as number), flag)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flag, platform_id, selectLeftId])
  return (
    <div className={StyleSheet.ModelingRightBody} role='time'>
      <Header />
      <>{Cms}</>
    </div>
  )
}

export default ModelingRight
