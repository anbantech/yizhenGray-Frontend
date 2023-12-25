import { Checkbox, Form, Input, Select, Tag } from 'antd'
import React, { useMemo } from 'react'
import TextArea from 'antd/lib/input/TextArea'
import StyleSheet from './ModelingRight.less'
import { LeftAndRightStore } from '../../Store/ModelLeftAndRight/leftAndRightStore'
import { LeftListStore } from '../../Store/ModeleLeftListStore/LeftListStore'
import { publicAttributes } from '../../Store/ModelStore'
import { getSystemConstantsStore } from 'Src/webSocket/webSocketStore'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { valueParams } from '../../Store/ModleStore'

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
  const { name, rightDataHandler, desc } = TargetDetail
  return (
    <div style={{ padding: '8px 16px' }} className={StyleSheet.rightFromCommonStyle}>
      <Form form={form} layout='vertical'>
        <Form.Item label='名称'>
          <Input disabled value={name.value} />
        </Form.Item>
        <Form.Item label='处理器类型'>
          <Input disabled value={rightDataHandler?.value} />
        </Form.Item>
        <Form.Item label='描述'>
          <TextArea disabled value={desc?.value} autoSize={{ minRows: 3, maxRows: 4 }} />
        </Form.Item>
      </Form>
    </div>
  )
}

