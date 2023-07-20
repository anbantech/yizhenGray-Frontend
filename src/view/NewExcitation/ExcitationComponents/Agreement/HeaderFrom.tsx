import { Form, Input, InputNumber, message, Select } from 'antd'
import * as React from 'react'
import { getPortList } from 'Src/services/api/excitationApi'
import styles from './agreementCompoents.less'

function HeaderForm() {
  const [form] = Form.useForm()
  const { Option } = Select
  const [valueCount, setValueCount] = React.useState(20)
  const [valueTime, setValueTime] = React.useState(200)
  const [portList, setPortList] = React.useState<string[]>([])
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

  const onchangeTime = (e: any) => {
    console.log(e.target.value)
    if (e.target.value > 4) {
      setValueTime(3)
    } else {
      setValueTime(0)
    }
  }
  return (
    <Form form={form} name='horizontal_login' layout='inline' className={styles.headerForm}>
      <Form.Item name='name' label='名称' rules={[{ required: true, message: 'Please input your username!' }]}>
        <Input placeholder='请输入激励名称' className={styles.commonItem} />
      </Form.Item>
      <Form.Item name='gu_cnt0' label='发送次数' rules={[{ required: true, message: 'Please input your password!' }]} initialValue={valueCount}>
        <Input placeholder='Username' className={styles.commonItems} />
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
      <Form.Item name='gu_cnt1' label='发送间隔' rules={[{ required: true, message: 'Please input your password!' }]} initialValue={valueTime}>
        <Input placeholder='Username' value={valueTime} className={styles.commonItems} onChange={onchangeTime} />
      </Form.Item>
    </Form>
  )
}

export default HeaderForm
