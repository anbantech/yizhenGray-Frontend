import { PlusOutlined } from '@ant-design/icons'
import { Form, Input } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import * as React from 'react'
import { useContext, useState } from 'react'
import { useHistory } from 'react-router'
import CommonButton from 'Src/components/Button/commonButton'
import { GlobalContexted } from 'Src/components/globalBaseMain/globalBaseMain'
import { createDoubleExcitationFn, excitationListFn } from 'Src/services/api/excitationApi'
import { throwErrorMessage } from 'Src/util/message'

import styles from '../excitation.less'
import ExcitationCard from '../excitationComponent/excitationCard'
import { GetDeatilFn } from './getDataDetailFn/getDataDetailFn'
// import { RouteComponentProps, StaticContext } from 'react-router'

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 }
}

const request = {
  target_type: 0,
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
  target_type: number
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
const DoubleExcitationForm: React.FC = () => {
  const [form] = useForm()
  const history = useHistory()
  const { isFixForm, info, type } = useContext(GlobalContexted)
  const [excitationList, setExcitationList] = useState<projectInfoType[]>([])
  const [cardArray, setCardArray] = React.useState(1)
  const [data, setData] = useState<number[]>([])
  const [cardCheckStatus, setCardCheckStatus] = useState(true)
  const [isDisableStatus, setIsDisableStatus] = React.useState<boolean>(true)
  const Data = GetDeatilFn(info?.id)
  const addCard = React.useCallback(() => {
    setCardArray(pre => pre + 1)
  }, [])
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

  const ExcitationCardList = React.useMemo(() => {
    const data = Array.from({ length: cardArray }, (v, i) => i)
    return data
  }, [cardArray])

  const onChange = React.useCallback(
    (val: any, index: number) => {
      setData((pre: number[] | any) => {
        const preCopy = pre
        preCopy[index] = val
        return [...preCopy]
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  )

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
          name: values.name,
          desc: values.name,
          gu_cnt0: +values.gu_cnt0,
          gu_w0: +values.gu_w0,
          gu_cnt1: +values.gu_cnt1,
          gu_w1: +values.gu_w1,
          align_delay_0: +values.align_delay_0,
          align_delay_1: +values.align_delay_1,
          align_delay_2: +values.align_delay_2,
          child_id_list: data
        }
        const result = await createDoubleExcitationFn(params)
        if (result.data) {
          history.push({
            pathname: '/excitationList',
            state: { type }
          })
        }
      }
    } catch (error) {
      throwErrorMessage(error)
    }
  }, [form, data, history, type])

  const getLength = React.useCallback(() => {
    if (data.length === 0) return false
    const bol = Object.values(data).every(item => {
      return Object.keys(item).length > 0
    })
    return bol
  }, [data])

  const cancelForm = () => {
    history.push({
      pathname: '/excitationList',
      state: { type }
    })
  }
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
    if (Data && isFixForm) {
      setCardArray(Data?.group_data_list.length)
      const { name, desc, gu_cnt0, gu_w0, gu_w1, gu_cnt1, align_delay_0, align_delay_2, align_delay_1 } = Data as any
      const formData = {
        name,
        description: desc,
        gu_cnt0,
        gu_w0,
        gu_cnt1,
        gu_w1,
        align_delay_0,
        align_delay_1,
        align_delay_2
      }
      form.setFieldsValue(formData)
    }
  }, [form, info, Data, isFixForm])
  return (
    <div className={styles.baseForm}>
      <Form name='basic' className={styles.twoForm} {...layout} onFieldsChange={onFieldsChange} autoComplete='off' form={form} size='large'>
        <Form.Item
          label='级联Group名称'
          name='name'
          validateFirst
          validateTrigger={['onBlur']}
          rules={[
            {
              validateTrigger: 'onBlur',
              validator(_, value) {
                if (typeof value === 'undefined' || value === '') {
                  return Promise.reject(new Error('请输入级联Group名称'))
                }
                return Promise.resolve()
              }
            },
            {
              required: true,
              max: 20,
              min: 2,
              message: '级联Group名称长度为2到20个字符'
            },
            {
              validateTrigger: 'onBlur',
              validator(_, value) {
                const reg = /^[\w\u4E00-\u9FA5]+$/
                if (reg.test(value)) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('级联Group名称由汉字、数字、字母和下划线组成'))
              }
            }
          ]}
        >
          <Input placeholder='请输入级联Group名称' disabled={isFixForm} />
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
          <Input disabled={isFixForm} placeholder='请输入前置时延' suffix='毫秒' />
        </Form.Item>
        <Form.Item
          label='发送次数'
          name='gu_cnt0'
          validateFirst
          validateTrigger={['onBlur']}
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
          <Input placeholder='请输入循环次数' disabled={isFixForm} />
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
          <Input placeholder='请输入等待时间' suffix='毫秒' disabled={isFixForm} />
        </Form.Item>
        <Form.Item
          label='循环次数'
          name='gu_cnt1'
          validateFirst
          validateTrigger={['onBlur']}
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
          <Input placeholder='请输入循环次数' disabled={isFixForm} />
        </Form.Item>
        <Form.Item
          label='循环间隔'
          name='gu_w1'
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
          <Input placeholder='请输入循环间隔' suffix='毫秒' disabled={isFixForm} />
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
                return Promise.reject(new Error('请输入 0-100之间的整数'))
              }
            }
          ]}
        >
          <Input disabled={isFixForm} placeholder='请输入中间时延' suffix='毫秒' />
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
          <Input disabled={isFixForm} placeholder='请输入后置时延' suffix='毫秒' />
        </Form.Item>
        <Form.Item
          label='级联描述'
          name='description'
          rules={[{ message: '请输入级联激励描述!' }, { type: 'string', max: 50, message: '字数不能超过50个 ' }]}
        >
          <Input.TextArea
            disabled={isFixForm}
            placeholder='请输入级联激励描述'
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
              formData={Data?.group_data_list}
              isFixForm={isFixForm}
              excitationList={excitationList}
              onChange={onChange}
              index={index}
              key={index}
            />
          )
        })}
        {ExcitationCardList.length < 10 && !isFixForm && (
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
          {!isFixForm ? (
            <CommonButton
              buttonStyle={styles.stepButton}
              name='取消'
              type='default'
              onClick={() => {
                cancelForm()
              }}
            />
          ) : null}
          {!isFixForm ? (
            <CommonButton
              buttonStyle={styles.stepButton}
              type='primary'
              name='确认'
              disabled={isFixForm ? true : cardCheckStatus}
              onClick={() => {
                createOneExcitationFn()
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default DoubleExcitationForm
