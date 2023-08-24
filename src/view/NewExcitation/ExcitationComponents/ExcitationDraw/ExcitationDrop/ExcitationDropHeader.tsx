import { Button, Input, message, Tag, Tooltip } from 'antd'
import * as React from 'react'
import { DropTip } from 'Src/view/excitation/excitationComponent/Tip'
import InputNumberSuffixMemo from 'Src/components/inputNumbersuffix/inputNumberSuffix'
import { checkListStore, GlobalStatusStore, LeftDropListStore, useExicitationSenderId } from 'Src/view/NewExcitation/ExcitaionStore/ExcitaionStore'
import { updateExcitationList } from 'Src/services/api/excitationApi'
import CommonModle from 'Src/components/Modal/projectMoadl/CommonModle'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { throwErrorMessage } from 'Src/util/message'
import StyleSheet from '../excitationDraw.less'

const CloumnLine = () => {
  return <div className={StyleSheet.cloumnLine} />
}

const iconMap = {
  1: <CheckCircleOutlined />,
  2: <CloseCircleOutlined />,
  3: <CloseCircleOutlined />
}

const statusMap = {
  1: 'success',
  2: 'error',
  3: 'error'
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
  const updateStatus = GlobalStatusStore(state => state.updateStatus)
  const clearCheckList = checkListStore(state => state.clearCheckList)
  const setUpdateStatus = GlobalStatusStore(state => state.setUpdateStatus)
  const { name, desc, gu_cnt0, gu_w0, updated, paramsChange, setTitleorDesc, setParamsChange } = LeftDropListStore()
  const [isReg, setReg] = React.useState(1)
  const [descInfo, setDesc] = React.useState('')
  const [isEditing, setIsEditing] = React.useState(false)
  const [inputSatus, setInputStatus] = React.useState(false)
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
      setParamsChange(true)
    },
    [setParamsChange, setSendBtnStatus, setValue]
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
    },
    [gu_cnt0, gu_w0, setValue]
  )

  const BtnStatus = React.useMemo(() => {
    return !sendBtnStatus
  }, [sendBtnStatus])

  const callback = React.useCallback(() => {
    setSendBtnStatus(true)
    setParamsChange(false)
    message.success('发送列表保存成功')
    getExcitaionDeatilFunction(sender_id as number)
    setUpdateStatus(!updateStatus)
  }, [getExcitaionDeatilFunction, sender_id, setParamsChange, setSendBtnStatus, setUpdateStatus, updateStatus])
  const saveConfig = React.useCallback(async () => {
    if (isReg !== 1) {
      return
    }
    const listArray = DropList.map((item: any) => {
      return item.sender_id
    })
    if (updated) {
      setSpinning(true)
    }

    if (name === '' || name.length < 2) {
      close()
      return message.error('发送列表名称长度不能小于俩个字符')
    }
    if (listArray.length === 0) {
      close()
      return message.error('发送列表至少要包含一个激励')
    }
    const child_id_list = [[], [...listArray], []]
    const params = { name, gu_cnt0, gu_w0, desc: desc ? desc.trim() : '', child_id_list }
    try {
      if (sender_id) {
        const res = await updateExcitationList(sender_id, params)
        if (res.code === 0) {
          callback()
          clearCheckList()
        }
        if (updated) {
          close()
        }
      }
    } catch (error) {
      close()
      throwErrorMessage(error, { 1005: '激励序列名称重复，请修改' })
    }
  }, [isReg, DropList, updated, name, gu_cnt0, gu_w0, desc, close, sender_id, callback, clearCheckList])

  const updateOrCreate = React.useCallback(() => {
    if (updated && paramsChange) {
      if (isReg === 1) {
        CommonModleClose(true)
      }
    } else {
      saveConfig()
    }
  }, [CommonModleClose, isReg, paramsChange, saveConfig, updated])

  const disableOnBlur = React.useCallback(
    (type: string) => {
      if (type === 'name') {
        const reg = /^[\w\u4E00-\u9FA5]+$/
        const valLength = name.length
        if (valLength >= 2 && valLength <= 20 && reg.test(name)) {
          setReg(1)
          setIsEditing(false)
        } else if (valLength < 2 || valLength > 20) {
          setReg(3)
          setIsEditing(true)
        } else {
          setReg(2)
          setIsEditing(true)
        }
      }
      if (desc.length <= 50 && type === 'desc') {
        setInputStatus(false)
      }
    },
    [desc.length, name]
  )

  const onChangeName = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
      if (type === 'name') {
        const reg = /^[\w\u4E00-\u9FA5]+$/
        const valLength = e.target.value.length
        if (valLength >= 2 && valLength <= 20 && reg.test(e.target.value)) {
          setReg(1)
        } else if (valLength < 2 || valLength > 20) {
          setReg(3)
        } else {
          setReg(2)
        }
        setSendBtnStatus(false)
        setTitleorDesc(type, e.target.value)
      }
    },

    [setSendBtnStatus, setTitleorDesc]
  )

  const onChangeDesc = (e: any, type: string) => {
    setDesc(e.target.value)
    setSendBtnStatus(false)
    setTitleorDesc(type, e.target.value)
  }

  const doubleClick = (type: string) => {
    if (type === 'name') {
      setIsEditing(true)
    } else {
      setDesc(desc)
      setInputStatus(true)
    }
  }

  React.useEffect(() => {
    return () => {
      setReg(1)
      setIsEditing(false)
      setInputStatus(false)
    }
  }, [sender_id])

  return (
    <div className={StyleSheet.DropHeader}>
      <Button disabled={!BtnStatus} type='primary' onClick={updateOrCreate} className={StyleSheet.saveBtn}>
        保存配置
      </Button>

      {isEditing ? (
        <div className={StyleSheet.headerInput}>
          <Input
            className={StyleSheet.numberInputHeader}
            value={name}
            onBlur={() => {
              disableOnBlur('name')
            }}
            autoFocus={isEditing}
            bordered={false}
            onChange={e => {
              onChangeName(e, 'name')
            }}
          />
          <div className={StyleSheet.tagPosistion}>
            <Tag
              icon={iconMap[isReg as keyof typeof iconMap]}
              style={{ position: 'absolute', left: '4px', top: '-12px' }}
              color={statusMap[isReg as keyof typeof statusMap]}
            >
              {isReg === 3 ? '名称长度为2-20个字符' : '名称由汉字、数字、字母和下划线组成'}
            </Tag>
          </div>
        </div>
      ) : (
        <div className={StyleSheet.sendListTitle}>
          <Tooltip placement='bottom' title={name || ''}>
            <span
              role='time'
              onDoubleClick={() => {
                doubleClick('name')
              }}
            >
              {name}
            </span>
          </Tooltip>
        </div>
      )}

      <div className={StyleSheet.editConcent}>
        <div className={StyleSheet.headerDesc} style={{ display: 'flex', alignItems: 'center' }}>
          {' '}
          描述:
          {inputSatus ? (
            <Input
              className={StyleSheet.descInputHeader}
              onBlur={() => {
                disableOnBlur('desc')
              }}
              value={descInfo}
              maxLength={50}
              autoFocus={inputSatus}
              bordered={false}
              onChange={e => {
                onChangeDesc(e, 'desc')
              }}
            />
          ) : (
            <>
              <Tooltip placement='bottom' title={desc}>
                <span
                  role='time'
                  style={{ paddingLeft: '8px' }}
                  onDoubleClick={() => {
                    doubleClick('desc')
                  }}
                >
                  {desc || '暂无描述'}
                </span>
              </Tooltip>
            </>
          )}
        </div>

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
          concent='修改激励序列配置，会停止关联任务，并清空关联任务的测试数据，是否确认保存？'
        />
      )}
    </div>
  )
}

const DropHeader = React.memo(DropHeaderMemo)
export default DropHeader
