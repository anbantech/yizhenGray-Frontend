import { Form, Input, Select } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import * as React from 'react'
import { useContext } from 'react'
import { useHistory } from 'react-router'
import CommonButton from 'Src/components/Button/commonButton'
import { GlobalContexted } from 'Src/components/globalBaseMain/globalBaseMain'
import { createExcitationFn, excitationListFn } from 'Src/services/api/excitationApi'
import { getTemplateList } from 'Src/services/api/templateApi'
import { throwErrorMessage } from 'Src/util/message'
import { GetDeatilFn } from './getDataDetailFn/getDataDetailFn'
import styles from '../excitation.less'

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

const request = {
  target_type: '0',
  key_word: '',
  status: null,
  page: 1,
  page_size: 99999,
  sort_field: 'create_time',
  sort_order: 'descend'
}

interface Resparams {
  target_type: number | string
  key_word?: string
  status?: null | number
  page: number
  page_size: number
  sort_field?: string
  sort_order?: string
}

type ResparamsType = Record<string, any>
const OneExcotationForm: React.FC = () => {
  const history = useHistory()
  const { isFixForm, info } = useContext(GlobalContexted)
  const { Option } = Select
  const [form] = useForm()
  const [isDisableStatus, setIsDisableStatus] = React.useState<boolean>(true)
  const [templateList, setTemplateList] = React.useState<any[]>()
  const [excitationList, setExcitationList] = React.useState<ResparamsType[]>([])
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

  // 获取激励列表
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
          target_id: +values.stimulus_id,
          template_id: +values.template_id,
          gu_cnt0: +values.gu_cnt0,
          gu_cnt1: +values.gu_cnt1,
          gu_w0: +values.gu_w0,
          gu_w1: +values.gu_w1,
          desc: values.description,
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
    getExcitationList({ ...request })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  React.useEffect(() => {
    if (Data) {
      const { name, desc, stimulus_id, template_id, gu_w0, align_delay_0, align_delay_2 } = Data as any
      const formData = {
        name,
        description: desc,
        stimulus_id,
        template_id,
        gu_w0,
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
          label='激励单元名称'
          name='name'
          validateFirst
          validateTrigger={['onBlur']}
          rules={[
            {
              validateTrigger: 'onBlur',
              validator(_, value) {
                if (typeof value === 'undefined' || value === '') {
                  return Promise.reject(new Error('请输入激励单元名称'))
                }
                return Promise.resolve()
              }
            },
            {
              required: true,
              max: 6,
              min: 2,
              message: '激励单元名称长度为2到6个字符'
            },
            {
              validateTrigger: 'onBlur',
              validator(_, value) {
                const reg = /^[\w\u4E00-\u9FA5]+$/
                if (reg.test(value)) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('激励单元名称由汉字、数字、字母和下划线组成'))
              }
            }
          ]}
        >
          <Input disabled={isFixForm} placeholder='请输入2到6个字符' />
        </Form.Item>

        <Form.Item name='stimulus_id' label='外设类别' rules={[{ required: true, message: '请选择选择外设类别' }]}>
          <Select placeholder='请选择外设类别' disabled={isFixForm}>
            {
              /**
               * 根据连接方式列表渲染下拉框可选择的设备比特率
               */
              excitationList?.map(rate => {
                return (
                  <Option key={rate.stimulus_id} value={rate.stimulus_id}>
                    {rate.stimulus_name}
                  </Option>
                )
              })
            }
          </Select>
        </Form.Item>
        <Form.Item name='template_id' label='模版名称' rules={[{ required: true, message: '请选择选择模版' }]}>
          <Select placeholder='请选择模版' disabled={isFixForm}>
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
          name='gu_cnt0'
          validateFirst
          validateTrigger={['onBlur']}
          initialValue={1}
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
          <Input disabled placeholder='请输入发送次数' />
        </Form.Item>
        <Form.Item
          label='等待时间'
          name='gu_w0'
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
          name='gu_cnt1'
          validateFirst
          validateTrigger={['onBlur']}
          initialValue={0}
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
          <Input disabled placeholder='请输入发送次数' />
        </Form.Item>
        <Form.Item
          label='循环间隔'
          name='gu_w1'
          validateFirst
          validateTrigger={['onBlur']}
          initialValue={0}
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
          <Input disabled placeholder='请输入整数,最大10' suffix='毫秒' />
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
