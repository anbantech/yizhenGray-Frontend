import { Form, Input, message, Select } from 'antd'
import * as React from 'react'
import NewInputNumberSuffixModal from 'Src/components/inputNumbersuffix/newExcitationModal'
import { getPortList } from 'Src/services/api/excitationApi'
import { ArgeementDropListStore } from '../../ExcitaionStore/ExcitaionStore'
import styles from './agreementCompoents.less'

const GuCntInput: React.FC<any> = (props: any) => {
  const { value, onChange } = props
  const setValue = ArgeementDropListStore(state => state.setValue)
  const gu_cnt0 = ArgeementDropListStore(state => state.gu_cnt0)
  const triggerChange = (changedValue: any) => {
    onChange?.(changedValue)
  }

  const onNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = Number.parseInt(e.target.value || '0', 10)
    if (Number.isNaN(newNumber)) {
      return
    }
    setValue('gu_cnt0', newNumber)
    triggerChange(newNumber)
  }
  const onMax = () => {
    const newValue = gu_cnt0 > 20 ? 20 : gu_cnt0
    const val = newValue === 0
    if (val) {
      setValue('gu_cnt0', 1)
      triggerChange(1)
    } else {
      setValue('gu_cnt0', newValue)
      triggerChange(newValue)
    }
  }

  return (
    <span>
      <Input
        type='text'
        onBlur={onMax}
        value={value || gu_cnt0}
        onChange={onNumberChange}
        style={{ width: 232 }}
        suffix={<NewInputNumberSuffixModal type='gu_cnt0' />}
      />
    </span>
  )
}

const GuW0Input: React.FC<any> = (props: any) => {
  const { detaileStatus, value, onChange } = props
  const setValue = ArgeementDropListStore(state => state.setValue)
  const gu_w0 = ArgeementDropListStore(state => state.gu_w0)
  const triggerChange = React.useCallback(
    (changedValue: any) => {
      onChange?.(changedValue)
    },
    [onChange]
  )
  const onNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = Number.parseInt(e.target.value || '0', 10)
    if (Number.isNaN(newNumber)) {
      return
    }
    setValue('gu_w0', newNumber)
    triggerChange(newNumber)
  }
  const onMax = React.useCallback(() => {
    const newValue = gu_w0 > 100 ? 100 : gu_w0
    setValue('gu_w0', newValue)
    triggerChange(newValue)
  }, [gu_w0, setValue, triggerChange])
  return (
    <span>
      <Input
        type='text'
        onBlur={onMax}
        value={value || gu_w0}
        onChange={onNumberChange}
        disabled={detaileStatus}
        style={{ width: 232 }}
        suffix={<NewInputNumberSuffixModal type='gu_w0' />}
      />
    </span>
  )
}

const HeadForm = React.forwardRef((props, myRef) => {
  const [form] = Form.useForm<any>()
  const { Option } = Select

  const [portList, setPortList] = React.useState<string[]>([])
  const { gu_cnt0, gu_w0, name, peripheral } = ArgeementDropListStore()
  const initialValues = {
    gu_cnt0: 1,
    gu_w0: 1
  }
  // 端口列表
  const fetchPortList = React.useCallback(async () => {
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

  const validateForm = React.useCallback(async () => {
    const value = await form.validateFields()
    return value
  }, [form])

  React.useImperativeHandle(myRef, () => ({
    save: () => {
      return form.getFieldsValue()
    },
    delete: () => {},
    validate: () => {
      return validateForm()
    },
    clearInteraction: () => {}
  }))

  React.useEffect(() => {
    fetchPortList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    if (name) {
      form.setFieldsValue({ name, gu_cnt0, gu_w0, peripheral })
    }
  }, [name, form, gu_cnt0, gu_w0, peripheral])

  const checkGuCnt = (_: any, value: any) => {
    if (value >= 1) {
      return Promise.resolve()
    }
  }
  const checkGuW0 = (_: any, value: any) => {
    if (value >= 0) {
      return Promise.resolve()
    }
    return Promise.reject(new Error('请填写发送间隔'))
  }
  return (
    <>
      <Form form={form} name='horizontal_login' autoComplete='off' layout='inline' className={styles.headerForm} initialValues={initialValues}>
        <Form.Item
          name='name'
          label='名称'
          className={styles.nameSty}
          validateFirst
          validateTrigger={['onBlur']}
          rules={[
            { required: true, message: '请输入激励名称' },
            { type: 'string', min: 2, max: 20, message: '激励名称长度为2到20个字符' },
            {
              validateTrigger: 'onBlur',
              validator(_, value) {
                const reg = /^[\w\u4E00-\u9FA5]+$/
                if (reg.test(value)) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('激励名称名称由汉字、数字、字母和下划线组成'))
              }
            }
          ]}
        >
          <Input placeholder='请输入激励名称' className={styles.commonItem} />
        </Form.Item>
        <Form.Item name='gu_cnt0' label='发送次数' rules={[{ required: true, validator: checkGuCnt }]}>
          <GuCntInput />
        </Form.Item>
        <Form.Item name='peripheral' label='外设' rules={[{ required: true, message: '请选择外设' }]}>
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

        <Form.Item name='gu_w0' label='发送间隔' rules={[{ required: true, validator: checkGuW0 }]}>
          <GuW0Input />
        </Form.Item>
      </Form>
    </>
  )
})

HeadForm.displayName = 'HeadForm'
const HeaderFormRef = React.memo(HeadForm)

export default HeaderFormRef
