import { Tooltip } from 'antd'
import React, { useCallback, useEffect, useRef } from 'react'
import { IconDelete, IconCommon, IconClock, IconExclamationTriangleFill } from '@anban/iconfonts'
import InfiniteScroll from 'react-infinite-scroll-component'
import styles from 'Src/view/Project/task/taskList/task.less'
import { useLocation } from 'react-router'
import { NoTask } from 'Src/view/NewExcitation/ExcitationComponents/ExcitationDraw/ExcitationDraw'
import StyleSheet from './modelLeft.less'
import { useLeftModelDetailsStore } from '../../Store/ModelStore'
import { RightDetailsAttributesStore } from '../../Store/ModeleRightListStore/RightListStoreList'
import { errorCodeMapFn, titleFlagMap } from '../../Store/MapStore'
import { LoactionState } from './ModelingLeftIndex'
import { MiddleStore } from '../../Store/ModelMiddleStore/MiddleStore'

const AttributesType = {
  1: 'Peripheral',
  2: 'Register',
  3: 'Processor',
  4: 'Timer',
  5: 'Target'
}

const Image = {
  3: <IconCommon style={{ width: '16px', height: '16px', color: '#CCCCCC' }} />,
  4: <IconClock style={{ width: '16px', height: '16px', color: '#CCCCCC' }} />
}

const OthersCompoentsMemo = (props: { listData: any; height: number }) => {
  const { listData, height } = props
  const focusNodeId = RightDetailsAttributesStore(state => state.focusNodeId)
  const tabs = useLeftModelDetailsStore(state => state.tabs)
  const hasMoreData = useLeftModelDetailsStore(state => state.hasMoreData)
  const setParams = useLeftModelDetailsStore(state => state.setParams)
  const processorListParams = useLeftModelDetailsStore(state => state.processorListParams)
  const timerListParams = useLeftModelDetailsStore(state => state.timerListParams)
  const baseKeyWordAndTagsGetList = useLeftModelDetailsStore(state => state.baseKeyWordAndTagsGetList)
  const rightAttributeMap = RightDetailsAttributesStore(state => state.rightAttributeMap)

  // 删除
  const deleteTreeNode = MiddleStore(state => state.deleteTreeNode)
  const platformsId = (useLocation() as LoactionState).state?.id
  const platformsIdmemo = React.useMemo(() => platformsId, [platformsId])
  const map = {
    dataHandlerNotReferenced: processorListParams,
    time: timerListParams
  }

  const loadMoreData = React.useCallback(() => {
    const data = map[tabs as keyof typeof map]
    const newPage = data.page_size + 10
    setParams(tabs, { page_size: newPage })
    baseKeyWordAndTagsGetList(tabs, platformsIdmemo)
  }, [map, tabs, setParams, baseKeyWordAndTagsGetList, platformsIdmemo])

  const updataMidleAndRightUI = useCallback(
    item => {
      const { flag } = item
      rightAttributeMap(AttributesType[flag as keyof typeof AttributesType], item.id)
    },
    [rightAttributeMap]
  )

  const deleteTreeNodeHandle = React.useCallback(
    (e, node) => {
      e.stopPropagation()
      const nodeArray = [{ id: String(node.id), data: { flag: node.flag } }]
      const nodeInfo = {
        node: nodeArray,
        title: titleFlagMap[node.flag as keyof typeof titleFlagMap][0],
        content: `${titleFlagMap[node.flag as keyof typeof titleFlagMap][1]}${node.name}`
      }
      deleteTreeNode(true, nodeInfo)
    },
    [deleteTreeNode]
  )

  return (
    <>
      {listData?.length > 0 ? (
        <InfiniteScroll
          dataLength={listData.length}
          next={loadMoreData}
          hasMore={hasMoreData}
          height={height}
          style={{ overflowX: 'hidden' }}
          loader={
            <p style={{ textAlign: 'center', width: '216px' }}>
              <span className={styles.listLine} />
              <span className={styles.concentList}>内容已经加载完毕</span>
            </p>
          }
          endMessage={
            <p style={{ textAlign: 'center', width: '216px' }}>
              <span className={styles.listLine} />
              <span className={styles.concentList}>内容已经加载完毕</span>
            </p>
          }
        >
          {listData.map((item: any) => {
            return (
              <div
                key={item.id}
                className={String(item.id) === String(focusNodeId) ? StyleSheet.activeTagItem : StyleSheet.tagItem}
                style={{ paddingRight: '4px' }}
              >
                <div
                  className={StyleSheet.leftTagItem}
                  role='time'
                  onClick={() => {
                    updataMidleAndRightUI(item)
                  }}
                >
                  {Image[item.flag as keyof typeof Image]}
                  <div>
                    <span style={{ width: '16px', height: '16px', paddingLeft: '6px', color: item.error_code !== 0 ? 'red' : '' }}>{item.name}</span>
                    {item?.error_code ? (
                      <Tooltip title={errorCodeMapFn(item.error_code, item)} color='red' placement='right'>
                        {' '}
                        <IconExclamationTriangleFill style={{ color: 'red', paddingLeft: '2px', paddingTop: 3 }} />
                      </Tooltip>
                    ) : null}
                  </div>
                </div>
                <IconDelete
                  style={{ color: '#cccccc' }}
                  className={StyleSheet.icon}
                  onClick={e => {
                    deleteTreeNodeHandle(e, item)
                  }}
                />
              </div>
            )
          })}
        </InfiniteScroll>
      ) : (
        <div className={StyleSheet.noList} style={{ height }}>
          <NoTask />
        </div>
      )}
    </>
  )
}

const OthersCompoents = React.memo(OthersCompoentsMemo)

function TImerAndDataHand() {
  // 动态设置虚拟列表高度
  const [height, setHeight] = React.useState(0)
  const layoutRef = useRef<any>()
  const tabs = useLeftModelDetailsStore(state => state.tabs)
  const setParams = useLeftModelDetailsStore(state => state.setParams)
  const timerList = useLeftModelDetailsStore(state => state.timerList)
  const processorList = useLeftModelDetailsStore(state => state.processorList)

  const map = {
    dataHandlerNotReferenced: processorList,
    time: timerList
  }

  const updatePage = React.useCallback(() => {
    setParams(tabs, { page_size: 50 })
  }, [setParams, tabs])

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { height } = entry.contentRect
        if (height >= 700) {
          updatePage()
        }
        setHeight(height)
      }
    })

    if (layoutRef.current) {
      resizeObserver.observe(layoutRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{ padding: '0 12px' }} ref={layoutRef} className={StyleSheet.concentBody}>
      <OthersCompoents listData={map[tabs as keyof typeof map]} height={height} />
    </div>
  )
}

export default TImerAndDataHand
