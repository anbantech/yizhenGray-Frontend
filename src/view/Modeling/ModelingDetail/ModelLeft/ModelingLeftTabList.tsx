import { Skeleton, Tooltip, Tree } from 'antd'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { IconPeripheral, IconYifuRegister, IconDelete, IconCommon, IconClock, IconExclamationTriangleFill } from '@anban/iconfonts'
import styles from 'Src/view/Project/task/taskList/task.less'
import StyleSheet from './modelLeft.less'
import { useLeftModelDetailsStore } from '../../Store/ModelStore'
import { RightDetailsAttributesStore } from '../../Store/ModeleRightListStore/RightListStoreList'
import { MiddleStore } from '../../Store/ModelMiddleStore/MiddleStore'
import { errorCodeMapFn, titleFlagMap } from '../../Store/MapStore'

interface LoactionState {
  state: Record<any, any>
}

const AttributesType = {
  1: 'Peripheral',
  2: 'Register',
  3: 'Processor',
  4: 'Timer',
  5: 'Target'
}

const Image = {
  1: <IconPeripheral style={{ width: '16px', height: '16px', color: '#CCCCCC' }} />,
  2: <IconYifuRegister style={{ width: '16px', height: '16px', color: '#CCCCCC' }} />,
  3: <IconCommon style={{ width: '16px', height: '16px', color: '#CCCCCC' }} />,
  4: <IconClock style={{ width: '16px', height: '16px', color: '#CCCCCC' }} />
}

const TreeDataMemo = (props: { listData: any; height: number }) => {
  const { listData, height } = props
  const [autoExpandParent, setAutoExpandParent] = useState(true)
  const rightAttributeMap = RightDetailsAttributesStore(state => state.rightAttributeMap)
  const foucusNodeId = RightDetailsAttributesStore(state => state.focusNodeId)

  // 点击节点画布展开
  const selectIdExpandDrawTree = MiddleStore(state => state.selectIdExpandDrawTree)

  // 受控:树
  const leftListExpandArray = MiddleStore(state => state.leftListExpandArray)

  // 控制树展开节点函数
  const upDateLeftExpandArrayFn = MiddleStore(state => state.upDateLeftExpandArrayFn)

  // 树节点 筛选结果
  const expandNodeArray = useLeftModelDetailsStore(state => state.expandNodeArray)

  const loading = useLeftModelDetailsStore(state => state.loading)

  // 删除
  const deleteTreeNode = MiddleStore(state => state.deleteTreeNode)

  const leftListExpandArrayMemo = useMemo(() => {
    return [...leftListExpandArray]
  }, [leftListExpandArray])

  const onExpand = React.useCallback(
    (newExpandedKeys: React.Key[]) => {
      const res = [...newExpandedKeys]
      setAutoExpandParent(false)
      upDateLeftExpandArrayFn(res as string[])
    },
    [upDateLeftExpandArrayFn]
  )

  const updataMidleAndRightUI = useCallback(
    (selectedKeys, e) => {
      const { flag, id } = e.node
      rightAttributeMap(AttributesType[flag as keyof typeof AttributesType], String(id), selectIdExpandDrawTree)
    },
    [rightAttributeMap, selectIdExpandDrawTree]
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

  useEffect(() => {
    if (expandNodeArray?.length > 0) {
      upDateLeftExpandArrayFn([...expandNodeArray])
    }
  }, [expandNodeArray, upDateLeftExpandArrayFn])

  return (
    <>
      <Skeleton loading={loading}>
        {listData.length > 0 ? (
          <Tree
            treeData={listData}
            className={StyleSheet.treeItem}
            showIcon
            onExpand={onExpand}
            onSelect={updataMidleAndRightUI}
            autoExpandParent={autoExpandParent}
            selectedKeys={[`${foucusNodeId}`]}
            expandedKeys={[...leftListExpandArrayMemo]}
            height={height}
            titleRender={(node: any) => {
              return (
                <div className={StyleSheet.node} style={{ paddingRight: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ paddingLeft: '6px' }}>{node.title}</span>
                    {node?.error_code ? (
                      <div>
                        <Tooltip title={errorCodeMapFn(node.error_code, node)} placement='right' color='red'>
                          {' '}
                          <IconExclamationTriangleFill style={{ width: '16px', height: '16px', color: 'red', paddingLeft: '2px', paddingTop: 3 }} />
                        </Tooltip>
                      </div>
                    ) : null}
                  </div>
                  {node.tabs !== 'boardLevelPeripherals' || [3].includes(node.flag) ? (
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
      </Skeleton>
    </>
  )
}

const TreeData = React.memo(TreeDataMemo)

function ModelingLeftTabList() {
  // 动态设置虚拟列表高度
  const [height, setHeight] = React.useState(0)
  const layoutRef = useRef<any>()
  const tabs = useLeftModelDetailsStore(state => state.tabs)
  const setParams = useLeftModelDetailsStore(state => state.setParams)
  const customMadePeripheralList = useLeftModelDetailsStore(state => state.customMadePeripheralList)
  const timerList = useLeftModelDetailsStore(state => state.timerList)
  const processorList = useLeftModelDetailsStore(state => state.processorList)
  const boardLevelPeripheralsList = useLeftModelDetailsStore(state => state.boardLevelPeripheralsList)
  const expandNodeArray = useLeftModelDetailsStore(state => state.expandNodeArray)

  const map = {
    customMadePeripheral: customMadePeripheralList,
    boardLevelPeripherals: boardLevelPeripheralsList,
    dataHandlerNotReferenced: processorList,
    time: timerList
  }

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
    const data = map[tabs as keyof typeof map]

    return treeData(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, tabs, expandNodeArray])

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
      <TreeData listData={listData} height={height} />
    </div>
  )
}

export default ModelingLeftTabList
