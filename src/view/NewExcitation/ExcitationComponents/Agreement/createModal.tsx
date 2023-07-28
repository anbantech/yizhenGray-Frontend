import React, { useRef } from 'react'
import 'antd/dist/antd.css'
import { Button, message, Modal } from 'antd'
import { getExcitaionDeatilFn, saveExcitaionFn } from 'Src/services/api/excitationApi'
import { ComponentsArray } from 'Src/view/NewExcitation/ExcitationComponents/Agreement/agreementCompoents'
import { generateUUID } from 'Src/util/common'
import AgreementIndex from './agreementIndex'
import StyleSheet from './agreementCompoents.less'
import HeaderForm from './HeaderFrom'
import { ArgeementDropListStore } from '../../ExcitaionStore/ExcitaionStore'

interface PropsType {
  visibility: boolean
  onOk: () => void
  sender_id: number
}

function NewExcitationMoadl({ visibility, onOk, sender_id }: PropsType) {
  const DropListRef = ArgeementDropListStore(state => state.DropListRef)
  const myRef = useRef<any>()
  const DropList = ArgeementDropListStore(state => state.DropList)
  const setHead = ArgeementDropListStore(state => state.setHead)
  const setDeatilStatus = ArgeementDropListStore(state => state.setDeatilStatus)
  const detaileStatus = ArgeementDropListStore(state => state.detaileStatus)
  const setLeftList = ArgeementDropListStore(state => state.setLeftList)
  // 检查所有信息Item项 是否符合规则
  const checkItem = React.useCallback(async () => {
    const res = DropListRef.map((item: any) => {
      return item.validate()
    })
    const Item = await Promise.all(res)
    const header = myRef.current?.validate()
    return Item && header
  }, [DropListRef])

  const createItem = React.useCallback(async () => {
    const res = DropListRef.map((item: any) => {
      return item.save()
    })
    const headObj = myRef.current.save()
    const params = { ...headObj, template: res }
    try {
      const res = await saveExcitaionFn(params)
      if (res) {
        message.success('激励创建成功')
        onOk()
      }
    } catch {
      message.error('新建失败')
    }
  }, [DropListRef, onOk])

  const getItemInfo = React.useCallback(async () => {
    checkItem()
      .then(res => {
        if (res) {
          createItem()
        }
        return res
      })
      .catch(() => {
        message.error('请检查控件')
      })
  }, [checkItem, createItem])

  const getExcitaionDeatilFunction = React.useCallback(
    async (id: number) => {
      try {
        const res = await getExcitaionDeatilFn(id)
        if (res.data) {
          const ps = res.data.template.map((template: any) => {
            const templateCopy = ComponentsArray.find(item => item.type === template.type)
            return { ...template, ...templateCopy, keys: generateUUID() }
          })
          const { name, gu_cnt0, gu_w0, peripheral } = res.data
          setLeftList(ps)
          setHead({ name, gu_cnt0, gu_w0, peripheral })
        }
      } catch (error) {
        message.error(error.message)
      }
    },
    [setHead, setLeftList]
  )

  React.useEffect(() => {
    if (sender_id !== -1) {
      getExcitaionDeatilFunction(sender_id)
    }
  }, [getExcitaionDeatilFunction, sender_id])

  return (
    <Modal
      width={720}
      className={StyleSheet.excitaionModal}
      visible={visibility}
      title={sender_id === -1 ? '新建激励' : detaileStatus ? '激励详情' : ' 修改激励'}
      onCancel={onOk}
      footer={[
        <>
          <Button onClick={onOk}>取消</Button>
          <Button
            type='primary'
            onClick={() => {
              setDeatilStatus(false)
            }}
          >
            新建
          </Button>
        </>
      ]}
    >
      <div className={StyleSheet.excitationModalBody}>
        <HeaderForm ref={myRef} detaileStatus={detaileStatus} />
        {DropList.length > 0 ? <AgreementIndex sender_id={sender_id} /> : null}
      </div>
    </Modal>
  )
}

export default NewExcitationMoadl
