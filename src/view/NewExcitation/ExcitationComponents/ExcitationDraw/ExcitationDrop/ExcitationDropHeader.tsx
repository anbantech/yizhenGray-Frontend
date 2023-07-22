import { InputNumber } from 'antd'
import * as React from 'react'
import { DropTip } from 'Src/view/excitation/excitationComponent/Tip'
import { sendExcitaionListStore } from 'Src/view/NewExcitation/ExcitaionStore/ExcitaionStore'
import StyleSheet from '../excitationDraw.less'

const CloumnLine = () => {
  return <div className={StyleSheet.cloumnLine} />
}
function DropHeaderMemo() {
  const detailData = sendExcitaionListStore(state => state.detailData)
  const { name, desc } = detailData
  return (
    <div className={StyleSheet.DropHeader}>
      <span className={StyleSheet.sendListTitle}>{name}</span>
      <div className={StyleSheet.editConcent}>
        <span className={StyleSheet.headerDesc}> 描述: {desc} </span>
        <CloumnLine />
        <div className={StyleSheet.inputEdit}>
          <span className={StyleSheet.headerDesc} style={{ marginRight: '12px' }}>
            发送次数:
          </span>
          <InputNumber className={StyleSheet.numberInput} min={1} max={10} defaultValue={1} controls />
        </div>
        <CloumnLine />
        <div className={StyleSheet.inputEdit} style={{ display: 'flex', alignItems: 'center' }}>
          <span className={StyleSheet.headerDesc} style={{ marginRight: '12px' }}>
            发送间隔:
          </span>
          <InputNumber className={StyleSheet.numberInput} min={1} max={10} defaultValue={1} controls />
          <DropTip />
        </div>
      </div>
    </div>
  )
}

const DropHeader = React.memo(DropHeaderMemo)
export default DropHeader
