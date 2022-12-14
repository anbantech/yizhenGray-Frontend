import React, { useRef, useState } from 'react'
import { Cascader, Form, Input, Select } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { StepRef } from 'Src/view/Project/task/createTask/newCreateTask'
import { PlusOutlined } from '@ant-design/icons'
import styles from '../excitation.less'

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
}

interface propsType {
  type: string
  formData: any
  isFixForm: boolean
  excitationList: any
  index: number
  onChange: (value: any, index: number) => void
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
const TwoExcitationCard = React.forwardRef((props: AllPropsType) => {
  const [form] = useForm()
  const { excitationList, onChange, index, isFixForm, formData } = props
  const [desc, setDesc] = useState('')
  const onValuesChange = (changedValues: any) => {
    const formData = changedValues
    if (formData.port) {
      onChange(formData.port, index)
    }
  }
  const onSelect = (val: string) => {
    excitationList.find((item: any) => {
      if (item.id === val) {
        setDesc(item.desc)
      }
      return ''
    })
  }
  React.useEffect(() => {
    if (formData && isFixForm) {
      const excitarionListes = formData[index]
      form.setFieldsValue({ port: excitarionListes.id, description: excitarionListes.desc })
    } else {
      form.setFieldsValue({ description: desc })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [desc, formData, form, index])

  const { Option } = Select

  return (
    <div className={styles.card_middle}>
      <Form name='middle' autoComplete='off' className={styles.card_middle_form} onValuesChange={onValuesChange} form={form}>
        <Form.Item name='port' label='??????' rules={[{ required: true, message: '???????????????????????????' }]}>
          <Select placeholder='?????????????????????' onSelect={onSelect} disabled={isFixForm}>
            {
              /**
               * ??????????????????????????????????????????????????????????????????
               */
              excitationList?.map((rate: any) => {
                return (
                  <Option key={rate.id} value={rate.id}>
                    {rate.name}
                  </Option>
                )
              })
            }
          </Select>
        </Form.Item>
        <Form.Item
          label='??????'
          name='description'
          rules={[{ message: '?????????????????????!' }, { type: 'string', max: 50, message: '??????????????????50??? ' }]}
        >
          <Input.TextArea disabled style={{ width: '222px' }} placeholder='????????????' autoSize={{ minRows: 2, maxRows: 3 }} />
        </Form.Item>
      </Form>
    </div>
  )
})
TwoExcitationCard.displayName = 'TwoExcitationCard'
const TwoExcitationCardCompoent = React.memo(TwoExcitationCard)

const ThreeExcitationCard = React.forwardRef((props: AllPropsType) => {
  const [form] = useForm()
  const { excitationList, onChange, index, isFixForm, formData } = props
  const [desc, setDesc] = useState('')
  const onValuesChange = (changedValues: any) => {
    const formData = changedValues
    if (formData.port) {
      onChange(formData.port[1], index)
    }
  }
  const onSelect = (value: any) => {
    excitationList.forEach((item: any) => {
      item.children.find((pre: any) => {
        if (+value[1] === pre.id) {
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
    if (formData && isFixForm) {
      const excitarionListes = formData[index]
      form.setFieldsValue({
        port: [excitarionListes.group_type === 0 ? '?????????' : '????????????', excitarionListes.name],
        description: excitarionListes.desc
      })

      // if (excitarionList.group_type === 1) {
      //   form.setFieldsValue({ port: excitarionList.id, description: excitarionList.desc })
      // }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [desc, formData, form, isFixForm, index])

  return (
    <div className={styles.card_middle}>
      <Form name='middle' autoComplete='off' className={styles.card_middle_form} onValuesChange={onValuesChange} form={form}>
        <Form.Item name='port' label='??????' rules={[{ required: true, message: '???????????????????????????' }]}>
          <Cascader disabled={isFixForm} fieldNames={{ label: 'name', value: 'id' }} options={excitationList} onChange={onSelect} />
        </Form.Item>
        <Form.Item
          label='??????'
          name='description'
          rules={[{ message: '?????????????????????!' }, { type: 'string', max: 50, message: '??????????????????50??? ' }]}
        >
          <Input.TextArea disabled style={{ width: '222px' }} placeholder='????????????' autoSize={{ minRows: 2, maxRows: 3 }} />
        </Form.Item>
      </Form>
    </div>
  )
})
ThreeExcitationCard.displayName = 'ThreeExcitationCard'
const ThreeExcitationCardCompoent = React.memo(ThreeExcitationCard)

const FiveExcitationCard: React.FC<PropsTypeFn> = (props: PropsTypeFn) => {
  const { onClick, type } = props
  return (
    <div role='time' onClick={onClick} className={styles.card_middle}>
      <div className={styles.card_concent}>
        <PlusOutlined style={{ fontSize: '18px' }} />
        {type === 'two' ? <span>???????????????Group </span> : <span>???????????????Group/??????Group</span>}
      </div>
    </div>
  )
}
FiveExcitationCard.displayName = 'FiveExcitationCard'
const FiveExcitationCardCompoent = React.memo(FiveExcitationCard)

const ExcitationCardMemo: React.FC<propsType> = (props: propsType) => {
  const { index, excitationList, onChange, formData, isFixForm, type } = props
  const [showCard, setShowCard] = useState(false)
  const childRef: ChildRef = {
    oneForm: useRef<StepRef | null>(null),
    twoForm: useRef<StepRef | null>(null),
    threeForm: useRef<StepRef | null>(null),
    fourForm: useRef<StepRef | null>(null)
  }

  return (
    <div className={styles.card_main}>
      {!showCard && !isFixForm ? (
        <FiveExcitationCardCompoent
          type={type}
          onClick={() => {
            setShowCard(true)
          }}
        />
      ) : type === 'two' ? (
        <TwoExcitationCardCompoent
          formData={formData}
          excitationList={excitationList}
          index={index}
          isFixForm={isFixForm}
          ref={childRef.twoForm}
          onChange={onChange}
        />
      ) : (
        <ThreeExcitationCardCompoent
          formData={formData}
          excitationList={excitationList}
          index={index}
          isFixForm={isFixForm}
          ref={childRef.twoForm}
          onChange={onChange}
        />
      )}
    </div>
  )
}
const ExcitationCard = React.memo(ExcitationCardMemo)
export default ExcitationCard
