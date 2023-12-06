import * as React from 'react'
import { useLeftModelDetailsStore } from '../../Store/ModelStore'
import {
  PeripheralDetailsAttributesMemo,
  ProcessorFormMemo,
  RegisterDetailsAttributesMemo,
  TargetDetailsAttributesMemo,
  TimerDetailsAttributesMemo
} from './ModelingRightCompoents'
import StyleSheet from './ModelingRight.less'
import { RightListStore, RightDetailsAttributesStore } from '../../Store/ModeleRightListStore/RightListStoreList'
import { MiddleStore, getAll } from '../../Store/ModelMiddleStore/MiddleStore'

const Header = () => {
  return (
    <div className={StyleSheet.rightSideheaderBody}>
      <span className={StyleSheet.rightHeaderSpan}>属性</span>
      <span className={StyleSheet.rightHeaderSpan2} />
    </div>
  )
}

const TabsDetailsAttributes = {
  Target: TargetDetailsAttributesMemo, // 目标机 //todo 100%
  Processor: ProcessorFormMemo, // 数据处理器
  Peripheral: PeripheralDetailsAttributesMemo, // 外设 // todo 100%
  Register: RegisterDetailsAttributesMemo, // 寄存器 // todo 70%
  Timer: TimerDetailsAttributesMemo // 定时器 //todo 100%
}

const FormType = {
  Target: '目标机',
  Processor: '数据处理器',
  Peripheral: '外设',
  Register: '寄存器',
  Timer: '定时器'
}

function ModelingRight() {
  const typeAttributes = RightDetailsAttributesStore(state => state.typeAttributes)
  // 外设 寄存器 数据处理器 定时器 详情
  const rightArrributes = RightDetailsAttributesStore(state => state.rightArrributes)
  //  目标机详情
  const targetDetails = useLeftModelDetailsStore(state => state.targetDetails)
  const { clickLeftListAndFoucsIdAndRightAtturbuites } = RightListStore()
  const platform_id = MiddleStore(state => state.platform_id)
  React.useEffect(() => {
    if (typeAttributes !== 'Target') {
      clickLeftListAndFoucsIdAndRightAtturbuites(FormType[typeAttributes as keyof typeof FormType], typeAttributes, rightArrributes)
    }
    return () => {
      if (platform_id) {
        getAll(+platform_id)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rightArrributes, typeAttributes])

  const CmpMemo = React.useMemo(() => {
    const Compoents = TabsDetailsAttributes[typeAttributes as keyof typeof TabsDetailsAttributes]
    if (Compoents && typeAttributes === 'Target') {
      return <Compoents {...targetDetails} />
    }
    return <Compoents {...targetDetails} />
  }, [typeAttributes, targetDetails])

  return (
    <div className={StyleSheet.ModelingRightBody}>
      <Header />
      <div>{CmpMemo}</div>
    </div>
  )
}

export default ModelingRight
