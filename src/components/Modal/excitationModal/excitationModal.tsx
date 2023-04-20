import React, { useEffect, useState } from 'react'
import 'antd/dist/antd.css'
import { Modal, Input, Form, Button, message } from 'antd'
import { throwErrorMessage } from 'Src/util/message'
import { createExcitationListFn, updateExcitation } from 'Src/services/api/excitationApi'
import styles from '../BaseModle.less'

interface FormInstance {
  name: string
  port: string
}
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
}
function ExcitationModal(props: any) {
  const { visible, width, hideModal, fixTitle, id, projectInfo } = props
  const [form] = Form.useForm<FormInstance>()
  const [isDisableStatus, setDisabledStatus] = useState(true)

  // 创建激励
  const createProjectItem = async (params: any) => {
    try {
      const data = await createExcitationListFn(params)
      message.success('项目创建成功')
      return data
    } catch (error) {
      message.error(error.message)
      return error
    }
  }
  // 校验表单 且 完成列表刷新  关闭表单
  const validateForm = async () => {
    try {
      const value = await form.validateFields()
      const { name, port } = value
      if (name) {
        if (fixTitle) {
          const res = await updateExcitation({ name: name.trim(), port: port.trim() }, id)
          message.success('激励修改成功')
          return res
        }
        if (!fixTitle) {
          const res = await createProjectItem({ name: name.trim(), port: port.trim() })
          return res
        }
      }
    } catch (error) {
      setDisabledStatus(true)
      throwErrorMessage(error, { 1005: '端口名称重复，请修改' })
      return error
    }
  }
  const formVali = () => {
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
        return error
      })
  }

  const onValuesChange = (changedValues: any, allValues: any) => {
    const protBol = allValues.port?.length >= 2 && allValues.port.length <= 20 && /^[\dA-Za-z]+$/.test(allValues.port)
    const idBol = allValues.name?.length >= 2 && allValues.name.length <= 20 && /^[\dA-Za-z]+$/.test(allValues.name)
    if (idBol && protBol) {
      setDisabledStatus(false)
    } else {
      setDisabledStatus(true)
    }
  }

  useEffect(() => {
    if (projectInfo) {
      const { name, port } = projectInfo
      // cause backend will auto add prefix for queue name
      // thus remove prefix of queue name when editing
      const formData = { name, port }
      form.setFieldsValue(formData)
    }
  }, [form, projectInfo])

  return (
    <Modal
      className={styles}
      width={width}
      visible={visible}
      title={fixTitle ? '修改端口' : '新建端口'}
      onCancel={() => {
        hideModal(false)
        form.resetFields()
        setDisabledStatus(true)
      }}
      footer={[
        <Button
          className={styles.btn_cancel_exection}
          key='back'
          onClick={() => {
            form.resetFields()
            hideModal(false)
            setDisabledStatus(true)
          }}
        >
          取消
        </Button>,
        <Button className={styles.btn_create_exection} key='submit' size='small' disabled={isDisableStatus} type='primary' onClick={() => formVali()}>
          {fixTitle ? '修改' : '新建'}
        </Button>
      ]}
    >
      <>
        <Form form={form} autoComplete='off' {...layout} onValuesChange={onValuesChange}>
          <Form.Item
            name='name'
            label='激励ID'
            validateFirst
            validateTrigger={['onBlur']}
            rules={[
              { required: true, message: '请输入激励ID' },
              { type: 'string', min: 2, max: 20, message: '激励ID长度为2到20个字符' },
              {
                validateTrigger: 'onBlur',
                validator(_, value) {
                  const reg = /^[\dA-Za-z]+$/
                  if (reg.test(value)) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('激励ID由数字、字母组成'))
                }
              }
            ]}
          >
            <Input placeholder='请输入激励ID' />
          </Form.Item>
          <Form.Item
            name='port'
            label='激励端点名称'
            validateFirst
            validateTrigger={['onBlur']}
            rules={[
              { required: true, message: '请输入激励端点名称' },
              { type: 'string', min: 2, max: 20, message: '激励端点名称2到20个字符' },
              {
                validateTrigger: 'onBlur',
                validator(_, value) {
                  const reg = /^[\dA-Za-z]+$/
                  if (reg.test(value)) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('激励端点名称由数字、字母组成'))
                }
              }
            ]}
          >
            <Input placeholder='请输入激励端点名称' />
          </Form.Item>
        </Form>
        <div className={styles.exection_line} />
      </>
    </Modal>
  )
}

export default ExcitationModal
