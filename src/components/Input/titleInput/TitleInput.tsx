import * as React from 'react'
import { useContext, memo, CSSProperties } from 'react'
// import EditIcon from 'Image/Template/edit.svg'
import { Input } from 'antd'
import { TemplateContext } from 'Src/view/template/BaseTemplate/templateContext'
import { TemplateStatus } from 'Src/view/template/BaseTemplate/createTemplateWrapper'
import styles from './TitleInput.less'

interface TitleInputProps {
  defaultTitle: string
  value: string
  onChange: (value: string) => void
  readonly?: boolean
}

const inputCss: CSSProperties = {
  width: '344px',
  marginRight: '8px',
  background: '#F0F0F1',
  borderRadius: '6px'
}

const TitleInput: React.FC<TitleInputProps> = ({ defaultTitle, value, onChange, readonly }) => {
  const { template } = useContext(TemplateContext)
  // bugfix：查看交互模板时，交互模板名称可修改
  // 优先使用父组件传递的值，如果没有则用上下文的值
  // eslint-disable-next-line eqeqeq
  const rt = readonly != undefined ? readonly : template.status === TemplateStatus.READ
  // 是否可编辑的初始状态由 readonly 参数决定
  // 如果为只读，则初始状态为不可编辑状态，如果为可编辑，初始状态为编辑状态
  // const [editing, setEditing] = useState(!rt)
  const editing = !rt

  const onTitleChange = (v: string) => {
    onChange(v)
  }

  return (
    <>
      <div style={{ margin: '30px auto' }}>
        <div className={styles.template_header}>
          {!editing ? (
            <>
              <span className={styles.template_name}>{value || defaultTitle}</span>
              {/* {!rt && <img className={styles.edit_icon} src={EditIcon} alt='edit' onClick={() => setEditing(true)} />} */}
            </>
          ) : (
            <>
              <Input
                spellCheck='false'
                style={inputCss}
                className={styles.template_name}
                placeholder={defaultTitle}
                value={value}
                onChange={e => {
                  onTitleChange(e.target.value)
                }}
              />
              {/* <Button disabled={!value} onClick={() => setEditing(false)}>
                确定
              </Button> */}
            </>
          )}
        </div>
      </div>
    </>
  )
}

TitleInput.displayName = 'TitleInput'

export default memo(TitleInput)
