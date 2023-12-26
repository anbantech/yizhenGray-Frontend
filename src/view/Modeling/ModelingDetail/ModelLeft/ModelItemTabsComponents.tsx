import * as React from 'react'
import StyleSheet from './modelLeft.less'
import { LeftListStore } from '../../Store/ModeleLeftListStore/LeftListStore'

type Tabs = {
  keys: string
  title: string
  tabs: string
}

const TabsCompoents = (props: Tabs) => {
  const { keys, title, tabs } = props
  // 在左侧侧边栏文件中默认加载请求自定义外设tabs
  // 侧边栏数量逻辑
  const { customPeripheralNums, boardPeripheralNums, timerNums, handlerDataNums, getList, initStore } = LeftListStore()
  const veryTabsKindNums = React.useMemo(() => {
    const NumsObj = {
      customPeripheral: customPeripheralNums,
      boardPeripheral: boardPeripheralNums,
      handlerData: handlerDataNums,
      timer: timerNums
    }
    return NumsObj[keys as keyof typeof NumsObj]
  }, [customPeripheralNums, boardPeripheralNums, handlerDataNums, timerNums, keys])

  //  选中侧边栏tabs class更新
  const selectStyleFn = React.useMemo(() => {
    return tabs === keys ? `${StyleSheet.selectModelingTabsCommonStyle}` : `${StyleSheet.NoSelectModelingTabsCommonStyle}`
  }, [tabs, keys])

  const changeTabsList = React.useCallback(
    (keys: string) => {
      if (tabs === keys) return
      initStore()
      getList(keys)
    },
    [tabs, initStore, getList]
  )

  return (
    <div
      className={[StyleSheet.ModelingTabsCommonStyle, selectStyleFn].join(' ')}
      role='time'
      onClick={() => {
        changeTabsList(keys)
      }}
    >
      <span>{title}</span>
      <span className={StyleSheet.NoSelectModelingTabsCommonStyle}> {veryTabsKindNums}</span>
    </div>
  )
}

const TabsComponentsMemo = React.memo(TabsCompoents)
function ModelLeftHeaderLeft() {
  const tabs = LeftListStore(state => state.tabs)
  const CompoentsTitle = {
    customPeripheral: '自定义外设',
    boardPeripheral: '板级外设',
    handlerData: '数据处理器',
    timer: '定时器'
  }
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
