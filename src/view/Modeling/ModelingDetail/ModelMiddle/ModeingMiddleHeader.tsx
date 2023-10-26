import React, { useMemo } from 'react'
import { Button, Form, Input, Radio, Select } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { IconPeripheral, IconYifuRegister, IconClock, IconCommon, IconDownload, IconFileText } from '@anban/iconfonts'
import StyleSheet from './modelMiddle.less'
import { HeaderStore, publicAttributes } from '../../Store/ModelStore'

type TabsSelect = {
  tabs: string
}

const { Option } = Select

const HeadrBarArray = [
  {
    name: '添加外设',
    icon: <IconPeripheral style={{ width: '16px', height: '16px' }} />,
    tabs: 'customMadePeripheral',
    style: { Width: '96px', padding: '0 10px' }
  },
  {
    name: '添加寄存器',
    icon: <IconYifuRegister style={{ width: '16px', height: '16px' }} />,
    tabs: 'processor',
    style: { Width: '110px', padding: '0 10px' }
  },
  {
    name: '添加数据处理器',
    icon: <IconCommon style={{ width: '16px', height: '16px' }} />,
    tabs: 'dataHandlerNotReferenced',
    style: { Width: '138px', padding: '0 10px' }
  },
  { name: '添加定时器', icon: <IconClock style={{ width: '16px', height: '16px' }} />, tabs: 'time', style: { Width: '110px', padding: '0 10px' } }
]

const RightHeaderBarArray = [
  {
    name: '生成脚本',
    type: 'create',
    icon: <IconFileText style={{ width: '16px', height: '16px' }} />,
    style: { Width: '96px', padding: '0 10px' }
  },
  {
    name: '下载脚本',
    type: 'download',
    icon: <IconDownload style={{ width: '16px', height: '16px' }} />,
    style: { Width: '96px', padding: '0 10px' }
  }
]

// 表单页脚
const FormFooter = () => {
  const unSetTabs = HeaderStore(state => state.unSetTabs)
  return (
    <div className={StyleSheet.formFooter}>
      <Button className={StyleSheet.Btn} key='cancel' style={{ borderRadius: '4px' }} onClick={unSetTabs}>
        取消
      </Button>
      <Button className={StyleSheet.Btn} disabled={Boolean(1)} key='submit' type='primary' style={{ borderRadius: '4px', marginLeft: '12px' }}>
        添加
      </Button>
    </div>
  )
}
const FormFooterMemo = React.memo(FormFooter)

// 外设表单
const PeripheralsForm = () => {
  const [form] = Form.useForm()
  return (
    <div className={StyleSheet.formBody}>
      <Form form={form} layout='vertical'>
        <Form.Item
          label='外设名称'
          required
          className={StyleSheet.firstFormItem}
          name='requiredMarkValue'
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
          <Input placeholder='请输入自定义外设名称' />
        </Form.Item>
        <Form.Item label='类型' required className={StyleSheet.firstFormItem} name='requiredMarkValue'>
          <Select placeholder='请选择所属外设'>
            {
              // portList?.map((rate: any) => {
              //   return (
              //     <Option key={rate} value={rate}>
              //       {rate}
              //     </Option>
              //   )
              // })
            }
          </Select>
        </Form.Item>
        <Form.Item label='基地址' required>
          <Input placeholder='请输入基地址' prefix='0x' />
        </Form.Item>
        <Form.Item label='地址大小' required>
          <Input placeholder='请输入地址大小' prefix='0x' suffix='字节' />
        </Form.Item>
        <Form.Item name='desc' label='项目描述' rules={[{ type: 'string', max: 50, message: '字数不能超过50个' }]}>
          <TextArea
            spellCheck='false'
            placeholder='请添加针对项目的相关描述'
            autoSize={{ minRows: 2, maxRows: 3 }}
            showCount={{
              formatter({ count }) {
                return `${count}/50`
              }
            }}
          />
        </Form.Item>
      </Form>
    </div>
  )
}
const PeripheralsFormMemo = React.memo(PeripheralsForm)

// 添加寄存器
const ProcessorForm = () => {
  const [form] = Form.useForm()
  return (
    <div className={StyleSheet.ProcessorFormBody}>
      <Form form={form} layout='vertical'>
        <Form.Item label='所属外设' required className={StyleSheet.firstFormItem} name='requiredMarkValue'>
          <Select placeholder='请选择所属外设'>
            {
              // portList?.map((rate: any) => {
              //   return (
              //     <Option key={rate} value={rate}>
              //       {rate}
              //     </Option>
              //   )
              // })
            }
          </Select>
        </Form.Item>
        <Form.Item label='寄存器名称' required>
          <Input placeholder='请输入寄存器名称' />
        </Form.Item>
        <Form.Item label='偏移地址' required>
          <Input placeholder='请输入偏移地址' prefix='0x' />
        </Form.Item>
      </Form>
    </div>
  )
}
const ProcessorFormMemo = React.memo(ProcessorForm)

