import React, { useCallback, useEffect, useState } from 'react'
import 'antd/dist/antd.css'
import { Modal, Input, Form, Button, message, Radio } from 'antd'
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
      const data = await createTaskInstance(params)
      return data
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
        if (res.data) {
          setCrashObj({})
          choiceModal()
          message.success('实例新建成功')
        }
      }
    } catch (error) {
      setDisabledStatus(true)
      throwErrorMessage(error, { 1005: '新建失败' })
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
    const bol = allValues.work_time
    if (bol) {
      setDisabledStatus(false)
    } else {
      setDisabledStatus(true)
    }
  }

  const handleCancel = (e: any, value: string) => {
    e.stopPropagation()
    const obj = carshObj
    if (obj[value] === e.target.value) {
      obj[value] = undefined
    } else {
      obj[value] = e.target.value
    }
    setCrashObj({ ...obj })
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
  }, [data, form])

  return (
    <Modal
      className={styles.formModal}
      width={width}
      visible={visibility}
      title={isDetail ? '停止条件' : '新建实例'}
      onCancel={() => {
        choiceModal()
      }}
      footer={[
        <Button
          key='back'
          className={styles.btn_cancelCrashTable}
          onClick={() => {
            form.resetFields()
            choiceModal()
          }}
        >
          取消
        </Button>,
        <Button
          className={styles.btn_createCrashTable}
          style={{ marginRight: '18px' }}
          key='submit'
          disabled={isDisableStatus}
          type='primary'
          onClick={() => formVali()}
        >
          新建
        </Button>
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
              <span> Crash </span>
              <span> Warn </span>
            </div>
          </div>
          <div className={styles.tableFooterList}>
            {Object.keys(CrashInfoMap).map((value: string) => {
              return (
                <div className={styles.tableFooter} key={value}>
                  <div className={styles.crashTable_headerLeft}>{CrashInfoMap[+value]}</div>
                  <Radio.Group style={{ width: '30%' }} value={carshObj[value]} disabled={Boolean(isDetail)}>
                    <Radio
                      value='1'
                      onClick={e => {
                        handleCancel(e, value)
                      }}
                      className={styles.leftCheckbox}
                      style={{ lineHeight: '39px', width: '56px' }}
                    />
                    <Radio
                      value='0'
                      onClick={e => {
                        handleCancel(e, value)
                      }}
                      style={{ lineHeight: '39px', width: '52px', margin: '0 auto' }}
                    />
                  </Radio.Group>
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
