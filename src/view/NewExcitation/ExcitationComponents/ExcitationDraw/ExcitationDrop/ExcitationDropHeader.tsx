import { Input, InputNumber, Tooltip } from 'antd'
import * as React from 'react'
import { DropTip } from 'Src/view/excitation/excitationComponent/Tip'
import InputNumberSuffixMemo from 'Src/components/inputNumbersuffix/inputNumberSuffix'
import { sendExcitaionListStore } from 'Src/view/NewExcitation/ExcitaionStore/ExcitaionStore'
import StyleSheet from '../excitationDraw.less'

const CloumnLine = () => {
  return <div className={StyleSheet.cloumnLine} />
}
function DropHeaderMemo() {
  const detailData = sendExcitaionListStore(state => state.detailData)
  const { name, desc } = detailData
  const [Gu_time, setGu_time] = React.useState(1)
  const onChangeGu_time = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = Number.parseInt(e.target.value || '0', 10)
    if (Number.isNaN(newNumber)) {
      return
    }
    setGu_time(newNumber)
  }
  return (
    <div className={StyleSheet.DropHeader}>
      <span className={StyleSheet.sendListTitle}>{name}</span>
      <div className={StyleSheet.editConcent}>
        <span className={StyleSheet.headerDesc}> 描述: {desc} </span>
        <CloumnLine />
        <div className={StyleSheet.inputEdit} style={{ display: 'flex', alignItems: 'center' }}>
          <span className={StyleSheet.headerDesc} style={{ marginRight: '12px' }}>
            发送次数:
          </span>
          <Tooltip trigger={['focus']} title={Gu_time} placement='topLeft' overlayClassName='numeric-input'>
            <Input className={StyleSheet.numberInput} maxLength={5} value={Gu_time} onChange={onChangeGu_time} suffix={<InputNumberSuffixMemo />} />
          </Tooltip>
        </div>
        <CloumnLine />
        <div className={StyleSheet.inputEdit} style={{ display: 'flex', alignItems: 'center' }}>
          <span className={StyleSheet.headerDesc} style={{ marginRight: '12px' }}>
            发送间隔:
          </span>
          <Tooltip trigger={['focus']} title={Gu_time} placement='topLeft' overlayClassName='numeric-input'>
            <Input className={StyleSheet.numberInput} maxLength={5} min={1} max={10} suffix={<InputNumberSuffixMemo />} />
          </Tooltip>
          <DropTip />
        </div>
      </div>
    </div>
  )
}

const DropHeader = React.memo(DropHeaderMemo)
export default DropHeader
