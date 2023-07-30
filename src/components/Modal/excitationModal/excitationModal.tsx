import React, { useEffect, useState } from 'react'
import 'antd/dist/antd.css'
import { Modal, Input, Form, Button, message } from 'antd'
import { throwErrorMessage } from 'Src/util/message'
import { createExcitationList, updateExcitationList } from 'Src/services/api/excitationApi'
import styles from '../BaseModle.less'

interface FormInstance {
  name: string
  desc: string
}

const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 28 }
}

function ExcitationModal(props: any) {
  const { TextArea } = Input
  const { visible, hideModal, fixTitle, sender_id, excitationInfo } = props
  const [form] = Form.useForm<FormInstance>()
  const [isDisableStatus, setDisabledStatus] = useState(true)

  // 校验表单 且 完成列表刷新  关闭表单
  const validateForm = React.useCallback(async () => {
    try {
      const value = await form.validateFields()
      const { name, desc } = value
      if (name) {
        if (fixTitle) {
          const res = await updateExcitationList(sender_id, { name: name.trim(), desc: desc ? desc.trim() : '' })
          message.success('激励发送列表修改成功')
          return res
        }
        if (!fixTitle) {
          const res = await createExcitationList({ name: name.trim(), desc: desc ? desc.trim() : '' })
          return res
        }
      }
    } catch (error) {
      hideModal(false)
      throwErrorMessage(error, { 1005: '激励发送列表名称重复，请修改' })
      return error
    }
  }, [fixTitle, form, hideModal, sender_id])

  const formVali = React.useCallback(() => {
    setDisabledStatus(true)
    validateForm()
      .then(res => {
        if (res.code !== 1005) {
          hideModal(false)
          form.resetFields()
        }
        return res
      })
      .catch(error => {
        hideModal(false)
        return error
      })
  }, [form, hideModal, validateForm])

  const onValuesChange = (changedValues: any, allValues: any) => {
    const bol = allValues.desc === undefined || allValues.desc?.length <= 50
    if (allValues.name?.length >= 2 && allValues.name.length <= 20 && /^[\w\u4E00-\u9FA5]+$/.test(allValues.name) && bol) {
      setDisabledStatus(false)
    } else {
      setDisabledStatus(true)
    }
  }

  useEffect(() => {
    if (excitationInfo) {
      const { name, desc } = excitationInfo
      // cause backend will auto add prefix for queue name
      // thus remove prefix of queue name when editing
      const formData = { name, desc }
      form.setFieldsValue(formData)
      setDisabledStatus(false)
    }
  }, [form, excitationInfo])

  return (
    <Modal
      className={styles.excitaionCreateModal}
      width={480}
      visible={visible}
      title={fixTitle ? '修改激励发送列表' : '新建激励发送列表'}
      onCancel={() => {
        hideModal(false)
        form.resetFields()
        setDisabledStatus(true)
      }}
      footer={[
        <Button
          className={styles.btn_cancel}
          key='back'
          onClick={() => {
            form.resetFields()
            hideModal(false)
            setDisabledStatus(true)
          }}
        >
          取消
        </Button>,
        <Button className={styles.btn_create} key='submit' disabled={isDisableStatus} type='primary' onClick={() => formVali()}>
          确认
        </Button>
      ]}
    >
      <Form form={form} autoComplete='off' {...layout} onValuesChange={onValuesChange}>
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
          <Input placeholder='请输入激励发送列表名称' />
        </Form.Item>
        <Form.Item name='desc' label='描述' rules={[{ type: 'string', max: 50, message: '字数不能超过50个' }]}>
          <TextArea
            placeholder='请添加针对激励发送列表的相关描述'
            autoSize={{ minRows: 4, maxRows: 5 }}
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

export default ExcitationModal
