/* eslint-disable no-param-reassign */
import { Tooltip } from 'antd'
import React, { useCallback, useEffect, useRef } from 'react'
import { IconDelete, IconCommon, IconClock, IconExclamationTriangleFill } from '@anban/iconfonts'
import InfiniteScroll from 'react-infinite-scroll-component'
import styles from 'Src/view/Project/task/taskList/task.less'
import StyleSheet from './modelLeft.less'
import { errorCodeMapFn, titleFlagMap } from '../../Store/MapStore'
import { LeftListStore } from '../../Store/ModeleLeftListStore/LeftListStore'
import { LeftAndRightStore } from '../../Store/ModelLeftAndRight/leftAndRightStore'
import { LowCodeStore } from '../../Store/CanvasStore/canvasStore'

const Image = {
  3: <IconCommon style={{ width: '16px', height: '16px', color: '#CCCCCC' }} />,
  4: <IconClock style={{ width: '16px', height: '16px', color: '#CCCCCC' }} />
}

const OthersCompoentsMemo = (props: { listData: any; height: number }) => {
  const { listData, height } = props
  const tabs = LeftListStore(state => state.tabs)
  const hasMoreData = LeftListStore(state => state.hasMoreData)
  const timerAndHandData = LeftListStore(state => state.timerAndHandData)
  const getList = LeftListStore(state => state.getList)
  const getAllList = LeftListStore(state => state.getAllList)
  // 设置选中节点,以及flag
  const { setSelect, selectLeftId } = LeftAndRightStore()
  const loadMoreData = React.useCallback(() => {
    const newPage = timerAndHandData.page_size + 10
    LeftListStore.getState().updateTimerAndHandleParams(newPage)
    getList('timer')
  }, [getList, timerAndHandData])

  const updataMidleAndRightUI = useCallback(
    (e, item) => {
      const { flag, id } = item
      setSelect(id, flag)
      if (flag === 3) {
        getAllList()
      }
    },
    [getAllList, setSelect]
  )

  // todo 画布不影响左侧列表,左侧列表影响画布
  const deleteTreeNodeHandle = React.useCallback(
    (e, node) => {
      e.stopPropagation()
      const nodeArray = [{ id: String(node.id), data: { flag: node.flag } }]
      const nodeInfo = {
        node: nodeArray,
        title: titleFlagMap[node.flag as keyof typeof titleFlagMap][0],
        content: `${titleFlagMap[node.flag as keyof typeof titleFlagMap][1]}${node.name}`
      }
      LowCodeStore.getState().setDeleNodeInfo(nodeInfo, true)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const onDragStart = (event: any, nodeType: any) => {
    const data = JSON.stringify({ ...nodeType, tabs })
    event.dataTransfer.setData('application/reactflow', data)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <>
      <InfiniteScroll
        dataLength={10}
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
        {listData?.map((item: any) => {
          return (
            <div
              key={item.id}
              className={String(item.id) === String(selectLeftId) ? StyleSheet.activeTagItem : StyleSheet.tagItem}
              style={{ paddingRight: '4px' }}
              draggable='true'
              onDragStart={event => onDragStart(event, item)}
            >
              <div
                className={StyleSheet.leftTagItem}
                role='time'
                onClick={e => {
                  e.stopPropagation()
                  updataMidleAndRightUI(e, item)
                }}
              >
                {Image[item.flag as keyof typeof Image]}
                <div>
                  <span
                    style={{
                      width: '16px',
                      height: '16px',
                      paddingLeft: '6px',
                      color: item.error_code !== 0 ? 'red' : ''
                    }}
                  >
                    {item.name}
                  </span>
                  {item?.error_code ? (
                    <Tooltip title={errorCodeMapFn(item.error_code, item)} color='red' placement='right'>
                      {' '}
                      <IconExclamationTriangleFill
                        style={{
                          color: 'red',
                          paddingLeft: '2px',
                          paddingTop: 3
                        }}
                      />
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
    </>
  )
}

const OthersCompoents = React.memo(OthersCompoentsMemo)

function TImerAndDataHand() {
  // 动态设置虚拟列表高度
  const [height, setHeight] = React.useState(0)
  const layoutRef = useRef<any>()
  const { tabsList, tabs } = LeftListStore()
  const listData = React.useMemo(() => {
    return tabsList
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabsList, tabs])
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { height } = entry.contentRect
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
      <OthersCompoents listData={listData} height={height} />
    </div>
  )
}

export default TImerAndDataHand
