import { PlusOutlined } from '@ant-design/icons'
import { Form, Input, message } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import * as React from 'react'
import { useContext, useState } from 'react'
import { useHistory } from 'react-router'
import CommonButton from 'Src/components/Button/commonButton'
import { GlobalContexted } from 'Src/components/globalBaseMain/globalBaseMain'
import { getAllRes } from 'Src/globalType/Response'
import { createGroup_unitFn, excitationListFn, updatThreeExcitaionList } from 'Src/services/api/excitationApi'
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
// const request1 = {
//   target_type: 2,
//   key_word: '',
//   status: null,
//   page: 1,
//   page_size: 999,
//   sort_field: 'create_time',
//   sort_order: 'descend'
// }

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
  const { isFixForm, info, type, lookDetail } = useContext(GlobalContexted)
  const [excitationList, setExcitationList] = useState<Option[]>([
    {
      sender_id: '0',
      name: '激励单元管理',
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

  // 过滤已经被使用的数据
  // const filterUseData = (val: FilterType) => {
  //   const res = val.filter(item => {
  //     return item.disabled === false
  //   })
  //   return res
  // }
  const filterUseData = (init: FilterType, val: number[]) => {
    return init.map(item => {
      const pre = item
      val?.forEach((id: number) => {
        pre.disabled = item.sender_id === id
      })
      return pre
    })
  }
  // 过滤数组元素中的unfinend
  const filterUnfinedItem = (val: number[]) => {
    return val.filter(value => value !== undefined)
  }

  // 获取
  const isBack = (propsDatas: any) => {
    const res = propsDatas.map((item: any) => {
      return item.sender_id
    })
    setData([...res])
    return res
  }

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
        updateDisabled(oldStepArray[index], false)
        oldStepArray[index] = val
        setData([...oldStepArray])
        updateDisabled(val, true)
      }
    },
    [data, deleteID, updateDisabled]
  )

  const deleteCard = React.useCallback(
    (val: number, data: number[]) => {
      const oldItemArray = [...data]
      const clearItem = oldItemArray.splice(val, 1)
      updateDisabled(clearItem[0], false)
      setData([...oldItemArray])
      return Promise.resolve()
    },
    [updateDisabled]
  )

  const sortCardArray = React.useCallback(
    async (val: number) => {
      await deleteCard(val, data)
      const oldItemArray = [...cardArray]
      oldItemArray.splice(val, 1)
      setCardArray([...oldItemArray])
    },
    [cardArray, data, deleteCard]
  )

  // 获取配置列表
  const getExcitationList = React.useCallback(
    async (request1: Resparams, resOld?: any) => {
      try {
        const result1 = await excitationListFn(request1)
        Promise.all([result1])
          .then(value => {
            if (resOld && value[0].data) {
              const res = filterUseData(value[0].data?.results, resOld)
              const data = [{ ...excitationList[0], children: res }]
              setExcitationList([...data])
            }
            const result1Data = value[0].data?.results
            const data = [{ ...excitationList[0], children: result1Data }]
            setExcitationList([...data])
            return value
          })
          .catch(error => {
            throwErrorMessage(error)
          })
        return result1
      } catch (error) {
        throwErrorMessage(error, { 1004: '请求资源未找到' })
      }
    },
    [excitationList]
  )

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
        let result
        if (!isFixForm) {
          result = await createGroup_unitFn(params)
        } else {
          result = await updatThreeExcitaionList(info.id, params)
        }

        if (result.data) {
          history.push({
            pathname: '/ThreeExcitationList'
          })
        }
      }
    } catch (error) {
      throwErrorMessage(error)
    }
  }, [form, data, isFixForm, info?.id, history])

  const cancelForm = () => {
    history.push({
      pathname: '/ThreeExcitationList'
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
        if ((fieldName !== 'description' && typeof fieldValue) === 'undefined') {
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

  React.useEffect(() => {
    if (!isDisableStatus) {
      if (filterUnfinedItem(data).length >= 1) {
        setCardCheckStatus(false)
      } else {
        setCardCheckStatus(true)
      }
    } else {
      setCardCheckStatus(true)
    }
    if (data.length > 1) {
      setCardArray(Array.from({ length: data.length }, (v, i) => i))
    }
  }, [data, isDisableStatus])
  React.useEffect(() => {
    getExcitationList(request)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    if (Data) {
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
      const res = isBack(Data.group_data_list)
      form.setFieldsValue(formData)
      onFieldsChange()
      getExcitationList(request, res)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, info, Data, isFixForm, onFieldsChange])

  return (
    <div className={styles.baseForm}>
      <Form name='basic' className={styles.twoForm} {...layout} onValuesChange={onFieldsChange} autoComplete='off' form={form} size='large'>
        <Form.Item
          label='激励嵌套管理名称'
          name='name'
          validateFirst
          validateTrigger={['onBlur']}
          rules={[
            {
              validateTrigger: 'onBlur',
              validator(_, value) {
                if (typeof value === 'undefined' || value === '') {
                  return Promise.reject(new Error('请输入激励嵌套管理名称'))
                }
                return Promise.resolve()
              }
            },
            {
              required: true,
              max: 20,
              min: 2,
              message: '激励嵌套管理名称长度为2到20个字符'
            },
            {
              validateTrigger: 'onBlur',
              validator(_, value) {
                const reg = /^[\w\u4E00-\u9FA5]+$/
                if (reg.test(value)) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('激励嵌套管理名称由汉字、数字、字母和下划线组成'))
              }
            }
          ]}
        >
          <Input placeholder='请输入激励嵌套管理名称' disabled={isFixForm && lookDetail} />
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
          label='激励嵌套管理描述'
          name='description'
          rules={[{ message: '请输入激励嵌套管理描述!' }, { type: 'string', max: 50, message: '字数不能超过50个 ' }]}
        >
          <Input.TextArea
            disabled={isFixForm && lookDetail}
            placeholder={isFixForm ? '' : '请输入激励嵌套管理描述'}
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
        {cardArray?.map((value: number, index: number) => {
          return (
            <ExcitationCard
              deleteCard={sortCardArray}
              type={type}
              idArray={data[index]}
              isFixForm={isFixForm}
              lookDetail={lookDetail}
              stepArray={cardArray}
              excitationList={excitationList}
              onChange={onChange}
              index={index}
              key={value}
            />
          )
        })}
        {cardArray.length < 10 && !lookDetail && (
          <div className={styles.nav_Btn} role='time' onClick={addCard}>
            <PlusOutlined style={{ fontSize: '20px', marginBottom: '3px' }} />
            <span>添</span>
            <span>加</span>
          </div>
        )}
      </div>

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
              disabled={cardCheckStatus}
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
