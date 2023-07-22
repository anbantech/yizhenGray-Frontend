// import Checkbox, { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { Checkbox } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import * as React from 'react'
import { checkListStore, LeftDropListStore } from 'Src/view/NewExcitation/ExcitaionStore/ExcitaionStore'
import StyleSheet from '../excitationDraw.less'

function ExcitationDropHeader() {
  const { checkAllSenderIdList, indeterminate, setIndeterminate, all, setCheckAll } = checkListStore()
  const DropList = LeftDropListStore(state => state.DropList)
  const checkItem = React.useCallback(() => {
    return DropList.map((item: any) => item.keys)
  }, [DropList])

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
    <div className={StyleSheet.dropList_Header}>
      <div className={[StyleSheet.dropList_HeaderCheckBox, StyleSheet.flexEnd].join(' ')}>
        <Checkbox onChange={onAllChange} indeterminate={indeterminate} checked={all} />
      </div>
      <div className={StyleSheet.dropList_HeaderCheckBoxRight}>
        <span className={StyleSheet.excitationChart}>序号</span>
        <span className={StyleSheet.excitationChart}>名称</span>
        <span className={StyleSheet.excitationChart}>外设</span>
        <span className={StyleSheet.excitationChart}>发送次数</span>
        <span className={StyleSheet.excitationChart}>发送间隔</span>
        <span className={StyleSheet.excitationChart}>操作</span>
      </div>
    </div>
  )
}

const MemoExcitationListHeader = React.memo(ExcitationDropHeader)

export default MemoExcitationListHeader
