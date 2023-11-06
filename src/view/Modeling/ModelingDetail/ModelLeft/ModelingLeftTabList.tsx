import { Tree, TreeDataNode } from 'antd'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { IconPeripheral, IconYifuRegister, IconDelete, IconCommon, IconClock } from '@anban/iconfonts'
import InfiniteScroll from 'react-infinite-scroll-component'
import styles from 'Src/view/Project/task/taskList/task.less'
import { useLocation } from 'react-router'
import StyleSheet from './modelLeft.less'
import { useModelDetailsStore } from '../../Store/ModelStore'

interface LoactionState {
  state: Record<any, any>
}

const Image = {
  1: <IconPeripheral style={{ width: '16px', height: '16px', color: '#CCCCCC' }} />,
  2: <IconYifuRegister style={{ width: '16px', height: '16px', color: '#CCCCCC' }} />,
  3: <IconCommon style={{ width: '16px', height: '16px', color: '#CCCCCC' }} />,
  4: <IconClock style={{ width: '16px', height: '16px', color: '#CCCCCC' }} />
}
const { DirectoryTree, TreeNode } = Tree

const OthersCompoentsMemo = (props: { listData: any; height: number }) => {
  const { listData, height } = props
  const tabs = useModelDetailsStore(state => state.tabs)
  const hasMoreData = useModelDetailsStore(state => state.hasMoreData)
  const setParams = useModelDetailsStore(state => state.setParams)
  const cusomMadePeripheralListParams = useModelDetailsStore(state => state.cusomMadePeripheralListParams)
  const processorListParams = useModelDetailsStore(state => state.processorListParams)
  const timerListParams = useModelDetailsStore(state => state.timerListParams)
  const baseKeyWordAndTagsGetList = useModelDetailsStore(state => state.baseKeyWordAndTagsGetList)
  const platformsId = (useLocation() as LoactionState).state?.id
  const platformsIdmemo = React.useMemo(() => platformsId, [platformsId])
  const map = {
    customMadePeripheral: cusomMadePeripheralListParams,
    boardLevelPeripherals: cusomMadePeripheralListParams,
    dataHandlerNotReferenced: processorListParams,
    time: timerListParams
  }

  const loadMoreData = React.useCallback(() => {
    const data = map[tabs as keyof typeof map]
    const newPage = data.page_size + 10

    setParams(tabs, { page_size: newPage })
    baseKeyWordAndTagsGetList(tabs, platformsIdmemo)
  }, [map, tabs, setParams, baseKeyWordAndTagsGetList, platformsIdmemo])

  return (
    <>
      {listData?.length >= 1 && (
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
              <div key={item.id} className={StyleSheet.tagItem} style={{ paddingRight: '4px' }}>
                <div className={StyleSheet.leftTagItem}>
                  {Image[item.flag as keyof typeof Image]}
                  <span style={{ paddingLeft: '6px' }}>{item.name}</span>
                </div>
                <IconDelete style={{ color: '#cccccc' }} className={StyleSheet.icon} />
              </div>
            )
          })}
        </InfiniteScroll>
      )}
    </>
  )
}

const OthersCompoents = React.memo(OthersCompoentsMemo)

const TreeDataMemo = (props: { listData: any; height: number }) => {
  const { listData, height } = props
  const [autoExpandParent, setAutoExpandParent] = useState(true)
  const showNode = useModelDetailsStore(state => state.showNode)
  const setItemExpand = useModelDetailsStore(state => state.setItemExpand)
  const onExpand = (newExpandedKeys: React.Key[]) => {
    setItemExpand(newExpandedKeys)
    setAutoExpandParent(false)
  }

  return (
    <>
      {listData?.length >= 1 && (
        <DirectoryTree
          className={StyleSheet.treeItem}
          showIcon
          onExpand={onExpand}
          autoExpandParent={autoExpandParent}
          expandedKeys={showNode}
          height={height}
          titleRender={node => {
            return (
              <div className={StyleSheet.node} style={{ paddingRight: '4px' }}>
                <span style={{ paddingLeft: '6px' }}>{node.title}</span>
                <IconDelete style={{ color: '#cccccc' }} className={StyleSheet.icon} />
              </div>
            )
          }}
        >
          {listData.map(
            (node: {
              title: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined
              key: React.Key | undefined
              icon: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined
              children: any[]
            }) => (
              <TreeNode title={node.title} key={node.key} icon={node.icon} className={node.children?.length === 0 ? `${StyleSheet.nodeIcon}` : ''}>
                {node.children?.map(
                  (childNode: {
                    title:
                      | boolean
                      | React.ReactChild
                      | React.ReactFragment
                      | React.ReactPortal
                      | ((data: TreeDataNode) => React.ReactNode)
                      | null
                      | undefined
                    key: React.Key | undefined
                    icon: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined
                  }) => (
                    <TreeNode title={childNode.title} key={childNode.key} icon={childNode.icon} />
                  )
                )}
              </TreeNode>
            )
          )}
        </DirectoryTree>
      )}
    </>
  )
}

const TreeData = React.memo(TreeDataMemo)

function ModelingLeftTabList() {
  // 动态设置虚拟列表高度
  const [height, setHeight] = React.useState(0)
  const layoutRef = useRef<any>()
  const tabs = useModelDetailsStore(state => state.tabs)
  const setParams = useModelDetailsStore(state => state.setParams)
  const customMadePeripheralList = useModelDetailsStore(state => state.customMadePeripheralList)
  const timerList = useModelDetailsStore(state => state.timerList)
  const processorList = useModelDetailsStore(state => state.processorList)
  const boardLevelPeripheralsList = useModelDetailsStore(state => state.boardLevelPeripheralsList)
  const cusomMadePeripheralListParams = useModelDetailsStore(state => state.cusomMadePeripheralListParams)

  const map = {
    customMadePeripheral: customMadePeripheralList,
    boardLevelPeripherals: boardLevelPeripheralsList,
    dataHandlerNotReferenced: processorList,
    time: timerList
  }
  const tagsMemo = useMemo(() => {
    return cusomMadePeripheralListParams.tag
  }, [cusomMadePeripheralListParams.tag])

  const treeData = (defaultData: any[]) => {
    const loop = (data: any) => {
      return data.map((item: { name?: any; id: any; flag?: any; children?: any }) => {
        const title = <span className={StyleSheet.title}>{item.name}</span>
        const key = item.id
        const { id } = item
        const icon = Image[item.flag as keyof typeof Image]
        if (item.children) {
          return {
            title,
            key,
            id,
            icon,
            children: loop(item.children)
          }
        }
        return {
          title,
          key,
          id,
          icon
        }
      })
    }
    return loop(defaultData)
  }

  const listData = React.useMemo(() => {
    const data = map[tabs as keyof typeof map]
    return treeData(data)
  }, [map, tabs])

  const normalListData = React.useMemo(() => {
    const data = map[tabs as keyof typeof map]
    return data
  }, [map, tabs])

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
      {['1', '2', '3'].includes(tagsMemo) || ['dataHandlerNotReferenced', 'time'].includes(tabs) ? (
        <OthersCompoents listData={normalListData} height={height} />
      ) : (
        <>{listData.length >= 1 && <TreeData listData={listData} height={height} />}</>
      )}
    </div>
  )
}

export default ModelingLeftTabList
