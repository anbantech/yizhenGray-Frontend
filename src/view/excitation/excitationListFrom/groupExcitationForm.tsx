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

const SetUp = React.forwardRef((props: any, myRef) => {
  const { type, isFixForm, idArray, changePre1, excitationList } = props
  const [cardArray, setCardArray] = React.useState(idArray.length === 0 ? [0] : Array.from({ length: idArray.length }, (v, i) => i))
  const [STATUS, setStatus] = useState(false)
  const addCard = React.useCallback(() => {
    const pre = cardArray
    pre.push(cardArray.length)
    setCardArray([...pre])
  }, [cardArray])

  const deleteCard = React.useCallback(
    (index: number) => {
      const cradArrayCopy = cardArray
      cradArrayCopy.splice(index, 1)
      setCardArray([...cradArrayCopy])
      changePre1(undefined, index)
      setStatus(!STATUS)
    },
    [STATUS, cardArray, changePre1]
  )

  const onChange = React.useCallback(
    (val: any, index: number) => {
      changePre1(val, index)
      setStatus(!STATUS)
    },
    [STATUS, changePre1]
  )

  React.useImperativeHandle(myRef, () => ({
    save: () => {},
    delete: () => {},
    validate: () => {},
    clearInteraction: () => {}
  }))
  return (
    <div className={styles.baseBody}>
      <div className={styles.baseForm}>
        <div className={styles.formOperation}>
          {cardArray?.map((value: number, index: number) => {
            return (
              <ExcitationCard
                deleteCard={deleteCard}
                type={type}
                idArray={idArray && idArray[index]}
                excitationList={excitationList}
                isFixForm={isFixForm}
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
      </div>
    </div>
  )
})

SetUp.displayName = 'SetUp'
const Fuzzing = React.forwardRef((props: any, myRef) => {
  const { type, isFixForm, idArray, changePre2, excitationList } = props
  const [cardArray, setCardArray] = React.useState(idArray.length === 0 ? [0] : Array.from({ length: idArray.length }, (v, i) => i))
  const [STATUS, setStatus] = useState(false)
  const addCard = React.useCallback(() => {
    const pre = cardArray
    pre.push(cardArray.length)
    setCardArray([...pre])
  }, [cardArray])

  const deleteCard = React.useCallback(
    (index: number) => {
      const cradArrayCopy = cardArray
      cradArrayCopy.splice(index, 1)
      setCardArray([...cradArrayCopy])
      changePre2(undefined, index)
      setStatus(!STATUS)
    },
    [STATUS, cardArray, changePre2]
  )

  const onChange = React.useCallback(
    (val: any, index: number) => {
      changePre2(val, index)
      setStatus(!STATUS)
    },
    [STATUS, changePre2]
  )

  React.useImperativeHandle(myRef, () => ({
    save: () => {},
    delete: () => {},
    validate: () => {},
    clearInteraction: () => {}
  }))
  return (
    <div className={styles.baseBody}>
      <div className={styles.baseForm}>
        <div className={styles.formOperation}>
          {cardArray?.map((value: number, index: number) => {
            return (
              <ExcitationCard
                deleteCard={deleteCard}
                type={type}
                idArray={idArray && idArray[index]}
                excitationList={excitationList}
                isFixForm={isFixForm}
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
      </div>
    </div>
  )
})
Fuzzing.displayName = 'Fuzzing'
const TearDown = React.forwardRef((props: any, myRef) => {
  const { type, isFixForm, idArray, excitationList, changePre3 } = props
  const [cardArray, setCardArray] = React.useState(idArray.length === 0 ? [0] : Array.from({ length: idArray.length }, (v, i) => i))
  const [STATUS, setStatus] = useState(false)
  const addCard = React.useCallback(() => {
    const pre = cardArray
    pre.push(cardArray.length)
    setCardArray([...pre])
  }, [cardArray])

  const deleteCard = React.useCallback(
    (index: number) => {
      const cradArrayCopy = cardArray
      cradArrayCopy.splice(index, 1)
      setCardArray([...cradArrayCopy])
      changePre3(undefined, index)
      setStatus(!STATUS)
    },
    [STATUS, cardArray, changePre3]
  )

  const onChange = React.useCallback(
    (val: any, index: number) => {
      changePre3(val, index)
      setStatus(!STATUS)
    },
    [STATUS, changePre3]
  )

  React.useImperativeHandle(myRef, () => ({
    save: async () => {},
    delete: () => {},
    validate: () => {},
    clearInteraction: () => {}
  }))

  return (
    <div className={styles.baseBody}>
      <div className={styles.baseForm}>
        <div className={styles.formOperation}>
          {cardArray?.map((index: number) => {
            return (
              <ExcitationCard
                deleteCard={deleteCard}
                type={type}
                idArray={idArray && idArray[index]}
                excitationList={excitationList}
                isFixForm={isFixForm}
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
      </div>
    </div>
  )
})
TearDown.displayName = 'TearDown'

const GroupExcitationForm: React.FC = () => {
  const { isFixForm, info, type, name, propsDatas } = useContext(GlobalContexted)
  const { Step } = Steps
  const history = useHistory()
  const [form] = useForm()
  const [current, setCurrent] = useState(0)
  const detailData = GetDeatilFn(info?.id ?? propsDatas?.sender_id)
  const [excitationList, setExcitationList] = useState<Option[]>()
  const stepCurrentRef = React.useRef<number[][]>([[], [], []])
  const childRef: ChildRef = {
    step1Ref: React.useRef<StepRef | null>(null),
    step2Ref: React.useRef<StepRef | null>(null),
    step3Ref: React.useRef<StepRef | null>(null)
  }
  const getExcitationList = async (request1: Resparams, doubleRequest: Resparams) => {
    try {
      const result2 = await excitationListFn(doubleRequest)
      const result1 = await excitationListFn(request1)
      const pre = [
        {
          sender_id: '0',
          name: '单激励Group',
          disabled: false,
          children: [{}]
        },
        {
          sender_id: '1',
          name: '级联Group',
          disabled: false,
          children: [{}]
        }
      ]
      Promise.all([result1, result2])
        .then(value => {
          const result1Data = value[0].data?.results
          const result2Data = value[1].data?.results
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
      const excitationListCopy = excitationList
      excitationListCopy?.forEach((item: any) => {
        item.children.forEach((element: any) => {
          if (value === element.sender_id) {
            const pre = element
            pre.disabled = bol
          }
        })
      })
    },
    [excitationList]
  )

  // 初始化数据 stepCurrent 数组
  const idMap = React.useCallback(
    propsDatas => {
      if (propsDatas) {
        stepCurrentRef.current.map((value: number[], index: number) => {
          if (Object.keys(propsDatas.group_data_list[index]).length > 0) {
            propsDatas.group_data_list[index]?.group_data_list.forEach((item: any) => {
              stepCurrentRef.current[index].push(item.sender_id)
              updateDisabled(item.sender_id, true)
            })
          }
          return value
        })
      }
    },
    [updateDisabled]
  )

  // 删除数据

  const deleteData = React.useCallback(
    (index: number) => {
      const arrayId = stepCurrentRef.current[current]
      const delArray = arrayId.splice(index, 1)
      stepCurrentRef.current[current] = arrayId
      return delArray
    },
    [current]
  )
  // 更改数据参数
  const changePre = React.useCallback(
    (val: number, index: number) => {
      if (val === undefined) {
        const delArray = deleteData(index)
        updateDisabled(delArray[0], false)
      } else {
        if (stepCurrentRef.current[current][index]) {
          const delArray = deleteData(index)
          updateDisabled(delArray[0], false)
          stepCurrentRef.current[current].push(val)
        } else {
          stepCurrentRef.current[current].push(val)
        }
        updateDisabled(val, true)
      }
    },
    [current, deleteData, updateDisabled]
  )

  const steps = [
    {
      title: '准备阶段',
      content: (
        <SetUp
          ref={childRef.step1Ref}
          excitationList={excitationList}
          type={type}
          info={info}
          isFixForm={isFixForm}
          idArray={stepCurrentRef.current[0]}
          Data={detailData}
          changePre1={changePre}
        />
      )
    },
    {
      title: <ChartComponents />,
      content: (
        <Fuzzing
          ref={childRef.step2Ref}
          idArray={stepCurrentRef.current[1]}
          excitationList={excitationList}
          type={type}
          info={info}
          isFixForm={isFixForm}
          Data={detailData}
          changePre2={changePre}
        />
      )
    },
    {
      title: '销毁阶段',
      content: (
        <TearDown
          ref={childRef.step3Ref}
          idArray={stepCurrentRef.current[2]}
          excitationList={excitationList}
          type={type}
          info={info}
          isFixForm={isFixForm}
          Data={detailData}
          changePre3={changePre}
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
      if (stepCurrentRef.current[1].length >= 1) {
        setCurrent(current + 1)
      } else {
        message.error('请配置激励')
      }
    } else {
      setCurrent(current + 1)
    }
  }, [current])

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
          child_id_list: stepCurrentRef.current
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

  const initData = React.useCallback(
    (value: any) => {
      const { name, desc } = value as any
      const formData = {
        name,
        description: desc
      }
      form.setFieldsValue(formData)
      idMap(value)
    },
    [form, idMap]
  )

  React.useEffect(() => {
    if (detailData || propsDatas) {
      initData(detailData || propsDatas)
    }
    return () => {
      stepCurrentRef.current = [[], [], []]
    }
  }, [detailData, initData, propsDatas])
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
