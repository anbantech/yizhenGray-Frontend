import { Form, Input, message, Select } from 'antd'
import * as React from 'react'
import NewInputNumberSuffixModal from 'Src/components/inputNumbersuffix/newExcitationModal'
import { getPortList } from 'Src/services/api/excitationApi'
import { ArgeementDropListStore } from '../../ExcitaionStore/ExcitaionStore'
import styles from './agreementCompoents.less'

const HeadForm = React.forwardRef((props: { detaileStatus: boolean }, myRef) => {
  const { detaileStatus } = props
  const [form] = Form.useForm<any>()
  const { Option } = Select
  const [portList, setPortList] = React.useState<string[]>([])
  const { gu_cnt0, gu_w0, setValue, name, peripheral } = ArgeementDropListStore()
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
  const onChangeGu_time = (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = Number.parseInt(e.target.value || '0', 10)
    if (Number.isNaN(newNumber)) {
      return
    }
    setValue(type, newNumber)
  }

  const onMax = React.useCallback(
    (type: string) => {
      if (type === 'gu_cnt0') {
        const newValue = Number(gu_cnt0) > 20 ? 20 : gu_cnt0
        setValue(type, newValue)
      }
      if (type === 'gu_w0') {
        const newValue = Number(gu_w0) > 100 ? 100 : gu_w0
        setValue(type, newValue)
      }
    },
    [gu_cnt0, gu_w0, setValue]
  )

  React.useEffect(() => {
    form.setFieldsValue({ gu_w0, gu_cnt0 })
  }, [gu_w0, gu_cnt0, form])

  return (
    <>
      <Form form={form} name='horizontal_login' layout='inline' className={styles.headerForm}>
        <Form.Item
          name='name'
          label='名称'
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
          <Input placeholder='请输入激励名称' className={styles.commonItem} disabled={detaileStatus} />
        </Form.Item>
        <Form.Item name='gu_cnt0' label='发送次数' rules={[{ required: true }]}>
          <Input
            disabled={detaileStatus}
            className={styles.commonItems}
            onBlur={() => {
              onMax('gu_cnt0')
            }}
            onChange={e => {
              onChangeGu_time('gu_cnt0', e)
            }}
            suffix={<NewInputNumberSuffixModal type='gu_cnt0' />}
          />
        </Form.Item>
        <Form.Item name='peripheral' label='外设' rules={[{ required: true, message: '请选择外设' }]}>
          <Select placeholder='请选择外设' className={styles.commonItem} disabled={detaileStatus}>
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

        <Form.Item name='gu_w0' label='发送间隔' rules={[{ required: true }]}>
          <Input
            disabled={detaileStatus}
            className={styles.commonItems}
            onChange={e => {
              onChangeGu_time('gu_w0', e)
            }}
            onBlur={() => {
              onMax('gu_w0')
            }}
            suffix={<NewInputNumberSuffixModal type='gu_w0' />}
          />
        </Form.Item>
      </Form>
    </>
  )
})

HeadForm.displayName = 'HeadForm'
const HeaderFormRef = React.memo(HeadForm)

export default HeaderFormRef
