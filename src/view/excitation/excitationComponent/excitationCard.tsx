import React, { useRef, useState } from 'react'
import { Form, Input, Select } from 'antd'
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
  onChange: (value: any, type: string, index: number) => void
  index: number
}

interface propsType {
  type: string
  formData: any
  isFixForm: boolean
  excitationList: any
  index: number
  onChange: (value: any, type: string, index: number) => void
}

interface ChildRef {
  oneForm: React.MutableRefObject<StepRef | null>
  twoForm: React.MutableRefObject<StepRef | null>
  threeForm: React.MutableRefObject<StepRef | null>
  fourForm: React.MutableRefObject<StepRef | null>
}

const TwoExcitationCard = React.forwardRef((props: AllPropsType) => {
  const [form] = useForm()
  const { excitationList, onChange, index, isFixForm, formData } = props
  const [desc, setDesc] = useState('')
  const onValuesChange = (changedValues: any) => {
    const formData = changedValues
    if (formData.port) {
      onChange(formData, 'excitarionList', index)
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
    if (isFixForm && formData) {
      const { excitarionList } = formData
      if (excitarionList) {
        form.setFieldsValue({ port: excitarionList[index]?.id, description: excitarionList[index]?.desc })
      }
    } else {
      form.setFieldsValue({ description: desc })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [desc, formData, form, index])

  const { Option } = Select

  return (
    <div className={styles.card_middle}>
      <Form name='middle' autoComplete='off' className={styles.card_middle_form} onValuesChange={onValuesChange} form={form}>
        <Form.Item name='port' label='名称' rules={[{ required: true, message: '请选择选择端口类别' }]}>
          <Select placeholder='请选择端口类别' onSelect={onSelect} disabled={isFixForm}>
            {
              /**
               * 根据连接方式列表渲染下拉框可选择的设备比特率
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
          label='描述'
          name='description'
          rules={[{ message: '请输入任务描述!' }, { type: 'string', max: 50, message: '字数不能超过50个 ' }]}
        >
          <Input.TextArea disabled style={{ width: '222px' }} placeholder='任务描述' autoSize={{ minRows: 2, maxRows: 3 }} />
        </Form.Item>
      </Form>
    </div>
  )
})
TwoExcitationCard.displayName = 'TwoExcitationCard'
const TwoExcitationCardCompoent = React.memo(TwoExcitationCard)

const FiveExcitationCard: React.FC<PropsTypeFn> = (props: PropsTypeFn) => {
  const { onClick, type } = props
  return (
    <div role='time' onClick={onClick} className={styles.card_middle}>
      <div className={styles.card_concent}>
        <PlusOutlined style={{ fontSize: '18px' }} />
        {type === 'two' ? <span>选择单激励Group / 选择已有的创建关系 </span> : <span>选择单激励Group/级联Group</span>}
      </div>
    </div>
  )
}

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
        <FiveExcitationCard
          type={type}
          onClick={() => {
            setShowCard(true)
          }}
        />
      ) : (
        <TwoExcitationCardCompoent
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
