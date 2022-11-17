import { Form, Input } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import React, { useImperativeHandle } from 'react'
import styles from './stepBaseConfig.less'

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 }
}

const FirstConfig = React.forwardRef((props, myRef) => {
  useImperativeHandle(myRef, () => ({
    save: () => {},
    delete: () => {},
    validate: () => {},
    clearInteraction: () => {}
  }))

  const [form] = useForm()
  return (
    <div className={styles.stepBaseMain}>
      <Form name='basic' className={styles.stepBaseMain_Form} {...layout} autoComplete='off' form={form} size='large'>
        <Form.Item
          label='任务名称'
          name='name'
          validateFirst
          validateTrigger={['onBlur']}
          rules={[
            {
              validateTrigger: 'onBlur',
              validator(_, value) {
                if (typeof value === 'undefined' || value === '') {
                  return Promise.reject(new Error('请输入旁路名称'))
                }
                return Promise.resolve()
              }
            },
            {
              required: true,
              max: 6,
              min: 2,
              message: '任务名称长度为2到6个字符'
            },
            {
              validateTrigger: 'onBlur',
              validator(_, value) {
                const reg = /^[\w\u4E00-\u9FA5]+$/
                if (reg.test(value)) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('任务名称由汉字、数字、字母和下划线组成'))
              }
            }
          ]}
        >
          <Input placeholder='请输入2到6个字符' />
        </Form.Item>

        <Form.Item
          label='运行时长'
          name='host'
          validateFirst
          validateTrigger={['onBlur']}
          rules={[
            {
              required: true,
              validateTrigger: 'onBlur',
              validator(_, value) {
                const reg = /^\d+$/
                if (reg.test(value)) {
                  if (value <= 48) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('请输入 0-48 之间的整数'))
                }
                return Promise.reject(new Error('请输入 0-48 之间的整数'))
              }
            }
          ]}
        >
          <Input placeholder='请输入整数,最大48' suffix='小时' />
        </Form.Item>
        <Form.Item
          label='Crash数量'
          name='username'
          validateFirst
          validateTrigger={['onBlur']}
          rules={[
            { required: true, message: '请输入账号' },
            {
              validator(_, value) {
                const reg = /^\d+$/
                if (reg.test(value)) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('请输入 0-48 之间的整数'))
              }
            }
          ]}
        >
          <Input placeholder='请输入Crash数量' />
        </Form.Item>

        <Form.Item
          label='真实设备名称'
          name='password'
          validateFirst
          validateTrigger={['onBlur']}
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password placeholder='请输入真实设备名称' />
        </Form.Item>
        <Form.Item
          label='目标描述'
          name='description'
          rules={[{ message: '请输入目标描述!' }, { type: 'string', max: 50, message: '字数不能超过50个 ' }]}
        >
          <Input.TextArea
            placeholder='目标描述'
            autoSize={{ minRows: 4, maxRows: 5 }}
            showCount={{
              formatter({ count }) {
                return `${count}/50`
              }
            }}
          />
        </Form.Item>
      </Form>
    </div>
  )
})

FirstConfig.displayName = 'FirstConfig'
export default FirstConfig
