/* eslint-disable no-param-reassign */
import { Tooltip, Tree } from 'antd'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { IconPeripheral, IconYifuRegister, IconDelete, IconCommon, IconClock, IconExclamationTriangleFill } from '@anban/iconfonts'
import styles from 'Src/view/Project/task/taskList/task.less'
import StyleSheet from './modelLeft.less'
import { errorCodeMapFn, titleFlagMap } from '../../Store/MapStore'
import { LeftListStore } from '../../Store/ModeleLeftListStore/LeftListStore'
import { LeftAndRightStore } from '../../Store/ModelLeftAndRight/leftAndRightStore'
import { LowCodeStore } from '../../Store/CanvasStore/canvasStore'

interface LoactionState {
  state: Record<any, any>
}

const Image = {
  1: <IconPeripheral style={{ width: '16px', height: '16px', color: '#CCCCCC' }} />,
  2: <IconYifuRegister style={{ width: '16px', height: '16px', color: '#CCCCCC' }} />,
  3: <IconCommon style={{ width: '16px', height: '16px', color: '#CCCCCC' }} />,
  4: <IconClock style={{ width: '16px', height: '16px', color: '#CCCCCC' }} />
}

const TreeDataMemo = (props: { listData: any; height: number }) => {
  const { listData, height } = props
  const { tabs } = LeftListStore()
  const customAndDefaultPeripheral = LeftListStore(state => state.customAndDefaultPeripheral)
  const [autoExpandParent, setAutoExpandParent] = useState(true)
  const { updateTreeNodeData } = LeftListStore()
  // loading 骨架屏
  const { treeNodeData, getAllList } = LeftListStore()
  // 设置选中节点,以及flag
  const { setSelect, selectLeftId } = LeftAndRightStore()
  // 树节点 筛选结果
  const onExpand = React.useCallback(
    (newExpandedKeys: React.Key[]) => {
      const res = [...newExpandedKeys]
      setAutoExpandParent(false)
      updateTreeNodeData(res as string[])
    },
    [updateTreeNodeData]
  )

  const showTabs = React.useMemo(() => {
    const result = ['customPeripheral', 'boardPeripheral'].includes(tabs) && customAndDefaultPeripheral.key_word
    return result
  }, [tabs, customAndDefaultPeripheral])

  const updataMidleAndRightUI = useCallback(
    (selectedKeys, e) => {
      const { flag, id } = e.node
      setSelect(id, flag)
      LowCodeStore.getState().setCanvasCenter(String(id))
      if (flag === 2) {
        getAllList()
      }
    },
    [getAllList, setSelect]
  )

  const deleteTreeNodeHandle = React.useCallback((e, node) => {
    e.stopPropagation()
    const nodeArray = [{ id: String(node.id), data: { flag: node.flag } }]
    const nodeInfo = {
      node: nodeArray,
      title: titleFlagMap[node.flag as keyof typeof titleFlagMap][0],
      content: `${titleFlagMap[node.flag as keyof typeof titleFlagMap][1]}${node.name}`
    }
    LowCodeStore.getState().setDeleNodeInfo(nodeInfo, true)
  }, [])

  const onDragStart = (event: any, nodeType: any) => {
    const { name, id, error_code, flag, tabs } = nodeType
    const data = JSON.stringify({ name, id, error_code, flag, tabs })
    event.dataTransfer.setData('application/reactflow', data)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <>
      {/* <Skeleton loading={loading}> */}
      {listData.length > 0 ? (
        <Tree
          treeData={listData}
          className={StyleSheet.treeItem}
          showIcon
          onExpand={onExpand}
          onSelect={updataMidleAndRightUI}
          autoExpandParent={autoExpandParent}
          selectedKeys={[`${selectLeftId}`]}
          expandedKeys={[...treeNodeData]}
          height={showTabs ? height - 20 : height}
          titleRender={(node: any) => {
            return (
              <div
                className={StyleSheet.node}
                style={{ paddingRight: '4px' }}
                draggable={node.flag === 1}
                onDragStart={event => onDragStart(event, node)}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ paddingLeft: '6px' }}>{node.title}</span>
                  {node?.error_code ? (
                    <div>
                      <Tooltip title={errorCodeMapFn(node.error_code, node)} placement='right' color='red'>
                        {' '}
                        <IconExclamationTriangleFill
                          style={{
                            width: '16px',
                            height: '16px',
                            color: 'red',
                            paddingLeft: '2px',
                            paddingTop: 3
                          }}
                        />
                      </Tooltip>
                    </div>
                  ) : null}
                </div>
                {node.tabs !== 'boardPeripheral' || ([3].includes(node.flag) && node.tabs === 'boardPeripheral') ? (
                  <IconDelete
                    style={{ color: '#cccccc' }}
                    className={StyleSheet.icon}
                    onClick={e => {
                      deleteTreeNodeHandle(e, node)
                    }}
                  />
                ) : null}
              </div>
            )
          }}
        />
      ) : (
        <p style={{ textAlign: 'center', width: '216px' }}>
          <span className={styles.listLine} />
          <span className={styles.concentList}>内容已经加载完毕</span>
        </p>
      )}
      {/* </Skeleton> */}
    </>
  )
}

const TreeData = React.memo(TreeDataMemo)

function ModelingLeftTabList() {
  // 动态设置虚拟列表高度
  const [height, setHeight] = React.useState(0)
  const layoutRef = useRef<any>()
  const { tabsList, tabs } = LeftListStore()
  const treeData = (defaultData: any[]) => {
    const loop = (data: any) => {
      return data?.map((item: { name?: any; id: any; flag?: any; error_code: number; children?: any }) => {
        const title = (
          <span style={{ color: item.error_code !== 0 ? 'red' : '' }} className={StyleSheet.title}>
            {item.name}
          </span>
        )
        const key = String(item.id)
        const { id, flag, error_code, name } = item
        const icon = Image[item.flag as keyof typeof Image]
        if (item.children) {
          return {
            title,
            name,
            key,
            tabs,
            id,
            icon,
            flag,
            error_code,
            children: loop(item.children)
          }
        }
        return {
          title,
          flag,
          key,
          tabs,
          id,
          icon,
          error_code,
          name
        }
      })
    }
    return loop(defaultData)
  }

  const listData = React.useMemo(() => {
    return treeData(tabsList)
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
      <TreeData listData={listData} height={height} />
    </div>
  )
}

export default ModelingLeftTabList
