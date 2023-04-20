/* eslint-disable indent */
import { PlusOutlined } from '@ant-design/icons'
import { Form, Input, message, Steps } from 'antd'
import { useForm } from 'antd/lib/form/Form'

import * as React from 'react'
import { useContext, useState } from 'react'
import { useHistory } from 'react-router'

import CommonButton from 'Src/components/Button/commonButton'
import { GlobalContexted } from 'Src/components/globalBaseMain/globalBaseMain'
import { checkDataStructure, excitationListFn } from 'Src/services/api/excitationApi'

import { generateUUID } from 'Src/util/common'
import { throwErrorMessage } from 'Src/util/message'
import { StepTip } from '../excitationComponent/Tip'
import styles from '../excitation.less'
import ExcitationCard from '../excitationComponent/excitationCard'
import { GetDeatilFn } from './getDataDetailFn/getDataDetailFn'

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 }
}
interface StepRef {
  save: () => []
  delete: () => void
  validate: () => boolean
  clearInteraction: () => void
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
type UncertaintyType = number[]

type FilterType = Record<string, any>[]

interface ChildRef {
  step1Ref: React.MutableRefObject<StepRef | null>
  step2Ref: React.MutableRefObject<StepRef | null>
  step3Ref: React.MutableRefObject<StepRef | null>
}

const ChartComponents = () => {
  return (
    <div>
      <span>发送阶段</span>
      <span style={{ color: 'red' }}>*</span>
    </div>
  )
}

const Fuzzing = (props: any) => {
  const { type, isFixForm, stepArray, changePre2, excitationList, current } = props
  const [cardArray, setCardArray] = React.useState([0])
  const addCard = React.useCallback(() => {
    const pre = cardArray
    pre.push(cardArray.length)
    setCardArray([...pre])
  }, [cardArray])

  const deleteCard = React.useCallback((index: number) => {
    console.log(index)
  }, [])

  const onChange = React.useCallback(
    (val: any, index: number) => {
      changePre2(val, index)
    },
    [changePre2]
  )
  React.useEffect(() => {
    if (stepArray.length > 1) {
      setCardArray(Array.from({ length: stepArray.length }, (v, i) => i))
    }
    return () => {
      setCardArray([0])
    }
  }, [current, stepArray])
  return (
    <div className={styles.baseBody}>
      <div className={styles.baseForm}>
        <div className={styles.formOperation}>
          {cardArray?.map((value: number, index: number) => {
            return (
              <ExcitationCard
                type={type}
                deleteCard={deleteCard}
                idArray={stepArray[index]}
                excitationList={excitationList}
                isFixForm={isFixForm}
                onChange={onChange}
                key={index}
                index={index}
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
      </div>
    </div>
  )
}

const GroupExcitationForm: React.FC = () => {
  const { isFixForm, info, type, name, propsDatas } = useContext(GlobalContexted)
  const { Step } = Steps
  const history = useHistory()
  const [form] = useForm()
  const [current, setCurrent] = useState(0)
  const detailData = GetDeatilFn(info?.id ?? propsDatas?.sender_id)
  const [excitationList, setExcitationList] = useState<Option[]>()
  const [stepArray, setStepArray] = useState<number[][]>([[], [], []])

  // 过滤已经被使用的数据
  const filterUseData = (val: FilterType) => {
    const res = val.filter(item => {
      return item.disabled === false
    })
    return res
  }

  // 过滤数组元素中的unfinend

  const filterUnfinedItem = (val: number[][]) => {
    const mapArray = val.map(item => {
      return item.filter(value => value !== undefined)
    })
    return mapArray
  }

  const getExcitationList = async (request1: Resparams, doubleRequest: Resparams) => {
    try {
      const result2 = await excitationListFn(doubleRequest)
      const result1 = await excitationListFn(request1)
      const pre = [
        {
          sender_id: '0',
          name: '激励单元管理',
          disabled: false,
          children: [{}]
        },
        {
          sender_id: '1',
          name: '激励嵌套管理',
          disabled: false,
          children: [{}]
        }
      ]
      Promise.all([result1, result2])
        .then(value => {
          const result1Data = filterUseData(value[0].data?.results as FilterType)
          const result2Data = filterUseData(value[1].data?.results as FilterType)
          if (isFixForm) {
            const data = [
              { ...pre[1], disabled: isFixForm, children: result2Data },
              { ...pre[0], disabled: isFixForm, children: result1Data }
            ]
            setExcitationList(data)
          } else {
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
              const data = [{ ...pre[0], children: result2Data }]
              setExcitationList(data)
            } else {
              return []
            }
          }

          return value
        })
        .catch(error => {
          throwErrorMessage(error)
        })
    } catch (error) {
      throwErrorMessage(error, { 1004: '请求资源未找到' })
    }
  }

  React.useEffect(() => {
    getExcitationList(request, request1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  // 删除数据
  const clearArrayItem = React.useCallback((val: number[][] | undefined[][], current, index: number) => {
    const oldItemArray = [...val]
    const clearItemArray = oldItemArray[current]
    const clearItem = clearItemArray[index]
    clearItemArray[index] = undefined
    return clearItem as number
  }, [])

  // 在各个阶段选择数据时,更新stepArray
  const changePre = React.useCallback(
    (val: number, index: number) => {
      const oldStepArray = stepArray
      if (val === undefined) {
        const res = clearArrayItem(oldStepArray, current, index)
        updateDisabled(res, false)
        return res
      }
      if (oldStepArray[current][index] !== val) {
        updateDisabled(oldStepArray[current][index], false)
        oldStepArray[current][index] = val
        setStepArray([...oldStepArray])
        updateDisabled(val, true)
        return oldStepArray
      }
    },
    [clearArrayItem, current, stepArray, updateDisabled]
  )

  const steps = [
    {
      title: '准备阶段',
      content: (
        <Fuzzing
          stepArray={stepArray[0]}
          excitationList={excitationList}
          type={type}
          info={info}
          current={current}
          isFixForm={isFixForm}
          Data={detailData}
          changePre2={changePre}
        />
      )
    },
    {
      title: <ChartComponents />,
      content: (
        <Fuzzing
          stepArray={stepArray[1]}
          excitationList={excitationList}
          type={type}
          info={info}
          current={current}
          isFixForm={isFixForm}
          Data={detailData}
          changePre2={changePre}
        />
      )
    },
    {
      title: '销毁阶段',
      content: (
        <Fuzzing
          stepArray={stepArray[2]}
          excitationList={excitationList}
          type={type}
          info={info}
          current={current}
          isFixForm={isFixForm}
          Data={detailData}
          changePre2={changePre}
        />
      )
    }
  ]

  // 判断是不是查看详情
  const isLookDetailAdd = React.useCallback(() => {
    setCurrent(current + 1)
  }, [current])

  const isLookDetailDecrease = React.useCallback(() => {
    setCurrent(current - 1)
  }, [current])

  const checkCurrent = React.useCallback(() => {
    if (current === 1) {
      if (stepArray[current].filter(value => value !== undefined).length >= 1) {
        setCurrent(current + 1)
      } else {
        message.error('请配置激励')
      }
    } else {
      setCurrent(current + 1)
    }
  }, [stepArray, current])

  const next = async () => {
    if (isFixForm) {
      isLookDetailAdd()
    } else {
      checkCurrent()
    }
  }

  const prev = async () => {
    isLookDetailDecrease()
  }

  const viewDraw = async () => {
    let values
    try {
      values = await form.validateFields()
    } catch {
      message.error('请填写交互名称')
    }
    try {
      if (values) {
        const params2 = {
          child_id_list: filterUnfinedItem(stepArray)
        }
        const result = await checkDataStructure(params2)
        if (result.data) {
          const params1 = {
            name: values.name,
            desc: values.description,
            group_data_list: result.data
          }
          history.push({
            pathname: '/excitationList/createGroupExcitation/ExcitationDraw',
            state: { Data: params1, child_id_list: params2, type, isFixForm, name }
          })
        }
      }
    } catch (error) {
      throwErrorMessage(error, { 1009: '项目删除失败' })
    }
  }

  const isFixFormDrawView = () => {
    history.push({
      pathname: '/excitationList/Deatail/ExcitationDraw',
      state: { Data: detailData || propsDatas, type, isFixForm, name }
    })
  }

  const isBack = (propsDatas: any) => {
    const resultArray = [[], [], []]
    propsDatas.group_data_list.forEach((element: any, index: number) => {
      const res = element.group_data_list
        ? element.group_data_list.map((item: any) => {
            return item.sender_id
          })
        : []
      resultArray[index] = res
      setStepArray([...resultArray])
      return res
    })
  }

  // 初始化数据 stepCurrent 数组
  const idMap = React.useCallback((propsDatas, isFixForm) => {
    if (propsDatas) {
      return isFixForm ? setStepArray([...propsDatas.group_id_list]) : isBack(propsDatas)
    }
  }, [])

  const initData = React.useCallback(
    (value: any, isFixForm: boolean) => {
      const { name, desc } = value as any
      const formData = {
        name,
        description: desc
      }
      form.setFieldsValue(formData)
      idMap(value, isFixForm)
    },
    [form, idMap]
  )
  React.useEffect(() => {
    if (detailData || propsDatas) {
      initData(detailData || propsDatas, isFixForm)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailData, propsDatas, isFixForm])
  return (
    <div className={styles.baseBody}>
      <div className={styles.baseForm}>
        <Form name='basic' className={styles.twoForm} {...layout} autoComplete='off' form={form} size='large'>
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
                    return Promise.reject(new Error('请输入交互名称'))
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
                  return Promise.reject(new Error('交互名称由汉字、数字、字母和下划线组成'))
                }
              }
            ]}
          >
            <Input disabled={isFixForm} placeholder='请输入交互名称' />
          </Form.Item>

          <Form.Item
            label='交互描述'
            name='description'
            rules={[{ message: '请输入交互描述!' }, { type: 'string', max: 50, message: '字数不能超过50个 ' }]}
          >
            <Input.TextArea
              disabled={isFixForm}
              placeholder={isFixForm ? '' : '请输入交互描述'}
              autoSize={{ minRows: 4, maxRows: 5 }}
              showCount={{
                formatter({ count }) {
                  return `${count}/50`
                }
              }}
            />
          </Form.Item>
        </Form>
        <div className={styles.stepHeader}>
          <div className={styles.stepHeader_concent}>
            <Steps current={current}>
              {steps.map(item => (
                <Step key={generateUUID()} title={item.title} />
              ))}
            </Steps>
            <StepTip />
          </div>
        </div>
        <div style={{ width: '100% ' }}>{steps[current].content}</div>
        <div className={styles.excitaion_footer}>
          <div className={styles.excitaion_footer_footerConcent}>
            {current > 0 && (
              <CommonButton
                buttonStyle={styles.stepButton}
                name='上一步'
                type='default'
                onClick={() => {
                  prev()
                }}
              />
            )}
            {current < steps.length - 1 && (
              <CommonButton
                buttonStyle={styles.active_button}
                name='下一步'
                type='default'
                onClick={() => {
                  next()
                }}
              />
            )}
            {current === steps.length - 1 && (
              <CommonButton buttonStyle={styles.active_button} name='预览' type='default' onClick={isFixForm ? isFixFormDrawView : viewDraw} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default GroupExcitationForm
