import Checkbox from 'antd/lib/checkbox'
import * as React from 'react'
import { DragSourceMonitor, useDrag } from 'react-dnd'
import {
  LeftDropListStore,
  RightDragListStore,
  DragableDragingStatusStore,
  useRequestStore,
  GlobalStatusStore,
  checkListStore
} from 'Src/view/NewExcitation/ExcitaionStore/ExcitaionStore'
import { Tooltip } from 'antd'
import { isEqual } from 'lodash'
import dragImg from 'Src/assets/drag/icon_drag.png'
import OmitExcitation from 'Src/components/OmitComponents/OpenMenu'
import styles from 'Src/view/Project/task/taskList/task.less'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { generateUUID } from 'Src/util/common'
import InfiniteScroll from 'react-infinite-scroll-component'
import StyleSheet from '../excitationDraw.less'

type DragableType = {
  sender_id: number
  setMenuId: any
  menuId: number
  name: string
  item: Record<string, any>
  onChange: (val: string, id: number) => void
}
type Props = { onChange: (val: string, id: number) => void }

// 拖拽列表的item
const Dragable = ({ sender_id, name, item, setMenuId, menuId, onChange }: DragableType) => {
  const DropList = LeftDropListStore(state => state.DropList)
  const setLeftList = LeftDropListStore(state => state.setLeftList)
  const LeftDragIndexFn = LeftDropListStore(state => state.LeftDragIndexFn)
  const setDragableStatus = DragableDragingStatusStore(state => state.setDragableStatus)
  const setSendBtnStatus = GlobalStatusStore(state => state.setSendBtnStatus)
  const clearCheckList = RightDragListStore(state => state.clearCheckList)
  const DropClearCheckList = checkListStore(state => state.clearCheckList)
  const [position, setPosition] = React.useState(0)

  const { setParamsChange } = LeftDropListStore()
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'DragDropItem',
      item() {
        setMenuId(-1)
        clearCheckList()
        const useless = DropList.find((item: any) => item.sender_id === -1)
        // 拖拽开始时，向 cardList 数据源中插入一个占位的元素，如果占位元素已经存在，不再重复插入
        if (!useless) {
          setLeftList([...DropList, { ...item, sender_id: -1, keys: generateUUID(), isItemDragging: true }])
        }
        setDragableStatus(true)
        const Item = { ...item, keys: generateUUID() }
        return Item
      },
      collect: monitor => ({
        isDragging: monitor.isDragging()
      }),
      end: (item: any, monitor: DragSourceMonitor) => {
        const uselessIndex = LeftDragIndexFn()
        const dropCardListCopy = DropList
        if (monitor.didDrop()) {
          dropCardListCopy.splice(uselessIndex, 1, item)
          setLeftList([...dropCardListCopy])
          DropClearCheckList()
          setSendBtnStatus(false)
          setParamsChange(true)
        } else {
          dropCardListCopy.splice(uselessIndex, 1)
          setLeftList([...dropCardListCopy])
        }
        setDragableStatus(false)
      }
    }),
    [DropList, setDragableStatus, item, clearCheckList, DropClearCheckList]
  )

  return (
    <div
      ref={drag}
      onClick={() => {
        setMenuId(-1)
      }}
      role='time'
      key={item.sender_id}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move' }}
      className={StyleSheet.excitationItem}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img className={StyleSheet.img_Body} src={dragImg} alt='' />
        <Checkbox value={sender_id} />

        <span className={StyleSheet.dragItem_name} style={{ marginRight: '6px', color: '#333333' }}>
          <Tooltip placement='bottom' title={name}>
            {' '}
            {name}
          </Tooltip>
        </span>
      </div>
      <div
        onClick={(e: any) => {
          e.stopPropagation()
          const { clientY } = e
          setPosition(clientY)
          setMenuId(menuId === sender_id ? -1 : sender_id)
        }}
        role='time'
      >
        <OmitExcitation menuId={menuId} position={position} onChange={onChange} id={sender_id} />
      </div>
    </div>
  )
}

const DragableMemo = React.memo(Dragable, isEqual)
// 拖拽区
function ExcitationDragMemo({ onChange }: Props) {
  const layoutRef = React.useRef<any>()
  // 右侧拖拽
  const rightDragList = RightDragListStore(state => state.DragList)
  // 全选
  const checkAllList = RightDragListStore(state => state.checkAllList)
  // 全选状态
  const setIndeterminate = RightDragListStore(state => state.setIndeterminate)
  const checkAllSenderIdList = RightDragListStore(state => state.checkAllSenderIdList)
  const setCheckAll = RightDragListStore(state => state.setCheckAll)
  const hasMoreData = useRequestStore(state => state.hasMoreData)
  const loadMoreData = useRequestStore(state => state.loadMoreData)
  const [menuId, setMenuId] = React.useState(-1)
  // 动态设置虚拟列表高度
  const [height, setHeight] = React.useState(0)
  const onChanges = React.useCallback(
    (checkedValues: CheckboxValueType[]) => {
      checkAllSenderIdList([...checkedValues])
      setCheckAll(checkedValues.length === rightDragList.length)
      setIndeterminate(!!checkedValues.length && checkedValues.length < rightDragList.length)
    },
    [checkAllSenderIdList, rightDragList.length, setCheckAll, setIndeterminate]
  )
  const up = React.useCallback(() => {
    setCheckAll(checkAllList.length === rightDragList.length)
    setIndeterminate(!!checkAllList.length && checkAllList.length < rightDragList.length)
    loadMoreData()
  }, [checkAllList.length, loadMoreData, rightDragList.length, setCheckAll, setIndeterminate])
  React.useEffect(() => {
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
  }, [])

  return (
    <div
      className={StyleSheet.LISTScroll}
      onMouseLeave={() => {
        setMenuId(-1)
      }}
      role='time'
      ref={layoutRef}
    >
      <InfiniteScroll
        dataLength={rightDragList.length}
        next={up}
        onScroll={() => {
          setMenuId(-1)
        }}
        hasMore={hasMoreData}
        height={height - 50}
        loader={
          <p style={{ textAlign: 'center', marginTop: '12px', marginLeft: '20px', width: '208px' }}>
            <span className={styles.listLine} />
            <span className={styles.concentList}>内容已经加载完毕</span>
          </p>
        }
        endMessage={
          <p style={{ textAlign: 'center', marginTop: '12px', marginLeft: '20px', width: '208px' }}>
            <span className={styles.concentList}>内容已经加载完毕</span>
          </p>
        }
      >
        <Checkbox.Group style={{ width: '100%' }} onChange={onChanges} value={checkAllList}>
          {rightDragList?.map((item: any) => {
            return (
              <DragableMemo
                sender_id={item.sender_id}
                setMenuId={setMenuId}
                menuId={menuId}
                onChange={onChange}
                name={item.name}
                item={item}
                key={item.sender_id}
              />
            )
          })}
        </Checkbox.Group>
      </InfiniteScroll>
    </div>
  )
}

const ExcitationDrag = React.memo(ExcitationDragMemo, isEqual)
export default ExcitationDrag
