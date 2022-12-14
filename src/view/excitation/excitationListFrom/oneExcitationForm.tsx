import { Form, Input, Select } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import * as React from 'react'
import { useContext } from 'react'
import { useHistory } from 'react-router'
import CommonButton from 'Src/components/Button/commonButton'
import { GlobalContexted } from 'Src/components/globalBaseMain/globalBaseMain'
import { getPortList, createExcitationFn } from 'Src/services/api/excitationApi'
import { getTemplateList } from 'Src/services/api/templateApi'
import { throwErrorMessage } from 'Src/util/message'
import styles from '../excitation.less'
import GetDeatilFn from './getDataDetailFn/getDataDetailFn'
// import { RouteComponentProps, StaticContext } from 'react-router'

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 }
}

const templateListRequest = {
  key_word: '',
  page: 1,
  page_size: 999,
  sort_field: 'create_time',
  sort_order: 'descend'
}

const OneExcotationForm: React.FC = () => {
  const history = useHistory()
  const { isFixForm, info } = useContext(GlobalContexted)
  const { Option } = Select
  const [form] = useForm()
  const [isDisableStatus, setIsDisableStatus] = React.useState<boolean>(true)
  const [templateList, setTemplateList] = React.useState<any[]>()
  const [portList, setPortList] = React.useState<string[]>([])
  const Data = GetDeatilFn(info?.id)
  // 获取模版列表
  const fetchTemplateList = React.useCallback(async () => {
    //  Todo code码
    try {
      const result = await getTemplateList(templateListRequest)
      if (result.data) {
        const { results } = result.data
        setTemplateList(results)
      }
      return result
    } catch (error) {
      throwErrorMessage(error, { 1009: '项目删除失败' })
    }
  }, [])
  // 端口列表
  const fetchPortList = React.useCallback(async () => {
    //  Todo code码
    try {
      const result = await getPortList()
      if (result.data) {
        const results = result.data
        setPortList(results)
      }
      return result
    } catch (error) {
      throwErrorMessage(error, { 1009: '项目删除失败' })
    }
  }, [])

  const createOneExcitationFn = async () => {
    let values
    try {
      values = await form.validateFields()
    } catch {
      setIsDisableStatus(true)
    }
    try {
      if (values) {
        const params = {
          group_type: 0,
          name: values.name,
          port: values.port,
          template_id: +values.template_id,
          recycle_count: +values.recycle_count,
          recycle_count_0: +values.recycle_count_0,
          recycle_time: +values.recycle_time,
          desc: values.description,
          wait_time_0: +values.wait_time_0,
          align_delay_0: +values.align_delay_0,
          align_delay_2: +values.align_delay_2
        }
        const result = await createExcitationFn(params)
        if (result.data) {
          history.push({
            pathname: '/excitationList',
            state: {}
          })
        }
      }
    } catch (error) {
      throwErrorMessage(error, { 1009: '激励创建失败' })
    }
  }

  const onFieldsChange = (changedFields: any, allFields: any) => {
    const disabledData: any = []
    const errors = allFields.every((item: any) => {
      return item.errors.length === 0
    })
    allFields.forEach((item: any) => {
      if (item.name[0] !== 'description') return disabledData.push(item.value)
    })

    const disabledBoolean = disabledData.every((item: any) => {
      return item !== undefined && item !== ''
    })
    if (disabledBoolean && errors) {
      setIsDisableStatus(false)
    } else {
      setIsDisableStatus(true)
    }
  }

  React.useEffect(() => {
    fetchTemplateList()
    fetchPortList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  React.useEffect(() => {
    if (Data) {
      const { name, desc, port, template_id, recycle_count_0, recycle_time, recycle_count, wait_time_0, align_delay_0, align_delay_2 } = Data as any
      const formData = {
        name,
        description: desc,
        port,
        template_id,
        recycle_count_0,
        recycle_count,
        recycle_time,
        wait_time_0,
        align_delay_0,
        align_delay_2
      }
      form.setFieldsValue(formData)
    }
  }, [form, info, Data])
  return (
    <div className={styles.baseForm}>
      <Form name='basic' className={styles.oneForm} {...layout} onFieldsChange={onFieldsChange} autoComplete='off' form={form} size='large'>
        <Form.Item
          label='激励名称'
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
          <Input disabled={isFixForm} placeholder='请输入2到6个字符' />
        </Form.Item>

        <Form.Item name='port' label='端口类别' rules={[{ required: true, message: '请选择选择端口类别' }]}>
          <Select placeholder='请选择端口类别' disabled={isFixForm}>
            {
              /**
               * 根据连接方式列表渲染下拉框可选择的设备比特率
               */
              portList?.map(rate => {
                return (
                  <Option key={rate} value={rate}>
                    {rate}
                  </Option>
                )
              })
            }
          </Select>
        </Form.Item>
        <Form.Item name='template_id' label='模版名称' rules={[{ required: true, message: '请选择选择模版' }]}>
          <Select placeholder='请选择选择模版' disabled={isFixForm}>
            {
              /**
               * 根据连接方式列表渲染下拉框可选择的设备比特率
               */
              templateList?.map(rate => {
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
          label='发送次数'
          name='recycle_count_0'
          validateFirst
          validateTrigger={['onBlur']}
          rules={[
            {
              required: true,
              validateTrigger: 'onBlur',
              validator(_, value) {
                const reg = /^\d+$/
                if (reg.test(value)) {
                  if (value <= 20) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('请输入 0-20 之间的整数'))
                }
                return Promise.reject(new Error('请输入 0-20 之间的整数'))
              }
            }
          ]}
        >
          <Input disabled={isFixForm} placeholder='请输入发送次数' />
        </Form.Item>
        <Form.Item
          label='等待时间'
          name='wait_time_0'
          validateFirst
          validateTrigger={['onBlur']}
          rules={[
            {
              required: true,
              validateTrigger: 'onBlur',
              validator(_, value) {
                const reg = /^\d+$/
                if (reg.test(value)) {
                  if (value <= 10) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('请输入 0-10 之间的整数'))
                }
                return Promise.reject(new Error('请输入 0-10 之间的整数'))
              }
            }
          ]}
        >
          <Input disabled={isFixForm} placeholder='请输入整数,最大10' suffix='毫秒' />
        </Form.Item>

        <Form.Item
          label='循环次数'
          name='recycle_count'
          validateFirst
          validateTrigger={['onBlur']}
          rules={[
            {
              required: true,
              validateTrigger: 'onBlur',
              validator(_, value) {
                const reg = /^\d+$/
                if (reg.test(value)) {
                  if (value <= 20) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('请输入 0-20 之间的整数'))
                }
                return Promise.reject(new Error('请输入 0-20 之间的整数'))
              }
            }
          ]}
        >
          <Input disabled={isFixForm} placeholder='请输入发送次数' />
        </Form.Item>
        <Form.Item
          label='循环间隔'
          name='recycle_time'
          validateFirst
          validateTrigger={['onBlur']}
          rules={[
            {
              required: true,
              validateTrigger: 'onBlur',
              validator(_, value) {
                const reg = /^\d+$/
                if (reg.test(value)) {
                  if (value <= 10) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('请输入 0-10 之间的整数'))
                }
                return Promise.reject(new Error('请输入 0-10 之间的整数'))
              }
            }
          ]}
        >
          <Input disabled={isFixForm} placeholder='请输入整数,最大10' suffix='毫秒' />
        </Form.Item>
        <Form.Item
          label='前置时延'
          name='align_delay_0'
          validateFirst
          validateTrigger={['onBlur']}
          rules={[
            {
              required: true,
              validateTrigger: 'onBlur',
              validator(_, value) {
                const reg = /^\d+$/
                if (reg.test(value)) {
                  if (value <= 10) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('请输入 0-10 之间的整数'))
                }
                return Promise.reject(new Error('请输入 0-10 之间的整数'))
              }
            }
          ]}
        >
          <Input disabled={isFixForm} placeholder='请输入整数,最大10' suffix='毫秒' />
        </Form.Item>
        <Form.Item
          label='后置时延'
          name='align_delay_2'
          validateFirst
          validateTrigger={['onBlur']}
          rules={[
            {
              required: true,
              validateTrigger: 'onBlur',
              validator(_, value) {
                const reg = /^\d+$/
                if (reg.test(value)) {
                  if (value <= 10) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('请输入 0-10 之间的整数'))
                }
                return Promise.reject(new Error('请输入 0-10 之间的整数'))
              }
            }
          ]}
        >
          <Input disabled={isFixForm} placeholder='请输入整数,最大10' suffix='毫秒' />
        </Form.Item>
        <Form.Item
          label='任务描述'
          name='description'
          rules={[{ message: '请输入激励描述!' }, { type: 'string', max: 50, message: '字数不能超过50个 ' }]}
        >
          <Input.TextArea
            disabled={isFixForm}
            placeholder='激励描述'
            autoSize={{ minRows: 4, maxRows: 5 }}
            showCount={{
              formatter({ count }) {
                return `${count}/50`
              }
            }}
          />
        </Form.Item>
      </Form>
      <div className={styles.excitaion_footer}>
        <div className={styles.excitaion_footer_footerConcent}>
          <CommonButton
            buttonStyle={styles.stepButton}
            name='取消'
            type='default'
            onClick={() => {
              //   cancenlForm()
            }}
          />
          <CommonButton
            buttonStyle={styles.stepButton}
            type='primary'
            name='确认'
            disabled={isDisableStatus}
            onClick={() => {
              createOneExcitationFn()
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default OneExcotationForm
