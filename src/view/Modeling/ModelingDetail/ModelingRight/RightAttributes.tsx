import { Checkbox, Form, Input, Select, Tag } from 'antd'
import React, { useEffect, useMemo } from 'react'
import { getSystemConstantsStore } from 'Src/webSocket/webSocketStore'
import TextArea from 'antd/lib/input/TextArea'
import type { CustomTagProps } from 'rc-select/lib/BaseSelect'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import StyleSheet from './ModelingRight.less'
import { LeftAndRightStore } from '../../Store/ModelLeftAndRight/leftAndRightStore'
import { LeftListStore } from '../../Store/ModeleLeftListStore/LeftListStore'
import { publicAttributes } from '../../Store/ModelStore'
import { BaseDataHandler, BaseErrorType } from '../../Store/ModelLeftAndRight/leftAndRightStoreType'

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
          <Input disabled value={processor?.value} />
        </Form.Item>
        <Form.Item label='描述'>
          <TextArea disabled value={desc?.value} autoSize={{ minRows: 3, maxRows: 4 }} />
        </Form.Item>
      </Form>
    </div>
  )
}

// todo 更新属性代做
const PeripheralComponents: React.FC = () => {
  const [form] = Form.useForm()
  const { PERIPHERAL_TYPE } = getSystemConstantsStore()
  const rightPeripheral = LeftAndRightStore(state => state.rightPeripheral)
  const { name, base_address, kind, address_length, desc, variety } = rightPeripheral
  const { onChangeFn, onBlurFn, closeMenu, rightAttributes } = LeftAndRightStore()

  const disabledVariety = React.useMemo(() => {
    return Boolean(variety)
  }, [variety])

  return (
    <div className={StyleSheet.rightFromCommonStyle} style={{ padding: '8px 16px' }}>
      <Form form={form} layout='vertical' id='area'>
        <Form.Item label='外设名称' help={name.errorMsg} hasFeedback validateStatus={name.validateStatus}>
          <Input
            disabled={disabledVariety}
            style={{ borderRadius: '4px' }}
            placeholder='外设名称'
            value={name?.value}
            onChange={(e: { target: { value: string | number | string[] | number[] | undefined } }) => {
              onChangeFn('rightPeripheral', 'name', e.target.value)
            }}
            onBlur={() => {
              if (rightAttributes.name === name.value) return
              onBlurFn(name.validateStatus, 'rightPeripheral')
            }}
          />
        </Form.Item>
        <Form.Item label='类型'>
          <Select
            value={kind.value}
            disabled={disabledVariety}
            getPopupContainer={() => document.querySelector('#area') as HTMLElement}
            onChange={e => {
              if (e === kind.value) return
              onChangeFn('rightPeripheral', 'kind', e)
              closeMenu(false, kind.validateStatus, 'rightPeripheral')
            }}
            placeholder='请选择类型'
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
            disabled={disabledVariety}
            value={base_address?.value}
            onChange={(e: { target: { value: string | number | string[] | number[] | undefined } }) => {
              onChangeFn('rightPeripheral', 'base_address', e.target.value)
            }}
            onBlur={() => {
              if (rightAttributes.base_address === base_address.value) return
              onBlurFn(base_address?.validateStatus, 'rightPeripheral')
            }}
          />
        </Form.Item>
        <Form.Item label='地址大小' help={address_length.errorMsg} hasFeedback validateStatus={address_length.validateStatus}>
          <Input
            placeholder='请输入基地址大小'
            disabled={disabledVariety}
            onChange={(e: { target: { value: string | number | string[] | number[] | undefined } }) => {
              onChangeFn('rightPeripheral', 'address_length', e.target.value)
            }}
            onBlur={() => {
              if (rightAttributes.address_length === address_length.value) return
              onBlurFn(address_length.validateStatus, 'rightPeripheral')
            }}
            prefix='0x'
            suffix='字节'
            value={address_length?.value}
          />
        </Form.Item>
        <Form.Item label='描述' help={desc.errorMsg} hasFeedback validateStatus={desc.validateStatus}>
          <TextArea
            value={desc?.value}
            placeholder={disabledVariety ? '-' : '请输入描述'}
            disabled={disabledVariety}
            onChange={e => {
              onChangeFn('rightPeripheral', 'desc', e.target.value)
            }}
            onBlur={() => {
              const bol = desc?.value === undefined || (desc?.value as string)?.length <= 50
              if (!bol) return
              onBlurFn(desc.validateStatus, 'rightPeripheral')
            }}
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

const RegisterComponents: React.FC = () => {
  const [form] = Form.useForm()
  const { rightDataRegister, onChangeFn, onBlurFn, closeMenu, getPeripheralDetail, registerList, rightAttributes } = LeftAndRightStore()

  const {
    variety,
    peripheral_id,
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
  } = rightDataRegister
  const { headerBarList } = LeftListStore()
  const { REGISTER_CMD } = getSystemConstantsStore()

  const isKind = useMemo(() => {
    return kind.value === 0
  }, [kind])

  const registerListStatus = useMemo(() => {
    if (!registerList?.length) return []
    const registerListArray = registerList?.filter((item: any) => {
      return item.kind === 0
    })
    return registerListArray
  }, [registerList])

  useEffect(() => {
    if (sr_peri_id && sr_peri_id?.value) {
      getPeripheralDetail(+sr_peri_id?.value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sr_peri_id])

  const SelectBefore = (props: { type: string; values: string | undefined; status: string | undefined }) => {
    const { type, values, status } = props
    return (
      <Select
        getPopupContainer={() => document.querySelector('#area') as HTMLElement}
        showArrow
        showSearch={Boolean(0)}
        allowClear
        value={values}
        style={{ width: 70, height: 30 }}
        onClear={() => {
          onChangeFn('rightDataRegister', type, null)
          closeMenu(false, status, 'rightDataRegister')
        }}
        onChange={(value: string) => {
          if (value === values) return
          onChangeFn('rightDataRegister', type, value)
          closeMenu(false, status, 'rightDataRegister')
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
              disabled
              getPopupContainer={() => document.querySelector('#area') as HTMLElement}
              style={{ borderRadius: '4px' }}
              value={peripheral_id?.value}
            >
              {headerBarList?.map((rate: any) => {
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
              value={name?.value}
              disabled={((variety as unknown) as number) === 1}
              onChange={(e: { target: { value: string | number | string[] | number[] | undefined } }) => {
                onChangeFn('rightDataRegister', 'name', e.target.value)
              }}
              onBlur={() => {
                if (rightAttributes.name === name.value) return
                onBlurFn(name.validateStatus, 'rightDataRegister')
              }}
            />
          </Form.Item>
          <Form.Item label='偏移地址' help={relative_address.errorMsg} hasFeedback validateStatus={relative_address.validateStatus}>
            <Input
              prefix='0x'
              value={relative_address?.value}
              disabled={((variety as unknown) as number) === 1}
              onChange={(e: { target: { value: string | number | string[] | number[] | undefined } }) => {
                onChangeFn('rightDataRegister', 'relative_address', e.target.value)
              }}
              onBlur={() => {
                if (rightAttributes.relative_address === relative_address.value) return
                onBlurFn(relative_address.validateStatus, 'rightDataRegister')
              }}
            />
          </Form.Item>
          <Form.Item label='初始化完成'>
            <Select
              style={{ borderRadius: '4px' }}
              showSearch={Boolean(0)}
              onChange={e => {
                if (e === finish.value) return
                onChangeFn('rightDataRegister', 'finish', e)
                closeMenu(false, finish.validateStatus, 'rightDataRegister')
              }}
              value={finish?.value}
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
              getPopupContainer={() => document.querySelector('#area') as HTMLElement}
              style={{ borderRadius: '4px' }}
              value={kind.value}
              onChange={e => {
                if (e === kind.value) return
                onChangeFn('rightDataRegister', 'kind', e)
                closeMenu(false, kind.validateStatus, 'rightDataRegister')
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
                value={sr_peri_id.value}
                onClear={() => {
                  onChangeFn('rightDataRegister', 'sr_peri_id', null)
                  onChangeFn('rightDataRegister', 'sr_id', null)
                  closeMenu(false, sr_peri_id.validateStatus, 'rightDataRegister')
                }}
                onChange={e => {
                  if (e) {
                    getPeripheralDetail(+e)
                    if (e === sr_peri_id.value) return
                    onChangeFn('rightDataRegister', 'sr_peri_id', e)
                    closeMenu(false, sr_peri_id.validateStatus, 'rightDataRegister')
                  }
                }}
                placeholder='请选择关联状态寄存器所属外设'
              >
                {headerBarList?.map((rate: any) => {
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
                onChange={async e => {
                  if (e && sr_peri_id?.value) {
                    await getPeripheralDetail(+sr_peri_id?.value)
                    if (e === sr_id.value) return
                    onChangeFn('rightDataRegister', 'sr_id', e)
                    closeMenu(false, sr_id.validateStatus, 'rightDataRegister')
                  }
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
                  style={{ borderRadius: 4 }}
                  value={set_value.value}
                  addonBefore={<SelectBefore type='set_cmd' values={set_cmd.value as string} status={set_cmd.validateStatus} />}
                  onChange={(e: { target: { value: string | number | string[] | number[] | undefined } }) => {
                    onChangeFn('rightDataRegister', 'set_value', e.target.value)
                  }}
                  onBlur={() => {
                    if (rightAttributes.set_value === set_value.value) return
                    onBlurFn(set_value.validateStatus, 'rightDataRegister')
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
                  addonBefore={<SelectBefore type='restore_cmd' values={restore_cmd.value as string} status={restore_value.validateStatus} />}
                  value={restore_value?.value}
                  onChange={(e: { target: { value: string | number | string[] | number[] | undefined } }) => {
                    onChangeFn('rightDataRegister', 'restore_value', e.target.value)
                  }}
                  onBlur={() => {
                    if (rightAttributes.restore_value === restore_value.value) return
                    onBlurFn(restore_value.validateStatus, 'rightDataRegister')
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

const DataHanderComponents: React.FC = () => {
  const { rightDataHandler, onChangeFn, clearFn, onBlurFn, closeMenu, getPeripheralDetail, registerList, rightAttributes } = LeftAndRightStore()
  const { headerBarList } = LeftListStore()
  const { name, port, interrupt, sof, eof, checksum_member, peripheral_id, framing_member, length_member, algorithm, register_id } = rightDataHandler
  const [form] = Form.useForm()

  //  kind 0是状态  1非状态 非状态寄存器
  const notRegsiterList = useMemo(() => {
    return registerList?.filter((item: any) => item.kind === 1)
  }, [registerList])

  //  寄存器的disablled
  const resgiedDisabled = useMemo(() => {
    return Boolean(rightDataHandler.peripheral_id.value)
  }, [rightDataHandler])

  // 校验子项
  const checkoutChild = useMemo(() => {
    if (!rightDataHandler.checksum_member.value) return []
    const res = rightDataHandler.checksum_member.value.map((item, index: number) => {
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
  }, [rightDataHandler])

  // 帧组合
  const framing_memberValue = useMemo(() => {
    if (!rightDataHandler.framing_member.value) return []
    const res = rightDataHandler.framing_member.value?.map((item, index) => {
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
  }, [rightDataHandler.framing_member])

  // 帧长度元素
  const framing_lengthValue = useMemo(() => {
    if (!rightDataHandler.length_member.value) return []
    const res = rightDataHandler.length_member.value.map(item => {
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
  }, [rightDataHandler.length_member])

  const { portList } = publicAttributes()
  const ALGORITHM = getSystemConstantsStore(state => state.ALGORITHM)

  const DropdownRender = React.useCallback(
    (props: { type: string }) => {
      const { type } = props
      const checkedList = (rightDataHandler[type as keyof typeof rightDataHandler] as BaseErrorType).value
      const onChange = (list: CheckboxValueType[]) => {
        onChangeFn('rightDataHandler', type, list as string[])
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
    [onChangeFn, rightDataHandler]
  )

  const DropdownRenderS = React.useCallback(
    (props: { type: string }) => {
      const { type } = props

      const checkedList = (rightDataHandler[type as keyof typeof rightDataHandler] as BaseErrorType).value
      const onChange = (list: CheckboxValueType[]) => {
        onChangeFn('rightDataHandler', type, list as string[])
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
    [onChangeFn, rightDataHandler]
  )

  const TagRender = React.useCallback(
    (props: { type: string } & CustomTagProps) => {
      const { type, closable, label, value } = props
      const data = (rightDataHandler[type as keyof typeof rightDataHandler] as BaseDataHandler).value as string[]
      const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
        event.preventDefault()
        event.stopPropagation()
      }
      const onClose = () => {
        const filterData = data?.filter(item => item !== value)
        onChangeFn('rightDataHandler', type, filterData as string[])
      }
      return (
        <Tag className={StyleSheet.tagStyle} onMouseDown={onPreventMouseDown} closable={closable} onClose={onClose}>
          <span>{label}</span>
        </Tag>
      )
    },
    [onChangeFn, rightDataHandler]
  )
  useEffect(() => {
    if (rightDataHandler.peripheral_id.value) return getPeripheralDetail(+rightDataHandler.peripheral_id.value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rightDataHandler.peripheral_id.value])

  return (
    <div className={StyleSheet.rightConcentBody} id='area'>
      <Form form={form} layout='vertical' className={StyleSheet.rightFromCommonStyle}>
        <div style={{ padding: '8px 16px' }}>
          <Form.Item label='数据处理器名称' help={name.errorMsg} hasFeedback validateStatus={name.validateStatus}>
            <Input
              onChange={(e: { target: { value: string | number | string[] | number[] | undefined } }) => {
                onChangeFn('rightDataHandler', 'name', e.target.value)
              }}
              onBlur={() => {
                if (rightAttributes.name === name.value) return
                onBlurFn(name.validateStatus, 'rightDataHandler')
              }}
              value={name.value}
              placeholder='请输入数据处理器名称'
            />
          </Form.Item>

          <Form.Item label='端口'>
            <Select
              value={port.value as string}
              getPopupContainer={() => document.querySelector('#area') as HTMLElement}
              placeholder='请选择端口'
              onChange={e => {
                onChangeFn('rightDataHandler', 'port', e)
              }}
              onDropdownVisibleChange={visible => {
                closeMenu(visible, port.validateStatus, 'rightDataHandler')
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
          <Form.Item label='中断号' help={interrupt.errorMsg} hasFeedback validateStatus={interrupt.validateStatus}>
            <Input
              value={rightDataHandler.interrupt.value}
              placeholder='请输入中断号'
              onChange={(e: { target: { value: string | number | string[] | number[] | undefined } }) => {
                onChangeFn('rightDataHandler', 'interrupt', e.target.value, true)
              }}
              onBlur={() => {
                if (rightAttributes.interrupt === interrupt.value) return
                onBlurFn(interrupt.validateStatus, 'rightDataHandler')
              }}
            />
          </Form.Item>
        </div>
        <div style={{ padding: '8px 16px' }} className={StyleSheet.dataFormatProcessing}>
          <span className={StyleSheet.spanTitle}>数据加工与输出格式编排</span>
          <Form.Item label='帧头' help={sof.errorMsg} hasFeedback validateStatus={sof.validateStatus}>
            <Input
              placeholder='请输入帧头'
              value={sof.value}
              onChange={(e: { target: { value: string | number | string[] | number[] | undefined } }) => {
                onChangeFn('rightDataHandler', 'sof', e.target.value)
              }}
              onBlur={() => {
                if (rightAttributes.sof === sof.value) return
                onBlurFn(sof.validateStatus, 'rightDataHandler')
              }}
            />
          </Form.Item>
          <Form.Item label='帧尾' help={eof.errorMsg} hasFeedback validateStatus={eof.validateStatus}>
            <Input
              value={eof.value}
              placeholder='请输入帧尾'
              onChange={(e: { target: { value: string | number | string[] | number[] | undefined } }) => {
                onChangeFn('rightDataHandler', 'eof', e.target.value)
              }}
              onBlur={() => {
                if (rightAttributes.eof === eof.value) return
                onBlurFn(eof.validateStatus, 'rightDataHandler')
              }}
            />
          </Form.Item>
          <Form.Item label='帧长度元素'>
            <Select
              showSearch={Boolean(0)}
              placeholder='请选择帧长度元素'
              allowClear
              value={framing_lengthValue}
              onClear={() => {
                clearFn('rightDataHandler', 'length_member', [])
              }}
              onDropdownVisibleChange={visible => {
                if (!visible && length_member.value.length === 0) return
                closeMenu(visible, length_member.validateStatus, 'rightDataHandler')
              }}
              mode='tags'
              dropdownRender={() => <DropdownRender type='length_member' />}
              getPopupContainer={() => document.querySelector('#area') as HTMLElement}
              showArrow
              tagRender={props => <TagRender {...props} type='length_member' />}
            />
          </Form.Item>
          <Form.Item label='校验算法'>
            <Select
              placeholder='请选择校验算法'
              getPopupContainer={() => document.querySelector('#area') as HTMLElement}
              value={algorithm.value ? algorithm.value : null}
              showSearch={Boolean(0)}
              onClear={() => {
                clearFn('rightDataHandler', 'algorithm', null)
              }}
              onChange={e => {
                onChangeFn('rightDataHandler', 'algorithm', e)
              }}
              onBlur={() => {
                if (!algorithm.value) return
                onBlurFn(algorithm.validateStatus, 'rightDataHandler')
              }}
              allowClear
              showArrow
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
              showSearch={Boolean(0)}
              allowClear
              value={checkoutChild}
              onClear={() => {
                clearFn('rightDataHandler', 'checksum_member', [])
              }}
              onDropdownVisibleChange={visible => {
                if (!visible && checksum_member.value.length === 0) return
                closeMenu(visible, checksum_member.validateStatus, 'rightDataHandler')
              }}
              mode='tags'
              dropdownRender={() => <DropdownRenderS type='checksum_member' />}
              getPopupContainer={() => document.querySelector('#area') as HTMLElement}
              showArrow
              tagRender={props => <TagRender {...props} type='checksum_member' />}
            />
          </Form.Item>
          <Form.Item label='输出帧结构' tooltip='指定数据帧元素和顺序,生成预期的输出帧结构'>
            <Select
              showSearch={Boolean(0)}
              allowClear
              placeholder='请选择输出帧结构'
              value={framing_memberValue}
              onClear={() => {
                clearFn('rightDataHandler', 'framing_member', [])
              }}
              onDropdownVisibleChange={visible => {
                if (!visible && framing_member.value.length === 0) return
                closeMenu(visible, framing_member.validateStatus, 'rightDataHandler')
              }}
              mode='tags'
              dropdownRender={() => <DropdownRender type='framing_member' />}
              getPopupContainer={() => document.querySelector('#area') as HTMLElement}
              showArrow
              tagRender={props => <TagRender {...props} type='framing_member' />}
            />
          </Form.Item>
        </div>
        <div style={{ padding: '8px 16px' }} className={StyleSheet.dataFormatProcessing}>
          <span className={StyleSheet.spanTitle}>输出寄存器</span>
          <Form.Item label='外设'>
            <Select placeholder='请选择外设' value={peripheral_id.value} disabled={Boolean(1)}>
              {headerBarList?.map((rate: any) => {
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
              value={register_id.value}
              disabled={!resgiedDisabled}
              getPopupContainer={() => document.querySelector('#area') as HTMLElement}
              onChange={e => {
                if (e === register_id.value) return
                onChangeFn('rightDataHandler', 'register_id', e)
                closeMenu(false, register_id.validateStatus, 'rightDataHandler')
              }}
            >
              {notRegsiterList?.map((rate: any) => {
                return (
                  <Option key={rate.id} value={rate.id} disabled={rate.rightDataHandler_id}>
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

// todo 定时器 和 画布 的交互
const TimerCompoents: React.FC = () => {
  const [form] = Form.useForm()
  const rightTimer = LeftAndRightStore(state => state.rightTimer)
  const { name, period, interrupt } = rightTimer
  const { onChangeFn, onBlurFn, rightAttributes } = LeftAndRightStore()
  return (
    <div className={StyleSheet.rightFromCommonStyle} style={{ padding: '8px 16px' }}>
      <Form form={form} layout='vertical'>
        <Form.Item label='定时器名称' help={name.errorMsg} hasFeedback validateStatus={name.validateStatus}>
          <Input
            onChange={(e: { target: { value: string | number | string[] | number[] | undefined } }) => {
              onChangeFn('rightTimer', 'name', e.target.value)
            }}
            onBlur={() => {
              if (rightAttributes.name === name.value) return
              onBlurFn(name.validateStatus, 'rightTimer')
            }}
            value={name.value}
            placeholder='请输入定时器名称'
          />
        </Form.Item>

        <Form.Item label='间隔' help={period.errorMsg} hasFeedback validateStatus={period.validateStatus}>
          <Input
            onChange={(e: { target: { value: string | number | string[] | number[] | undefined } }) => {
              onChangeFn('rightTimer', 'period', e.target.value)
            }}
            onBlur={() => {
              if (rightAttributes.period === period.value) return
              onBlurFn(period.validateStatus, 'rightTimer')
            }}
            suffix='微秒'
            placeholder='请输入间隔'
            value={period.value}
          />
        </Form.Item>

        <Form.Item label='中断号' help={interrupt.errorMsg} hasFeedback validateStatus={interrupt.validateStatus}>
          <Input
            placeholder='请输入中断号'
            value={interrupt.value}
            onChange={(e: { target: { value: string | number | string[] | number[] | undefined } }) => {
              onChangeFn('rightTimer', 'interrupt', e.target.value)
            }}
            onBlur={() => {
              if (rightAttributes.interrupt === interrupt.value) return
              onBlurFn(interrupt.validateStatus, 'rightTimer')
            }}
          />
        </Form.Item>
      </Form>
    </div>
  )
}

export { TimerCompoents, DataHanderComponents, RegisterComponents, PeripheralComponents, TargetComponents }
