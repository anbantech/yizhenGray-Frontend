import { Form, Input } from 'antd'
import React from 'react'
import TextArea from 'antd/lib/input/TextArea'
import StyleSheet from './ModelingRight.less'
import { LeftAndRightStore } from '../../Store/ModelLeftAndRight/leftAndRightStore'

const TargetComponents: React.FC = () => {
  const [form] = Form.useForm()
  const TargetDetail = LeftAndRightStore(state => state.rightTargetDetail)
  const { name, processor, desc } = TargetDetail
  return (
    <div style={{ padding: '8px 16px' }} className={StyleSheet.rightFromCommonStyle}>
      <Form form={form} layout='vertical'>
        <Form.Item label='名称'>
          <Input disabled value={name.value} />
        </Form.Item>
        <Form.Item label='处理器类型'>
          <Input disabled value={processor.value} />
        </Form.Item>
        <Form.Item label='描述'>
          <TextArea disabled value={desc.value} autoSize={{ minRows: 3, maxRows: 4 }} />
        </Form.Item>
      </Form>
    </div>
  )
}

const PeripheralComponents: React.FC = () => {
  return (
    <div>
      <span>22</span>
    </div>
  )
}

const RegisterComponents: React.FC = () => {
  return (
    <div>
      <span>22</span>
    </div>
  )
}

const DataHanderComponents: React.FC = () => {
  return (
    <div>
      <span>22</span>
    </div>
  )
}

const TimerCompoents: React.FC = () => {
  const [form] = Form.useForm()
  const rightTimer = LeftAndRightStore(state => state.rightTimer)
  const { name, period, interrupt } = rightTimer

  return (
    <div className={StyleSheet.rightFromCommonStyle} style={{ padding: '8px 16px' }}>
      <Form form={form} layout='vertical'>
        <Form.Item label='定时器名称' help={name.errorMsg} hasFeedback validateStatus={name.validateStatus}>
          <Input value={name.value} placeholder='请输入定时器名称' />
        </Form.Item>
        <Form.Item label='间隔' help={period.errorMsg} hasFeedback validateStatus={period.validateStatus}>
          <Input suffix='微秒' placeholder='请输入间隔' value={period.value} />
        </Form.Item>
        <Form.Item label='中断号' help={interrupt.errorMsg} hasFeedback validateStatus={interrupt.validateStatus}>
          <Input placeholder='请输入中断号' value={interrupt.value} />
        </Form.Item>
      </Form>
    </div>
  )
}

export { TimerCompoents, DataHanderComponents, RegisterComponents, PeripheralComponents, TargetComponents }
