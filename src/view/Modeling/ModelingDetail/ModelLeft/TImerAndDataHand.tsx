import { Tooltip } from 'antd'
import React, { useCallback, useEffect, useRef } from 'react'
import { IconDelete, IconCommon, IconClock, IconExclamationTriangleFill } from '@anban/iconfonts'
import InfiniteScroll from 'react-infinite-scroll-component'
import styles from 'Src/view/Project/task/taskList/task.less'
import StyleSheet from './modelLeft.less'
import { useLeftModelDetailsStore } from '../../Store/ModelStore'
import { errorCodeMapFn } from '../../Store/MapStore'
import { LeftListStore } from '../../Store/ModeleLeftListStore/LeftListStore'

const Image = {
  3: <IconCommon style={{ width: '16px', height: '16px', color: '#CCCCCC' }} />,
  4: <IconClock style={{ width: '16px', height: '16px', color: '#CCCCCC' }} />
}

const OthersCompoentsMemo = (props: { listData: any; height: number }) => {
  const { listData, height } = props
  const hasMoreData = LeftListStore(state => state.hasMoreData)
  const timerAndHandData = LeftListStore(state => state.timerAndHandData)
  const getList = LeftListStore(state => state.getList)
  const loadMoreData = React.useCallback(() => {
    const newPage = timerAndHandData.page_size + 10
    getList({ ...timerAndHandData, page_size: newPage }, '')
  }, [getList, timerAndHandData])

  const SelectionNode = useCallback(item => {
    const { flag, id } = item
    console.log(flag, id)
  }, [])
  // todo 画布不影响左侧列表,左侧列表影响画布
  const deleteTreeNodeHandle = React.useCallback(
    (e, node) => {
      e.stopPropagation()
      console.log(e, node)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <>
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
              className={String(item.id) === String(11) ? StyleSheet.activeTagItem : StyleSheet.tagItem}
              style={{ paddingRight: '4px' }}
            >
              <div
                className={StyleSheet.leftTagItem}
                role='time'
                onClick={() => {
                  SelectionNode(item)
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
  const tabs = useLeftModelDetailsStore(state => state.tabs)
  const setParams = useLeftModelDetailsStore(state => state.setParams)
  const timerList = useLeftModelDetailsStore(state => state.timerList)

  const map = {
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
