import * as React from 'react'
import { useLeftModelDetailsStore } from '../../Store/ModelStore'
import StyleSheet from './modelLeft.less'
import { MiddleStore, getAll } from '../../Store/ModelMiddleStore/MiddleStore'

type Tabs = {
  keys: string
  title: string
  tabs: string
}

const TabsCompoents = (props: Tabs) => {
  const { keys, title, tabs } = props
  // 切换列表 更新列表数据 在左侧侧边栏文件中默认加载请求自定义外设tabs
  const setTabs = useLeftModelDetailsStore(state => state.setTabs)
  const initStore = useLeftModelDetailsStore(state => state.initStore)
  const { fn } = useLeftModelDetailsStore()
  // 侧边栏数量逻辑
  const cusomMadePeripheralNums = useLeftModelDetailsStore(state => state.cusomMadePeripheralNums)
  const timerNums = useLeftModelDetailsStore(state => state.timerNums)
  const handlerDataNums = useLeftModelDetailsStore(state => state.handlerDataNums)
  const boardPeripheralNums = useLeftModelDetailsStore(state => state.boardPeripheralNums)
  const platform_id = MiddleStore(state => state.platform_id)
  const veryTabsKindNums = React.useMemo(() => {
    const NumsObj = {
      customMadePeripheral: cusomMadePeripheralNums,
      boardLevelPeripherals: boardPeripheralNums,
      dataHandlerNotReferenced: handlerDataNums,
      time: timerNums
    }
    return NumsObj[keys as keyof typeof NumsObj]
  }, [cusomMadePeripheralNums, boardPeripheralNums, handlerDataNums, timerNums, keys])

  //  选中侧边栏tabs class更新
  const selectStyleFn = React.useMemo(() => {
    return tabs === keys ? `${StyleSheet.selectModelingTabsCommonStyle}` : `${StyleSheet.NoSelectModelingTabsCommonStyle}`
  }, [tabs, keys])

  const changeTabsList = React.useCallback(
    (keys: string) => {
      if (tabs === keys) return
      fn()
      initStore()
      setTabs(keys)
      if (platform_id) getAll(+platform_id)
    },
    [fn, initStore, setTabs, tabs, platform_id]
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
  const tabs = useLeftModelDetailsStore(state => state.tabs)

  const CompoentsTitle = {
    customMadePeripheral: '自定义外设',
    boardLevelPeripherals: '板级外设',
    dataHandlerNotReferenced: '数据处理器',
    time: '定时器'
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
