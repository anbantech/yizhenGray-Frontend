import * as React from 'react'
import { useDrop } from 'react-dnd'
import { ArgeementDropListStore, DragableDragingStatusStore } from '../../ExcitaionStore/ExcitaionStore'
import styles from './agreementCompoents.less'

function AgreementDrop() {
  const [, drop] = useDrop(() => ({
    accept: 'DragDropItem'
  }))
  const DropList = ArgeementDropListStore(state => state.DropList)
  const setLeftList = ArgeementDropListStore(state => state.setLeftList)
  const dragableDragingStatus = DragableDragingStatusStore(state => state.dragableDragingStatus)

  const moveCardHandler = React.useCallback(
    (dragIndex: number, hoverIndex: number) => {
      if (dragableDragingStatus) {
        const dropCardListCopy = DropList
        const lessIndex = DropList.findIndex((item: any) => item.id === -1)
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
    <div ref={drop} className={styles.agreementDrop}>
      {DropList?.map((item, index: number) => {
        return <item.Components index={index} key={item.keys} Item={item} moveCardHandler={moveCardHandler} />
      })}
    </div>
  )
}

export default AgreementDrop
