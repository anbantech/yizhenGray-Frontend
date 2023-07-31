import React from 'react'
import { useDrag, DragPreviewImage } from 'react-dnd'
import IntPng from 'Src/assets/drag/Int.svg'
import IntArrayPng from 'Src/assets/drag/intArray.svg'
import StringPng from 'Src/assets/drag/string.svg'
import { generateUUID } from 'Src/util/common'
import { ArgeementDropListStore, DragableDragingStatusStore } from '../../ExcitaionStore/ExcitaionStore'
import styles from './agreementCompoents.less'
import { ComponentsArray } from './agreementCompoents'

interface DragCmps {
  type: string
  id: number
  Components: any
}

const preViewImg = {
  byte_array: IntArrayPng,
  byte: IntPng,
  string: StringPng
}

const preViewTitle = {
  byte_array: '整数数组',
  byte: '整数',
  string: '字符串'
}

const StyleMap = {
  string: { width: '74px', height: '26px', borderRadius: '4px', cursor: 'move' },
  byte: { width: '60px', height: '26px', borderRadius: '4px', margin: '0px 6px', cursor: 'move' },
  byte_array: { width: '88px', height: '26px', borderRadius: '4px', cursor: 'move' }
}

type ItemType = { item: DragCmps }

const Draggable = ({ item }: ItemType) => {
  const DropList = ArgeementDropListStore(state => state.DropList)
  const setLeftList = ArgeementDropListStore(state => state.setLeftList)
  const LeftDragIndexFn = ArgeementDropListStore(state => state.LeftDragIndexFn)
  const setDragableStatus = DragableDragingStatusStore(state => state.setDragableStatus)
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: 'DragDropItem',
      item() {
        const useless = DropList.find((item: any) => item.id === -1)
        // 拖拽开始时，向 cardList 数据源中插入一个占位的元素，如果占位元素已经存在，不再重复插入
        if (!useless) {
          setLeftList([...DropList, { ...item, id: -1, keys: generateUUID() }])
        }
        setDragableStatus(true)
        const Item = { ...item, keys: generateUUID() }
        return Item
      },
      collect: monitor => {
        const isDragging = monitor.isDragging()
        return {
          isDragging
        }
      },
      end(item, monitor) {
        const uselessIndex = LeftDragIndexFn()
        const dropCardListCopy = DropList
        if (monitor.didDrop()) {
          const preItem = item as any
          dropCardListCopy.splice(uselessIndex, 1, preItem)
          setLeftList([...dropCardListCopy])
        } else {
          dropCardListCopy.splice(uselessIndex, 1)
          setLeftList([...dropCardListCopy])
        }
        setDragableStatus(false)
      }
    }),
    [DropList, setDragableStatus]
  )

  const addDragItem = React.useCallback(() => {
    const Item = { ...item, keys: generateUUID() }
    const dropCardListCopy = DropList
    dropCardListCopy.push(Item)
    setLeftList([...dropCardListCopy])
  }, [DropList, item, setLeftList])
  return (
    <>
      <DragPreviewImage connect={preview} src={preViewImg[item.type as keyof typeof preViewImg]} />
      <div
        ref={drag}
        role='time'
        style={{ opacity: isDragging ? 0.4 : 1, ...StyleMap[item.type as keyof typeof StyleMap] }}
        className={styles.dragButton}
        onClick={addDragItem}
      >
        <div className={styles.dragImage} />
        <span>{preViewTitle[item.type as keyof typeof preViewTitle]} </span>
      </div>
    </>
  )
}

function AgreementDrag() {
  return (
    <div className={styles.agreeFooter}>
      <span> 新增协议数据: </span>
      {ComponentsArray?.map(item => {
        return <Draggable key={`${new Date()}${Math.random()}`} item={item} />
      })}
    </div>
  )
}

export default AgreementDrag
