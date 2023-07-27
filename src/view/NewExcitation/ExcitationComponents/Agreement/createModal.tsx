import React, { useRef } from 'react'
import 'antd/dist/antd.css'
import { Button, message, Modal } from 'antd'
import { saveExcitaionFn } from 'Src/services/api/excitationApi'
import AgreementIndex from './agreementIndex'
import StyleSheet from './agreementCompoents.less'
import HeaderForm from './HeaderFrom'
import { ArgeementDropListStore } from '../../ExcitaionStore/ExcitaionStore'

interface PropsType {
  visibility: boolean
  onOk: () => void
}

function NewExcitationMoadl({ visibility, onOk }: PropsType) {
  const DropListRef = ArgeementDropListStore(state => state.DropListRef)
  const myRef = useRef<any>()
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
        console.log(res.data)
      }
    } catch {
      message.error('新建失败')
    }
  }, [DropListRef])

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

  return (
    <Modal
      width={720}
      className={StyleSheet.excitaionModal}
      visible={visibility}
      title='新建激励'
      onCancel={onOk}
      footer={[
        <>
          <Button onClick={onOk}>取消</Button>
          <Button onClick={getItemInfo}>新建</Button>
        </>
      ]}
    >
      <div className={StyleSheet.excitationModalBody}>
        <HeaderForm ref={myRef} />
        <AgreementIndex />
      </div>
    </Modal>
  )
}

export default NewExcitationMoadl
