import { Checkbox, Form, Input, Select, Tag } from 'antd'
import React, { useMemo } from 'react'
import { getSystemConstantsStore } from 'Src/webSocket/webSocketStore'
import type { CustomTagProps } from 'rc-select/lib/BaseSelect'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import TextArea from 'antd/lib/input/TextArea'
import StyleSheet from './ModelingRight.less'
import { checkUtilFnStore, publicAttributes, useLeftModelDetailsStore } from '../../Store/ModelStore'
import { valueParams, valueParamsArray } from '../../Store/ModleStore'
import { RightListStore, RightDetailsAttributesStore } from '../../Store/ModeleRightListStore/RightListStoreList'
import { MiddleStore, getAll } from '../../Store/ModelMiddleStore/MiddleStore'

const { Option } = Select

// 帧字典
const OutputFrameStructureOptionsAndVerifyChildAndFrameLength = [
  { label: '帧头', value: '1' },
  { label: '帧长度', value: '5' },
  { label: '数据段', value: '2' },
  { label: '校验段', value: '3' },
  { label: '帧尾', value: '4' }
]

const OutputFrameStructureOptionsAndVerifyChildAndFrameLengthObject = {
  1: '帧头',
  5: '帧长度',
  2: '数据段',
  3: '校验段',
  4: '帧尾'
}

const OutputFrameStructureOptionsAndVerifyChildAndFrameLengthLs = [
  { label: '帧头', value: '1' },
  { label: '帧长度', value: '5' },
  { label: '数据段', value: '2' },
  // { label: '校验段', value: '3' },
  { label: '帧尾', value: '4' }
]

const isStatusRegister = [
  { label: 'True', value: 0 },
  { label: 'False', value: 1 }
]

const isFinish = [
  { label: 'False', value: false },
  { label: 'True', value: true }
]

export const {
  saveCanvasAndUpdateNodeName,

  baseOnUpdateNodeAndEdge,
  updateRegisterNodeDraw,
  updateNodeAttributeInfo
} = MiddleStore.getState()

// 更新名称 左侧列表更新
export const { getModelListDetails } = useLeftModelDetailsStore.getState()

