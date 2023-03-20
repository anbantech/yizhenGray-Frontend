import React, { useState } from 'react'
import { Cascader, Form, Input, Select } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { StepRef } from 'Src/view/Project/task/createTask/newCreateTask'
// import { PlusOutlined } from '@ant-design/icons'
import styles from '../excitation.less'

import { GetDeatilFn } from '../excitationListFrom/getDataDetailFn/getDataDetailFn'

interface PropsTypeFn {
  type: string
  onClick: () => void
}

interface AllPropsType {
  excitationList: any
  isFixForm: boolean
  formData: any
  onChange: (value: any, index: number) => void
  index: number
  deleteCard: (index: number) => void
}

interface propsType {
  type: string
  isFixForm: boolean
  excitationList: any
  index: number
  // eslint-disable-next-line react/require-default-props
  idArray?: number
  // eslint-disable-next-line react/require-default-props
  formData?: any
  onChange: (value: any, index: number) => void
  deleteCard: (index: number) => void
}

interface ChildRef {
  oneForm: React.MutableRefObject<StepRef | null>
  twoForm: React.MutableRefObject<StepRef | null>
  threeForm: React.MutableRefObject<StepRef | null>
  fourForm: React.MutableRefObject<StepRef | null>
}

interface Option {
  value: string
  label: string
  disabled?: boolean
  children?: Option[]
}
const TwoExcitationCard = (props: AllPropsType) => {
  const [form] = useForm()
  const { excitationList, onChange, index, deleteCard, isFixForm, formData } = props
  const [desc, setDesc] = useState('')
  const onValuesChange = (changedValues: any) => {
    const formData = changedValues
    if (formData.port) {
      onChange(formData.port, index)
    }
  }
  const onSelect = (val: string) => {
    excitationList.find((item: any) => {
      if (item.sender_id === val) {
        setDesc(item.desc)
      }
      return ''
    })
  }
  React.useEffect(() => {
    if (formData && isFixForm) {
      const excitarionListes = formData[index]
      form.setFieldsValue({ port: excitarionListes.sender_id, description: excitarionListes.desc })
    } else {
      form.setFieldsValue({ description: desc })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [desc, formData, form, index])

  const { Option } = Select

  return (
    <div className={styles.card_middle} key={index}>
      <div
        role='time'
        onClick={() => {
          deleteCard(index)
        }}
        style={{ display: 'none' }}
      >
        删除
      </div>
      <Form name='middle' autoComplete='off' className={styles.card_middle_form} onValuesChange={onValuesChange} form={form}>
        <Form.Item name='port' label='名称' rules={[{ required: true, message: '请选择配置项' }]}>
          <Select placeholder='请选择配置项' allowClear onSelect={onSelect} disabled={isFixForm}>
            {
              /**
               * 根据连接方式列表渲染下拉框可选择的设备比特率
               */
              excitationList?.map((rate: any) => {
                return (
                  <Option key={rate.sender_id} disabled={rate.disabled} value={rate.sender_id}>
                    {rate.name}
                  </Option>
                )
              })
            }
          </Select>
        </Form.Item>
        <Form.Item label='描述' name='description' rules={[{ message: '请输入描述!' }, { type: 'string', max: 50, message: '字数不能超过50个 ' }]}>
          <Input.TextArea disabled style={{ width: '222px' }} placeholder={isFixForm ? '' : '描述'} autoSize={{ minRows: 2, maxRows: 3 }} />
        </Form.Item>
      </Form>
    </div>
  )
}
TwoExcitationCard.displayName = 'TwoExcitationCard'
const TwoExcitationCardCompoent = React.memo(TwoExcitationCard)

const ThreeExcitationCard = (props: AllPropsType) => {
  const [form] = useForm()
  const { excitationList, deleteCard, onChange, index, isFixForm, formData } = props
  const [desc, setDesc] = useState('')
  const onValuesChange = async (changedValues: any) => {
    const formData = changedValues
    if (formData.port) {
      onChange(formData.port[1], index)
    }
  }
  const onSelect = (value: any) => {
    if (value === undefined) {
      onChange(undefined, index)
      form.setFieldsValue({ description: '' })
      setDesc('')
      return
    }
    excitationList.forEach((item: any) => {
      item.children.find((pre: any) => {
        if (+value[1] === pre.sender_id) {
          setDesc(pre.desc)
        }
        return ''
      })
    })
  }
  React.useEffect(() => {
    if (desc) {
      form.setFieldsValue({ description: desc })
    }
    if (formData) {
      const excitarionListes = formData[index] || formData
      form.setFieldsValue({
        port: [excitarionListes.target_type === 1 ? '单激励Group' : '级联Group', excitarionListes.name],
        description: excitarionListes.desc
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [desc, formData, form, isFixForm, index, excitationList])

  return (
    <div className={styles.card_middle}>
      <div
        role='time'
        onClick={() => {
          deleteCard(index)
        }}
        style={{ display: 'none' }}
      >
        删除
      </div>
      <Form name='middle' autoComplete='off' className={styles.card_middle_form} onValuesChange={onValuesChange} form={form}>
        <Form.Item name='port' label='名称' rules={[{ required: true, message: '请选择激励' }]}>
          <Cascader
            disabled={isFixForm}
            placeholder='选择配置'
            fieldNames={{ label: 'name', value: 'sender_id' }}
            options={excitationList}
            onChange={onSelect}
          />
        </Form.Item>
        <Form.Item label='描述' name='description' rules={[{ message: '请输入描述!' }, { type: 'string', max: 50, message: '字数不能超过50个 ' }]}>
          <Input.TextArea disabled style={{ width: '222px' }} placeholder={isFixForm ? '' : '描述'} autoSize={{ minRows: 2, maxRows: 3 }} />
        </Form.Item>
      </Form>
    </div>
  )
}
ThreeExcitationCard.displayName = 'ThreeExcitationCard'
const ThreeExcitationCardCompoent = React.memo(ThreeExcitationCard)

const ExcitationCardMemo: React.FC<propsType> = (props: propsType) => {
  const { index, excitationList, deleteCard, idArray, formData, onChange, isFixForm, type } = props
  const Data = GetDeatilFn(idArray)
  return (
    <div className={styles.card_main}>
      {type === 'five' ? (
        <TwoExcitationCardCompoent
          deleteCard={deleteCard}
          formData={Data}
          excitationList={excitationList}
          index={index}
          isFixForm={isFixForm}
          onChange={onChange}
        />
      ) : (
        <ThreeExcitationCardCompoent
          deleteCard={deleteCard}
          formData={Data || formData}
          excitationList={excitationList}
          index={index}
          isFixForm={isFixForm}
          onChange={onChange}
        />
      )}
    </div>
  )
}
const ExcitationCard = React.memo(ExcitationCardMemo)
export default ExcitationCard
