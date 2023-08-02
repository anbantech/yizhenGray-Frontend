import { Checkbox } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import * as React from 'react'
import { RightDragListStore } from 'Src/view/NewExcitation/ExcitaionStore/ExcitaionStore'
import StyleSheet from '../excitationDraw.less'

function ExcitationDragHeaderMemo() {
  const indeterminate = RightDragListStore(state => state.indeterminate)
  const all = RightDragListStore(state => state.all)
  const checkAllSenderIdList = RightDragListStore(state => state.checkAllSenderIdList)
  const setIndeterminate = RightDragListStore(state => state.setIndeterminate)
  const setCheckAll = RightDragListStore(state => state.setCheckAll)
  const DragList = RightDragListStore(state => state.DragList)

  const checkItem = React.useCallback(() => {
    return DragList.map((item: any) => item.sender_id)
  }, [DragList])

  const onAllChange = React.useCallback(
    (e: CheckboxChangeEvent) => {
      const list = checkItem()
      checkAllSenderIdList(e.target.checked ? [...list] : [])
      setIndeterminate(false)
      setCheckAll(e.target.checked)
    },
    [checkAllSenderIdList, checkItem, setCheckAll, setIndeterminate]
  )

  return (
    <div className={StyleSheet.dragList_Header}>
      <Checkbox style={{ marginLeft: '20px' }} onChange={onAllChange} indeterminate={indeterminate} checked={all} />
      <span className={[StyleSheet.excitationChart, StyleSheet.dragItem_name].join(' ')}> 激励名称 </span>
      <span className={StyleSheet.excitationChart}> 操作 </span>
    </div>
  )
}

const ExcitationDragHeader = React.memo(ExcitationDragHeaderMemo)

export default ExcitationDragHeader