// 数据处理器
const DataHandlerForm = () => {
  const [form] = Form.useForm()
  const { portList } = publicAttributes()
  return (
    <div className={StyleSheet.DataHandlerFormBody}>
      <Form form={form} layout='vertical'>
        <Form.Item
          label='数据处理器名称'
          required
          className={StyleSheet.firstFormItem}
          name='name'
          rules={[
            { required: true, message: '请输入数据处理器名称' },
            { type: 'string', min: 2, max: 20, message: '数据处理器名称长度为2到20个字符' },
            {
              validateTrigger: 'onBlur',
              validator(_, value) {
                const reg = /^[\w\u4E00-\u9FA5]+$/
                if (reg.test(value)) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('数据处理器名称由汉字、数字、字母和下划线组成'))
              }
            }
          ]}
        >
          <Input placeholder='请输入自定义外设名称' />
        </Form.Item>
        <Form.Item name='port' validateTrigger={['onBlur']} label='端口' rules={[{ required: true, message: '请选择端口' }]}>
          <Select placeholder='请选择端口'>
            {
              /**
               * 下拉选择端口
               */
              portList?.map((rate: any) => {
                return (
                  <Option key={rate} value={rate}>
                    {rate}
                  </Option>
                )
              })
            }
          </Select>
        </Form.Item>
      </Form>
    </div>
  )
}

const DataHandlerFormMemo = React.memo(DataHandlerForm)
// 添加定时器
const TimeForm = () => {
  const [form] = Form.useForm()
  return (
    <div className={StyleSheet.ProcessorFormBody}>
      <Form form={form} layout='vertical'>
        <Form.Item
          label='定时器名称'
          required
          className={StyleSheet.firstFormItem}
          name='name'
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
          <Input placeholder='请输入自定义外设名称' />
        </Form.Item>
        <Form.Item label='间隔' required name='period'>
          <Input placeholder='请输入间隔' suffix='微秒' />
        </Form.Item>
        <Form.Item label='中断号' required name='interrupt'>
          <Input placeholder='请输入中断号' />
        </Form.Item>
      </Form>
    </div>
  )
}
const TimeFormMemo = React.memo(TimeForm)

const TabsBarForm = {
  customMadePeripheral: <PeripheralsFormMemo />,
  processor: <ProcessorFormMemo />,
  dataHandlerNotReferenced: <DataHandlerFormMemo />,
  time: <TimeFormMemo />
}

function ModelingMiddleHeaderMemo() {
  const tabs = HeaderStore(state => state.tabs)
  return (
    <div className={StyleSheet.moddleMiddleHeaderBody} key={tabs}>
      {TabsBarForm[tabs as keyof typeof TabsBarForm]}
      <FormFooterMemo />
    </div>
  )
}

const ModelingMiddleHeader = React.memo(ModelingMiddleHeaderMemo)

const HeaderBarMemo = () => {
  const setTabs = HeaderStore(state => state.setTabs)
  const tabs = HeaderStore(state => state.tabs)
  const tabsSelect = React.useMemo(() => tabs, [tabs])
  return (
    <div className={StyleSheet.middleLeftHeaderBar}>
      <div className={StyleSheet.middleLeftHeaderBarLeft}>
        {HeadrBarArray.map(item => {
          return (
            <div
              key={item.tabs}
              role='time'
              onClick={() => {
                setTabs(item.tabs)
              }}
              className={tabsSelect === item.tabs ? StyleSheet.middleLeftSelectHeaderBarItem : StyleSheet.middleLeftHeaderBarItem}
              style={item.style}
            >
              {item.icon}
              <span style={{ paddingLeft: '3px' }}>{item.name}</span>
            </div>
          )
        })}
      </div>

      <div className={StyleSheet.middleLeftHeaderBarRight}>
        {RightHeaderBarArray.map(item => {
          return (
            <div key={item.type} role='time' onClick={() => {}} className={StyleSheet.middleLeftHeaderBarItem} style={item.style}>
              {item.icon}
              <span style={{ paddingLeft: '3px' }}>{item.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const HeaderBar = React.memo(HeaderBarMemo)

function MiddleHeaderBar() {
  const tabs = HeaderStore(state => state.tabs)
  return (
    <div className={StyleSheet.middleHeaderBar}>
      <HeaderBar />
      {tabs && <ModelingMiddleHeader />}
    </div>
  )
}

export default MiddleHeaderBar
