/* eslint-disable unicorn/prefer-query-selector */
import React, { useMemo } from 'react'
import { Button, Form, Input, Radio, Select } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { IconPeripheral, IconYifuRegister, IconClock, IconCommon, IconDownload, IconFileText } from '@anban/iconfonts'
import StyleSheet from './modelMiddle.less'
import { formItemParamsCheckStore, HeaderStore, publicAttributes, useModelDetailsStore } from '../../Store/ModelStore'
import { getSystemConstantsStore } from 'Src/webSocket/webSocketStore'

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
  const btnStatus = formItemParamsCheckStore(state => state.btnStatus)
  const setBtnStatus = formItemParamsCheckStore(state => state.setBtnStatus)
  const optionalParameters = formItemParamsCheckStore(state => state.optionalParameters)
  const cancel = React.useCallback(() => {
    setBtnStatus(true)
    unSetTabs()
  }, [setBtnStatus, unSetTabs])
  const getCollect = React.useCallback(() => {
    console.log(optionalParameters)
  }, [optionalParameters])
  return (
    <div className={StyleSheet.formFooter}>
      <Button className={StyleSheet.Btn} key='cancel' style={{ borderRadius: '4px' }} onClick={cancel}>
        取消
      </Button>
      <Button
        className={StyleSheet.Btn}
        disabled={btnStatus}
        key='submit'
        type='primary'
        onClick={getCollect}
        style={{ borderRadius: '4px', marginLeft: '12px' }}
      >
        添加
      </Button>
    </div>
  )
}
const FormFooterMemo = React.memo(FormFooter)

