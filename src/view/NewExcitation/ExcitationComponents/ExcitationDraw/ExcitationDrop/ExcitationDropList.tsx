import { Checkbox, Tooltip } from 'antd'
import * as React from 'react'
import { DropTargetMonitor, useDrag, useDrop, XYCoord } from 'react-dnd'
import dragImg from 'Src/assets/drag/icon_drag.png'
import {
  checkListStore,
  DragableDragingStatusStore,
  GlobalStatusStore,
  LeftDropListStore
} from 'Src/view/NewExcitation/ExcitaionStore/ExcitaionStore'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import withScrolling from 'react-dnd-scrolling'
import styles from 'Src/view/Project/task/taskList/task.less'
import StyleSheet from '../excitationDraw.less'

interface PorpsType<T> {
  moveCard: (sender_id: string, atIndex: number) => void
  findCard: (sender_id: string) => FindType
  index: number
  sender_id: string
  item: T
  DropList: ItemType[]
  DeleteCheckItem: (index: number) => void
}

type FindType = { index: number; card: ItemType[] }

interface ItemType {
  sender_id: number
  name: string
  peripheral: string
  gu_cnt0: number
  gu_w0: number
  keys: string
  isItemDragging?: boolean
}

interface PropsType {
  index: number
  Item: Record<string, any>
  moveCardHandler: (dragIndex: number, hoverIndex: number) => void
  DeleteCheckItem: any
}

const DropableMemo = ({ index, Item, moveCardHandler, DeleteCheckItem }: PropsType) => {
  const { sender_id } = Item
  const { setParamsChange } = LeftDropListStore()
  const ref = React.useRef<HTMLDivElement>(null)
  const [position, setPosition] = React.useState<{ index: number; sender_id: number }>({ index: -2, sender_id: -2 })
  const DropList = LeftDropListStore(state => state.DropList)
  // 更新按钮状态
  const setSendBtnStatus = GlobalStatusStore(state => state.setSendBtnStatus)
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'DragDropItem',
      item: () => {
        const positionInfo = {
          index,
          sender_id
        }
        setPosition({ ...positionInfo })
        return positionInfo
      },
      collect: monitor => ({
        isDragging: monitor.isDragging()
      }),
      end(draggedItem, monitor) {
        if (monitor.didDrop()) {
          if (position.index === draggedItem.index) {
            setSendBtnStatus(true)
          } else {
            setParamsChange(true)
            setSendBtnStatus(false)
          }
        } else {
          setSendBtnStatus(true)
        }
      }
    }),
    [sender_id, index, DropList]
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
      style={{
        opacity: isDragging || Item.isItemDragging ? 0.4 : 1,
        cursor: 'move'
      }}
    >
      <div className={StyleSheet.excitationItemDrop_left}>
        <img className={StyleSheet.img_Body} src={dragImg} alt='' />
        <Checkbox value={Item.keys} />
      </div>
      <div className={StyleSheet.excitationItemDrop_right}>
        <span className={StyleSheet.excitationChart}>{index}</span>
        <Tooltip placement='bottomLeft' title={Item.name}>
          <span className={StyleSheet.excitationChart}>{Item.name}</span>
        </Tooltip>
        <span className={StyleSheet.excitationChart}>{Item.peripheral}</span>
        <span className={StyleSheet.excitationChart}>{Item.gu_cnt0}</span>
        <span className={StyleSheet.excitationChart}>{Item.gu_w0}</span>
        <div style={{ paddingRight: '16px', cursor: 'pointer' }}>
          <div
            role='time'
            className={styles.taskListLeft_detailImg}
            onClick={() => {
              DeleteCheckItem(Item.keys)
              setSendBtnStatus(false)
              setParamsChange(true)
            }}
          />
        </div>
      </div>
    </div>
  )
}

const Dropable = React.memo(DropableMemo)
const ScrollingComponent = withScrolling('div')

function ExcitationDropList() {
  const [, drop] = useDrop(() => ({
    accept: 'DragDropItem'
  }))
  const checkAllList = checkListStore(state => state.checkAllList)
  const { checkAllSenderIdList, setCheckAll, setIndeterminate, clearCheckList } = checkListStore()
  // 列表元素

  const DropList = LeftDropListStore(state => state.DropList)
  const setLeftList = LeftDropListStore(state => state.setLeftList)
  const dragableDragingStatus = DragableDragingStatusStore(state => state.dragableDragingStatus)

  const moveCardHandler = React.useCallback(
    (dragIndex: number, hoverIndex: number) => {
      clearCheckList()
      if (dragableDragingStatus) {
        const dropCardListCopy = DropList
        const lessIndex = dropCardListCopy.findIndex((item: any) => item.sender_id === -1)
        const copy = dropCardListCopy.splice(lessIndex, 1)
        dropCardListCopy.splice(hoverIndex, 0, ...copy)
        setLeftList([...dropCardListCopy])
      } else {
        const dropCardListCopy = DropList
        dropCardListCopy.splice(dragIndex, 1, ...dropCardListCopy.splice(hoverIndex, 1, dropCardListCopy[dragIndex]))
        setLeftList([...dropCardListCopy])
      }
    },
    [DropList, clearCheckList, dragableDragingStatus, setLeftList]
  )

  const onChange = React.useCallback(
    (checkedValues: CheckboxValueType[]) => {
      checkAllSenderIdList([...checkedValues])
      setCheckAll(checkedValues.length === DropList.length)
      setIndeterminate(!!checkedValues.length && checkedValues.length < DropList.length)
    },
    [DropList, checkAllSenderIdList, setCheckAll, setIndeterminate]
  )

  const DeleteCheckItem = React.useCallback(
    (val: string) => {
      const DropListFilter = DropList.filter((item: any) => {
        return val !== item.keys
      })
      const CheckListFilter = checkAllList.filter((item: any) => {
        return val !== item
      })
      checkAllSenderIdList([...CheckListFilter])
      setLeftList([...DropListFilter])
      if (DropListFilter.length === 0) {
        setCheckAll(false)
      } else {
        setCheckAll(CheckListFilter.length === DropListFilter.length)
      }
      setIndeterminate(!!CheckListFilter.length && CheckListFilter.length < DropListFilter.length)
    },
    [DropList, checkAllList, checkAllSenderIdList, setCheckAll, setIndeterminate, setLeftList]
  )

  return (
    <ScrollingComponent className={StyleSheet.dropList_ListScroll}>
      <div ref={drop} className={StyleSheet.dropList_List}>
        <Checkbox.Group style={{ width: '100%' }} onChange={onChange} value={checkAllList}>
          <div ref={drop} className={StyleSheet.dropList_List}>
            {DropList?.map((item, index: number) => {
              return <Dropable index={index} key={item.keys} DeleteCheckItem={DeleteCheckItem} moveCardHandler={moveCardHandler} Item={item} />
            })}
          </div>
        </Checkbox.Group>
      </div>
    </ScrollingComponent>
  )
}
const MemoExcitationList = React.memo(ExcitationDropList)

export default MemoExcitationList