// 定义名称为处理器属性的组件
// 中断号,帧头,帧尾 做校验
const ProcessorDetailsAttributes = () => {
  const [form] = Form.useForm()
  const processor = RightListStore(state => state.processor)
  const AllPeripheralList = useLeftModelDetailsStore(state => state.AllPeripheralList)
  const register = RightDetailsAttributesStore(state => state.register)
  const platform_id = MiddleStore(state => state.platform_id)

  //  kind 0是状态  1非状态 非状态寄存器
  const notRegsiterList = useMemo(() => {
    return register.filter((item: any) => item.kind === 1)
  }, [register])

  //  寄存器的disablled

  const resgiedDisabled = useMemo(() => {
    return Boolean(processor.peripheral_id.value)
  }, [processor])

  // 校验子项
  const checkoutChild = useMemo(() => {
    if (!processor.checksum_member.value) return []
    const res = processor.checksum_member.value.map((item: string, index) => {
      return {
        label: `${index + 1}-${
          OutputFrameStructureOptionsAndVerifyChildAndFrameLengthObject[
            (item as unknown) as keyof typeof OutputFrameStructureOptionsAndVerifyChildAndFrameLengthObject
          ]
        }`,
        value: item
      }
    })
    return res
  }, [processor.checksum_member])

  // 帧组合
  const framing_memberValue = useMemo(() => {
    if (!processor.framing_member.value) return []
    const res = processor.framing_member.value?.map((item: string, index) => {
      return {
        label: `${index + 1}-${
          OutputFrameStructureOptionsAndVerifyChildAndFrameLengthObject[
            (item as unknown) as keyof typeof OutputFrameStructureOptionsAndVerifyChildAndFrameLengthObject
          ]
        }`,
        value: item
      }
    })
    return res
  }, [processor.framing_member])

  // 帧长度元素
  const framing_lengthValue = useMemo(() => {
    if (!processor.length_member.value) return []
    const res = processor.length_member.value.map((item: string) => {
      return {
        label: `${
          OutputFrameStructureOptionsAndVerifyChildAndFrameLengthObject[
            (item as unknown) as keyof typeof OutputFrameStructureOptionsAndVerifyChildAndFrameLengthObject
          ]
        }`,
        value: item
      }
    })
    return res
  }, [processor.length_member])

  const { portList } = publicAttributes()
  const ALGORITHM = getSystemConstantsStore(state => state.ALGORITHM)
  const { checkoutProcessor, updateOnceFormValue, updateProcessor, frontendCheckoutName, onBlurAsyncCheckoutNameFormValues } = RightListStore()
  // const { getPeripheralAttributes } = RightDetailsAttributesStore()
  const { checkInterrupt, checkNullAndHex, checkNameLength, checkNameFormat } = checkUtilFnStore()
  const DropdownRender = React.useCallback(
    (props: { title: string; type: string }) => {
      const { title, type } = props

      const checkedList = (processor[type as keyof typeof processor] as valueParams).value
      const onChange = (list: CheckboxValueType[]) => {
        updateOnceFormValue(list, title, type)
      }
      return (
        <div style={{ width: '100%' }}>
          <Checkbox.Group value={(checkedList as unknown) as CheckboxValueType[]} className={StyleSheet.checkBoxGroupBody} onChange={onChange}>
            {OutputFrameStructureOptionsAndVerifyChildAndFrameLength.map(item => {
              return (
                <div key={item.value} className={StyleSheet.renderCheckBoxItem}>
                  <span style={{ lineHeight: '32px' }}> {item.label} </span>
                  <Checkbox style={{ lineHeight: '32px' }} value={item.value} />
                </div>
              )
            })}
          </Checkbox.Group>
        </div>
      )
    },
    [processor, updateOnceFormValue]
  )

  const DropdownRenderS = React.useCallback(
    (props: { title: string; type: string }) => {
      const { title, type } = props

      const checkedList = (processor[type as keyof typeof processor] as valueParams).value
      const onChange = (list: CheckboxValueType[]) => {
        updateOnceFormValue(list, title, type)
      }
      return (
        <div style={{ width: '100%' }}>
          <Checkbox.Group value={(checkedList as unknown) as CheckboxValueType[]} className={StyleSheet.checkBoxGroupBody} onChange={onChange}>
            {OutputFrameStructureOptionsAndVerifyChildAndFrameLengthLs.map(item => {
              return (
                <div key={item.value} className={StyleSheet.renderCheckBoxItem}>
                  <span style={{ lineHeight: '32px' }}> {item.label} </span>
                  <Checkbox style={{ lineHeight: '32px' }} value={item.value} />
                </div>
              )
            })}
          </Checkbox.Group>
        </div>
      )
    },
    [processor, updateOnceFormValue]
  )

  const TagRender = React.useCallback(
    (props: { title: string; type: string } & CustomTagProps) => {
      const { type, title, closable, label, value } = props

      const data = (processor[type as keyof typeof processor] as valueParamsArray).value as string[]
      const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
        event.preventDefault()
        event.stopPropagation()
      }
      const onClose = () => {
        const filterData = data?.filter(item => item !== value)
        updateOnceFormValue(filterData, title, type)
      }
      return (
        <Tag className={StyleSheet.tagStyle} onMouseDown={onPreventMouseDown} closable={closable} onClose={onClose}>
          <span>{label}</span>
        </Tag>
      )
    },
    [processor, updateOnceFormValue]
  )
  const closeMenu = (visible: boolean, type?: string) => {
    if (!visible) {
      updateProcessor(type)
    }
  }

  const clearValue = React.useCallback(
    (type?: string) => {
      updateProcessor(type)
    },
    [updateProcessor]
  )

  // 获取非状态寄存器
  const closeMenuAndGetRegisterList = React.useCallback(
    async (visible: boolean) => {
      if (!visible) {
        updateProcessor('peripheral_id')
      }
      if (platform_id && visible) getAll(+platform_id)
    },
    [platform_id, updateProcessor]
  )

  return (
    <div className={StyleSheet.rightConcentBody} id='area'>
      <Form form={form} layout='vertical' className={StyleSheet.rightFromCommonStyle}>
        <div style={{ padding: '8px 16px' }}>
          <Form.Item label='数据处理器名称' help={processor.name.errorMsg} hasFeedback validateStatus={processor.name.validateStatus}>
            <Input
              value={processor.name.value}
              placeholder='请输入数据处理器名称'
              onChange={e => {
                frontendCheckoutName(e.target.value, '数据处理器', 'name', checkNameLength, checkNameFormat)
              }}
              onBlur={e => {
                onBlurAsyncCheckoutNameFormValues(e.target.value, '数据处理器', 'name', updateProcessor)
              }}
            />
          </Form.Item>

          <Form.Item label='端口'>
            <Select
              value={processor.port.value as string}
              getPopupContainer={() => document.querySelector('#area') as HTMLElement}
              placeholder='请选择端口'
              onChange={(value: string) => {
                updateOnceFormValue(value, '数据处理器', 'port')
              }}
              onDropdownVisibleChange={visible => {
                closeMenu(visible, 'port')
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
          <Form.Item label='中断号' help={processor.interrupt.errorMsg} hasFeedback validateStatus={processor.interrupt.validateStatus}>
            <Input
              value={processor.interrupt.value}
              placeholder='请输入中断号'
              onChange={e => {
                updateOnceFormValue(e.target.value, '数据处理器', 'interrupt')
              }}
              onBlur={e => {
                checkoutProcessor(e.target.value, '数据处理器', 'interrupt', checkInterrupt, updateProcessor)
              }}
            />
          </Form.Item>
        </div>
        <div style={{ padding: '8px 16px' }} className={StyleSheet.dataFormatProcessing}>
          <span className={StyleSheet.spanTitle}>数据加工与输出格式编排</span>
          <Form.Item label='帧头' help={processor.sof.errorMsg} hasFeedback validateStatus={processor.sof.validateStatus}>
            <Input
              placeholder='请输入帧头'
              value={processor.sof.value}
              onChange={e => {
                updateOnceFormValue(e.target.value, '数据处理器', 'sof')
              }}
              onBlur={e => {
                checkoutProcessor(e.target.value, '数据处理器', 'sof', checkNullAndHex, updateProcessor)
              }}
            />
          </Form.Item>
          <Form.Item label='帧尾' help={processor.eof.errorMsg} hasFeedback validateStatus={processor.eof.validateStatus}>
            <Input
              value={processor.eof.value}
              placeholder='请输入帧尾'
              onChange={e => {
                updateOnceFormValue(e.target.value, '数据处理器', 'eof')
              }}
              onBlur={e => {
                checkoutProcessor(e.target.value, '数据处理器', 'eof', checkNullAndHex, updateProcessor)
              }}
            />
          </Form.Item>
          <Form.Item label='帧长度元素'>
            <Select
              showSearch={Boolean(0)}
              placeholder='请选择帧长度元素'
              allowClear
              value={framing_lengthValue}
              onDropdownVisibleChange={visible => {
                closeMenu(visible)
              }}
              onClear={() => {
                updateOnceFormValue([], '数据处理器', 'length_member')
                clearValue()
              }}
              mode='tags'
              dropdownRender={() => <DropdownRender title='数据处理器' type='length_member' />}
              getPopupContainer={() => document.querySelector('#area') as HTMLElement}
              showArrow
              tagRender={props => <TagRender {...props} title='数据处理器' type='length_member' />}
            />
          </Form.Item>
          <Form.Item label='校验算法'>
            <Select
              placeholder='请选择校验算法'
              getPopupContainer={() => document.querySelector('#area') as HTMLElement}
              value={processor.algorithm.value ? processor.algorithm.value : null}
              showSearch={Boolean(0)}
              allowClear
              showArrow
              onDropdownVisibleChange={visible => {
                closeMenu(visible)
              }}
              onChange={value => {
                updateOnceFormValue(value, '数据处理器', 'algorithm')
              }}
              onClear={() => {
                updateOnceFormValue('', '数据处理器', 'algorithm')
                clearValue()
              }}
            >
              {ALGORITHM?.map((rate: any) => {
                return (
                  <Option key={rate.value} value={rate.value}>
                    {rate.label}
                  </Option>
                )
              })}
            </Select>
          </Form.Item>
          <Form.Item label='校验子项' tooltip='按照校验顺序指定要校验的子项'>
            <Select
              placeholder='请选择校验子项'
              onClear={() => {
                updateOnceFormValue([], '数据处理器', 'checksum_member')
                clearValue()
              }}
              showSearch={Boolean(0)}
              allowClear
              value={checkoutChild}
              onDropdownVisibleChange={visible => {
                closeMenu(visible)
              }}
              mode='tags'
              dropdownRender={() => <DropdownRenderS title='数据处理器' type='checksum_member' />}
              getPopupContainer={() => document.querySelector('#area') as HTMLElement}
              showArrow
              tagRender={props => <TagRender {...props} title='数据处理器' type='checksum_member' />}
            />
          </Form.Item>
          <Form.Item label='输出帧结构' tooltip='指定数据帧元素和顺序,生成预期的输出帧结构'>
            <Select
              showSearch={Boolean(0)}
              allowClear
              placeholder='请选择输出帧结构'
              onClear={() => {
                updateOnceFormValue([], '数据处理器', 'framing_member')
                clearValue()
              }}
              value={framing_memberValue}
              onDropdownVisibleChange={visible => {
                closeMenu(visible)
              }}
              mode='tags'
              dropdownRender={() => <DropdownRender title='数据处理器' type='framing_member' />}
              getPopupContainer={() => document.querySelector('#area') as HTMLElement}
              showArrow
              tagRender={props => <TagRender {...props} title='数据处理器' type='framing_member' />}
            />
          </Form.Item>
        </div>
        <div style={{ padding: '8px 16px' }} className={StyleSheet.dataFormatProcessing}>
          <span className={StyleSheet.spanTitle}>输出寄存器</span>
          <Form.Item label='外设'>
            <Select
              placeholder='请选择外设'
              value={processor.peripheral_id.value}
              showSearch={Boolean(0)}
              allowClear
              onChange={value => {
                updateOnceFormValue(value as string, '数据处理器', 'peripheral_id')
              }}
              onClear={() => {
                updateOnceFormValue('', '数据处理器', 'peripheral_id')
                clearValue('peripheral_id')
              }}
              getPopupContainer={() => document.querySelector('#area') as HTMLElement}
              onDropdownVisibleChange={visible => {
                closeMenuAndGetRegisterList(visible)
              }}
            >
              {AllPeripheralList?.map((rate: any) => {
                return (
                  <Option key={rate.id} value={rate.id}>
                    {rate.name}
                  </Option>
                )
              })}
            </Select>
          </Form.Item>
          <Form.Item label='寄存器'>
            <Select
              placeholder='请选择寄存器'
              value={processor.register_id.value}
              disabled={!resgiedDisabled}
              onClear={() => {
                updateOnceFormValue('', '数据处理器', 'register_id')
                clearValue()
              }}
              onChange={value => {
                updateOnceFormValue(value as string, '数据处理器', 'register_id')
              }}
              getPopupContainer={() => document.querySelector('#area') as HTMLElement}
              onDropdownVisibleChange={visible => {
                closeMenu(visible, 'register_id')
              }}
            >
              {notRegsiterList?.map((rate: any) => {
                return (
                  <Option key={rate.id} value={rate.id}>
                    {rate.name}
                  </Option>
                )
              })}
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
  const peripheral = RightListStore(state => state.peripheral)
  const { name, address_length, base_address } = peripheral
  const { PERIPHERAL_TYPE } = getSystemConstantsStore()
  const {
    updatePeripheral,
    frontendCheckoutName,
    onBlurAsyncCheckoutNameFormValues,
    checkoutBase_addreeAndLength,
    updateOnceFormValue
  } = RightListStore()

  const { checkHex, checkNameFormat, checkNameLength } = checkUtilFnStore()

  const disabledStatus = useMemo(() => {
    return peripheral.variety === 1
  }, [peripheral])

  return (
    <div className={StyleSheet.rightFromCommonStyle} style={{ padding: '8px 16px' }}>
      <Form form={form} layout='vertical' id='area'>
        <Form.Item label='外设名称' help={name.errorMsg} hasFeedback validateStatus={name.validateStatus}>
          <Input
            style={{ borderRadius: '4px' }}
            value={peripheral.name.value}
            onChange={e => {
              frontendCheckoutName(e.target.value, '外设', 'name', checkNameLength, checkNameFormat)
            }}
            onBlur={e => {
              onBlurAsyncCheckoutNameFormValues(e.target.value, '外设', 'name', updatePeripheral, peripheral)
            }}
            placeholder='外设名称'
            disabled={disabledStatus}
          />
        </Form.Item>
        <Form.Item label='类型'>
          <Select
            getPopupContainer={() => document.querySelector('#area') as HTMLElement}
            placeholder='请选择类型'
            onChange={(value: string) => {
              updateOnceFormValue(value, '外设', 'kind')
            }}
            value={peripheral.kind.value as string}
            disabled={disabledStatus}
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
        <Form.Item label='基地址' help={base_address.errorMsg} hasFeedback validateStatus={base_address.validateStatus}>
          <Input
            prefix='0x'
            value={peripheral.base_address.value}
            disabled={disabledStatus}
            onChange={e => {
              checkoutBase_addreeAndLength(e.target.value, '外设', 'base_address', checkHex)
            }}
            onBlur={e => {
              onBlurAsyncCheckoutNameFormValues(e.target.value, '外设', 'base_address', updatePeripheral, peripheral)
            }}
          />
        </Form.Item>
        <Form.Item label='地址大小' help={address_length.errorMsg} hasFeedback validateStatus={address_length.validateStatus}>
          <Input
            placeholder='请输入基地址大小'
            onChange={e => {
              checkoutBase_addreeAndLength(e.target.value, '外设', 'address_length', checkHex)
            }}
            onBlur={e => {
              onBlurAsyncCheckoutNameFormValues(e.target.value, '外设', 'address_length', updatePeripheral, peripheral)
            }}
            value={peripheral.address_length.value}
            prefix='0x'
            suffix='字节'
            disabled={disabledStatus}
          />
        </Form.Item>
        <Form.Item label='描述' help={peripheral.desc.errorMsg} hasFeedback validateStatus={peripheral.desc.validateStatus}>
          <TextArea
            placeholder={disabledStatus ? '-' : '请输入描述'}
            value={peripheral.desc.value}
            disabled={disabledStatus}
            showCount={{
              formatter({ count }) {
                return `${count}/50`
              }
            }}
            onChange={e => {
              updateOnceFormValue(e.target.value, '外设', 'desc')
            }}
            onBlur={e => {
              onBlurAsyncCheckoutNameFormValues(e.target.value, '外设', 'desc', updatePeripheral, peripheral)
            }}
          />
        </Form.Item>
      </Form>
    </div>
  )
}
const PeripheralDetailsAttributesMemo = React.memo(PeripheralDetailsAttributes)

// 定义寄存器
const RegisterDetailsAttributes = () => {
  const [form] = Form.useForm()
  const rightArrributes = RightDetailsAttributesStore(state => state.rightArrributes)
  const registerListOkr = RightDetailsAttributesStore(state => state.register)

  const isCustomMadePeripheralOrboardPeripheralNums = useMemo(() => {
    return rightArrributes.variety === 1
  }, [rightArrributes.variety])

  const register = RightListStore(state => state.register)

  const {
    updateRegister,
    checkoutBase_addreeAndLength,
    updateOnceFormValue,
    frontendCheckoutName,
    onBlurAsyncCheckoutNameFormValues
  } = RightListStore()

  const { AllPeripheralList, customMadePeripheralList } = useLeftModelDetailsStore()

  const registerListStatus = useMemo(() => {
    if (!registerListOkr?.length) return []
    const registerListArray = registerListOkr?.filter((item: any) => {
      return item.kind === 0
    })
    return registerListArray
  }, [registerListOkr])

  const {
    peripheral_id,
    peripheral,
    relative_address,
    sr_peri_id,
    name,
    finish,
    kind,
    set_cmd,
    set_value,
    sr_id,
    restore_cmd,
    restore_value
  } = register
  const { REGISTER_CMD } = getSystemConstantsStore()

  const { checkNameFormat, checkNameLength, checkNullAndHex, checkHex } = checkUtilFnStore()

  const isBoardLevePeripherals = useMemo(() => {
    const res = isCustomMadePeripheralOrboardPeripheralNums ? [peripheral.value] : customMadePeripheralList
    return res
  }, [customMadePeripheralList, isCustomMadePeripheralOrboardPeripheralNums, peripheral.value])

  const isKind = useMemo(() => {
    return kind.value === 0
  }, [kind])

  const clearValue = (title: string, type: string) => {
    updateOnceFormValue(null, title, type)
    updateRegister()
  }

  const closeMenu = (visible: boolean, type?: string) => {
    if (!visible) {
      updateRegister(type)
    }
  }

  const SelectBefore = (props: { type: string; title: string; values: string; fn: (value: string, title: string, type: string) => void }) => {
    const { type, title, values, fn } = props

    return (
      <Select
        getPopupContainer={() => document.querySelector('#area') as HTMLElement}
        onClear={() => {
          clearValue(title, type)
        }}
        showArrow
        showSearch={Boolean(0)}
        allowClear
        value={values}
        style={{ width: 70, height: 30 }}
        onChange={(value: string) => {
          fn(value, title, type)
        }}
        onDropdownVisibleChange={visible => {
          closeMenu(visible)
        }}
      >
        {REGISTER_CMD?.map(rate => {
          return (
            <Option key={rate?.value} value={rate?.value}>
              {rate?.label}
            </Option>
          )
        })}
      </Select>
    )
  }

  return (
    <div>
      <Form form={form} layout='vertical' className={StyleSheet.rightFromCommonStyle} id='area'>
        <div className={StyleSheet.rightFromCommonHeaderStyle} style={{ padding: '8px 16px' }}>
          <Form.Item label='所属外设'>
            <Select
              placeholder='请选择所属外设'
              showSearch={Boolean(0)}
              getPopupContainer={() => document.querySelector('#area') as HTMLElement}
              onDropdownVisibleChange={visible => {
                closeMenu(visible, 'peripheral_id')
              }}
              onChange={value => {
                updateOnceFormValue(value as string, '寄存器', 'peripheral_id')
              }}
              style={{ borderRadius: '4px' }}
              value={peripheral_id.value}
              disabled={isCustomMadePeripheralOrboardPeripheralNums}
            >
              {isBoardLevePeripherals?.map((rate: any) => {
                return (
                  <Option key={rate?.id} value={rate?.id}>
                    {rate?.name}
                  </Option>
                )
              })}
            </Select>
          </Form.Item>
          <Form.Item label='寄存器名称' help={name.errorMsg} hasFeedback validateStatus={name.validateStatus}>
            <Input
              style={{ borderRadius: '4px' }}
              value={name.value}
              onChange={e => {
                frontendCheckoutName(e.target.value, '寄存器', 'name', checkNameLength, checkNameFormat)
              }}
              onBlur={e => {
                onBlurAsyncCheckoutNameFormValues(e.target.value, '寄存器', 'name', updateRegister, register)
              }}
              disabled={isCustomMadePeripheralOrboardPeripheralNums}
            />
          </Form.Item>
          <Form.Item label='偏移地址' help={relative_address.errorMsg} hasFeedback validateStatus={relative_address.validateStatus}>
            <Input
              prefix='0x'
              value={relative_address.value}
              onChange={e => {
                checkoutBase_addreeAndLength(e.target.value, '寄存器', 'relative_address', checkHex)
              }}
              onBlur={e => {
                onBlurAsyncCheckoutNameFormValues(e.target.value, '寄存器', 'relative_address', updateRegister, register)
              }}
              disabled={isCustomMadePeripheralOrboardPeripheralNums}
            />
          </Form.Item>
          <Form.Item label='初始化完成'>
            <Select
              style={{ borderRadius: '4px' }}
              showSearch={Boolean(0)}
              onDropdownVisibleChange={visible => {
                closeMenu(visible)
              }}
              value={finish.value}
              onChange={value => {
                updateOnceFormValue(value as string, '寄存器', 'finish')
              }}
            >
              {isFinish?.map((rate: any) => {
                return (
                  <Option key={rate?.value} value={rate?.value}>
                    {rate?.label}
                  </Option>
                )
              })}
            </Select>
          </Form.Item>
        </div>
        <div className={StyleSheet.isStatusRegister}>
          <Form.Item label='是否为状态寄存器'>
            <Select
              showSearch={Boolean(0)}
              onDropdownVisibleChange={visible => {
                closeMenu(visible)
              }}
              getPopupContainer={() => document.querySelector('#area') as HTMLElement}
              style={{ borderRadius: '4px' }}
              value={kind.value}
              onChange={value => {
                updateOnceFormValue(value as string, '寄存器', 'kind')
              }}
            >
              {isStatusRegister?.map((rate: any) => {
                return (
                  <Option key={rate?.value} value={rate?.value}>
                    {rate?.label}
                  </Option>
                )
              })}
            </Select>
          </Form.Item>
        </div>

        {!isKind ? (
          <div style={{ padding: '8px 16px' }}>
            <span className={StyleSheet.spanTitle}>关联状态寄存器</span>
            <Form.Item label='外设'>
              <Select
                getPopupContainer={() => document.querySelector('#area') as HTMLElement}
                style={{ borderRadius: '4px' }}
                showSearch={Boolean(0)}
                allowClear
                onDropdownVisibleChange={visible => {
                  closeMenu(visible, 'sr_peri_id')
                }}
                onChange={value => {
                  updateOnceFormValue(value as string, '寄存器', 'sr_peri_id')
                }}
                onClear={() => {
                  clearValue('寄存器', 'sr_peri_id')
                }}
                value={sr_peri_id.value}
                placeholder='请选择关联状态寄存器所属外设'
              >
                {AllPeripheralList?.map((rate: any) => {
                  return (
                    <Option key={rate?.id} value={rate?.id}>
                      {rate?.name}
                    </Option>
                  )
                })}
              </Select>
            </Form.Item>
            <Form.Item label='关联状态寄存器'>
              <Select
                getPopupContainer={() => document.querySelector('#area') as HTMLElement}
                placeholder='请选择关联状态寄存器'
                disabled={!sr_peri_id.value}
                showSearch={Boolean(0)}
                value={sr_id.value}
                onDropdownVisibleChange={visible => {
                  closeMenu(visible, 'sr_id')
                }}
                onChange={value => {
                  updateOnceFormValue(value as string, '寄存器', 'sr_id')
                }}
              >
                {registerListStatus?.map((rate: any) => {
                  return (
                    <Option key={rate?.id} value={rate?.id}>
                      {rate?.name}
                    </Option>
                  )
                })}
              </Select>
            </Form.Item>
          </div>
        ) : (
          <>
            <div className={StyleSheet.footerFormTop}>
              <div className={StyleSheet.footerFormChart}>
                <span className={StyleSheet.setStyle}>设置</span>
                <span className={StyleSheet.setStyle} style={{ marginLeft: '50px' }}>
                  操作数
                </span>
              </div>
              <Form.Item help={set_value.errorMsg} hasFeedback validateStatus={set_value.validateStatus}>
                <Input
                  prefix='0x'
                  addonBefore={<SelectBefore title='寄存器' type='set_cmd' values={set_cmd.value as string} fn={updateOnceFormValue} />}
                  value={set_value.value}
                  onChange={e => {
                    checkoutBase_addreeAndLength(e.target.value, '寄存器', 'set_value', checkNullAndHex)
                  }}
                  onBlur={e => {
                    onBlurAsyncCheckoutNameFormValues(e.target.value, '寄存器', 'set_value', updateRegister, register)
                  }}
                />
              </Form.Item>
            </div>
            <div className={StyleSheet.footerFormTop}>
              <div className={StyleSheet.footerFormChart}>
                <span className={StyleSheet.setStyle}>恢复</span>
                <span className={StyleSheet.setStyle} style={{ marginLeft: '50px' }}>
                  操作数
                </span>
              </div>
              <Form.Item help={restore_value.errorMsg} hasFeedback validateStatus={restore_value.validateStatus}>
                <Input
                  prefix='0x'
                  style={{ borderRadius: 4 }}
                  addonBefore={<SelectBefore title='寄存器' type='restore_cmd' values={restore_cmd.value as string} fn={updateOnceFormValue} />}
                  value={restore_value.value}
                  onChange={e => {
                    checkoutBase_addreeAndLength(e.target.value, '寄存器', 'restore_value', checkNullAndHex)
                  }}
                  onBlur={e => {
                    onBlurAsyncCheckoutNameFormValues(e.target.value, '寄存器', 'restore_value', updateRegister, register)
                  }}
                />
              </Form.Item>
            </div>
          </>
        )}
      </Form>
    </div>
  )
}
const RegisterDetailsAttributesMemo = React.memo(RegisterDetailsAttributes)

// Done 定义定时器组件
const TimerDetailsAttributes = () => {
  const [form] = Form.useForm()
  const timer = RightListStore(state => state.timer)
  const {
    frontendCheckoutName,
    updateTimer,
    onBlurAsyncCheckoutNameFormValues,
    checkoutTimerPeriodAndInterrupt,
    updateOnceFormValue
  } = RightListStore()
  const { checkInterrupt, checkInterval, checkNameFormat, checkNameLength } = checkUtilFnStore()

  const { name, period, interrupt } = timer
  return (
    <div className={StyleSheet.rightFromCommonStyle} style={{ padding: '8px 16px' }}>
      <Form form={form} layout='vertical'>
        <Form.Item label='定时器名称' help={name.errorMsg} hasFeedback validateStatus={name.validateStatus}>
          <Input
            value={name.value}
            placeholder='请输入定时器名称'
            onChange={e => {
              frontendCheckoutName(e.target.value, '定时器', 'name', checkNameLength, checkNameFormat)
            }}
            onBlur={e => {
              onBlurAsyncCheckoutNameFormValues(e.target.value, '定时器', 'name', updateTimer, timer)
            }}
          />
        </Form.Item>
        <Form.Item label='间隔' help={period.errorMsg} hasFeedback validateStatus={period.validateStatus}>
          <Input
            suffix='微秒'
            placeholder='请输入间隔'
            value={period.value}
            onChange={e => {
              updateOnceFormValue(e.target.value, '定时器', 'period')
            }}
            onBlur={e => {
              checkoutTimerPeriodAndInterrupt(e.target.value, '定时器', 'period', checkInterval)
            }}
          />
        </Form.Item>
        <Form.Item label='中断号' help={interrupt.errorMsg} hasFeedback validateStatus={interrupt.validateStatus}>
          <Input
            placeholder='请输入中断号'
            value={interrupt.value}
            onChange={e => {
              updateOnceFormValue(e.target.value, '定时器', 'interrupt')
            }}
            onBlur={e => {
              checkoutTimerPeriodAndInterrupt(e.target.value, '定时器', 'interrupt', checkInterrupt)
            }}
          />
        </Form.Item>
      </Form>
    </div>
  )
}

const TimerDetailsAttributesMemo = React.memo(TimerDetailsAttributes)

// Done 定义目标机组件
const TargetDetailsAttributes = (props: { name: string; processor: string; desc: string }) => {
  const [form] = Form.useForm()
  const formValueMemo = useMemo(() => {
    return {
      name: props?.name,
      processor: props?.processor,
      desc: props?.desc
    }
  }, [props])
  return (
    <div style={{ padding: '8px 16px' }} className={StyleSheet.rightFromCommonStyle}>
      <Form form={form} layout='vertical'>
        <Form.Item label='名称'>
          <Input disabled value={formValueMemo.name} />
        </Form.Item>
        <Form.Item label='处理器类型'>
          <Input disabled value={formValueMemo.processor} />
        </Form.Item>
        <Form.Item label='描述'>
          <TextArea disabled value={formValueMemo.desc} autoSize={{ minRows: 3, maxRows: 4 }} />
        </Form.Item>
      </Form>
    </div>
  )
}

const TargetDetailsAttributesMemo = React.memo(TargetDetailsAttributes)

export { TargetDetailsAttributesMemo, TimerDetailsAttributesMemo, RegisterDetailsAttributesMemo, PeripheralDetailsAttributesMemo, ProcessorFormMemo }
