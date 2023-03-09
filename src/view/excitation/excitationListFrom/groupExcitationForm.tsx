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
  target_type: '0',
  key_word: '',
  status: null,
  page: 1,
  page_size: 999,
  sort_field: 'create_time',
  sort_order: 'descend'
}
const request1 = {
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
type UncertaintyType = number[]
interface ChildRef {
  step1Ref: React.MutableRefObject<StepRef | null>
  step2Ref: React.MutableRefObject<StepRef | null>
  step3Ref: React.MutableRefObject<StepRef | null>
}
const SetUp = React.forwardRef((props: any, myRef) => {
  const { type, Data, isFixForm, idArray, changePre, excitationList } = props
  const [cardArray, setCardArray] = React.useState(1)
  const [flag, setFlag] = useState(false)
  const [data, setData] = useState<number[]>([])
  const addCard = React.useCallback(() => {
    setCardArray(pre => pre + 1)
    setFlag(true)
  }, [])

  const ExcitationCardList = React.useMemo(() => {
    if (flag) {
      const data = Array.from({ length: cardArray }, (v, i) => i)
      return data
    }
    if (idArray && idArray?.length !== 0) {
      const data = Array.from({ length: idArray.length }, (v, i) => i)
      return data
    }

    return [0]
  }, [cardArray, flag, idArray])

  const onChange = React.useCallback(
    (val: any, index: number) => {
      if (val === undefined) {
        changePre(index)
        return
      }
      setData((pre: number[] | any) => {
        const preCopy = pre
        preCopy[index] = val
        return [...preCopy]
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const viewDraw = async () => {
    if (data.length === 0) return []
    return data
  }
  React.useEffect(() => {
    if (Data) {
      setCardArray(Data?.group_data_list[0]?.group_data_list?.length)
    }
  }, [Data])
  React.useImperativeHandle(myRef, () => ({
    save: () => {
      return viewDraw()
    },
    delete: () => {},
    validate: () => {},
    clearInteraction: () => {}
  }))
  return (
    <div className={styles.baseBody}>
      <div className={styles.baseForm}>
        <div className={styles.formOperation}>
          {ExcitationCardList?.map((value: number, index: number) => {
            return (
              <ExcitationCard
                type={type}
                idArray={idArray && idArray[index]}
                excitationList={excitationList}
                isFixForm={isFixForm}
                onChange={onChange}
                formData={Data && Data?.group_data_list[0].group_data_list}
                index={index}
                key={generateUUID()}
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
      </div>
    </div>
  )
})
const Fuzzing = React.forwardRef((props: any, myRef) => {
  const { type, Data, isFixForm, idArray, changePre, excitationList } = props
  const [flag, setFlag] = useState(false)
  const [data, setData] = useState<number[]>([])
  const [cardArray, setCardArray] = React.useState(1)
  const addCard = React.useCallback(() => {
    setCardArray(pre => pre + 1)
    setFlag(true)
  }, [])

  const ExcitationCardList = React.useMemo(() => {
    if (flag) {
      const data = Array.from({ length: cardArray }, (v, i) => i)
      return data
    }
    if (idArray && idArray?.length !== 0) {
      const data = Array.from({ length: idArray.length }, (v, i) => i)
      return data
    }
    return [0]
  }, [cardArray, flag, idArray])

  const onChange = React.useCallback(
    (val: any, index: number) => {
      if (val === undefined) {
        changePre(index)
        return
      }
      setData((pre: number[] | any) => {
        const preCopy = pre
        preCopy[index] = val
        return [...preCopy]
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const viewDraw = () => {
    if (data.length === 0) return []
    return data
  }

  const checkData = React.useCallback(() => {
    if (data.length >= 1 || (Data && Data?.group_data_list[1].group_data_list.length >= 1)) {
      return true
    }
    return false
  }, [Data, data.length])
  React.useEffect(() => {
    if (Data) {
      setCardArray(Data?.group_data_list[1].group_data_list.length)
    }
  }, [Data])

  React.useImperativeHandle(myRef, () => ({
    save: () => {
      return viewDraw()
    },
    delete: () => {},
    validate: () => {
      return checkData()
    },
    clearInteraction: () => {}
  }))
  return (
    <div className={styles.baseBody}>
      <div className={styles.baseForm}>
        <div className={styles.formOperation}>
          {ExcitationCardList?.map((value: number, index: number) => {
            return (
              <ExcitationCard
                type={type}
                idArray={idArray && idArray[index]}
                excitationList={excitationList}
                isFixForm={isFixForm}
                onChange={onChange}
                formData={Data && Data?.group_data_list[1].group_data_list}
                index={index}
                key={generateUUID()}
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
      </div>
    </div>
  )
})

const TearDown = React.forwardRef((props: any, myRef) => {
  const { type, Data, isFixForm, idArray, excitationList, changePre } = props
  const [cardArray, setCardArray] = React.useState(1)
  const [flag, setFlag] = useState(false)
  const [data, setData] = useState<number[]>([])
  const addCard = React.useCallback(() => {
    setCardArray(pre => pre + 1)
    setFlag(true)
  }, [])

  const ExcitationCardList = React.useMemo(() => {
    if (flag) {
      const data = Array.from({ length: cardArray }, (v, i) => i)
      return data
    }
    if (idArray && idArray?.length !== 0) {
      const data = Array.from({ length: idArray.length }, (v, i) => i)
      return data
    }

    return [0]
  }, [cardArray, flag, idArray])

  const onChange = React.useCallback(
    (val: any, index: number) => {
      if (val === undefined) {
        changePre(index)
      }
      setData((pre: number[] | any) => {
        const preCopy = pre
        preCopy[index] = val
        return [...preCopy]
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  //  预览功能
  const viewDraw = () => {
    return data
  }

  React.useImperativeHandle(myRef, () => ({
    save: async () => {
      return viewDraw()
    },
    delete: () => {},
    validate: () => {},
    clearInteraction: () => {}
  }))

  return (
    <div className={styles.baseBody}>
      <div className={styles.baseForm}>
        <div className={styles.formOperation}>
          {ExcitationCardList?.map((index: number) => {
            return (
              <ExcitationCard
                type={type}
                idArray={idArray && idArray[index]}
                excitationList={excitationList}
                isFixForm={isFixForm}
                onChange={onChange}
                formData={Data && Data?.group_data_list[2]?.group_data_list}
                index={index}
                key={generateUUID()}
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
      </div>
    </div>
  )
})

const GroupExcitationForm: React.FC = () => {
  const { isFixForm, info, type, name, propsDatas } = useContext(GlobalContexted)
  const { Step } = Steps
  const history = useHistory()
  const [form] = useForm()
  const [current, setCurrent] = useState(0)
  const detailData = GetDeatilFn(info?.id ?? propsDatas?.sender_id)
  const [excitationList, setExcitationList] = useState<Option[]>([
    {
      sender_id: '0',
      name: '单激励Group',
      disabled: false,
      children: []
    },
    {
      sender_id: '1',
      name: '级联Group',
      disabled: false,
      children: []
    }
  ])
  const stepCurrentRef = React.useRef<number[][]>([[], [], []])
  const childRef: ChildRef = {
    step1Ref: React.useRef<StepRef | null>(null),
    step2Ref: React.useRef<StepRef | null>(null),
    step3Ref: React.useRef<StepRef | null>(null)
  }

  const idMap = React.useCallback(propsDatas => {
    if (propsDatas) {
      stepCurrentRef.current.map((value: number[], index: number) => {
        if (Object.keys(propsDatas.group_data_list[index]).length > 0) {
          propsDatas.group_data_list[index]?.group_data_list.forEach((item: any) => {
            if (stepCurrentRef.current[index].length === 0) {
              stepCurrentRef.current[index] = [item.sender_id]
            } else {
              stepCurrentRef.current[index].forEach((val: number) => {
                if (val !== item.sender_id) {
                  stepCurrentRef.current[index].push(item.sender_id)
                }
              })
            }
          })
        }
        return value
      })
    }
  }, [])
  const getExcitationList = async (request1: Resparams, doubleRequest: Resparams) => {
    try {
      const result2 = await excitationListFn(doubleRequest)
      const result1 = await excitationListFn(request1)
      Promise.all([result1, result2])
        .then(value => {
          const result1Data = value[0].data?.results
          const result2Data = value[1].data?.results
          setExcitationList(pre => {
            const preCopy = pre
            if (isFixForm) {
              return [
                { ...preCopy[1], disabled: isFixForm, children: result2Data },
                { ...preCopy[0], disabled: isFixForm, children: result1Data }
              ]
            }
            return [
              { ...preCopy[1], children: result2Data },
              { ...preCopy[0], children: result1Data }
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
  React.useEffect(() => {
    getExcitationList(request, request1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const changePre = React.useCallback(
    (index: number) => {
      const idArray = stepCurrentRef.current[current][index]
      excitationList.map((item: any) => {
        return item.children.forEach((val: any) => {
          if (idArray === val.sender_id) {
            const valRest = val
            valRest.disabled = false
          }
        })
      })
      const arrayId = stepCurrentRef.current[current]
      arrayId.splice(index, 1)
      stepCurrentRef.current[current] = arrayId
    },
    [current, excitationList]
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
          changePre={changePre}
        />
      )
    },
    {
      title: '发送阶段',
      content: (
        <Fuzzing
          ref={childRef.step2Ref}
          idArray={stepCurrentRef.current[1]}
          excitationList={excitationList}
          type={type}
          info={info}
          isFixForm={isFixForm}
          Data={detailData}
          changePre={changePre}
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
          changePre={changePre}
        />
      )
    }
  ]
  const checkIdUseStatus = () => {
    const idArray = stepCurrentRef.current[current]
    excitationList.map((item: any) => {
      return item.children.forEach((val: any) => {
        idArray.map((_i: any) => {
          if (_i === val.sender_id) {
            const valRest = val
            valRest.disabled = true
          }
          return _i
        })
      })
    })
  }
  const next = async () => {
    if (current === 1) {
      if (stepCurrentRef.current[1].length >= 1 || childRef.step2Ref.current?.validate() || isFixForm) {
        const res2 = await childRef.step2Ref.current?.save()
        if (res2 && res2.length >= 1 && res2.length <= 3) {
          stepCurrentRef.current[1] = res2
        }
        setCurrent(current + 1)
        checkIdUseStatus()
      } else {
        message.error('请配置激励数据')
      }
    }

    switch (current) {
      case 0: {
        const res1 = await childRef.step1Ref.current?.save()
        if (res1 && res1.length >= 1 && res1.length <= 3) {
          stepCurrentRef.current[0] = res1
        }
        checkIdUseStatus()
        setCurrent(current + 1)
        break
      }
      case 2: {
        const res3 = await childRef.step3Ref.current?.save()
        if (res3 && res3.length >= 1 && res3.length <= 3) {
          stepCurrentRef.current[2] = res3
        }
        checkIdUseStatus()
        break
      }
      default:
        return null
    }
  }

  const prev = async () => {
    if (current === 1) {
      const res2 = await childRef.step2Ref.current?.save()
      if (res2 && res2.length >= 1 && res2.length <= 3) {
        stepCurrentRef.current[1] = res2
      }
      checkIdUseStatus()
      setCurrent(current - 1)
    }

    switch (current) {
      case 0: {
        const res1 = await childRef.step1Ref.current?.save()
        if (res1 && res1.length >= 1 && res1.length <= 3) {
          stepCurrentRef.current[0] = res1
        }
        checkIdUseStatus()
        setCurrent(current - 1)
        break
      }
      case 2: {
        const res3 = await childRef.step3Ref.current?.save()
        if (res3 && res3.length >= 1 && res3.length <= 3) {
          stepCurrentRef.current[2] = res3
        }
        checkIdUseStatus()
        setCurrent(current - 1)
        break
      }
      default:
        return null
    }
  }

  const viewDraw = async () => {
    if (current === steps.length - 1) {
      const res3 = await childRef.step3Ref.current?.save()
      if (res3 && res3.length >= 1 && res3.length <= 3) {
        stepCurrentRef.current[2] = res3
      }
    }
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
            state: { Data: params1, type, isFixForm, name }
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
              placeholder='请输入交互描述'
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
                <Step key={item.title} title={item.title} />
              ))}
            </Steps>
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
