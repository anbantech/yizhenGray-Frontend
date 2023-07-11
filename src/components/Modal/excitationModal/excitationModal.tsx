import React, { useEffect, useState } from 'react'
import 'antd/dist/antd.css'
import { Modal, Input, Form, Button, message } from 'antd'
import { throwErrorMessage } from 'Src/util/message'
import { createExcitationListFn, updateExcitation } from 'Src/services/api/excitationApi'
import TextArea from 'antd/lib/input/TextArea'
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

  // 新建激励
  const createProjectItem = async (params: any) => {
    try {
      const data = await createExcitationListFn(params)
      message.success('项目新建成功')
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
      title={fixTitle ? '修改端口' : '新建外设'}
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
        <Form form={form} className={styles.projectForm} autoComplete='off' {...layout} onValuesChange={onValuesChange}>
          <Form.Item
            name='name'
            validateFirst
            label='项目名称'
            validateTrigger={['onBlur']}
            rules={[
              { required: true, message: '请输入项目名称' },
              { type: 'string', min: 2, max: 20, message: '项目名称长度为2到20个字符' },
              {
                validateTrigger: 'onBlur',
                validator(_, value) {
                  const reg = /^[\w\u4E00-\u9FA5]+$/
                  if (reg.test(value)) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('项目名称由汉字、数字、字母和下划线组成'))
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
      </>
    </Modal>
  )
}

export default ExcitationModal
