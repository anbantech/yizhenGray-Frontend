/* eslint-disable indent */
import { Input, Select } from 'antd'
import { memo, useState, useMemo } from 'react'
import * as React from 'react'
import { GlobalContext } from 'Src/globalContext/globalContext'
import styles from './createResponseTemplate.less'

interface ResponseTemplateListItem {
  value?: string
  rules?: {
    condition?: number | string
    alg?: string
    rule?: string | { min_num: string; max_num: string }
  }
  index: string
  attr: string
  optionStatus: boolean
  onChange: (...args: any[]) => void
  readonly?: boolean
  resize: (height: number) => void
  style: any
  parserSelectorValue?: string
}

const MoreOpationsComponent: React.FC<ResponseTemplateListItem> = ({
  parserSelectorValue,
  rules,
  index,
  onChange,
  attr,
  readonly,
  resize,
  style
}) => {
  const refs = React.useRef(null!)
  const { condition, member, relationship } = React.useContext(GlobalContext).config
  const { Option } = Select
  const [prevHeight, setPrevHeight] = React.useState('32px')
  const [preObj, setPreObj] = useState<any>()
  const limit = useMemo(() => rules?.alg, [rules?.alg])
  const setValue = (val: any, type: string, index: string, attr: string) => {
    const obj = preObj
    obj[type] = val
    onChange(obj, index, attr)
  }
  const changeRuleObject = (val: any, type: string, index: string, attr: string) => {
    setValue(val, type, index, attr)
  }
  // 监听dom变化，当高度发生变化时通知父组件进行更新
  React.useEffect(() => {
    const ob = new MutationObserver((...args) => {
      args[0].forEach(record => {
        const { height } = (record.target as HTMLTextAreaElement).style
        const prevHeight2Number = +prevHeight.replace(/(.+)px/, '$1')
        const currentHeight2Number = +height.replace(/(.+)px/, '$1')
        if (currentHeight2Number !== prevHeight2Number) {
          setPrevHeight(height)
          resize(currentHeight2Number)
        }
      })
    })
    const inputDom = (refs.current as any).resizableTextArea.textArea
    ob.observe(inputDom, { attributes: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    if (['between', 'not_between'].includes(limit as string)) {
      setPreObj({ ...rules, rule: { min_num: '', max_num: '' } })
    } else {
      setPreObj({ ...rules, rule: '' })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit])

  React.useEffect(() => {
    setPreObj(rules)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (value: string) => {
    setValue(value, 'condition', index, attr)
    setValue('', 'alg', index, attr)
    setValue('', 'rule', index, attr)
  }
  // 选择限定值范围
  const handleLimitChange = (value: string) => {
    setValue(value, 'alg', index, attr)
    setValue('', 'rule', index, attr)
    return value
  }

  const changeRuleLimit = (val: any, type: string, index: string, attr: string, limit: string) => {
    const values = val
    const value =
      limit === 'min_num' ? { min_num: `${values}`, max_num: preObj.rule?.max_num } : { min_num: preObj.rule?.min_num, max_num: `${values}` }
    setValue(value, type, index, attr)
  }
  // 清除限定值范围
  const clearLimit = () => {
    setValue('', 'condition', index, attr)
    setValue('', 'alg', index, attr)
    setValue('', 'rule', index, attr)
  }

  const ifConditionDisabled = React.useCallback(
    (label: string) => {
      if (!parserSelectorValue) return false
      const isTextProtocolParser = ['HTTP', 'FTP', 'TFTP'].includes(parserSelectorValue)
      if (isTextProtocolParser && label === '限定值范围') return true
      return false
    },
    [parserSelectorValue]
  )

  return (
    <div className={`${styles.selectBase} ${styles.selectSize}`} style={readonly ? { ...style } : { ...style }}>
      <div>
        <Select
          onClear={clearLimit}
          style={{ width: 120 }}
          allowClear
          value={(rules?.condition as any) as string}
          onChange={handleChange}
          disabled={readonly}
        >
          {condition.map(item => {
            return (
              <>
                <Option value={item.value} disabled={ifConditionDisabled(item.label)}>
                  {item.label}
                </Option>
              </>
            )
          })}
        </Select>
      </div>
      <div>
        <Select
          style={{ width: 120 }}
          value={rules?.alg}
          onChange={handleLimitChange}
          disabled={rules?.condition === undefined || rules?.condition === '' || readonly}
        >
          {rules?.condition
            ? member.map(item => {
                return (
                  <>
                    <Option value={item.value}>{item.label}</Option>
                  </>
                )
              })
            : relationship.map(item => {
                return (
                  <>
                    <Option value={item.value}>{item.label}</Option>
                  </>
                )
              })}
        </Select>
      </div>
      {['between', 'not_between'].includes(limit as string) ? (
        <div className={styles.inputDouble}>
          <Input.TextArea
            ref={refs}
            autoSize={readonly ? { minRows: 3, maxRows: 3 } : true}
            style={{ marginRight: '2px', minHeight: '65px', borderColor: 'transparent' }}
            placeholder={readonly ? '无' : +rules!.condition! !== 0 ? '请输入内容' : '请输入内容（16进制数）'}
            value={String((rules?.rule as any).min_num || '')}
            onChange={e => changeRuleLimit(e.target.value, 'rule', index, attr, 'min_num')}
            disabled={readonly}
          />
          <Input.TextArea
            ref={refs}
            autoSize={readonly ? { minRows: 3, maxRows: 3 } : true}
            style={{ minHeight: '65px', borderColor: 'transparent' }}
            placeholder={readonly ? '无' : +rules!.condition! !== 0 ? '请输入内容' : '请输入内容（16进制数）'}
            value={String((rules?.rule as any).max_num || '')}
            onChange={e => changeRuleLimit(e.target.value, 'rule', index, attr, 'max_num')}
            disabled={readonly}
          />
        </div>
      ) : (
        <div>
          <Input.TextArea
            ref={refs}
            autoSize={readonly ? { minRows: 3, maxRows: 3 } : true}
            style={{ minHeight: '65px', borderColor: 'transparent', textAlign: 'center' }}
            placeholder={
              readonly ? '无' : rules!.condition === '' ? '请输入内容' : +rules!.condition! !== 0 ? '请输入内容' : '请输入内容（16进制数）'
            }
            value={String(rules?.rule)}
            onChange={e => changeRuleObject(e.target.value, 'rule', index, attr)}
            disabled={readonly || !rules?.alg}
          />
        </div>
      )}
    </div>
  )
}

MoreOpationsComponent.displayName = 'MoreOpationsComponent'

export default memo(MoreOpationsComponent)
