import Checkbox from 'antd/lib/checkbox'
import * as React from 'react'
import { DragSourceMonitor, useDrag } from 'react-dnd'
import { LeftDropListStore, RightDragListStore, DragableDragingStatusStore } from 'Src/view/NewExcitation/ExcitaionStore/ExcitaionStore'
import dragImg from 'Src/assets/drag/icon_drag.png'
import OmitExcitationComponents from 'Src/components/OmitComponents/OmitExcitationComponents'
import StyleSheet from '../excitationDraw.less'

type DragableType = { id: number; name: string; keys: number }

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
          setLeftList([{ ...item, sender_id: -1, isItemDragging: true }, ...DropList])
        }
        setDragableStatus(true)
        return item
      },
      collect: monitor => ({
        isDragging: monitor.isDragging()
      }),
      end: (item, monitor: DragSourceMonitor) => {
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
function ExcitationDrag() {
  const rightDragList = RightDragListStore(state => state.DragList)

  // const onChange = (checkedValues: CheckboxValueType[]) => {
  //   console.log('2')
  // }
  return (
    <div>
      <Checkbox.Group style={{ width: '100%' }}>
        {rightDragList?.map((item: any) => {
          return <DragableMemo id={item.sender_id} name={item.name} item={item} key={item.sender_id} />
        })}
      </Checkbox.Group>
    </div>
  )
}

export default ExcitationDrag
