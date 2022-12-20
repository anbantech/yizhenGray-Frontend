import { Input } from 'antd'
import { memo } from 'react'
import * as React from 'react'
import styles from './createResponseTemplate.less'

interface ResponseTemplateListItem {
  value: string
  index: string
  attr: 'name' | 'size' | 'value'
  onChange: (...args: any[]) => void
  readonly?: boolean
  resize: (height: number) => void
  style: any
}

const ResponseTemplateListItem: React.FC<ResponseTemplateListItem> = ({ value, index, onChange, attr, readonly, resize, style }) => {
  const refs = React.useRef(null!)
  const [prevHeight, setPrevHeight] = React.useState('32px')
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

  return (
    <div className={`${styles.base} ${styles.size}`} style={readonly ? { ...style } : { ...style }}>
      <Input.TextArea
        ref={refs}
        autoSize={readonly ? { minRows: 3, maxRows: 3 } : true}
        style={{ minHeight: '65px', borderColor: 'transparent', textAlign: 'center' }}
        placeholder={readonly ? '无' : '请输入内容'}
        value={String(value)}
        onChange={e => onChange(e.target.value, index, attr)}
        disabled={readonly}
      />
    </div>
  )
}

ResponseTemplateListItem.displayName = 'ResponseTemplateListItem'

export default memo(ResponseTemplateListItem)
