import { Form, FormInstance, Input, Steps } from 'antd'
import React, { useState } from 'react'
import StyleSheet from './stepBaseConfig.less'

const layout = {
  wrapperCol: { span: 22 }
}
const OneSteps = () => {
  const { TextArea } = Input
  const [form] = Form.useForm<FormInstance>()
  const onValuesChange = (changedValues: any, allValues: any) => {
    const bol = allValues.desc === undefined || allValues.desc?.length <= 50
    if (allValues.name?.length >= 2 && allValues.name.length <= 20 && /^[\w\u4E00-\u9FA5]+$/.test(allValues.name) && bol) {
    } else {
    }
  }
  return (
    <>
      <Form form={form} autoComplete='off' {...layout} className={StyleSheet.oneStepform} onValuesChange={onValuesChange}>
        <Form.Item
          name='name'
          validateFirst
          label='名称'
          validateTrigger={['onBlur']}
          rules={[
            { required: true, message: '请输入项目名称' },
            { type: 'string', min: 2, max: 20, message: '项目名称长度为2到20个字符' },
            {
              validateTrigger: 'onBlur',
              validator(_, value) {
                const reg = /^[\w\u4E00-\u9FA5]+$/
                if (reg.test(value)) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('项目名称由汉字、数字、字母和下划线组成'))
              }
            }
          ]}
        >
          <Input placeholder='请输入项目名称' />
        </Form.Item>
        <Form.Item name='desc' label='描述' rules={[{ type: 'string', max: 50, message: '字数不能超过50个' }]}>
          <TextArea
            placeholder='请添加针对项目的相关描述'
            autoSize={{ minRows: 4, maxRows: 5 }}
            showCount={{
              formatter({ count }) {
                return `${count}/50`
              }
            }}
          />
        </Form.Item>
      </Form>
    </>
  )
}
const TwoSteps = () => {
  return <div>222</div>
}
const ThreeSteps = () => {
  return <div>2222</div>
}

function StepComponentsMemo() {
  const [current, setCurrent] = useState(0)
  const { Step } = Steps
  const steps = [
    {
      title: '设置名称',
      content: <OneSteps />
    },
    {
      title: '选择目标激励',
      content: <TwoSteps />
    },
    {
      title: '编辑发送列表',
      content: <ThreeSteps />
    }
  ]

  return (
    <div>
      <div className={StyleSheet.stepHeader}>
        <Steps current={current}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
      </div>

      <div className={StyleSheet.concent}>{steps[current].content}</div>
    </div>
  )
}

const StepComponents = React.memo(StepComponentsMemo)

export default StepComponents
