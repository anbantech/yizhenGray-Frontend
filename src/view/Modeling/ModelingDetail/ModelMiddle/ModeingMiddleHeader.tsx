/* eslint-disable unicorn/prefer-query-selector */
import React, { useMemo } from 'react'
import { Button, Form, Input, Select, Tooltip, message } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { IconPeripheral, IconYifuRegister, IconClock, IconCommon, IconDownload, IconFileText } from '@anban/iconfonts'
import { getSystemConstantsStore } from 'Src/webSocket/webSocketStore'
import { useLocation } from 'react-router'
import { downLoadScript, scriptGenerator } from 'Src/services/api/modelApi'
import { throwErrorMessage } from 'Src/util/message'
import { warn } from 'Src/util/common'
import StyleSheet from './modelMiddle.less'
import { checkUtilFnStore, formItemParamsCheckStore, publicAttributes, useLeftModelDetailsStore } from '../../Store/ModelStore'
import { LoactionState } from '../ModelLeft/ModelingLeftIndex'
import { MiddleStore } from '../../Store/ModelMiddleStore/MiddleStore'
import { RightDetailsAttributesStore } from '../../Store/ModeleRightListStore/RightListStoreList'

const browserDownload = {
  ifHasDownloadAPI: 'download' in document.createElement('a'),
  createFrontendDownloadAction(name: string, content: Blob) {
    if ('download' in document.createElement('a')) {
      const link = document.createElement('a')
      link.download = `${name}`
      link.href = URL.createObjectURL(content)
      link.click()
    } else {
      warn(true, '您的浏览器不支持下载方法，请更新您的浏览器到最新版本')
    }
  }
}

type TabsSelect = {
  tabs: string
}

