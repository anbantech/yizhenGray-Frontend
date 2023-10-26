import { Form, Input, Select } from 'antd'
import React from 'react'
import StyleSheet from './ModelingRight.less'

const { Option } = Select

// 定义名称为处理器属性的组件
const ProcessorDetailsAttributes = () => {
  const [form] = Form.useForm()
  return (
    <div className={StyleSheet.rightConcentBody}>
      <Form form={form} layout='vertical' className={StyleSheet.rightFromCommonStyle}>
        <div style={{ padding: '8px 16px' }}>
          <Form.Item
            label='数据处理器名称 '
            name='requiredMarkValue'
            rules={[
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
            <Input placeholder='请输入自定义外设名称' />
          </Form.Item>
          <Form.Item label='端口'>
            <Input />
          </Form.Item>
          <Form.Item label='中断号'>
            <Input />
          </Form.Item>
        </div>
        <div style={{ padding: '8px 16px' }} className={StyleSheet.dataFormatProcessing}>
          <span className={StyleSheet.spanTitle}>数据加工与输出格式编排</span>
          <Form.Item label='帧头'>
            <Input />
          </Form.Item>
          <Form.Item label='帧尾'>
            <Input />
          </Form.Item>
          <Form.Item label='帧长度元素' name='kind'>
            <Select defaultValue='0'>
              <Option value='0'>False</Option>
              <Option value='1'>True</Option>
            </Select>
          </Form.Item>
          <Form.Item label='校验算法' name='kind'>
            <Select defaultValue='0'>
              <Option value='0'>False</Option>
              <Option value='1'>True</Option>
            </Select>
          </Form.Item>
          <Form.Item label='校验子项' name='kind'>
            <Select defaultValue='0'>
              <Option value='0'>False</Option>
              <Option value='1'>True</Option>
            </Select>
          </Form.Item>
          <Form.Item label='外设' name='kind'>
            <Select defaultValue='0'>
              <Option value='0'>False</Option>
              <Option value='1'>True</Option>
            </Select>
          </Form.Item>
          <Form.Item label='寄存器' name='kind'>
            <Select defaultValue='0'>
              <Option value='0'>False</Option>
              <Option value='1'>True</Option>
            </Select>
          </Form.Item>
        </div>
      </Form>
    </div>
  )
}
const ProcessorFormMemo = React.memo(ProcessorDetailsAttributes)

// 定义外设属性组件
const PeripheralDetailsAttributes = () => {
  const [form] = Form.useForm()
  return (
    <div className={StyleSheet.rightFromCommonStyle} style={{ padding: '8px 16px' }}>
      <Form form={form} layout='vertical'>
        <Form.Item
          label='外设名称'
          name='name '
          rules={[
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
          <Input placeholder='外设名称' />
        </Form.Item>
        <Form.Item label='类型'>
          <Select defaultValue='0'>
            <Option value='0'>False</Option>
            <Option value='1'>True</Option>
          </Select>
        </Form.Item>
        <Form.Item label='基地址'>
          <Input prefix='0x' />
        </Form.Item>
        <Form.Item label='地址大小'>
          <Input placeholder='请输入基地址大小' prefix='0x' suffix='字节' />
        </Form.Item>
        <Form.Item label='描述'>
          <Input placeholder='请输入基地址大小' />
        </Form.Item>
      </Form>
    </div>
  )
}
const PeripheralDetailsAttributesMemo = React.memo(PeripheralDetailsAttributes)

// 定义寄存器
const RegisterDetailsAttributes = () => {
  const [form] = Form.useForm()
  const change = (values, allValues) => {
    console.log(values, allValues)
  }
  return (
    <div>
      <Form form={form} layout='vertical' onValuesChange={change} className={StyleSheet.rightFromCommonStyle}>
        <div className={StyleSheet.rightFromCommonHeaderStyle} style={{ padding: '8px 16px' }}>
          <Form.Item label='所属外设' name='id'>
            <Select defaultValue='0'>
              <Option value='0'>False</Option>
              <Option value='1'>True</Option>
            </Select>
          </Form.Item>
          <Form.Item label='寄存器名称' name='name'>
            <Input />
          </Form.Item>
          <Form.Item label='偏移地址' name='relative_address'>
            <Input prefix='0x' />
          </Form.Item>
          <Form.Item label='初始化完成' name='finish'>
            <Select defaultValue='0'>
              <Option value='0'>False</Option>
              <Option value='1'>True</Option>
            </Select>
          </Form.Item>
        </div>
        <div className={StyleSheet.isStatusRegister}>
          <Form.Item label='是否为状态寄存器' name='kind'>
            <Select defaultValue='0'>
              <Option value='0'>False</Option>
              <Option value='1'>True</Option>
            </Select>
          </Form.Item>
        </div>
        <div style={{ padding: '8px 16px' }}>
          <span className={StyleSheet.spanTitle}>关联状态寄存器</span>
          <Form.Item label='外设'>
            <Select placeholder='请选择关联状态寄存器外设' defaultValue='0'>
              <Option value='0'>False</Option>
              <Option value='1'>True</Option>
            </Select>
          </Form.Item>
          <Form.Item label='关联状态寄存器' name='sr_id'>
            <Input />
          </Form.Item>
        </div>
      </Form>
    </div>
  )
}

const RegisterDetailsAttributesMemo = React.memo(RegisterDetailsAttributes)

// 定义定时器组件

const TimerDetailsAttributes = () => {
  const [form] = Form.useForm()
  return (
    <div className={StyleSheet.rightFromCommonStyle} style={{ padding: '8px 16px' }}>
      <Form form={form} layout='vertical'>
        <Form.Item
          label='定时器名称'
          name='requiredMarkValue'
          rules={[
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
          <Input placeholder='请输入自定义外设名称' />
        </Form.Item>
        <Form.Item label='间隔'>
          <Input suffix='毫秒' />
        </Form.Item>
        <Form.Item label='中断号'>
          <Input placeholder='请输入中断号' />
        </Form.Item>
      </Form>
    </div>
  )
}

const TimerDetailsAttributesMemo = React.memo(TimerDetailsAttributes)

// 定义目标机组件
const TargetDetailsAttributes = () => {
  const [form] = Form.useForm()
  return (
    <div style={{ padding: '8px 16px' }} className={StyleSheet.rightFromCommonStyle}>
      <Form form={form} layout='vertical'>
        <Form.Item label='名称'>
          <Input disabled={Boolean(1)} />
        </Form.Item>
        <Form.Item label='处理器类型'>
          <Input disabled={Boolean(1)} />
        </Form.Item>
        <Form.Item label='描述'>
          <Input disabled={Boolean(1)} />
        </Form.Item>
      </Form>
    </div>
  )
}

const TargetDetailsAttributesMemo = React.memo(TargetDetailsAttributes)

const TabsDetailsAttributes = {
  Target: <TargetDetailsAttributesMemo />, // 目标机 //todo 100%
  Processor: <ProcessorFormMemo />, // 数据处理器
  Peripheral: <PeripheralDetailsAttributesMemo />, // 外设 // todo 100%
  Register: <RegisterDetailsAttributesMemo />, // 寄存器 // todo 7  0%
  Timer: <TimerDetailsAttributesMemo /> // 定时器 //todo 100%
}

export default TabsDetailsAttributes
