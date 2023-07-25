import { Input } from 'antd'
import * as React from 'react'
import { DropTip } from 'Src/view/excitation/excitationComponent/Tip'
import InputNumberSuffixMemo from 'Src/components/inputNumbersuffix/inputNumberSuffix'
import { LeftDropListStore, sendExcitaionListStore } from 'Src/view/NewExcitation/ExcitaionStore/ExcitaionStore'
import StyleSheet from '../excitationDraw.less'

const CloumnLine = () => {
  return <div className={StyleSheet.cloumnLine} />
}
function DropHeaderMemo() {
  const detailData = sendExcitaionListStore(state => state.detailData)
  const gu_cnt0 = LeftDropListStore(state => state.gu_cnt0)
  const gu_w0 = LeftDropListStore(state => state.gu_w0)
  const setValue = LeftDropListStore(state => state.setValue)
  const { name, desc } = detailData

  const onChangeGu_time = (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = Number.parseInt(e.target.value || '0', 10)
    if (Number.isNaN(newNumber)) {
      return
    }

    setValue(type, newNumber)
  }

  const onMax = React.useCallback(
    (type: string) => {
      if (type === 'gu_cnt0') {
        const newValue = Number(gu_cnt0) > 20 ? 20 : gu_cnt0
        setValue(type, newValue)
      }
      if (type === 'gu_w0') {
        const newValue = Number(gu_w0) > 100 ? 100 : gu_w0
        setValue(type, newValue)
      }
    },
    [gu_cnt0, gu_w0, setValue]
  )
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

          <Input
            className={StyleSheet.numberInput}
            value={gu_cnt0}
            onBlur={() => {
              onMax('gu_cnt0')
            }}
            onChange={e => {
              onChangeGu_time('gu_cnt0', e)
            }}
            suffix={<InputNumberSuffixMemo type='gu_cnt0' />}
          />
        </div>
        <CloumnLine />
        <div className={StyleSheet.inputEdit} style={{ display: 'flex', alignItems: 'center' }}>
          <span className={StyleSheet.headerDesc} style={{ marginRight: '12px' }}>
            发送间隔:
          </span>

          <Input
            className={StyleSheet.numberInput}
            onChange={e => {
              onChangeGu_time('gu_w0', e)
            }}
            onBlur={() => {
              onMax('gu_w0')
            }}
            value={gu_w0}
            suffix={<InputNumberSuffixMemo type='gu_w0' />}
          />

          <DropTip />
        </div>
      </div>
    </div>
  )
}

const DropHeader = React.memo(DropHeaderMemo)
export default DropHeader
