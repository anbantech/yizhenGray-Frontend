import { PlusOutlined } from '@ant-design/icons'
import { Form, Input } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import * as React from 'react'
import { useContext, useState } from 'react'
import { useHistory } from 'react-router'
import CommonButton from 'Src/components/Button/commonButton'
import { GlobalContexted } from 'Src/components/globalBaseMain/globalBaseMain'
import { getAllRes } from 'Src/globalType/Response'
import { createGroup_unitFn, excitationListFn } from 'Src/services/api/excitationApi'
import { throwErrorMessage } from 'Src/util/message'

import styles from '../excitation.less'
import ExcitationCard from '../excitationComponent/excitationCard'
import { Tip } from '../excitationComponent/Tip'
import { GetDeatilFn } from './getDataDetailFn/getDataDetailFn'
// import { RouteComponentProps, StaticContext } from 'react-router'
type FilterType = Record<string, any>[]
const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 }
}

const request = {
  target_type: '1',
  key_word: '',
  status: null,
  page: 1,
  page_size: 999,
  sort_field: 'create_time',
  sort_order: 'descend'
}
const request1 = {
  target_type: 2,
  key_word: '',
  status: null,
  page: 1,
  page_size: 999,
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
interface formPorps {
  [key: number]: any
}
interface Option {
  sender_id: string
  name: string
  disabled?: boolean
  children?: any[]
}
const DoubleExcitationForm: React.FC = () => {
  const [form] = useForm()
  const history = useHistory()
  const { isFixForm, info, type } = useContext(GlobalContexted)
  const [excitationList, setExcitationList] = useState<Option[]>([
    {
      sender_id: '1',
      name: '级联Group',
      disabled: false,
      children: []
    },
    {
      sender_id: '0',
      name: '单激励Group',
      disabled: false,
      children: []
    }
  ])
  const [data, setData] = useState<number[]>([])
  const [cardArray, setCardArray] = React.useState([0])
  const [cardCheckStatus, setCardCheckStatus] = useState(true)
  const [isDisableStatus, setIsDisableStatus] = React.useState<boolean>(true)
  const Data = GetDeatilFn(info?.id) as getAllRes
  const addCard = React.useCallback(() => {
    const pre = cardArray
    pre.push(cardArray.length)
    setCardArray([...pre])
  }, [cardArray])

  // const getExcitationList = async (value: Resparams) => {
  //   try {
  //     const result = await excitationListFn(value)
  //     if (result.data) {
  //       setExcitationList(result.data.results)
  //     }
  //   } catch (error) {
  //     throwErrorMessage(error, { 1004: '请求资源未找到' })
  //   }
  // }

  // 过滤已经被使用的数据
  const filterUseData = (val: FilterType) => {
    const res = val.filter(item => {
      return item.disabled === false
    })
    return res
  }

  // 过滤数组元素中的unfinend

  const filterUnfinedItem = (val: number[]) => {
    const mapArray = val.filter(value => value !== undefined)

    return mapArray
  }

  // 添加元素

  //  选择某一参数之后,更新列表的disabled
  const updateDisabled = React.useCallback(
    (value: number, bol: boolean) => {
      const excitationListOld = excitationList as Option[]
      excitationListOld?.forEach((item: any) => {
        item.children.forEach((element: any) => {
          if (value === element.sender_id) {
            const pre = element
            pre.disabled = bol
          }
        })
      })
      setExcitationList([...excitationListOld])
    },
    [excitationList]
  )

  // 删除某个id
  const deleteID = React.useCallback(
    (index: number) => {
      const oldItemArray = data as any
      const clearItem = oldItemArray[index]
      oldItemArray[index] = undefined
      setData([...oldItemArray])
      return clearItem as number
    },
    [data]
  )

  const onChange = React.useCallback(
    (val: number, index: number) => {
      const oldStepArray = data
      if (val === undefined) {
        const item = deleteID(index)
        updateDisabled(item, false)
        return item
      }
      if (oldStepArray[index] !== val) {
        oldStepArray[index] = val
        setData([...oldStepArray])
        updateDisabled(val, true)
      }
    },
    [data, deleteID, updateDisabled]
  )

  // 获取配置列表
  const getExcitationList = async (request1: Resparams, doubleRequest: Resparams) => {
    try {
      const result2 = await excitationListFn(doubleRequest)
      const result1 = await excitationListFn(request1)
      Promise.all([result1, result2])
        .then(value => {
          const result1Data = filterUseData(value[0].data?.results as FilterType)
          const result2Data = filterUseData(value[1].data?.results as FilterType)

          setExcitationList(pre => {
            const preCopy = pre
            if (isFixForm) {
              return [
                { ...preCopy[1], disabled: isFixForm, children: result2Data },
                { ...preCopy[0], disabled: isFixForm, children: result1Data }
              ]
            }
            const res1 = result1Data?.length ? result1Data : null
            const res2 = result2Data?.length ? result2Data : null
            if (res1 && res2) {
              const data = [
                { ...pre[1], children: result2Data },
                { ...pre[0], children: result1Data }
              ]
              setExcitationList(data)
            } else if (res1) {
              const data = [{ ...pre[0], children: result1Data }]
              setExcitationList(data)
            } else if (res2) {
              const data = [{ ...pre[1], children: result2Data }]
              setExcitationList(data)
            } else {
              return []
            }
            return []
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

  // 创建级联
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
          gu_cnt0: +values.gu_cnt0,
          gu_w0: +values.gu_w0,
          gu_cnt1: +values.gu_cnt1,
          gu_w1: +values.gu_w1,
          align_delay_0: +values.align_delay_0,
          align_delay_1: +values.align_delay_1,
          align_delay_2: +values.align_delay_2,
          child_id_list: filterUnfinedItem(data)
        }
        const result = await createGroup_unitFn(params)
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
    if (!isDisableStatus) {
      if (filterUnfinedItem(data).length >= 1) {
        setCardCheckStatus(false)
      } else {
        setCardCheckStatus(true)
      }
    }
    if (data.length >= 1) {
      setCardArray(Array.from({ length: data.length }, (v, i) => i))
    }
    return () => {
      setCardArray([0])
    }
  }, [data, isDisableStatus])

  const deleteCard = () => {}

  React.useEffect(() => {
    getExcitationList(request1, request)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isBack = (propsDatas: any) => {
    const res = propsDatas.map((item: any) => {
      return item.sender_id
    })
    setData([...res])
    return res
  }
  React.useEffect(() => {
    if (Data && isFixForm) {
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
      isBack(Data.group_data_list)
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
          <Input disabled={isFixForm} placeholder='请输入前置时延' suffix={<Tip />} />
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
          <Input placeholder='请输入发送次数' disabled />
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
          <Input placeholder='请输入等待时间' disabled={isFixForm} suffix={<Tip />} />
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
          <Input placeholder='请输入循环次数' disabled />
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
          <Input placeholder='请输入循环间隔' disabled suffix={<Tip />} />
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
          <Input disabled={isFixForm} placeholder='请输入中间时延' suffix={<Tip />} />
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
          <Input disabled={isFixForm} placeholder='请输入后置时延' suffix={<Tip />} />
        </Form.Item>
        <Form.Item
          label='级联Group描述'
          name='description'
          rules={[{ message: '请输入级联Group描述!' }, { type: 'string', max: 50, message: '字数不能超过50个 ' }]}
        >
          <Input.TextArea
            disabled={isFixForm}
            placeholder={isFixForm ? '' : '请输入级联Group描述'}
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
        {cardArray?.map((index: number) => {
          return (
            <ExcitationCard
              deleteCard={deleteCard}
              type={type}
              idArray={data[index]}
              isFixForm={isFixForm}
              excitationList={excitationList}
              onChange={onChange}
              index={index}
              key={index}
            />
          )
        })}
        {cardArray.length < 10 && !isFixForm && (
          <div className={styles.nav_Btn} role='time' onClick={addCard}>
            <PlusOutlined style={{ fontSize: '20px', marginBottom: '3px' }} />
            <span>添</span>
            <span>加</span>
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
