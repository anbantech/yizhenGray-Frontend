import * as React from 'react'
import { useLocation } from 'react-router'
import { useModelDetailsStore } from '../../Store/ModelStore'
import { LoactionState } from './ModelingLeftIndex'
import StyleSheet from './modelLeft.less'

type Tabs = {
  keys: string
  title: string
  tabs: string
}

const TabsCompoents = (props: Tabs) => {
  const { keys, title, tabs } = props
  // 切换列表 更新列表数据 在左侧侧边栏文件中默认加载请求自定义外设tabs
  const setTabs = useModelDetailsStore(state => state.setTabs)
  const initStore = useModelDetailsStore(state => state.initStore)
  const platformsId = (useLocation() as LoactionState).state?.id
  const platformsIdmemo = React.useMemo(() => platformsId, [platformsId])
  const { getList, fn } = useModelDetailsStore()
  // 侧边栏数量逻辑
  const cusomMadePeripheralNums = useModelDetailsStore(state => state.cusomMadePeripheralNums)
  const timerNums = useModelDetailsStore(state => state.timerNums)
  const handlerDataNums = useModelDetailsStore(state => state.handlerDataNums)
  const boardPeripheralNums = useModelDetailsStore(state => state.boardPeripheralNums)
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
      if (platformsIdmemo) {
        setTabs(keys)
        getList(keys, platformsIdmemo)
      }
    },
    [fn, getList, initStore, platformsIdmemo, setTabs, tabs]
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
  const tabs = useModelDetailsStore(state => state.tabs)

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
