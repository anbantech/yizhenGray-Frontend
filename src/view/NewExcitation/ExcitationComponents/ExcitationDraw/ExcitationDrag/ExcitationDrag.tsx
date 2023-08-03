import Checkbox from 'antd/lib/checkbox'
import * as React from 'react'
import { DragSourceMonitor, useDrag } from 'react-dnd'
import {
  LeftDropListStore,
  RightDragListStore,
  DragableDragingStatusStore,
  useRequestStore,
  GlobalStatusStore
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

type DragableType = { sender_id: number; name: string; item: Record<string, any>; onChange: (val: string, id: number) => void }
type Props = { onChange: (val: string, id: number) => void }

// 拖拽列表的item
const Dragable = ({ sender_id, name, item, onChange }: DragableType) => {
  const DropList = LeftDropListStore(state => state.DropList)
  const setLeftList = LeftDropListStore(state => state.setLeftList)
  const LeftDragIndexFn = LeftDropListStore(state => state.LeftDragIndexFn)
  const setDragableStatus = DragableDragingStatusStore(state => state.setDragableStatus)
  const setSendBtnStatus = GlobalStatusStore(state => state.setSendBtnStatus)
  const clearCheckList = RightDragListStore(state => state.clearCheckList)
  const { setParamsChange } = LeftDropListStore()
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'DragDropItem',
      item() {
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
          setSendBtnStatus(false)
          setParamsChange(true)
        } else {
          dropCardListCopy.splice(uselessIndex, 1)
          setLeftList([...dropCardListCopy])
        }
        setDragableStatus(false)
      }
    }),
    [DropList, setDragableStatus, item, clearCheckList]
  )
  const myRef = React.useRef<any>()
  return (
    <div
      ref={drag}
      role='time'
      key={item.sender_id}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move' }}
      onMouseLeave={() => {
        myRef.current?.closeMenu()
      }}
      className={StyleSheet.excitationItem}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img className={StyleSheet.img_Body} src={dragImg} alt='' />
        <Checkbox value={sender_id} />

        <span className={StyleSheet.dragItem_name} style={{ marginRight: '6px' }}>
          <Tooltip placement='bottom' title={name}>
            {' '}
            {name}
          </Tooltip>
        </span>
      </div>
      <OmitExcitation ref={myRef} onChange={onChange} id={sender_id} />
    </div>
  )
}

const DragableMemo = React.memo(Dragable, isEqual)
// 拖拽区
function ExcitationDragMemo({ onChange }: Props) {
  const layoutRef = React.useRef<any>()
  const rightDragList = RightDragListStore(state => state.DragList)
  const checkAllList = RightDragListStore(state => state.checkAllList)
  const setIndeterminate = RightDragListStore(state => state.setIndeterminate)
  const checkAllSenderIdList = RightDragListStore(state => state.checkAllSenderIdList)
  const setCheckAll = RightDragListStore(state => state.setCheckAll)
  const hasMoreData = useRequestStore(state => state.hasMoreData)
  const loadMoreData = useRequestStore(state => state.loadMoreData)
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
    <div className={StyleSheet.LISTScroll} ref={layoutRef}>
      <InfiniteScroll
        dataLength={rightDragList.length}
        next={loadMoreData}
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
            return <DragableMemo sender_id={item.sender_id} onChange={onChange} name={item.name} item={item} key={item.sender_id} />
          })}
        </Checkbox.Group>
      </InfiniteScroll>
    </div>
  )
}

const ExcitationDrag = React.memo(ExcitationDragMemo, isEqual)
export default ExcitationDrag
