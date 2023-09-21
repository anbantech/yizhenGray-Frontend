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

interface excitationListType {
  group_name: string
  sender_id: number
}
interface PropType {
  taskInfo: any
}
const TaskForm = (props: PropType) => {
  const { taskInfo } = props
  const [form] = useForm()
  const { Option } = Select
  const [excitationList, setExcitationList] = useState<excitationListType[]>([])
  const [nodeList, setnodeList] = useState<number[] | unknown[]>([])
  useEffect(() => {
    if (taskInfo) {
      const { name, desc, work_time, crash_num, sender_id, group_name, beat_unit, simu_instance_id } = taskInfo
      const excitationInfo = { sender_id, group_name }
      setExcitationList([excitationInfo])
      setnodeList(() => {
        return [simu_instance_id]
      })
      const formData = {
        name,
        description: desc,
        work_time,
        crash_num,
        beat_unit,
        simu_instance_id,
        sender_id
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
          <Input spellCheck='false' disabled placeholder='请输入2到20个字符' />
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
                  if (value >= 1 && value <= 48) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('请输入 1-48 之间的整数'))
                }
                return Promise.reject(new Error('请输入 1-48 之间的整数'))
              }
            }
          ]}
        >
          <Input spellCheck='false' disabled placeholder='请输入整数,最大48' suffix='小时' />
        </Form.Item>
        <Form.Item
          label='Crash数量'
          name='crash_num'
          validateFirst
          validateTrigger={['onBlur']}
          rules={[
            { required: true, message: '请输入Crash数量' },
            {
              validator(_, value) {
                const reg = /^\d+$/
                if (reg.test(value)) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('请输入 0-100 之间的整数'))
              }
            }
          ]}
        >
          <Input disabled placeholder='请输入Crash数量' />
        </Form.Item>
        <Form.Item label='节拍单元' name='beat_unit' initialValue={200}>
          <Input spellCheck='false' disabled placeholder='请输入节拍单元' suffix='毫秒' />
        </Form.Item>
        <Form.Item
          label='仿真节点'
          name='simu_instance_id'
          validateFirst
          validateTrigger={['onBlur']}
          rules={[{ required: true, message: '请选择仿真节点' }]}
        >
          <Select disabled placeholder='请选择仿真节点'>
            {
              /**
               * 根据连接方式列表渲染下拉框可选择的设备比特率
               */
              nodeList?.map((rate: any) => {
                return (
                  <Option key={rate} value={rate}>
                    {rate}
                  </Option>
                )
              })
            }
          </Select>
        </Form.Item>
        <Form.Item label='交互' name='sender_id' validateFirst validateTrigger={['onBlur']} rules={[{ required: true, message: '请选择交互' }]}>
          <Select placeholder='请选择交互' disabled>
            {excitationList?.map((rate: any) => {
              return (
                <Option key={rate.sender_id} value={rate.sender_id}>
                  {rate.group_name}
                </Option>
              )
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label='任务描述'
          name='description'
          rules={[{ message: '请输入任务描述!' }, { type: 'string', max: 50, message: '字数不能超过50个 ' }]}
        >
          <Input.TextArea
            spellCheck='false'
            disabled
            placeholder='任务描述'
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
