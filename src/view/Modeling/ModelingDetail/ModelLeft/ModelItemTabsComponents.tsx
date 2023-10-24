import * as React from 'react'
import { useModelDetailsStore } from '../../Store/ModelStore'
import StyleSheet from './modelLeft.less'

type Tabs = {
  keys: string
  title: string
  tabs: string
}

const CompoentsTitle = {
  customMadePeripheral: '自定义外设',
  boardLevelPeripherals: '板级外设',
  dataHandlerNotReferenced: '未使用数据处理器',
  time: '定时器'
}

const TabsCompoents = (props: Tabs) => {
  const { keys, title, tabs } = props
  const setTabs = useModelDetailsStore(state => state.setTabs)
  const selectStyleFn = React.useMemo(() => {
    return tabs === keys ? `${StyleSheet.selectModelingTabsCommonStyle}` : `${StyleSheet.NoSelectModelingTabsCommonStyle}`
  }, [tabs, keys])
  return (
    <div
      className={[StyleSheet.ModelingTabsCommonStyle, selectStyleFn].join(' ')}
      role='time'
      onClick={() => {
        setTabs(keys)
      }}
    >
      <span>{title}</span>
      <span className={StyleSheet.NoSelectModelingTabsCommonStyle}> 99</span>
    </div>
  )
}

const TabsComponentsMemo = React.memo(TabsCompoents)
function ModelLeftHeaderLeft() {
  const tabs = useModelDetailsStore(state => state.tabs)
  return (
    <div className={StyleSheet.ModelLeftHeader}>
      {Object.keys(CompoentsTitle).map(item => {
        return (
          <div key={item}>
            <TabsComponentsMemo keys={item} tabs={tabs} title={CompoentsTitle[item as keyof typeof CompoentsTitle]} />
          </div>
        )
      })}
    </div>
  )
}

const ModelLeftHeaderLeftMemo = React.memo(ModelLeftHeaderLeft)
export default ModelLeftHeaderLeftMemo
