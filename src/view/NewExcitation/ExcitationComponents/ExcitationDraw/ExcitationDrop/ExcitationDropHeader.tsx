import { Button, Input, message } from 'antd'
import * as React from 'react'
import { DropTip } from 'Src/view/excitation/excitationComponent/Tip'
import InputNumberSuffixMemo from 'Src/components/inputNumbersuffix/inputNumberSuffix'
import { GlobalStatusStore, LeftDropListStore, useExicitationSenderId } from 'Src/view/NewExcitation/ExcitaionStore/ExcitaionStore'
import { updateExcitationList } from 'Src/services/api/excitationApi'
import StyleSheet from '../excitationDraw.less'

const CloumnLine = () => {
  return <div className={StyleSheet.cloumnLine} />
}
function DropHeaderMemo() {
  // 拿 sender_id
  const sender_id = useExicitationSenderId(state => state.sender_id)
  const setValue = LeftDropListStore(state => state.setValue)
  // 更新按钮状态
  const sendBtnStatus = GlobalStatusStore(state => state.sendBtnStatus)
  const setSendBtnStatus = GlobalStatusStore(state => state.setSendBtnStatus)
  const DropList = LeftDropListStore(state => state.DropList)
  const { name, desc, gu_cnt0, gu_w0 } = LeftDropListStore()

  const onChangeGu_time = React.useCallback(
    (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
      const newNumber = Number.parseInt(e.target.value || '0', 10)
      if (Number.isNaN(newNumber)) {
        return
      }
      setValue(type, newNumber)
      setSendBtnStatus(false)
    },
    [setSendBtnStatus, setValue]
  )

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
      setSendBtnStatus(false)
    },
    [gu_cnt0, gu_w0, setSendBtnStatus, setValue]
  )

  const BtnStatus = React.useMemo(() => {
    return DropList.length !== 0 && !sendBtnStatus
  }, [DropList.length, sendBtnStatus])

  const saveConfig = React.useCallback(async () => {
    const listArray = DropList.map((item: any) => {
      return item.sender_id
    })
    const child_id_list = [[], [...listArray], []]
    const params = { name, gu_cnt0, gu_w0, desc: desc ? desc.trim() : '', child_id_list }
    if (sender_id) {
      const res = await updateExcitationList(sender_id, params)
      if (res.code === 0) {
        setSendBtnStatus(true)
        message.success('创建成功')
      }
    }
  }, [DropList, desc, gu_cnt0, gu_w0, name, sender_id, setSendBtnStatus])

  return (
    <div className={StyleSheet.DropHeader}>
      <Button disabled={!BtnStatus} onClick={saveConfig} className={StyleSheet.saveBtn}>
        保存配置
      </Button>
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