type props = {
  addNodeAndAddEdge: () => void
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
  const unSetTabs = formItemParamsCheckStore(state => state.unSetTabs)
  const Tabs = formItemParamsCheckStore(state => state.tabs)
  const platformsId = (useLocation() as LoactionState).state?.id
  const platformsIdmemo = React.useMemo(() => platformsId, [platformsId])
  const createElement = MiddleStore(state => state.createElement)
  const checkEveryItem = formItemParamsCheckStore(state => state.checkEveryItem)
  const optionalParameters = formItemParamsCheckStore(state => state.optionalParameters)
  const getModelListDetails = useLeftModelDetailsStore(state => state.getModelListDetails)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const btnStatus = useMemo(() => checkEveryItem(optionalParameters), [optionalParameters])
  const rightAttributeMap = RightDetailsAttributesStore(state => state.rightAttributeMap)
  const cancel = React.useCallback(() => {
    unSetTabs()
  }, [unSetTabs])
  const getCollect = React.useCallback(() => {
    const { name, base_address, desc, interrupt, address_length, period, peripheral_id, port, relative_address, kind } = optionalParameters
    const periperalParams = {
      platform_id: platformsIdmemo,
      name: name?.value,
      kind: kind?.value,
      desc: desc?.value,
      address_length: (address_length?.value as string)?.trim().length % 2 === 0 ? address_length?.value : `0${address_length?.value}`,
      base_address: (base_address?.value as string)?.trim().length % 2 === 0 ? base_address?.value : `0${base_address?.value}`
    }

    const timerParams = {
      platform_id: platformsIdmemo,
      name: name?.value,
      period: period?.value,
      interrupt: interrupt?.value
    }

    const dataHandParams = {
      platform_id: platformsIdmemo,
      name: name?.value,
      port: port?.value
    }
    // 0 状态寄存器 1 非状态寄存器
    const ProcessorParams = {
      platform_id: platformsIdmemo,
      name: name?.value,
      peripheral_id: peripheral_id?.value,
      kind: 1,
      relative_address: (relative_address?.value as string)?.trim().length % 2 === 0 ? relative_address?.value : `0${relative_address?.value}`
    }

    const mapParams = {
      customMadePeripheral: periperalParams,
      processor: ProcessorParams,
      time: timerParams,
      dataHandlerNotReferenced: dataHandParams
    }

    const info = mapParams[Tabs as keyof typeof mapParams]
    // openSiderMenu(Tabs)

    createElement(Tabs, info, getModelListDetails, platformsIdmemo, cancel, rightAttributeMap)
  }, [optionalParameters, platformsIdmemo, Tabs, createElement, getModelListDetails, cancel, rightAttributeMap])

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

// 外设表单 完全体
const PeripheralsForm = () => {
  const { PERIPHERAL_TYPE } = getSystemConstantsStore()
  const { optionalParameters, onChange, updateFormValue } = formItemParamsCheckStore()
  const { name, base_address, address_length } = optionalParameters

  const KindValue = useMemo(() => {
    return optionalParameters.kind?.value
  }, [optionalParameters])
  const [form] = Form.useForm()

  const { checkNameFormat, checkNameLength, checkHex } = checkUtilFnStore()
  return (
    <div className={StyleSheet.formBody}>
      <Form form={form} layout='vertical'>
        <Form.Item
          label='外设名称'
          required
          className={StyleSheet.firstFormItem}
          name='name'
          hasFeedback
          help={name?.errorMsg}
          validateStatus={name?.validateStatus}
        >
          <Input
            placeholder='请输入自定义外设名称'
            onChange={e => {
              onChange('name', e.target.value, '自定义外设', checkNameFormat, checkNameLength)
            }}
          />
        </Form.Item>

        <Form.Item label='类型' required>
          <Select
            value={KindValue}
            placeholder='请选择类型'
            getPopupContainer={() => document.getElementsByClassName(StyleSheet.firstFormItem)[0] as HTMLElement}
            onChange={value => {
              onChange('kind', `${value}`, '类型')
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

        <Form.Item
          label='基地址'
          hasFeedback
          required
          name='base_address'
          help={base_address?.errorMsg}
          validateStatus={base_address?.validateStatus}
        >
          <Input
            placeholder='请输入基地址'
            prefix='0x'
            onChange={e => {
              onChange('base_address', e.target.value, '基地址', checkHex)
            }}
          />
        </Form.Item>
        <Form.Item
          label='地址大小'
          hasFeedback
          required
          name='address_length'
          help={address_length?.errorMsg}
          validateStatus={address_length?.validateStatus}
        >
          <Input
            placeholder='请输入地址大小'
            prefix='0x'
            suffix='字节'
            onChange={e => {
              onChange('address_length', e.target.value, '地址大小', checkHex)
            }}
          />
        </Form.Item>
        <Form.Item name='desc' label='外设描述' rules={[{ type: 'string', max: 50, message: '字数不能超过50个' }]}>
          <TextArea
            spellCheck='false'
            onChange={e => {
              updateFormValue('desc', e.target.value, '描述', null, 'success')
            }}
            placeholder='请输入描述'
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
  const customMadePeripheralList = useLeftModelDetailsStore(state => state.customMadePeripheralList)

  const customMadePeripheralListMemo = useMemo(() => {
    return customMadePeripheralList.map((item: any) => {
      return { id: item.id, name: item.name }
    })
  }, [customMadePeripheralList])
  const { optionalParameters, onChange } = formItemParamsCheckStore()
  const { name, relative_address, peripheral_id } = optionalParameters

  const { checkNameFormat, checkNameLength, checkHex } = checkUtilFnStore()
  const [form] = Form.useForm()

  return (
    <div className={StyleSheet.ProcessorFormBody}>
      <Form form={form} layout='vertical'>
        <Form.Item label='所属外设' required className={StyleSheet.firstFormItem}>
          <Select
            placeholder='请选择所属外设'
            value={peripheral_id?.value ? peripheral_id?.value : undefined}
            getPopupContainer={() => document.getElementsByClassName(StyleSheet.firstFormItem)[0] as HTMLElement}
            onChange={val => {
              onChange('peripheral_id', `${val}`, '数据处理器')
            }}
          >
            {customMadePeripheralListMemo?.map((rate: any) => {
              return (
                <Option key={String(rate.id)} value={String(rate.id)}>
                  {rate.name}
                </Option>
              )
            })}
          </Select>
        </Form.Item>
        <Form.Item label='寄存器名称' hasFeedback required name='name' help={name?.errorMsg} validateStatus={name?.validateStatus}>
          <Input
            placeholder='请输入寄存器名称'
            onChange={e => {
              onChange('name', e.target.value, '寄存器', checkNameFormat, checkNameLength)
            }}
          />
        </Form.Item>
        <Form.Item
          label='偏移地址'
          required
          name='relative_address'
          hasFeedback
          help={relative_address?.errorMsg}
          validateStatus={relative_address?.validateStatus}
        >
          <Input
            placeholder='请输入偏移地址'
            prefix='0x'
            onChange={e => {
              onChange('relative_address', e.target.value, '偏移地址', checkHex)
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
  const { optionalParameters, onChange } = formItemParamsCheckStore()
  const { name, port } = optionalParameters
  const portList = publicAttributes(state => state.portList)
  const { checkNameFormat, checkNameLength } = checkUtilFnStore()
  return (
    <div className={StyleSheet.DataHandlerFormBody}>
      <Form form={form} layout='vertical'>
        <Form.Item
          label='数据处理器名称'
          required
          className={StyleSheet.firstFormItem}
          name='name'
          hasFeedback
          help={name?.errorMsg}
          validateStatus={name?.validateStatus}
        >
          <Input
            value={name?.value}
            placeholder='请输入数据处理器名称'
            onChange={e => {
              onChange('name', e.target.value, '数据处理器', checkNameFormat, checkNameLength)
            }}
          />
        </Form.Item>
        <Form.Item name='port' label='端口' required hasFeedback help={port?.errorMsg} validateStatus={port?.validateStatus}>
          <Select
            getPopupContainer={() => document.getElementsByClassName(StyleSheet.firstFormItem)[0] as HTMLElement}
            placeholder='请选择端口'
            onChange={(value: string) => {
              onChange('port', value, '端口')
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

// 添加定时器 完全体
const TimeForm = () => {
  const [form] = Form.useForm()
  const { optionalParameters, onChange } = formItemParamsCheckStore()
  const { name, period, interrupt } = optionalParameters
  const { checkNameFormat, checkNameLength, checkInterrupt, checkInterval } = checkUtilFnStore()
  return (
    <div className={StyleSheet.ProcessorFormBody}>
      <Form form={form} layout='vertical'>
        <Form.Item
          label='定时器名称'
          name='name'
          required
          hasFeedback
          className={StyleSheet.firstFormItem}
          help={name?.errorMsg}
          validateStatus={name?.validateStatus}
        >
          <Input
            placeholder='请输入定时器名称'
            value={name?.value}
            onChange={e => {
              onChange('name', e.target.value, '定时器', checkNameFormat, checkNameLength)
            }}
          />
        </Form.Item>
        <Form.Item label='间隔' hasFeedback required name='period' validateStatus={period?.validateStatus} help={period?.errorMsg}>
          <Input
            placeholder='请输入间隔'
            suffix='微秒'
            value={period?.value}
            onChange={e => {
              onChange('period', e.target.value, '间隔', checkInterval)
            }}
          />
        </Form.Item>
        <Form.Item label='中断号' hasFeedback required name='interrupt' validateStatus={interrupt?.validateStatus} help={interrupt?.errorMsg}>
          <Input
            placeholder='请输入中断号'
            value={interrupt?.value}
            onChange={e => {
              onChange('interrupt', e.target.value, '间隔', checkInterrupt)
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
  const tabs = formItemParamsCheckStore(state => state.tabs)
  return (
    <div className={StyleSheet.moddleMiddleHeaderBody} key={tabs}>
      {TabsBarForm[tabs as keyof typeof TabsBarForm]}
      <FormFooterMemo />
    </div>
  )
}

const ModelingMiddleHeader = React.memo(ModelingMiddleHeaderMemo)

const HeaderBarMemo = () => {
  const setTabs = formItemParamsCheckStore(state => state.setTabs)
  const tabs = formItemParamsCheckStore(state => state.tabs)
  const tabsSelect = React.useMemo(() => tabs, [tabs])
  const unSelect = formItemParamsCheckStore(state => state.unSetTabs)
  const { initFormValue } = formItemParamsCheckStore()
  const platform_id = MiddleStore(state => state.platform_id)
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

  // 下载与生成函数
  const downloadAndCreate = React.useCallback(
    async (type: string) => {
      try {
        if (!platform_id) return
        if (type === 'download') {
          const res: any = await downLoadScript(platform_id)
          if (res.data) {
            message.success('脚本下载成功')
            browserDownload.createFrontendDownloadAction(decodeURIComponent(res.fileName), new Blob([res.data]))
          }
        } else {
          const res: any = await scriptGenerator(platform_id)
          if (res.code === 0) {
            message.success('生成脚本成功')
          }
        }
      } catch (error) {
        if (error.code) {
          throwErrorMessage(error, { 7025: '请先点击生成脚本,然后再尝试下载' })
        }
      }
    },
    [platform_id]
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
            <>
              {item.type === 'download' ? (
                <Tooltip title='要获取最新脚本，请先点击“生成脚本”，再下载'>
                  <div
                    key={item.type}
                    role='time'
                    onClick={() => {
                      downloadAndCreate(item.type)
                    }}
                    className={StyleSheet.middleLeftHeaderBarItem}
                    style={item.style}
                  >
                    {item.icon}
                    <span style={{ paddingLeft: '3px' }}>{item.name}</span>
                  </div>
                </Tooltip>
              ) : (
                <div
                  key={item.type}
                  role='time'
                  onClick={() => {
                    downloadAndCreate(item.type)
                  }}
                  className={StyleSheet.middleLeftHeaderBarItem}
                  style={item.style}
                >
                  {item.icon}
                  <span style={{ paddingLeft: '3px' }}>{item.name}</span>
                </div>
              )}
            </>
          )
        })}
      </div>
    </div>
  )
}
const HeaderBar = React.memo(HeaderBarMemo)
function MiddleHeaderBar() {
  const tabs = formItemParamsCheckStore(state => state.tabs)

  return (
    <div className={StyleSheet.middleHeaderBar}>
      <HeaderBar />
      {tabs && <ModelingMiddleHeader />}
    </div>
  )
}

export default MiddleHeaderBar
