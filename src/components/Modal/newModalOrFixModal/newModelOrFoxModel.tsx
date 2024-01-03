import React, { useEffect, useState } from 'react'
import 'antd/dist/antd.css'
import { Modal, Input, Form, Button, Select, message } from 'antd'
import { getSystemConstantsStore } from 'Src/webSocket/webSocketStore'
import { throwErrorMessage } from 'Src/util/message'
import { useNewModelingStore } from 'Src/view/Modeling/Store/ModelStore'
import { LowCodeStore } from 'Src/view/Modeling/Store/CanvasStore/canvasStore'
import styles from './modelingModal.less'

interface FormInstance {
  name: string
  desc: string
  processor: string
}

interface ModelProps {
  visible: boolean
  creatModalOrFixModal: (val: boolean) => void
  isFix: boolean
  detailInfo: { name: string; processor: string; desc: string }
}

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
}

function ModelModal(props: ModelProps) {
  const { TextArea } = Input
  const { visible, creatModalOrFixModal, isFix, detailInfo } = props
  const [isDisableStatus, setDisabledStatus] = useState(true)
  const { Option } = Select
  const [form] = Form.useForm<FormInstance>()
  const [loading, setLoading] = useState(false)
  const { createTarget, updateModelTargetList, initParams } = useNewModelingStore()

  const { createTargetNode } = LowCodeStore()
  const { PROCESSOR } = getSystemConstantsStore()
  const onValuesChange = (changedValues: any, allValues: any) => {
    const bol = allValues.desc === undefined || allValues.desc?.length <= 50
    if (allValues.processor && allValues.name?.length >= 2 && allValues.name.length <= 20 && /^[\w\u4E00-\u9FA5]+$/.test(allValues.name) && bol) {
      setDisabledStatus(false)
    } else {
      setDisabledStatus(true)
    }
  }

  const closeModal = React.useCallback(() => {
    form.resetFields()
    creatModalOrFixModal(false)
  }, [creatModalOrFixModal, form])

  const create = React.useCallback(
    async (params: { name: string; processor: string; desc?: string }) => {
      setLoading(true)
      try {
        const res: any = await createTarget(params)
        if (res.code === 0) {
          const initTreeResult: any = await createTargetNode(res.data)
          if (initTreeResult.code === 0) {
            message.success('创建成功')
            initParams()
            creatModalOrFixModal(false)
          }
          return setLoading(false)
        }
      } catch (error) {
        setDisabledStatus(true)
        throwErrorMessage(error, { 1004: '该建模任务不存在', 1005: '建模任务名称重复，请修改', 1007: '操作频繁' })
        return setLoading(false)
      }
    },
    [creatModalOrFixModal, createTarget, createTargetNode, initParams]
  )

  const fix = React.useCallback(
    async (params: { name: string; processor: string; desc?: string }) => {
      try {
        const res = await updateModelTargetList(params)
        if ((res as any).code === 0) {
          message.success('修改成功')
          initParams()
          creatModalOrFixModal(false)
        }
      } catch (error) {
        setDisabledStatus(true)
        throwErrorMessage(error, { 1004: '该建模任务不存在', 1005: '建模任务名称重复，请修改', 1007: '操作频繁' })
      }
    },
    [creatModalOrFixModal, initParams, updateModelTargetList]
  )

  const createOrfix = React.useCallback(async () => {
    const value = await form.validateFields()
    const { name, desc, processor } = value
    if (isFix) {
      fix({ name, desc, processor })
    } else {
      create({ name, desc, processor })
    }
  }, [create, fix, form, isFix])

  useEffect(() => {
    if (detailInfo && detailInfo.name) {
      const { name, desc, processor } = detailInfo
      // cause backend will auto add prefix for queue name
      // thus remove prefix of queue name when editing
      const formData = { name, desc, processor }
      form.setFieldsValue(formData)
      setDisabledStatus(false)
    }
    return () => {
      form.resetFields()
    }
  }, [form, detailInfo])

  return (
    <Modal
      centered={Boolean(1)}
      className={styles.formModal}
      visible={visible}
      title={isFix ? '修改建模任务' : '新建建模任务'}
      onCancel={closeModal}
      footer={[
        <Button className={styles.btn_cancel} key='back' onClick={closeModal}>
          取消
        </Button>,
        <Button className={styles.btn_create} key='submit' loading={loading} onClick={createOrfix} disabled={isDisableStatus} type='primary'>
          {isFix ? '修改' : '新建'}
        </Button>
      ]}
    >
      <Form form={form} className={styles.modelingModal} autoComplete='off' {...layout} onValuesChange={onValuesChange}>
        <Form.Item
          name='name'
          validateFirst
          label='名称'
          validateTrigger={['onBlur']}
          rules={[
            { required: true, message: '请输入名称' },
            { type: 'string', min: 2, max: 20, message: '名称长度为2到20个字符' },
            {
              validateTrigger: 'onBlur',
              validator(_, value) {
                const reg = /^[\w\u4E00-\u9FA5]+$/
                if (reg.test(value)) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('名称由汉字、数字、字母和下划线组成'))
              }
            }
          ]}
        >
          <Input spellCheck='false' placeholder='请输入建模任务名称' />
        </Form.Item>

        <Form.Item
          name='processor'
          validateFirst
          label='处理器类型'
          validateTrigger={['onBlur']}
          rules={[{ required: true, message: '请选择处理器类型' }]}
        >
          <Select disabled={isFix} placeholder='请选择处理器类型' style={{ borderRadius: '4px' }}>
            {
              /**
               * 根据连接方式列表渲染下拉框可选择的设备比特率
               */
              PROCESSOR?.map((rate: any) => {
                return (
                  <Option key={rate.value} disabled={rate.disabled} value={rate.value}>
                    {rate.label}
                  </Option>
                )
              })
            }
          </Select>
        </Form.Item>
        <Form.Item name='desc' label='描述' className={styles.modelFormItemDesc} rules={[{ type: 'string', max: 50, message: '字数不能超过50个' }]}>
          <TextArea
            spellCheck='false'
            placeholder='请输入描述'
            autoSize={{ minRows: 3, maxRows: 4 }}
            showCount={{
              formatter({ count }) {
                return `${count}/50`
              }
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModelModal
