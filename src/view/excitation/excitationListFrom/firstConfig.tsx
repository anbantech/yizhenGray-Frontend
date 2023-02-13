import { Form, Input, Select } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import React, { useEffect, useImperativeHandle, useState } from 'react'
import { excitationListFn } from 'Src/services/api/excitationApi'
import { createTaskFn, updateTask } from 'Src/services/api/taskApi'
import { throwErrorMessage } from 'Src/util/message'
import styles from 'Src/view/Project/task/createTask/taskConfigCompents/stepBaseConfig.less'

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 }
}
const request = {
  target_type: 2,
  key_word: '',
  status: null,
  page: 1,
  page_size: 10,
  sort_field: 'create_time',
  sort_order: 'descend'
}
interface projectInfoType {
  id: number
  name: string
  port: string
  status: number | null
  create_time: string
  update_time: string
  create_user: string
  update_user: string
}

interface Resparams {
  target_type: number
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
  taskInfo: any
}
const FirstConfig = React.forwardRef((props: propsFn, myRef) => {
  const { onChange, id, taskInfo } = props
  const [form] = useForm()
  const { Option } = Select
  const [excitationList, setExcitationList] = useState<projectInfoType[]>([])

  const createOneExcitationFn = React.useCallback(async () => {
    const values = await form.validateFields()
    try {
      if (values) {
        const params = {
          name: values.name,
          desc: values.description,
          project_id: id,
          work_time: values.work_time,
          crash_num: values.crash_num,
          group_id: values.group_id
        }
        if (taskInfo?.editTask) {
          const result = await updateTask(taskInfo.data.id, params)
          if (result.data) {
            return result.data
          }
        } else {
          const result = await createTaskFn(params)
          if (result.data) {
            return result.data
          }
        }
      }
    } catch (error) {
      throwErrorMessage(error, { 1009: '任务删除失败' })
    }
  }, [form, id, taskInfo.data?.id, taskInfo?.editTask])
  useImperativeHandle(myRef, () => ({
    save: () => {
      return createOneExcitationFn()
    },
    delete: () => {},
    validate: () => {},
    clearInteraction: () => {}
  }))

  const getExcitationList = async (value: Resparams) => {
    try {
      const result = await excitationListFn(value)
      if (result.data) {
        setExcitationList(result.data.results)
      }
    } catch (error) {
      throwErrorMessage(error, { 1004: '请求资源未找到' })
    }
  }

  useEffect(() => {
    getExcitationList(request)
    if (taskInfo.data) {
      const { name, desc, project_id, work_time, crash_num, group_id } = taskInfo.data as any
      const formData = {
        name,
        description: desc,
        project_id,
        work_time,
        crash_num,
        group_id
      }
      form.setFieldsValue(formData)
    }
  }, [form, taskInfo.data])
  return (
    <div className={styles.stepBaseMain}>
      <Form name='basic' className={styles.stepBaseMain_Form} {...layout} onFieldsChange={onChange} autoComplete='off' form={form} size='large'>
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
          <Input placeholder='请输入2到20个字符' />
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
          <Input placeholder='请输入整数,最大48' suffix='小时' />
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
          <Input placeholder='请输入Crash数量' />
        </Form.Item>

        <Form.Item label='交互' name='group_id' validateFirst validateTrigger={['onBlur']} rules={[{ required: true, message: '请选择交互' }]}>
          <Select placeholder='请选择交互'>
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
