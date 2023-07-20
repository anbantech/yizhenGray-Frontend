// import Checkbox, { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { Checkbox } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import * as React from 'react'
import StyleSheet from '../excitationDraw.less'

function ExcitationDropHeader() {
  const onAllChange = (e: CheckboxChangeEvent) => {
    // console.log(`checked = ${e}`)
  }
  return (
    <div className={StyleSheet.dropList_Header}>
      <div className={[StyleSheet.dropList_HeaderCheckBox, StyleSheet.flexEnd].join(' ')}>
        <Checkbox onChange={onAllChange} />
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
