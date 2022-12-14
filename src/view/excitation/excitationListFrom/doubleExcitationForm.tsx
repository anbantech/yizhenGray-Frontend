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
import GetDeatilFn from './getDataDetailFn/getDataDetailFn'
// import { RouteComponentProps, StaticContext } from 'react-router'

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
      throwErrorMessage(error, { 1004: '?????????????????????' })
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
          recycle_count_0: +values.recycle_count_0,
          wait_time_0: +values.wait_time_0,
          align_delay_0: +values.align_delay_0,
          align_delay_2: +values.align_delay_2,
          child_id_list: data
        }
        const result = await createDoubleExcitationFn(params)
        if (result.data) {
          history.push({
            pathname: '/excitationList',
            state: {}
          })
        }
      }
    } catch (error) {
      throwErrorMessage(error)
    }
  }, [form, data, history])

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
    if (Data && isFixForm) {
      setCardArray(Data?.group_data_list.length)
      const { name, desc, recycle_count_0, wait_time_0, align_delay_0, align_delay_2 } = Data as any
      const formData = {
        name,
        description: desc,
        recycle_count_0,
        wait_time_0,
        align_delay_0,
        align_delay_2
      }
      form.setFieldsValue(formData)
    }
  }, [form, info, Data, isFixForm])
  return (
    <div className={styles.baseForm}>
      <Form name='basic' className={styles.twoForm} {...layout} onFieldsChange={onFieldsChange} autoComplete='off' form={form} size='large'>
        <Form.Item
          label='????????????'
          name='name'
          validateFirst
          validateTrigger={['onBlur']}
          rules={[
            {
              validateTrigger: 'onBlur',
              validator(_, value) {
                if (typeof value === 'undefined' || value === '') {
                  return Promise.reject(new Error('?????????????????????'))
                }
                return Promise.resolve()
              }
            },
            {
              required: true,
              max: 6,
              min: 2,
              message: '?????????????????????2???6?????????'
            },
            {
              validateTrigger: 'onBlur',
              validator(_, value) {
                const reg = /^[\w\u4E00-\u9FA5]+$/
                if (reg.test(value)) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('?????????????????????????????????????????????????????????'))
              }
            }
          ]}
        >
          <Input placeholder='?????????2???6?????????' disabled={isFixForm} />
        </Form.Item>

        <Form.Item
          label='????????????'
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
                  return Promise.reject(new Error('????????? 0-20 ???????????????'))
                }
                return Promise.reject(new Error('????????? 0-20 ???????????????'))
              }
            }
          ]}
        >
          <Input placeholder='?????????????????????' disabled={isFixForm} />
        </Form.Item>
        <Form.Item
          label='????????????'
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
                  return Promise.reject(new Error('????????? 0-10 ???????????????'))
                }
                return Promise.reject(new Error('????????? 0-10 ???????????????'))
              }
            }
          ]}
        >
          <Input placeholder='???????????????,??????10' suffix='??????' disabled={isFixForm} />
        </Form.Item>

        <Form.Item
          label='????????????'
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
                  return Promise.reject(new Error('????????? 0-10 ???????????????'))
                }
                return Promise.reject(new Error('????????? 0-10 ???????????????'))
              }
            }
          ]}
        >
          <Input disabled={isFixForm} placeholder='???????????????,??????10' suffix='??????' />
        </Form.Item>
        <Form.Item
          label='????????????'
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
                  return Promise.reject(new Error('????????? 0-10 ???????????????'))
                }
                return Promise.reject(new Error('????????? 0-10 ???????????????'))
              }
            }
          ]}
        >
          <Input disabled={isFixForm} placeholder='???????????????,??????10' suffix='??????' />
        </Form.Item>
        <Form.Item
          label='????????????'
          name='description'
          rules={[{ message: '???????????????????????????!' }, { type: 'string', max: 50, message: '??????????????????50??? ' }]}
        >
          <Input.TextArea
            disabled={isFixForm}
            placeholder='????????????'
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
            <span>???</span>
            <span>???</span>
            <span>???</span>
            <span>???</span>
          </div>
        )}
      </div>

      <div className={styles.excitaion_footer}>
        <div className={styles.excitaion_footer_footerConcent}>
          <CommonButton
            buttonStyle={styles.stepButton}
            name='??????'
            type='default'
            onClick={() => {
              //   cancenlForm()
            }}
          />
          <CommonButton
            buttonStyle={styles.stepButton}
            type='primary'
            name='??????'
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

export default DoubleExcitationForm
