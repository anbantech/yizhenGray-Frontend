import { PlusOutlined } from '@ant-design/icons'
import { Form, Input } from 'antd'
import { useForm } from 'antd/lib/form/Form'

import * as React from 'react'
import { useContext, useState } from 'react'
import CommonButton from 'Src/components/Button/commonButton'
import { GlobalContexted } from 'Src/components/globalBaseMain/globalBaseMain'
import { createExcitationFn, excitationListFn } from 'Src/services/api/excitationApi'
import { throwErrorMessage } from 'Src/until/message'
import styles from '../excitation.less'
import ExcitationCard from '../excitationComponent/excitationCard'

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 }
}

const request = {
  group_type: 0,
  key_word: '',
  status: null,
  page: 1,
  page_size: 999,
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
  group_type: number
  key_word?: string
  status?: null | number
  page: number
  page_size: number
  sort_field?: string
  sort_order?: string
}
interface formPorps {
  [key: number]: any
}
const GroupExcitationForm: React.FC = () => {
  const { isFixForm, info, type } = useContext(GlobalContexted)
  const [form] = useForm()
  const [cardArray, setCardArray] = React.useState(1)
  const [cardCheckStatus, setCardCheckStatus] = useState(true)
  const [isDisableStatus, setIsDisableStatus] = React.useState<boolean>(true)
  const [excitationList, setExcitationList] = useState<projectInfoType[]>([])
  const [data, setData] = useState({ align_delay_0: {}, align_delay_1: {}, align_delay_2: {}, excitarionList: {} })
  const addCard = React.useCallback(() => {
    setCardArray(pre => pre + 1)
  }, [])
  const ExcitationCardList = React.useMemo(() => {
    const data = Array.from({ length: cardArray }, (v, i) => i)
    return data
  }, [cardArray])

  const onChange = React.useCallback(
    (val: any, type: string, index: number) => {
      if (type === 'align_delay_0') {
        setData((pre: any) => {
          const preCopy = pre
          preCopy[type] = val
          return { ...pre, align_delay_0: { ...preCopy[type] } }
        })
      }
      if (type === 'align_delay_1') {
        setData((pre: any) => {
          const preCopy = pre
          preCopy[type][index] = val
          return { ...pre, align_delay_1: { ...preCopy[type] } }
        })
      }
      if (type === 'excitarionList') {
        setData((pre: any) => {
          const preCopy = pre
          preCopy[type][index] = val
          return { ...pre, excitarionList: { ...preCopy[type] } }
        })
      }

      if (type === 'align_delay_2') {
        setData((pre: any) => {
          const preCopy = pre
          preCopy[type] = val
          return { ...pre, align_delay_2: { ...preCopy[type] } }
        })
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  )

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

  const createOneExcitationFn = React.useCallback(async () => {
    let values
    try {
      values = await form.validateFields()
    } catch {
      setIsDisableStatus(true)
    }
    try {
      if (values) {
        const params = {
          group_type: 1,
          name: values.name,
          port: values.port,
          recycle_count: values.recycle_count,
          recycle_time: values.recycle_time,
          desc: values.description,
          group_info: data
        }
        const result = await createExcitationFn(params)
        // ToDo
      }
    } catch (error) {
      throwErrorMessage(error, { 1009: '项目删除失败' })
    }
  }, [form, data])
  const getLength = React.useCallback(() => {
    const bol = Object.values(data).every(item => {
      return Object.keys(item).length > 0
    })
    return bol
  }, [data])
  const onFieldsChange = (changedFields: any, allFields: any) => {
    const disabledData: any = []
    const errors = allFields.every((item: any) => {
      return item.errors.length === 0
    })
    // eslint-disable-next-line array-callback-return
    allFields.map((item: any) => {
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
    if (!getLength() && isDisableStatus) {
      setCardCheckStatus(true)
    } else {
      setCardCheckStatus(false)
    }
  }, [data, getLength, isDisableStatus])

  React.useEffect(() => {
    getExcitationList(request)
  }, [])

  React.useEffect(() => {
    if (info) {
      const { name, desc, port, template_id, recycle_count, recycle_time } = info
      const formData = { name, description: desc, port, template_id, recycle_count, recycle_time }
      form.setFieldsValue(formData)
    }
  }, [form, info])
  return (
    <div className={styles.baseForm}>
      <Form name='basic' className={styles.twoForm} {...layout} onFieldsChange={onFieldsChange} autoComplete='off' form={form} size='large'>
        <Form.Item
          label='次联激励名称'
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
          label='循环次数'
          name='wait_time_0'
          validateFirst
          validateTrigger={['onBlur']}
          rules={[{ required: true, message: '请输入发送次数' }]}
        >
          <Input placeholder='请输入发送次数' />
        </Form.Item>
        <Form.Item
          label='循环间隔'
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
          <Input placeholder='请输入整数,最大48' suffix='毫秒' />
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
      <div className={styles.formOperation}>
        {ExcitationCardList?.map((index: number) => {
          return (
            <ExcitationCard
              type={type}
              excitationList={excitationList}
              isFixForm={isFixForm}
              onChange={onChange}
              formData={data}
              index={index}
              key={index}
            />
          )
        })}

        {ExcitationCardList.length < 4 && (
          <div className={styles.nav_Btn} role='time' onClick={addCard}>
            <PlusOutlined style={{ fontSize: '20px', marginBottom: '3px' }} />
            <span>添</span>
            <span>加</span>
            <span>激</span>
            <span>励</span>
          </div>
        )}
      </div>
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
            disabled={isFixForm ? true : cardCheckStatus}
            onClick={() => {
              createOneExcitationFn()
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default GroupExcitationForm