const PeripheralComponents: React.FC = () => {
  const [form] = Form.useForm()
  const { PERIPHERAL_TYPE } = getSystemConstantsStore()

  return (
    <div className={StyleSheet.rightFromCommonStyle} style={{ padding: '8px 16px' }}>
      <Form form={form} layout='vertical' id='area'>
        <Form.Item label='外设名称'>
          <Input style={{ borderRadius: '4px' }} placeholder='外设名称' />
        </Form.Item>
        <Form.Item label='类型'>
          <Select getPopupContainer={() => document.querySelector('#area') as HTMLElement} placeholder='请选择类型'>
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
          <Input prefix='0x' />
        </Form.Item>
        <Form.Item label='地址大小' help={address_length.errorMsg} hasFeedback validateStatus={address_length.validateStatus}>
          <Input placeholder='请输入基地址大小' prefix='0x' suffix='字节' />
        </Form.Item>
        <Form.Item label='描述'>
          <TextArea
            // placeholder={disabledStatus ? '-' : '请输入描述'}
            // value={peripheral.desc.value}
            // disabled={disabledStatus}
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
  const { rightDataRegister } = LeftAndRightStore()
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
  } = rightDataRegister
  const { REGISTER_CMD } = getSystemConstantsStore()

  const isKind = useMemo(() => {
    return kind.value === 0
  }, [kind])

  const SelectBefore = () => {
    return (
      <Select
        getPopupContainer={() => document.querySelector('#area') as HTMLElement}
        showArrow
        showSearch={Boolean(0)}
        allowClear
        // value={values}
        style={{ width: 70, height: 30 }}
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
              style={{ borderRadius: '4px' }}
              value={peripheral_id.value}
            >
              {/* {isBoardLevePeripherals?.map((rate: any) => {
                return (
                  <Option key={rate?.id} value={rate?.id}>
                    {rate?.name}
                  </Option>
                )
              })} */}
            </Select>
          </Form.Item>
          <Form.Item label='寄存器名称' help={name.errorMsg} hasFeedback validateStatus={name.validateStatus}>
            <Input style={{ borderRadius: '4px' }} value={name.value} />
          </Form.Item>
          <Form.Item label='偏移地址' help={relative_address.errorMsg} hasFeedback validateStatus={relative_address.validateStatus}>
            <Input prefix='0x' value={relative_address.value} />
          </Form.Item>
          <Form.Item label='初始化完成'>
            <Select style={{ borderRadius: '4px' }} showSearch={Boolean(0)} value={finish.value}>
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
                console.log('1')
              }}
              getPopupContainer={() => document.querySelector('#area') as HTMLElement}
              style={{ borderRadius: '4px' }}
              value={kind.value}
              onChange={value => {
                console.log('1')
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
                placeholder='请选择关联状态寄存器所属外设'
              >
                {/* {AllPeripheralList?.map((rate: any) => {
                  return (
                    <Option key={rate?.id} value={rate?.id}>
                      {rate?.name}
                    </Option>
                  )
                })} */}
              </Select>
            </Form.Item>
            <Form.Item label='关联状态寄存器'>
              <Select
                getPopupContainer={() => document.querySelector('#area') as HTMLElement}
                placeholder='请选择关联状态寄存器'
                disabled={!sr_peri_id.value}
                showSearch={Boolean(0)}
                value={sr_id.value}
              >
                {/* {registerListStatus?.map((rate: any) => {
                  return (
                    <Option key={rate?.id} value={rate?.id}>
                      {rate?.name}
                    </Option>
                  )
                })} */}
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
  const { rightDataHandler } = LeftListStore()

  const [form] = Form.useForm()
  //  kind 0是状态  1非状态 非状态寄存器
  const notRegsiterList = useMemo(() => {
    return []
  }, [])

  //  寄存器的disablled
  const resgiedDisabled = useMemo(() => {
    return false
  }, [])

  // 校验子项
  const checkoutChild = useMemo(() => {
    if (!rightDataHandler.checksum_member.value) return []
    const res = rightDataHandler.checksum_member.value.map((item: string, index: number) => {
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
    const res = rightDataHandler.framing_member.value?.map((item: string, index) => {
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
    const res = rightDataHandler.length_member.value.map((item: string) => {
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
    (props: { title: string; type: string }) => {
      const { title, type } = props
      const checkedList = (rightDataHandler[type as keyof typeof rightDataHandler] as valueParams).value
      const onChange = (list: CheckboxValueType[]) => {
        // updateOnceFormValue(list, title, type)
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
    [rightDataHandler]
  )

  const DropdownRenderS = React.useCallback(
    (props: { title: string; type: string }) => {
      const { title, type } = props

      const checkedList = (rightDataHandler[type as keyof typeof rightDataHandler] as valueParams).value
      const onChange = (list: CheckboxValueType[]) => {}
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
    [rightDataHandler]
  )

  const TagRender = React.useCallback(
    (props: { title: string; type: string } & CustomTagProps) => {
      const { type, title, closable, label, value } = props

      const data = (rightDataHandler[type as keyof typeof rightDataHandler] as valueParamsArray).value as string[]
      const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
        event.preventDefault()
        event.stopPropagation()
      }
      const onClose = () => {
        // const filterData = data?.filter(item => item !== value)
        // updateOnceFormValue(filterData, title, type)
      }
      return (
        <Tag className={StyleSheet.tagStyle} onMouseDown={onPreventMouseDown} closable={closable} onClose={onClose}>
          <span>{label}</span>
        </Tag>
      )
    },
    [rightDataHandler]
  )
  const closeMenu = (visible: boolean, type?: string) => {
    if (!visible) {
      // updateProcessor(type)
    }
  }

  const clearValue = React.useCallback((type?: string) => {
    // updateProcessor(type)
  }, [])

  // todo 获取非状态寄存器

  return (
    <div className={StyleSheet.rightConcentBody} id='area'>
      <Form form={form} layout='vertical' className={StyleSheet.rightFromCommonStyle}>
        <div style={{ padding: '8px 16px' }}>
          <Form.Item label='数据处理器名称' help={rightDataHandler.name.errorMsg} hasFeedback validateStatus={rightDataHandler.name.validateStatus}>
            <Input
              value={rightDataHandler.name.value}
              placeholder='请输入数据处理器名称'
              onChange={e => {
                console.log('11', e)
              }}
              onBlur={e => {
                console.log('11', e)
              }}
            />
          </Form.Item>

          <Form.Item label='端口'>
            <Select
              value={rightDataHandler.port.value as string}
              getPopupContainer={() => document.querySelector('#area') as HTMLElement}
              placeholder='请选择端口'
              onChange={(value: string) => {
                console.log('11', e)
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
          <Form.Item label='中断号' help={rightDataHandler.interrupt.errorMsg} hasFeedback validateStatus={rightDataHandler.interrupt.validateStatus}>
            <Input
              value={rightDataHandler.interrupt.value}
              placeholder='请输入中断号'
              onChange={e => {
                console.log('11', e)
              }}
              onBlur={e => {
                console.log('11', e)
              }}
            />
          </Form.Item>
        </div>
        <div style={{ padding: '8px 16px' }} className={StyleSheet.dataFormatProcessing}>
          <span className={StyleSheet.spanTitle}>数据加工与输出格式编排</span>
          <Form.Item label='帧头' help={rightDataHandler.sof.errorMsg} hasFeedback validateStatus={rightDataHandler.sof.validateStatus}>
            <Input
              placeholder='请输入帧头'
              value={rightDataHandler.sof.value}
              onChange={e => {
                console.log('11', e)
              }}
              onBlur={e => {
                console.log('11', e)
              }}
            />
          </Form.Item>
          <Form.Item label='帧尾' help={rightDataHandler.eof.errorMsg} hasFeedback validateStatus={rightDataHandler.eof.validateStatus}>
            <Input
              value={rightDataHandler.eof.value}
              placeholder='请输入帧尾'
              onChange={e => {
                console.log('11', e)
              }}
              onBlur={e => {
                console.log('11', e)
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
                console.log('11', e)
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
              value={rightDataHandler.algorithm.value ? rightDataHandler.algorithm.value : null}
              showSearch={Boolean(0)}
              allowClear
              showArrow
              onDropdownVisibleChange={visible => {
                closeMenu(visible)
              }}
              onChange={value => {
                console.log('11', e)
              }}
              onClear={() => {
                console.log('11', e)
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
                console.log('11', e)
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
                console.log('11', e)
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
              value={rightDataHandler.peripheral_id.value}
              showSearch={Boolean(0)}
              allowClear
              onChange={value => {
                console.log('11', e)
              }}
              onClear={() => {
                console.log('11', e)
                clearValue('peripheral_id')
              }}
              getPopupContainer={() => document.querySelector('#area') as HTMLElement}
              onDropdownVisibleChange={visible => {
                console.log('11', e)
              }}
            >
              {/* {AllPeripheralList?.map((rate: any) => {
                return (
                  <Option key={rate.id} value={rate.id}>
                    {rate.name}
                  </Option>
                )
              })} */}
            </Select>
          </Form.Item>
          <Form.Item label='寄存器'>
            <Select
              placeholder='请选择寄存器'
              value={rightDataHandler.register_id.value}
              disabled={!resgiedDisabled}
              onClear={() => {
                console.log('11', e)
                clearValue()
              }}
              onChange={value => {
                console.log('11', e)
              }}
              getPopupContainer={() => document.querySelector('#area') as HTMLElement}
              onDropdownVisibleChange={visible => {
                closeMenu(visible, 'register_id')
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
