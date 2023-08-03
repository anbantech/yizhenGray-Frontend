import React, { useRef } from 'react'
import 'antd/dist/antd.css'
import CommonModle from 'Src/components/Modal/projectMoadl/CommonModle'
import { Button, message, Modal } from 'antd'
import { getExcitaionDeatilFn, saveExcitaionFn, updateControl } from 'Src/services/api/excitationApi'
import { ComponentsArray } from 'Src/view/NewExcitation/ExcitationComponents/Agreement/agreementCompoents'
import { generateUUID } from 'Src/util/common'
import AgreementIndex from './agreementIndex'
import StyleSheet from './agreementCompoents.less'
import HeaderForm from './HeaderFrom'
import { ArgeementDropListStore, GlobalStatusStore } from '../../ExcitaionStore/ExcitaionStore'

interface PropsType {
  visibility: boolean
  onOk: () => void
  sender_id: number
}

function NewExcitationMoadl({ visibility, onOk, sender_id }: PropsType) {
  const DropListRef = ArgeementDropListStore(state => state.DropListRef)
  const myRef = useRef<any>()
  const [spinning, setSpinning] = React.useState(false)
  const [visibilitys, setVisibility] = React.useState(false)
  const DropList = ArgeementDropListStore(state => state.DropList)
  const setHead = ArgeementDropListStore(state => state.setHead)
  //
  const setDrop = GlobalStatusStore(state => state.setDetailStatus)
  const DropStatus = GlobalStatusStore(state => state.detailStatus)
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

  const CommonModleClose = React.useCallback((val: boolean) => {
    setVisibility(val)
  }, [])

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
    } catch (error) {
      message.error(error.message)
    }
  }, [DropListRef, onOk])
  // 更新元素 updateControl
  const updateItem = React.useCallback(async () => {
    const res = DropListRef.map((item: any) => {
      return item.save()
    })
    const headObj = myRef.current.save()
    const params = { ...headObj, template: res }
    try {
      const res = await updateControl(sender_id, params)
      if (res) {
        if (res.code === 0) {
          message.success('激励修改成功')
        }
      }
      return res
    } catch {
      message.error('激励修改失败')
    }
  }, [DropListRef, sender_id])
  // 创建
  const getItemInfo = React.useCallback(async () => {
    checkItem()
      .then(res => {
        if (res) {
          createItem()
        }
        return res
      })
      .catch(() => {})
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
  const DropListMemo = React.useMemo(() => {
    return DropList.length !== 0
  }, [DropList])
  // 更新
  const upadateItemInfo = React.useCallback(async () => {
    CommonModleClose(false)
    setSpinning(true)
    checkItem()
      .then(async res => {
        const res1 = await updateItem()
        if (res1) {
          onOk()
          setSpinning(false)
          setDrop(!DropStatus)
        }
        return res
      })
      .catch(() => {
        setSpinning(false)
      })
  }, [CommonModleClose, DropStatus, checkItem, onOk, setDrop, updateItem])

  const fixExcitaiton = React.useCallback(async () => {
    checkItem()
      .then(res => {
        if (res) {
          CommonModleClose(true)
        }
        return res
      })
      .catch(() => {})
  }, [CommonModleClose, checkItem])

  const contorl = React.useCallback(() => {
    if (sender_id === -1) {
      getItemInfo()
    } else {
      fixExcitaiton()
    }
  }, [fixExcitaiton, getItemInfo, sender_id])

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
      title={sender_id === -1 ? '新建激励' : '查看和修改'}
      onCancel={onOk}
      footer={[
        <>
          <Button onClick={onOk}>取消</Button>
          <Button
            type='primary'
            disabled={!DropListMemo}
            onClick={() => {
              contorl()
            }}
          >
            {sender_id === -1 ? '新建' : '修改'}
          </Button>
        </>
      ]}
    >
      <div className={StyleSheet.excitationModalBody}>
        <HeaderForm ref={myRef} />
        <AgreementIndex sender_id={sender_id} />
      </div>
      {visibilitys && (
        <CommonModle
          IsModalVisible={visibilitys}
          spinning={spinning}
          deleteProjectRight={upadateItemInfo}
          CommonModleClose={CommonModleClose}
          ing='修改中'
          btnName='修改'
          concent='修改除名称以外的配置项，会停止关联任务，并清空关联任务的测试数据，是否确认修改？'
          name='修改激励'
        />
      )}
    </Modal>
  )
}

export default NewExcitationMoadl
