import { Form, Input, Select } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import React, { useEffect, useState } from 'react'
import styles from 'Src/view/Project/task/createTask/taskConfigCompents/stepBaseConfig.less'

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 }
}

interface projectInfoType {
  id?: number | string
  name?: string
  port?: string
  status?: number | null
  create_time?: string
  update_time?: string
  create_user?: string
  update_user?: string
}

interface Resparams {
  group_type: number
  key_word?: string
  status?: null | number
  page: number
  page_size: number
  sort_field?: string
  sort_order?: string
}
interface propsFn {
  onChange: (changedFields: any, allFields: any) => void
  id: number
}

interface PropType {
  taskInfo: any
}
const TaskForm = (props: PropType) => {
  const { taskInfo } = props
  const [form] = useForm()
  const { Option } = Select
  const [excitationList, setExcitationList] = useState<projectInfoType[]>([])
  useEffect(() => {
    if (taskInfo) {
      const { name, desc, work_time, crash_num, group_id, group_name } = taskInfo
      setExcitationList(() => {
        const excitationInfo = { id: group_id, name: group_name }
        return [excitationInfo]
      })
      const formData = {
        name,
        description: desc,
        work_time,
        crash_num,
        group_id
      }
      form.setFieldsValue(formData)
    }
  }, [form, taskInfo])
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
                  return Promise.reject(new Error('请输入任务名称'))
                }
                return Promise.resolve()
              }
            },
            {
              required: true,
              max: 20,
              min: 2,
              message: '任务名称长度为2到20个字符'
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
          <Input placeholder='请输入2到20个字符' disabled />
        </Form.Item>

        <Form.Item
          label='运行时长'
          name='work_time'
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
          <Input placeholder='请输入整数,最大48' suffix='小时' disabled />
        </Form.Item>
        <Form.Item
          label='Crash数量'
          name='crash_num'
          validateFirst
          validateTrigger={['onBlur']}
          rules={[
            {
              required: true,
              validateTrigger: 'onBlur',
              validator(_, value) {
                const reg = /^\d+$/
                if (reg.test(value)) {
                  if (value <= 100) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('请输入 0-100 之间的整数'))
                }
                return Promise.reject(new Error('请输入 0-100 之间的整数'))
              }
            }
          ]}
        >
          <Input placeholder='请输入Crash数量' disabled />
        </Form.Item>

        <Form.Item label='交互' name='group_id' validateFirst validateTrigger={['onBlur']} rules={[{ required: true, message: '请选择交互' }]}>
          <Select placeholder='请选择选择交互' disabled>
            {
              /**
               * 根据连接方式列表渲染下拉框可选择的设备比特率
               */
              excitationList?.map((rate: any) => {
                return (
                  <Option key={rate.id} value={rate.id}>
                    {rate.name}
                  </Option>
                )
              })
            }
          </Select>
        </Form.Item>
        <Form.Item
          label='任务描述'
          name='description'
          rules={[{ message: '请输入任务描述!' }, { type: 'string', max: 50, message: '字数不能超过50个 ' }]}
        >
          <Input.TextArea
            placeholder='任务描述'
            disabled
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
}

TaskForm.displayName = 'TaskForm'
export default TaskForm
