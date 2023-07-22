import Checkbox from 'antd/lib/checkbox'
import * as React from 'react'
import { DragSourceMonitor, useDrag } from 'react-dnd'
import {
  LeftDropListStore,
  RightDragListStore,
  DragableDragingStatusStore,
  useRequestStore
} from 'Src/view/NewExcitation/ExcitaionStore/ExcitaionStore'
import dragImg from 'Src/assets/drag/icon_drag.png'
import OmitExcitationComponents from 'Src/components/OmitComponents/OmitExcitationComponents'
import styles from 'Src/view/Project/task/taskList/task.less'
import { generateUUID } from 'Src/util/common'
import InfiniteScroll from 'react-infinite-scroll-component'
import StyleSheet from '../excitationDraw.less'

type DragableType = { id: number; name: string; keys: number }
type Props = { height: number }
type ChildRefType = { closeMenu: () => void } | null
// 拖拽列表的item
const Dragable = ({ name, sender_id, item }: any) => {
  // 展示菜单

  const DropList = LeftDropListStore(state => state.DropList)
  const setLeftList = LeftDropListStore(state => state.setLeftList)
  const LeftDragIndexFn = LeftDropListStore(state => state.LeftDragIndexFn)
  const setDragableStatus = DragableDragingStatusStore(state => state.setDragableStatus)

  const [, setUpdateMenue] = React.useState<number>(-1)
  // 定义 ref
  const ref = React.useRef<ChildRefType>(null!)

  const onChange = (val: string) => {
    switch (val) {
      case '删除':
        // CommonModleClose(true)
        break
      case '查看关联信息':
        // getDependenceInfo()
        break
      case '修改':
        // jumpUpdateWeb(updateMenue)
        break
      default:
        return null
    }
  }

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'DragDropItem',
      item() {
        const useless = DropList.find((item: any) => item.sender_id === -1)
        // 拖拽开始时，向 cardList 数据源中插入一个占位的元素，如果占位元素已经存在，不再重复插入
        if (!useless) {
          setLeftList([{ ...item, sender_id: -1, keys: generateUUID(), isItemDragging: true }, ...DropList])
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
        } else {
          dropCardListCopy.splice(uselessIndex, 1)
        }
        setLeftList([...dropCardListCopy])
        setDragableStatus(false)
      }
    }),
    [DropList, setDragableStatus]
  )
  return (
    <div
      ref={drag}
      role='time'
      style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move' }}
      onMouseLeave={() => {
        setUpdateMenue(-1)
        ref.current?.closeMenu()
      }}
      className={StyleSheet.excitationItem}
    >
      <div
        role='time'
        onMouseDown={() => {
          setUpdateMenue(-1)
          ref.current?.closeMenu()
        }}
      >
        <img className={StyleSheet.img_Body} src={dragImg} alt='' />
        <Checkbox value={sender_id} />
        <span className={StyleSheet.dragItem_name} style={{ marginRight: '6px' }}>
          {' '}
          {name}
        </span>
      </div>
      <OmitExcitationComponents id={sender_id} ref={ref} onChange={onChange} updateMenueFn={setUpdateMenue} />
    </div>
  )
}

const DragableMemo = React.memo(Dragable)
// 拖拽区
function ExcitationDrag({ height }: Props) {
  const rightDragList = RightDragListStore(state => state.DragList)
  const { hasMoreData, loadMoreData } = useRequestStore()
  return (
    <div className={StyleSheet.LISTScroll}>
      <InfiniteScroll
        dataLength={rightDragList.length}
        next={loadMoreData}
        hasMore={hasMoreData}
        height={height}
        loader={
          <p style={{ textAlign: 'center', marginTop: '12px', marginLeft: '20px', width: '208px' }}>
            <div className={styles.listLine} />
            <div className={styles.concentList}>内容已经加载完毕</div>
          </p>
        }
        endMessage={
          <p style={{ textAlign: 'center', marginTop: '12px', marginLeft: '20px', width: '208px' }}>
            {/* <div className={styles.listLine} /> */}
            <div className={styles.concentList}>内容已经加载完毕</div>
          </p>
        }
      >
        {rightDragList?.map((item: any) => {
          return <DragableMemo id={item.sender_id} name={item.name} item={item} key={item.sender_id} />
        })}
      </InfiniteScroll>
    </div>
  )
}

export default ExcitationDrag
