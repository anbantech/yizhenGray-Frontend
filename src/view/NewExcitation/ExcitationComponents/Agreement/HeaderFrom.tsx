import { Form, Input, InputNumber, message, Select } from 'antd'
import * as React from 'react'
import { getPortList } from 'Src/services/api/excitationApi'
import styles from './agreementCompoents.less'

const { Option } = Select

type Currency = 'rmb'
interface PriceValue {
  count?: number
}

interface PriceInputProps {
  value?: PriceValue
  onChange?: (value: PriceValue) => void
}

const CountInput: React.FC<PriceInputProps> = ({ value = {}, onChange }) => {
  const [number, setNumber] = React.useState(0)
  const triggerChange = (changedValue: { count?: number }) => {
    onChange?.({ ...changedValue })
  }

  const onNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = Number.parseInt(e.target.value || '0', 10)
    if (Number.isNaN(number)) {
      return
    }
    if (!('number' in value)) {
      setNumber(newNumber)
    }
    triggerChange({ count: newNumber })
  }

  return (
    <span>
      <Input type='text' value={value.count || number} onChange={onNumberChange} style={{ width: 100 }} className={styles.commonItems} />
    </span>
  )
}

const TimeInput: React.FC<PriceInputProps> = ({ value = {}, onChange }) => {
  const [number, setNumber] = React.useState(0)
  const triggerChange = (changedValue: { count?: number }) => {
    onChange?.({ ...changedValue })
  }

  const onNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = Number.parseInt(e.target.value || '0', 10)
    if (Number.isNaN(number)) {
      return
    }
    if (!('number' in value)) {
      setNumber(newNumber)
    }
    triggerChange({ count: newNumber })
  }

  return (
    <span>
      <Input type='text' value={value.count || number} onChange={onNumberChange} style={{ width: 100 }} className={styles.commonItems} />
    </span>
  )
}

interface PriceValue {
  count?: number
}

interface PriceInputProps {
  value?: PriceValue
  onChange?: (value: PriceValue) => void
}

function HeaderForm() {
  const [form] = Form.useForm()
  const { Option } = Select
  const [valueCount, setValueCount] = React.useState(20)
  const [valueTime, setValueTime] = React.useState(200)
  const [portList, setPortList] = React.useState<string[]>([])

  const checkPrice = (_: any, value: { count: number }) => {
    if (value.count > 0) {
      return Promise.resolve()
    }
  }
  // 端口列表
  const fetchPortList = React.useCallback(async () => {
    //  Todo code码
    try {
      const result = await getPortList()
      if (result.data) {
        const results = result.data

        setPortList(results)
      }
      return result
    } catch (error) {
      message.error(error.message)
    }
  }, [])
  React.useEffect(() => {
    fetchPortList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onchangeTime = async () => {
    const res = await form.getFieldsValue()
    // console.log(res)
  }
  return (
    <>
      <Form
        form={form}
        name='horizontal_login'
        layout='inline'
        className={styles.headerForm}
        initialValues={{
          gu_cent0: {
            count: 20
          },
          gu_w0: {
            count: 100
          }
        }}
      >
        <Form.Item name='name' label='名称' rules={[{ required: true, message: 'Please input your username!' }]}>
          <Input placeholder='请输入激励名称' className={styles.commonItem} />
        </Form.Item>
        <Form.Item name='gu_cent0' label='发送次数' rules={[{ validator: checkPrice }]}>
          <TimeInput />
        </Form.Item>
        <Form.Item name='username' label='外设' rules={[{ required: true, message: 'Please input your username!' }]}>
          <Select placeholder='请选择外设' className={styles.commonItem}>
            {
              /**
               * 下拉选择端口
               */
              portList?.map(rate => {
                return (
                  <Option key={rate} value={rate}>
                    {rate}
                  </Option>
                )
              })
            }
          </Select>
        </Form.Item>

        <Form.Item name='gu_w0' label='发送间隔' rules={[{ validator: checkPrice }]}>
          <CountInput />
        </Form.Item>
      </Form>
      <div onClick={onchangeTime} role='time'>
        12312
      </div>
    </>
  )
}

export default HeaderForm
