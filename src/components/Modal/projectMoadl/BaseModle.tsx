import React, { useEffect, useState } from 'react'
import 'antd/dist/antd.css'
import { Modal, Input, Form, Button, message } from 'antd'
import { throwErrorMessage } from 'Src/util/message'
import { updateProject, createProject } from 'Src/services/api/projectApi'
import styles from '../BaseModle.less'

interface FormInstance {
  name: string
  desc: string
}

function ModalpPop(props: any) {
  const { TextArea } = Input
  const { visible, width, hideModal, fixTitle, id, projectInfo } = props
  const [form] = Form.useForm<FormInstance>()
  const [isDisableStatus, setDisabledStatus] = useState(true)

  // 创建列表
  const createProjectItem = async (params: any) => {
    try {
      const data = await createProject(params)
      message.success('项目创建成功')
      return data
    } catch (error) {
      throwErrorMessage(error, { 1005: '项目名称重复，请修改' })
      return error
    }
  }
  // 校验表单 且 完成列表刷新  关闭表单
  const validateForm = async () => {
    try {
      const value = await form.validateFields()
      const { name, desc } = value
      if (name) {
        if (fixTitle) {
          const res = await updateProject({ name: name.trim(), desc: desc ? desc.trim() : '' }, id)
          message.success('项目修改成功')
          return res
        }
        if (!fixTitle) {
          const res = await createProjectItem({ name: name.trim(), desc: desc ? desc.trim() : '' })
          return res
        }
      }
    } catch (error) {
      setDisabledStatus(true)
      throwErrorMessage(error, { 1005: '项目名称重复，请修改' })
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
    const bol = allValues.desc === undefined || allValues.desc?.length <= 50
    if (allValues.name?.length >= 2 && allValues.name.length <= 20 && /^[\w\u4E00-\u9FA5]+$/.test(allValues.name) && bol) {
      setDisabledStatus(false)
    } else {
      setDisabledStatus(true)
    }
  }

  useEffect(() => {
    if (projectInfo) {
      const { name, desc } = projectInfo
      // cause backend will auto add prefix for queue name
      // thus remove prefix of queue name when editing
      const formData = { name, desc }
      form.setFieldsValue(formData)
    }
  }, [form, projectInfo])

  return (
    <Modal
      className={styles}
      width={width}
      visible={visible}
      title={fixTitle ? '修改项目' : '新建项目'}
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
          {fixTitle ? '确认修改' : '确认新建'}
        </Button>
      ]}
    >
      <Form form={form} autoComplete='off' onValuesChange={onValuesChange}>
        <Form.Item
          name='name'
          validateFirst
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
          <Input placeholder='请输入项目名称' />
        </Form.Item>
        <Form.Item name='desc' rules={[{ type: 'string', max: 50, message: '字数不能超过50个' }]}>
          <TextArea
            placeholder='请添加针对项目的相关描述'
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

export default ModalpPop