// 外设表单
const PeripheralsForm = () => {
  const { PERIPHERAL_TYPE } = getSystemConstantsStore()
  const { optionalParameters, changeValuePeripheralForm, setBtnStatus, checkHex, checkNameFormat, checkNameLength } = formItemParamsCheckStore()
  const { name, base_address, address_length } = optionalParameters

  const [form] = Form.useForm()
  const onValueChange = React.useCallback((val, allValues) => {
    const bol = allValues.desc === undefined || allValues.desc?.length <= 50
    if (
      bol &&
      checkNameFormat(allValues.name) &&
      checkNameLength(allValues.name) &&
      checkHex(allValues.address_length) &&
      checkHex(allValues.base_address)
    ) {
      setBtnStatus(false)
    } else {
      setBtnStatus(true)
    }
  }, [])
  return (
    <div className={StyleSheet.formBody}>
      <Form form={form} layout='vertical' onValuesChange={onValueChange}>
        <Form.Item
          label='外设名称'
          required
          validateFirst
          name='name'
          validateTrigger={['onChange', 'onBlur']}
          className={StyleSheet.firstFormItem}
          help={name?.errorMsg}
          validateStatus={name?.validateStatus}
        >
          <Input
            placeholder='请输入自定义外设名称'
            onChange={e => {
              changeValuePeripheralForm('name', '外设', e.target.value)
            }}
          />
        </Form.Item>
        <Form.Item label='类型' required className={StyleSheet.firstFormItem} name='kind'>
          <Select
            placeholder='请选择所属外设'
            getPopupContainer={() => document.getElementsByClassName(StyleSheet.firstFormItem)[0] as HTMLElement}
            onChange={value => {
              changeValuePeripheralForm('peripheral_id', '外设', value)
            }}
          >
            {PERIPHERAL_TYPE?.map((rate: any) => {
              return (
                <Option key={rate.value} value={rate.value}>
                  {rate.label}
                </Option>
              )
            })}
          </Select>
        </Form.Item>
        <Form.Item label='基地址' required name='base_address' help={base_address?.errorMsg} validateStatus={base_address?.validateStatus}>
          <Input
            placeholder='请输入基地址'
            prefix='0x'
            onChange={e => {
              changeValuePeripheralForm('base_address', '外设', e.target.value)
            }}
          />
        </Form.Item>
        <Form.Item label='地址大小' required name='address_length' help={address_length?.errorMsg} validateStatus={address_length?.validateStatus}>
          <Input
            placeholder='请输入地址大小'
            prefix='0x'
            suffix='字节'
            onChange={e => {
              changeValuePeripheralForm('address_length', '外设', e.target.value)
            }}
          />
        </Form.Item>
        <Form.Item name='desc' label='外设描述' rules={[{ type: 'string', max: 50, message: '字数不能超过50个' }]}>
          <TextArea
            spellCheck='false'
            onChange={e => {
              changeValuePeripheralForm('desc', '外设', e.target.value)
            }}
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
  const customMadePeripheralList = useModelDetailsStore(state => state.customMadePeripheralList)
  const customMadePeripheralListMemo = useMemo(() => {
    return customMadePeripheralList.map((item: any) => {
      return { id: item.id, name: item.name }
    })
  }, [customMadePeripheralList])
  const { optionalParameters, changeValueRegisterForm, setBtnStatus, checkHex, checkNameFormat, checkNameLength } = formItemParamsCheckStore()
  const { name, relative_address } = optionalParameters

  const [form] = Form.useForm()
  const onValueChange = React.useCallback(
    (changedValues: any, allValues: any) => {
      if (checkNameFormat(allValues.name) && checkNameLength(allValues.name) && checkHex(allValues.relative_address)) {
        setBtnStatus(false)
      } else {
        setBtnStatus(true)
      }
    },
    [checkHex, checkNameFormat, checkNameLength, setBtnStatus]
  )
  return (
    <div className={StyleSheet.ProcessorFormBody}>
      <Form form={form} layout='vertical' onValuesChange={onValueChange}>
        <Form.Item label='所属外设' required className={StyleSheet.firstFormItem} name='peripheral_id'>
          <Select
            placeholder='请选择所属外设'
            getPopupContainer={() => document.getElementsByClassName(StyleSheet.firstFormItem)[0] as HTMLElement}
            onChange={val => {
              changeValueRegisterForm('peripheral_id', '外设', val)
            }}
          >
            {customMadePeripheralListMemo?.map((rate: any) => {
              return (
                <Option key={rate.id} value={rate.id}>
                  {rate.name}
                </Option>
              )
            })}
          </Select>
        </Form.Item>
        <Form.Item label='寄存器名称' required name='name' help={name?.errorMsg} validateStatus={name?.validateStatus}>
          <Input
            placeholder='请输入寄存器名称'
            onChange={e => {
              changeValueRegisterForm('name', '寄存器', e.target.value)
            }}
          />
        </Form.Item>
        <Form.Item
          label='偏移地址'
          required
          name='relative_address'
          help={relative_address?.errorMsg}
          validateStatus={relative_address?.validateStatus}
        >
          <Input
            placeholder='请输入偏移地址'
            prefix='0x'
            onChange={e => {
              changeValueRegisterForm('relative_address', '偏移地址', e.target.value)
            }}
          />
        </Form.Item>
      </Form>
    </div>
  )
}
const ProcessorFormMemo = React.memo(ProcessorForm)

// 数据处理器
const DataHandlerForm = () => {
  const [form] = Form.useForm()
  const { optionalParameters, changeValueHanderlForm, setBtnStatus, checkNameLength, checkNameFormat } = formItemParamsCheckStore()
  const { name } = optionalParameters
  const { portList } = publicAttributes()
  const onValueChange = React.useCallback(
    (val: any, allValues: { name: string; port: string }) => {
      if (checkNameLength(allValues.name) && checkNameFormat(allValues.name) && allValues.port) {
        setBtnStatus(false)
      } else {
        setBtnStatus(true)
      }
    },
    [checkNameFormat, checkNameLength, setBtnStatus]
  )
  return (
    <div className={StyleSheet.DataHandlerFormBody}>
      <Form form={form} layout='vertical' onValuesChange={onValueChange}>
        <Form.Item
          label='数据处理器名称'
          required
          className={StyleSheet.firstFormItem}
          name='name'
          help={name?.errorMsg}
          validateStatus={name?.validateStatus}
        >
          <Input
            value={name?.value}
            placeholder='请输入数据处理器名称'
            onChange={e => {
              changeValueHanderlForm('name', '数据处理器', e.target.value)
            }}
          />
        </Form.Item>
        <Form.Item name='port' label='端口' rules={[{ required: true, message: '请选择端口' }]}>
          <Select
            getPopupContainer={() => document.getElementsByClassName(StyleSheet.firstFormItem)[0] as HTMLElement}
            placeholder='请选择端口'
            onSelect={(value: string) => {
              changeValueHanderlForm('port', '数据处理器', value)
            }}
          >
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
  const {
    optionalParameters,
    changeValueTimerForm,
    checkNameLength,
    checkNameFormat,
    setBtnStatus,
    checkInterval,
    checkInterrupt
  } = formItemParamsCheckStore()
  const { name, period, interrupt } = optionalParameters
  const onValueChange = React.useCallback(
    (val: any, allValues: { name: string; period: string; interrupt: string }) => {
      if (
        checkNameLength(allValues?.name) &&
        checkNameFormat(allValues?.name) &&
        checkInterval(allValues.period) &&
        checkInterrupt(allValues.interrupt)
      ) {
        setBtnStatus(false)
      } else {
        setBtnStatus(true)
      }
    },
    [checkInterrupt, checkInterval, checkNameFormat, checkNameLength, setBtnStatus]
  )

  return (
    <div className={StyleSheet.ProcessorFormBody}>
      <Form form={form} layout='vertical' onValuesChange={onValueChange}>
        <Form.Item
          label='定时器名称'
          name='name'
          required
          className={StyleSheet.firstFormItem}
          help={name?.errorMsg}
          validateStatus={name?.validateStatus}
        >
          <Input
            placeholder='请输入自定义外设名称'
            value={name?.value}
            onChange={e => {
              changeValueTimerForm('name', '定时器', e.target.value)
            }}
          />
        </Form.Item>
        <Form.Item label='间隔' required name='period' validateStatus={period?.validateStatus} help={period?.errorMsg}>
          <Input
            placeholder='请输入间隔'
            suffix='微秒'
            value={period?.value}
            onChange={e => {
              changeValueTimerForm('period', '间隔', e.target.value)
            }}
          />
        </Form.Item>
        <Form.Item label='中断号' required name='interrupt' validateStatus={interrupt?.validateStatus} help={interrupt?.errorMsg}>
          <Input
            placeholder='请输入中断号'
            value={interrupt?.value}
            onChange={e => {
              changeValueTimerForm('interrupt', '中断号', e.target.value)
            }}
          />
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
  const unSelect = HeaderStore(state => state.unSetTabs)
  const { initFormValue } = formItemParamsCheckStore()
  const showOrHide = React.useCallback(
    (val: string) => {
      if (tabsSelect === val) {
        initFormValue()
        unSelect()
      } else {
        initFormValue()
        setTabs(val)
      }
    },
    [initFormValue, setTabs, tabsSelect, unSelect]
  )
  return (
    <div className={StyleSheet.middleLeftHeaderBar}>
      <div className={StyleSheet.middleLeftHeaderBarLeft}>
        {HeadrBarArray.map(item => {
          return (
            <div
              key={item.tabs}
              role='time'
              onClick={() => {
                showOrHide(item.tabs)
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
