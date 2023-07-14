// import Checkbox, { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { Checkbox } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import * as React from 'react'
import StyleSheet from '../excitationDraw.less'

function ExcitationDragHeader() {
  const onAllChange = (e: CheckboxChangeEvent) => {
    console.log(e)
  }
  return (
    <div className={StyleSheet.dragList_Header}>
      <Checkbox style={{ marginLeft: '20px' }} onChange={onAllChange} />
      <span className={[StyleSheet.excitationChart, StyleSheet.dragItem_name].join(' ')}> 激励名称 </span>
      <span className={StyleSheet.excitationChart}> 操作 </span>
    </div>
  )
}

export default ExcitationDragHeader
