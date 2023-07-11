import Checkbox, { CheckboxChangeEvent } from 'antd/lib/checkbox'
import * as React from 'react'
import StyleSheet from './excitationDraw.less'

function ExcitationDragHeader() {
  const onAllChange = (e: CheckboxChangeEvent) => {
    console.log(`checked = ${e.target.checked}`)
  }
  return (
    <div className={StyleSheet.dragList_Header}>
      <Checkbox onChange={onAllChange} />
      <span className={(StyleSheet.excitationChart, StyleSheet.dragItem_name)}> 激励名称 </span>
      <span className={StyleSheet.excitationChart}> 操作 </span>
    </div>
  )
}

export default ExcitationDragHeader
