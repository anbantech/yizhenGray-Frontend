import React, { useEffect, useState } from 'react'
import 'antd/dist/antd.css'
import { Modal, Input, Form, Button, message, Radio, RadioChangeEvent } from 'antd'
import { throwErrorMessage } from 'Src/util/message'
import { updateProject, createProject } from 'Src/services/api/projectApi'
import { CrashInfoMap } from 'Src/util/DataMap/dataMap'
import styles from '../BaseModle.less'

interface FormInstance {
  name: string
  desc: string
}

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 50 }
}

interface NEWTaskInstanceType {
  visibility: boolean
  task_id: number
  project_id: number
  choiceModal: () => void
  width: string
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

type CrashObjType = Record<string, string>

function NewTaskInstance(props: NEWTaskInstanceType) {
  const { visibility, task_id, project_id, choiceModal, width } = props
  const [form] = Form.useForm<FormInstance>()
  const [isDisableStatus, setDisabledStatus] = useState(true)
  const [carshObj, setCrashObj] = useState<CrashObjType>({})
  // 创建列表
  const createProjectItem = async (params: any) => {
    try {
      const data = await createProject(params)
      message.success('项目创建成功')
      return data
    } catch (error) {
      throwErrorMessage(error, { 1005: '项目名称重复，请修改' })
      return error
    }
  }
  // 校验表单 且 完成列表刷新  关闭表单
  const validateForm = async () => {
    try {
      const value = await form.validateFields()
      const { name, desc } = value
      if (name) {
        // if (fixTitle) {
        //   const res = await updateProject({ name: name.trim(), desc: desc ? desc.trim() : '' }, id)
        //   message.success('项目修改成功')
        //   return res
        // }
        // if (!fixTitle) {
        //   const res = await createProjectItem({ name: name.trim(), desc: desc ? desc.trim() : '' })
        //   return res
        // }
      }
    } catch (error) {
      setDisabledStatus(true)
      throwErrorMessage(error, { 1005: '项目名称重复，请修改' })
      return error
    }
  }
  const formVali = () => {
    setDisabledStatus(true)
    validateForm()
      .then(res => {
        if (res.code !== 1005) {
          //   hideModal(false)
          form.resetFields()
        }
        return res
      })
      .catch(error => {
        return error
      })
  }

  const onValuesChange = (changedValues: any, allValues: any) => {
    const bol = allValues.desc === undefined || allValues.desc?.length <= 50
    if (allValues.name?.length >= 2 && allValues.name.length <= 20 && /^[\w\u4E00-\u9FA5]+$/.test(allValues.name) && bol) {
      setDisabledStatus(false)
    } else {
      setDisabledStatus(true)
    }
  }

  const onChange = (e: RadioChangeEvent, value: string) => {
    const newCrashObj = carshObj
    newCrashObj[value] = e.target.value
    setCrashObj({ ...newCrashObj })
  }
  useEffect(() => {
    return () => {
      setCrashObj({})
    }
  }, [])
  return (
    <Modal
      className={styles.formModal}
      width={width}
      visible={visibility}
      title='新建实例'
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
        <Button className={styles.btn_createCrashTable} key='submit' disabled={isDisableStatus} type='primary' onClick={() => formVali()}>
          创建
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
          <Input placeholder='请输入运行时长' suffix='小时' />
        </Form.Item>
        <Form.Item label='Crash数量' name='crash_num' help='填写crash数量后，任务运行中只要运行时长或crash数量达到'>
          <Input placeholder='请输入Crash数量' />
        </Form.Item>
      </Form>
      <div className={styles.CrashTableBody}>
        <span style={{ paddingLeft: '17px' }}>Crash类型:</span>
        <div className={styles.crashTable}>
          <div className={styles.crashTable_header}>
            <span className={styles.crashTable_headerLeft}> 错误类型 </span>
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
                  <Radio.Group
                    style={{ width: '30%' }}
                    onChange={(e: RadioChangeEvent) => {
                      onChange(e, value)
                    }}
                  >
                    <Radio value='1' className={styles.leftCheckbox} style={{ lineHeight: '39px', width: '56px' }} />
                    <Radio value='0' style={{ lineHeight: '39px', width: '52px', margin: '0 auto' }} />
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
