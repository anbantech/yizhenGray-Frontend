import React, { useEffect, useState } from 'react'
import 'antd/dist/antd.css'
import { Modal, Input, Form, Button, Select } from 'antd'
import { throwErrorMessage } from 'Src/util/message'
import styles from './modelingModal.less'

interface FormInstance {
  name: string
  desc: string
}

interface ModelProps {
  visible: boolean
  modelId: number | null
  creatModalOrFixModal: (val: boolean) => void
  isFix: boolean
}

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
}

function ModelModal(props: ModelProps) {
  const { TextArea } = Input
  const { visible, modelId, creatModalOrFixModal, isFix } = props
  const { Option } = Select
  const [form] = Form.useForm<FormInstance>()

  const onValuesChange = (changedValues: any, allValues: any) => {}
  const closeModal = React.useCallback(() => {
    form.resetFields()
    creatModalOrFixModal(false)
  }, [creatModalOrFixModal, form])

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
        <Button className={styles.btn_create} key='submit' type='primary'>
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
            { required: true, message: '请输入建模名称' },
            { type: 'string', min: 2, max: 20, message: '建模名称长度为2到20个字符' },
            {
              validateTrigger: 'onBlur',
              validator(_, value) {
                const reg = /^[\w\u4E00-\u9FA5]+$/
                if (reg.test(value)) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('建模名称由汉字、数字、字母和下划线组成'))
              }
            }
          ]}
        >
          <Input spellCheck='false' placeholder='请输入建模名称' />
        </Form.Item>

        <Form.Item
          name='name'
          validateFirst
          label='处理器类型'
          validateTrigger={['onBlur']}
          rules={[{ required: true, message: '请选择处理器类型' }]}
        >
          <Select placeholder='请选择处理器类型' style={{ borderRadius: '4px' }}>
            {
              /**
               * 根据连接方式列表渲染下拉框可选择的设备比特率
               */
              [1, 2, 3]?.map((rate: any) => {
                return (
                  <Option key={rate} disabled={rate.disabled} value={rate}>
                    {rate}
                  </Option>
                )
              })
            }
          </Select>
        </Form.Item>
        <Form.Item
          name='desc'
          label='建模描述'
          className={styles.modelFormItemDesc}
          rules={[{ type: 'string', max: 50, message: '字数不能超过50个' }]}
        >
          <TextArea
            spellCheck='false'
            placeholder='请添加针对建模的相关描述'
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
