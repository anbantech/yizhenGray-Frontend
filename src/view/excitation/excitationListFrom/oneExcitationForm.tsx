import { Form, Input, message, Select } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import * as React from 'react'
import { useContext } from 'react'
import { useHistory } from 'react-router'
import CommonButton from 'Src/components/Button/commonButton'
import { GlobalContexted } from 'Src/components/globalBaseMain/globalBaseMain'
import CommonModle from 'Src/components/Modal/projectMoadl/CommonModle'
import { createExcitationFn, excitationListFn, updatTwoExcitaionList } from 'Src/services/api/excitationApi'
import { getTemplateList } from 'Src/services/api/templateApi'
import { throwErrorMessage } from 'Src/util/message'
import styles from '../excitation.less'
import { Tip } from '../excitationComponent/Tip'
import { GetDeatilFn } from './getDataDetailFn/getDataDetailFn'

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}

const templateListRequest = {
  key_word: '',
  page: 1,
  page_size: 999,
  sort_field: 'create_time',
  sort_order: 'descend'
}

const oneRequest = {
  target_type: '0',
  key_word: '',
  status: null,
  page: 1,
  page_size: 999,
  sort_field: 'create_time',
  sort_order: 'descend'
}

interface listArray {
  [propName: string]: string | number
}

const OneExcotationForm: React.FC = () => {
  const history = useHistory()
  const { isFixForm, info, lookDetail, fromPathName, type, name } = useContext(GlobalContexted)
  const { Option } = Select
  const [form] = useForm()
  const [isDisableStatus, setIsDisableStatus] = React.useState<boolean>(true)
  const [templateList, setTemplateList] = React.useState<any[]>()
  const [spinning, setSpinning] = React.useState(false)
  const [visibility, setVisibility] = React.useState(false)
  const [portList, setPortList] = React.useState<listArray[]>([])
  const Data = GetDeatilFn(info?.id)

  const CommonModleClose = (val: boolean) => {
    setVisibility(val)
  }
  // 获取模板列表
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
      message.error(error.message)
    }
  }, [])
  // 端口列表
  const fetchPortList = React.useCallback(async () => {
    //  Todo code码
    try {
      const result = await excitationListFn(oneRequest)
      if (result.data) {
        const results = result.data
        setPortList(results.results)
      }
      return result
    } catch (error) {
      message.error(error.message)
    }
  }, [])

  const createOneExcitationFn = React.useCallback(async () => {
    setSpinning(true)
    const routerInfo = { isFixForm, info, lookDetail, type, name }
    let values
    try {
      values = await form.validateFields()
    } catch {
      setIsDisableStatus(true)
    }
    try {
      if (values) {
        const params = {
          name: values.name,
          target_id: values.target_id,
          template_id: +values.template_id,
          gu_cnt1: +values.gu_cnt1,
          gu_cnt0: +values.gu_cnt0,
          gu_w1: +values.gu_w1,
          desc: values.description,
          gu_w0: +values.gu_w0,
          align_delay_1: +values.align_delay_1,
          align_delay_0: +values.align_delay_0,
          align_delay_2: +values.align_delay_2
        }
        let result
        if (!isFixForm) {
          result = await createExcitationFn(params)
        } else {
          result = await updatTwoExcitaionList(info.id, params)
        }
        setSpinning(false)
        CommonModleClose(false)
        if (result.data) {
          history.push({
            state: { ...routerInfo, lookDetail: true },
            pathname: `${fromPathName}`
          })
        }
      }
    } catch (error) {
      throwErrorMessage(error, { 1009: '激励单元删除失败' })
    }
  }, [form, fromPathName, history, info, isFixForm, lookDetail, name, type])

  const cancelForm = () => {
    history.push({
      pathname: '/TwoExcitationList'
    })
  }

  const onFieldsChange = React.useCallback(
    async (changedFields?: any, allFields?: any) => {
      // avoid outOfDate bug, sleep 300ms
      await new Promise<void>(resolve => setTimeout(() => resolve(), 300))
      if (!changedFields && !allFields) {
        // eslint-disable-next-line no-param-reassign
        allFields = form.getFieldsValue()
      }
      let allFinished = true
      // eslint-disable-next-line no-restricted-syntax
      for (const [fieldName, fieldValue] of Object.entries(allFields)) {
        if (fieldName !== 'description' && typeof fieldValue === 'undefined') {
          allFinished = false
          break
        }
      }
      if (!allFinished) {
        setIsDisableStatus(true)
        return
      }
      let values
      try {
        values = await form.validateFields()
      } catch (error) {
        message.error(error)
      }
      setIsDisableStatus(!values)
    },
    [form]
  )

  const createOrUpdate = React.useCallback(() => {
    if (isFixForm) {
      CommonModleClose(true)
    } else {
      createOneExcitationFn()
    }
  }, [createOneExcitationFn, isFixForm])

  React.useEffect(() => {
    fetchTemplateList()
    fetchPortList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  React.useEffect(() => {
    if (Data) {
      const { name, desc, target_id, template_id, align_delay_1, gu_cnt0, gu_cnt1, gu_w1, gu_w0, align_delay_0, align_delay_2 } = Data as any
      const formData = {
        name,
        description: desc,
        target_id,
        template_id,
        gu_cnt0,
        gu_cnt1,
        gu_w1,
        gu_w0,
        align_delay_0,
        align_delay_1,
        align_delay_2
      }
      form.setFieldsValue(formData)
      onFieldsChange()
    }
  }, [form, info, Data, onFieldsChange])

  return (
    <div className={styles.baseForm}>
      <Form name='basic' className={styles.oneForm} {...layout} onValuesChange={onFieldsChange} autoComplete='off' form={form} size='large'>
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
              max: 20,
              min: 2,
              message: '激励单元名称长度为2到20个字符'
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
          <Input disabled={isFixForm && lookDetail} placeholder='请输入激励单元名称' />
        </Form.Item>

        <Form.Item name='target_id' label='外设名称' rules={[{ required: true, message: '请选择外设' }]}>
          <Select placeholder='请选择外设' disabled={isFixForm && lookDetail}>
            {
              /**
               * 下拉选择端口
               */
              portList?.map(rate => {
                return (
                  <Option key={rate.stimulus} disabled={rate.disable} value={rate.stimulus_id}>
                    {rate.stimulus_name}
                  </Option>
                )
              })
            }
          </Select>
        </Form.Item>
        <Form.Item name='template_id' label='模板名称' rules={[{ required: true, message: '请选择模板' }]}>
          <Select placeholder='请选择模板' disabled={isFixForm && lookDetail}>
            {
              /**
               *  选择不同模板
               */
              templateList?.map(rate => {
                return (
                  <Option key={rate.id} value={rate.id} disabled={rate.disable as boolean}>
                    {rate.name}
                  </Option>
                )
              })
            }
          </Select>
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
          <Input disabled={isFixForm && lookDetail} placeholder='请输入前置时延' suffix={<Tip />} />
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
                  if (value > 0 && value <= 20) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('请输入 1-20 之间的整数'))
                }
                return Promise.reject(new Error('请输入 1-20 之间的整数'))
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
          <Input disabled={isFixForm && lookDetail} placeholder='请输入等待时间' suffix={<Tip />} />
        </Form.Item>
        <Form.Item
          label='循环间隔'
          name='gu_w1'
          validateFirst
          initialValue={0}
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
          <Input disabled placeholder='请输入循环间隔' suffix={<Tip />} />
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
                  if (value >= 0 && value <= 20) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('请输入 1-20 之间的整数'))
                }
                return Promise.reject(new Error('请输入 1-20 之间的整数'))
              }
            }
          ]}
        >
          <Input disabled placeholder='请输入循环次数' />
        </Form.Item>

        <Form.Item
          label='中间时延'
          name='align_delay_1'
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
          <Input disabled={isFixForm && lookDetail} placeholder='请输入中间时延' suffix={<Tip />} />
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
          <Input disabled={isFixForm && lookDetail} placeholder='请输入后置时延' suffix={<Tip />} />
        </Form.Item>
        <Form.Item
          label='激励单元描述'
          name='description'
          rules={[{ message: '单激励单元描述!' }, { type: 'string', max: 50, message: '字数不能超过50个 ' }]}
        >
          <Input.TextArea
            disabled={isFixForm && lookDetail}
            placeholder={isFixForm ? '' : '请输入激励单元描述'}
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
          {!lookDetail ? (
            <CommonButton
              buttonStyle={styles.stepButton}
              name='取消'
              type='default'
              onClick={() => {
                cancelForm()
              }}
            />
          ) : null}
          {!lookDetail ? (
            <CommonButton
              buttonStyle={styles.stepButton}
              type='primary'
              name={isFixForm ? '修改' : '新建'}
              disabled={isDisableStatus}
              onClick={createOrUpdate}
            />
          ) : null}
        </div>
      </div>
      <CommonModle
        IsModalVisible={visibility}
        spinning={spinning}
        deleteProjectRight={createOneExcitationFn}
        CommonModleClose={CommonModleClose}
        ing='修改中'
        name='修改激励单元'
        concent='修改除名称、描述以外的配置项，会停止关联任务，并清空关联任务的测试数据，是否确认修改？'
      />
    </div>
  )
}

export default OneExcotationForm
