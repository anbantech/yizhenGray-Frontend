// import Checkbox, { CheckboxChangeEvent } from 'antd/lib/checkbox'
import * as React from 'react'
import { DropTargetMonitor, useDrag, useDrop, XYCoord } from 'react-dnd'
import dragImg from 'Src/assets/drag/icon_drag.png'
import { generateUUID } from 'Src/util/common'
import { DragableDragingStatusStore, LeftDropListStore } from 'Src/view/NewExcitation/ExcitaionStore/ExcitaionStore'
import styles from 'Src/view/Project/task/taskList/task.less'
import StyleSheet from '../excitationDraw.less'

interface PorpsType<T> {
  moveCard: (sender_id: string, atIndex: number) => void
  findCard: (sender_id: string) => FindType
  index: number
  sender_id: string
  item: T
}

type FindType = { index: number; card: ItemType[] }

interface ItemType {
  sender_id: number
  name: string
  peripheral: string
  gu_cnt0: number
  gu_w0: number
  isItemDragging?: boolean
}

const DropableMemo = ({ index, item, moveCardHandler, sender_id }: any) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'DragDropItem',
      item() {
        return {
          index,
          sender_id
        }
      },
      collect: monitor => ({
        isDragging: monitor.isDragging()
      }),
      end: () => {}
    }),
    [sender_id, index]
  )

  const [{ handlerId }, drop] = useDrop({
    accept: 'DragDropItem',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()
      }
    },
    hover(item: any, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      // 拖拽元素下标与鼠标悬浮元素下标一致时，不进行操作
      if (dragIndex === hoverIndex) {
        return
      }

      // 确定屏幕上矩形范围
      const hoverBoundingRect = ref.current!.getBoundingClientRect()

      // 获取中点垂直坐标
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // 确定鼠标位置
      const clientOffset = monitor.getClientOffset()

      // 获取距顶部距离
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      /**
       * 只在鼠标越过一半物品高度时执行移动。
       *
       * 当向下拖动时，仅当光标低于50%时才移动。
       * 当向上拖动时，仅当光标在50%以上时才移动。
       *
       * 可以防止鼠标位于元素一半高度时元素抖动的状况
       */

      // 向下拖动
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // 向上拖动
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }
      // 执行 move 回调函数
      moveCardHandler(dragIndex, hoverIndex)

      /**
       * 如果拖拽的组件为 Box，则 dragIndex 为 undefined，此时不对 item 的 index 进行修改
       * 如果拖拽的组件为 Card，则将 hoverIndex 赋值给 item 的 index 属性
       */

      // eslint-disable-next-line no-param-reassign
      item.index = hoverIndex
    }
  })

  drag(drop(ref))
  return (
    <div
      ref={ref}
      data-handler-id={handlerId}
      className={StyleSheet.excitationItemDrop}
      style={{ opacity: item.isItemDragging || isDragging ? 0.4 : 1, cursor: 'move' }}
    >
      <div className={StyleSheet.excitationItemDrop_left}>
        <img className={StyleSheet.img_Body} src={dragImg} alt='' />
        {/* <Checkbox value={item.sender_id} /> */}
      </div>
      <div className={StyleSheet.excitationItemDrop_right}>
        <span className={StyleSheet.excitationChart}>{index}</span>
        <span className={StyleSheet.excitationChart}>{item.name}</span>
        <span className={StyleSheet.excitationChart}>{item.peripheral}</span>
        <span className={StyleSheet.excitationChart}>{item.gu_cnt0}</span>
        <span className={StyleSheet.excitationChart}>{item.gu_w0}</span>
        <div>
          <div role='time' className={styles.taskListLeft_detailImg} onClick={() => {}} />
        </div>
      </div>
    </div>
  )
}

const Dropable = React.memo(DropableMemo)

function ExcitationDropList() {
  const [, drop] = useDrop(() => ({
    accept: 'DragDropItem'
  }))
  const DropList = LeftDropListStore(state => state.DropList)
  const setLeftList = LeftDropListStore(state => state.setLeftList)

  const dragableDragingStatus = DragableDragingStatusStore(state => state.dragableDragingStatus)
  const moveCardHandler = React.useCallback(
    (dragIndex: number, hoverIndex: number) => {
      if (dragableDragingStatus) {
        const dropCardListCopy = DropList
        const lessIndex = DropList.findIndex((item: any) => item.sender_id === -1)
        dropCardListCopy.splice(hoverIndex, 1, ...dropCardListCopy.splice(lessIndex, 1, dropCardListCopy[hoverIndex]))
        setLeftList([...dropCardListCopy])
      } else {
        const dropCardListCopy = DropList
        dropCardListCopy.splice(dragIndex, 1, ...dropCardListCopy.splice(hoverIndex, 1, dropCardListCopy[dragIndex]))
        setLeftList([...dropCardListCopy])
      }
    },
    [DropList, dragableDragingStatus, setLeftList]
  )

  return (
    <div ref={drop} className={StyleSheet.dropList_List}>
      {DropList?.map((item: ItemType, index: number) => {
        return (
          <Dropable
            sender_id={item.sender_id}
            key={`${generateUUID()}`}
            isDragableDraging={dragableDragingStatus}
            moveCardHandler={moveCardHandler}
            index={index}
            item={item}
          />
        )
      })}
    </div>
  )
}
const MemoExcitationList = React.memo(ExcitationDropList)

export default MemoExcitationList
