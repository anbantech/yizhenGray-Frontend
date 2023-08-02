import { Button, Input, message, Tooltip } from 'antd'
import * as React from 'react'
import { DropTip } from 'Src/view/excitation/excitationComponent/Tip'
import InputNumberSuffixMemo from 'Src/components/inputNumbersuffix/inputNumberSuffix'
import { GlobalStatusStore, LeftDropListStore, useExicitationSenderId } from 'Src/view/NewExcitation/ExcitaionStore/ExcitaionStore'
import { updateExcitationList } from 'Src/services/api/excitationApi'
import CommonModle from 'Src/components/Modal/projectMoadl/CommonModle'
import StyleSheet from '../excitationDraw.less'

const CloumnLine = () => {
  return <div className={StyleSheet.cloumnLine} />
}
function DropHeaderMemo({ getExcitaionDeatilFunction }: { getExcitaionDeatilFunction: (val: number) => void }) {
  const [spinning, setSpinning] = React.useState(false)
  const [visibility, setVisibility] = React.useState(false)
  // 拿 sender_id
  const sender_id = useExicitationSenderId(state => state.sender_id)
  const setValue = LeftDropListStore(state => state.setValue)
  // 更新按钮状态
  const sendBtnStatus = GlobalStatusStore(state => state.sendBtnStatus)
  const setSendBtnStatus = GlobalStatusStore(state => state.setSendBtnStatus)
  const DropList = LeftDropListStore(state => state.DropList)
  const { name, desc, gu_cnt0, gu_w0, updated } = LeftDropListStore()
  const CommonModleClose = React.useCallback((val: boolean) => {
    setVisibility(val)
  }, [])

  const close = React.useCallback(() => {
    CommonModleClose(false)
    setSpinning(false)
  }, [CommonModleClose])

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
        const newValue_1 = Number(gu_cnt0) > 20 ? 20 : gu_cnt0
        const newValue_2 = Number(gu_cnt0) === 0
        if (newValue_2) {
          setValue(type, 1)
        } else {
          setValue(type, newValue_1)
        }
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
    return !sendBtnStatus
  }, [sendBtnStatus])

  const saveConfig = React.useCallback(async () => {
    if (updated) {
      setSpinning(true)
    }
    const listArray = DropList.map((item: any) => {
      return item.sender_id
    })
    if (listArray.length === 0) {
      return message.error('发送列表至少要包含一个激励')
    }
    const child_id_list = [[], [...listArray], []]
    const params = { name, gu_cnt0, gu_w0, desc: desc ? desc.trim() : '', child_id_list }
    try {
      if (sender_id) {
        const res = await updateExcitationList(sender_id, params)
        if (res.code === 0) {
          setSendBtnStatus(true)
          message.success('发送列表保存成功')
          getExcitaionDeatilFunction(sender_id)
        }
        if (updated) {
          close()
        }
      }
    } catch {
      close()
      message.success('发送列表保存失败')
    }
  }, [DropList, close, desc, getExcitaionDeatilFunction, gu_cnt0, gu_w0, name, sender_id, setSendBtnStatus, updated])

  const updateOrCreate = () => {
    if (updated) {
      CommonModleClose(true)
    } else {
      saveConfig()
    }
  }
  return (
    <div className={StyleSheet.DropHeader}>
      <Button disabled={!BtnStatus} type='primary' onClick={updateOrCreate} className={StyleSheet.saveBtn}>
        保存配置
      </Button>
      <Tooltip placement='bottom' title={name || ''}>
        <span className={StyleSheet.sendListTitle}>{name}</span>
      </Tooltip>

      <div className={StyleSheet.editConcent}>
        <span className={StyleSheet.headerDesc} style={{ display: 'flex', alignItems: 'center' }}>
          {' '}
          描述:
          <Tooltip placement='bottom' title={desc || ''}>
            <span className={StyleSheet.Headerdesc} style={{ display: 'flex', alignItems: 'center', paddingLeft: '8px' }}>
              {desc}
            </span>{' '}
          </Tooltip>
        </span>

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

      {visibility && (
        <CommonModle
          IsModalVisible={visibility}
          spinning={spinning}
          deleteProjectRight={saveConfig}
          CommonModleClose={CommonModleClose}
          ing='保存中'
          name='保存配置'
          btnName='确定'
          concent='修改激励发送列表配置，会停止关联任务，并清空关联任务的测试数据，是否确认保存？'
        />
      )}
    </div>
  )
}

const DropHeader = React.memo(DropHeaderMemo)
export default DropHeader
