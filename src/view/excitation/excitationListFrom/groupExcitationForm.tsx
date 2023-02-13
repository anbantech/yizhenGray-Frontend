import { PlusOutlined } from '@ant-design/icons'
import { Form, Input } from 'antd'
import { useForm } from 'antd/lib/form/Form'

import * as React from 'react'
import { useContext, useState } from 'react'
import { useHistory } from 'react-router'
import CommonButton from 'Src/components/Button/commonButton'
import { GlobalContexted } from 'Src/components/globalBaseMain/globalBaseMain'
import { createGroupFn, excitationListFn } from 'Src/services/api/excitationApi'
import { throwErrorMessage } from 'Src/util/message'
import styles from '../excitation.less'
import ExcitationCard from '../excitationComponent/excitationCard'
import { GetDeatilFn } from './getDataDetailFn/getDataDetailFn'

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 }
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

const doubleRequest = {
  target_type: 1,
  key_word: '',
  status: null,
  page: 1,
  page_size: 999,
  sort_field: 'create_time',
  sort_order: 'descend'
}
interface Option {
  sender_id: string
  name: string
  disabled?: boolean
  children?: any[]
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
interface formPorps {
  [key: number]: any
}
const GroupExcitationForm: React.FC = () => {
  const { isFixForm, info, type } = useContext(GlobalContexted)
  const history = useHistory()
  const [form] = useForm()
  const [cardArray, setCardArray] = React.useState(1)
  const [cardCheckStatus, setCardCheckStatus] = useState(true)
  const [isDisableStatus, setIsDisableStatus] = React.useState<boolean>(true)
  const [excitationList, setExcitationList] = useState<Option[]>([
    {
      sender_id: '0',
      name: '单激励',
      disabled: false,
      children: []
    },
    {
      sender_id: '1',
      name: '级联激励',
      disabled: false,
      children: []
    }
  ])
  const [data, setData] = useState<number[]>([])
  const Data = GetDeatilFn(info?.id)
  const addCard = React.useCallback(() => {
    setCardArray(pre => pre + 1)
  }, [])
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
  const cancelForm = () => {
    history.push({
      pathname: '/excitationList',
      state: { type }
    })
  }
  const getExcitationList = async (oneRequest: Resparams, doubleRequest: Resparams) => {
    try {
      const result1 = await excitationListFn(oneRequest)
      const result2 = await excitationListFn(doubleRequest)
      Promise.all([result1, result2])
        .then(value => {
          const result1Data = value[0].data?.results
          const result2Data = value[1].data?.results
          setExcitationList(pre => {
            const preCopy = pre
            if (isFixForm) {
              return [
                { ...preCopy[0], disabled: isFixForm, children: result1Data },
                { ...preCopy[1], disabled: isFixForm, children: result2Data }
              ]
            }
            return [
              { ...preCopy[0], children: result1Data },
              { ...preCopy[1], children: result2Data }
            ]
          })
          return value
        })
        .catch(error => {
          throwErrorMessage(error)
        })
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
          name: values.name,
          desc: values.description,
          child_id_list: data
        }
        const result = await createGroupFn(params)
        if (result.data) {
          history.push({
            pathname: '/excitationList',
            state: { type }
          })
        }
      }
    } catch (error) {
      throwErrorMessage(error, { 1009: '项目删除失败' })
    }
  }, [form, data, history, type])
  const getLength = React.useCallback(() => {
    if (data.length === 0) return false
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
    getExcitationList(oneRequest, doubleRequest)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFixForm])

  React.useEffect(() => {
    if (Data && isFixForm) {
      setCardArray(Data?.group_data_list.length)
      const { name, desc } = Data as any
      const formData = {
        name,
        description: desc
      }
      form.setFieldsValue(formData)
    }
  }, [form, info, Data, isFixForm])
  return (
    <div className={styles.baseForm}>
      <Form name='basic' className={styles.twoForm} {...layout} onFieldsChange={onFieldsChange} autoComplete='off' form={form} size='large'>
        <Form.Item
          label='交互名称'
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
              max: 20,
              min: 2,
              message: '交互名称长度为2到20个字符'
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
          <Input disabled={isFixForm} placeholder='请输入2到20个字符' />
        </Form.Item>

        <Form.Item
          label='交互描述'
          name='description'
          rules={[{ message: '请输入交互描述!' }, { type: 'string', max: 50, message: '字数不能超过50个 ' }]}
        >
          <Input.TextArea
            disabled={isFixForm}
            placeholder='交互描述'
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
              formData={Data?.group_data_list}
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

export default GroupExcitationForm
