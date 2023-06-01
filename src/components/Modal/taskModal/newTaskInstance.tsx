import React, { useCallback, useEffect, useState } from 'react'
import 'antd/dist/antd.css'
import { Button, Checkbox, Form, Input, message, Modal } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { throwErrorMessage } from 'Src/util/message'
import { InfoTip } from 'Src/view/excitation/excitationComponent/Tip'
import { createTaskInstance } from 'Src/services/api/taskApi'
import { CrashInfoMap } from 'Src/util/DataMap/dataMap'
import styles from '../BaseModle.less'

interface FormInstance {
  work_time: number
  crash_num: number
}

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 50 }
}

interface NEWTaskInstanceType {
  visibility: boolean
  task_id: number
  choiceModal: () => void
  width: string
  // eslint-disable-next-line react/require-default-props
  data?: any
  isDetail: number
}

type Currency = 'rmb' | 'dollar'

interface PriceValue {
  number?: number
  currency?: Currency
}

interface PriceInputProps {
  value?: PriceValue
  onChange?: (value: PriceValue) => void
}

type SetObjDataProps = {
  [key: string]: any
}

type CrashObjType = Record<string, string>

function NewTaskInstance(props: NEWTaskInstanceType) {
  const { visibility, task_id, choiceModal, width, isDetail, data } = props
  const [form] = Form.useForm<FormInstance>()
  const [isDisableStatus, setDisabledStatus] = useState(true)
  const [indeterminate, setIndeterminate] = useState(false)
  const [checkAll, setCheckAll] = useState(false)
  const [indeterminateCrash, setIndeterminateCrash] = useState(false)
  const [checkAllCrash, setCheckAllCrash] = useState(false)
  const [carshObj, setCrashObj] = useState<CrashObjType | Record<string, unknown>>({})

  const filterData = (value: CrashObjType | Record<string, unknown>) => {
    const oldVal = value
    Object.keys(oldVal).forEach(item => {
      if (oldVal[item] === undefined) {
        delete oldVal[item]
      }
    })
    return oldVal
  }
  // 新建列表
  const createInstaceItem = async (params: any) => {
    try {
      return await createTaskInstance(params)
    } catch (error) {
      throwErrorMessage(error, { 1005: '实例新建失败' })
      return error
    }
  }

  // 校验表单 且 完成列表刷新  关闭表单
  const validateForm = useCallback(async () => {
    try {
      const value = await form.validateFields()
      const { work_time, crash_num } = value
      const copyItem = {
        task_id,
        work_time,
        crash_num,
        crash_config: filterData(carshObj)
      }
      if (work_time) {
        const res = await createInstaceItem(copyItem)
        if (res.code === 0) {
          setCrashObj({})
          choiceModal()
          message.success('实例新建成功')
        }
      }
    } catch (error) {
      setCrashObj({})
      setCheckAll(false)
      setCheckAllCrash(false)
      setDisabledStatus(true)
      message.error('新建实例失败')
      return error
    }
  }, [carshObj, choiceModal, form, task_id])

  const formVali = () => {
    setDisabledStatus(true)
    validateForm()
      .then(res => {
        if (res.code !== 1005) {
          form.resetFields()
        }
        return res
      })
      .catch(error => {
        return error
      })
  }

  const onValuesChange = (changedValues: any, allValues: any) => {
    const { work_time } = allValues
    if (work_time >= 1 && work_time <= 48) {
      setDisabledStatus(false)
    } else {
      setDisabledStatus(true)
    }
  }

  const handleCancel = (e: any, value: string) => {
    e.stopPropagation()
    const obj = carshObj
    if (obj[value] === e.target.value) {
      delete obj[value]
    } else {
      obj[value] = e.target.value
    }
    const ObjArray = Object.values(obj)
    const isEqual = ObjArray.every((val, i, arr) => val === arr[0])
    const isEqual1 = ObjArray.some(val => val === '1')
    const isEqual2 = ObjArray.some(val => val === '0')
    setCheckAllCrash(isEqual && ObjArray[0] === '1' && Object.keys(obj).length === Object.keys(CrashInfoMap).length)
    setCheckAll(isEqual && ObjArray[0] === '0' && Object.keys(obj).length === Object.keys(CrashInfoMap).length)
    setIndeterminateCrash(isEqual1)
    setIndeterminate(isEqual2)
    setCrashObj({ ...obj })
  }

  const setKindOfType = (type: string, isChecked: boolean) => {
    const objData: Record<string, string> = {}
    Object.keys(CrashInfoMap).forEach((item: string) => {
      if (type === 'Crash') {
        objData[item] = '1'
      } else {
        objData[item] = '0'
      }
    })
    setCrashObj(isChecked ? { ...objData } : {})
  }

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setKindOfType('Warn', e.target.checked)
    setIndeterminate(false)
    if (e.target.checked) {
      setCheckAllCrash(false)
      setIndeterminateCrash(false)
    }
    setCheckAll(e.target.checked)
  }

  const onCheckAllChangeCrash = (e: CheckboxChangeEvent) => {
    setKindOfType('Crash', e.target.checked)
    setIndeterminateCrash(false)
    if (e.target.checked) {
      setCheckAll(false)
      setIndeterminate(false)
    }
    setCheckAllCrash(e.target.checked)
  }

  useEffect(() => {
    if (data) {
      const { work_time, crash_num, crash_config } = data
      // cause backend will auto add prefix for queue name
      // thus remove prefix of queue name when editing
      const formData = { work_time, crash_num }
      form.setFieldsValue(formData)
      setCrashObj({ ...crash_config })
    }
    return () => {
      if (!visibility) {
        form.resetFields()
        setCheckAll(false)
        setCheckAllCrash(false)
      }
    }
  }, [data, form, visibility])

  return (
    <Modal
      className={styles.formNewInstanceModal}
      width={width}
      visible={visibility}
      title={isDetail ? '停止条件' : '新建实例'}
      onCancel={() => {
        choiceModal()
      }}
      footer={[
        <>
          {!isDetail ? (
            <div>
              {' '}
              <Button
                key='back'
                className={styles.btn_cancelCrashTable}
                onClick={() => {
                  form.resetFields()
                  choiceModal()
                }}
              >
                取消
              </Button>
              <Button
                className={styles.btn_createCrashTable}
                style={{ marginRight: '10px' }}
                key='submit'
                disabled={isDisableStatus}
                type='primary'
                onClick={() => formVali()}
              >
                新建
              </Button>
            </div>
          ) : (
            <div>
              {' '}
              <Button
                key='back'
                className={styles.btn_cancelCrashTable}
                onClick={() => {
                  form.resetFields()
                  choiceModal()
                }}
              >
                返回
              </Button>
            </div>
          )}
        </>
      ]}
    >
      <Form form={form} className={styles.taskCrashForm} autoComplete='off' {...layout} onValuesChange={onValuesChange}>
        <Form.Item
          label='运行时长'
          name='work_time'
          validateFirst
          validateTrigger={['onBlur']}
          rules={[
            {
              required: true,
              validateTrigger: 'onBlur',
              validator(_, value) {
                const reg = /^\d+$/
                if (reg.test(value)) {
                  if (value >= 1 && value <= 48) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('请输入 1-48 之间的整数'))
                }
                return Promise.reject(new Error('请输入 1-48 之间的整数'))
              }
            }
          ]}
        >
          <Input disabled={Boolean(isDetail)} placeholder='请输入运行时长' suffix='小时' />
        </Form.Item>
        <Form.Item
          label='Crash数量'
          name='crash_num'
          rules={[
            {
              validator(_, value) {
                if (!value) {
                  return Promise.resolve()
                }
                const reg = /^\d+$/
                if (reg.test(value)) {
                  if (value >= 1 && value <= 100) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('请输入 1-100 之间的整数'))
                }
                return Promise.reject(new Error('请输入 1-100 之间的整数'))
              }
            }
          ]}
        >
          <Input disabled={Boolean(isDetail)} placeholder='请输入Crash数量' suffix={<InfoTip />} />
        </Form.Item>
      </Form>
      <div className={styles.CrashTableBody}>
        <span style={{ paddingLeft: '25px' }}> 缺陷类型 :</span>
        <div className={styles.crashTable}>
          <div className={styles.crashTable_header}>
            <span className={styles.crashTable_headerLeft}> 缺陷类型 </span>
            <div className={styles.crashTable_headerRight}>
              <div className={styles.Checkbox1}>
                <Checkbox indeterminate={indeterminateCrash} disabled={Boolean(isDetail)} onChange={onCheckAllChangeCrash} checked={checkAllCrash}>
                  Crash
                </Checkbox>
              </div>
              <div className={styles.Checkbox2}>
                <Checkbox indeterminate={indeterminate} disabled={Boolean(isDetail)} onChange={onCheckAllChange} checked={checkAll}>
                  Warn
                </Checkbox>
              </div>
            </div>
          </div>
          <div className={styles.tableFooterList}>
            {Object.keys(CrashInfoMap).map((value: string) => {
              return (
                <div className={styles.tableFooter} key={value}>
                  <div className={styles.crashTable_headerLeft}>{CrashInfoMap[+value]}</div>
                  <Checkbox.Group style={{ width: '42%' }} value={carshObj[value] as string[]} disabled={Boolean(isDetail)}>
                    <Checkbox
                      value='1'
                      onClick={e => {
                        handleCancel(e, value)
                      }}
                      className={styles.leftCheckbox}
                      style={{ lineHeight: '39px', width: '75px', paddingLeft: '4px' }}
                    />
                    <Checkbox
                      value='0'
                      onClick={e => {
                        handleCancel(e, value)
                      }}
                      style={{ lineHeight: '39px', marginLeft: '8px' }}
                    />
                  </Checkbox.Group>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default NewTaskInstance
