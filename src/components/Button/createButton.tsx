import React from 'react'
import add from 'Image/Add.svg'
import { Button } from 'antd'
import styles from './Button.less'
import 'antd/dist/antd.css'
// @params 类型 Type 大小 size  宽度 width  名称 name

interface buttonStyleType {
  width?: string
  height?: string
  name?: string
  size?: 'small' | 'middle' | 'large' | undefined
  type?: 'link' | 'text' | 'ghost' | 'default' | 'primary' | 'dashed' | undefined
  onClick?: () => void
}
const CreateButton: React.FC<buttonStyleType> = props => {
  const { width, name, size, type, onClick } = props
  return (
    <div style={{ width }}>
      <Button className={styles.buttonStyle} type={type} size={size} block onClick={onClick}>
        <img src={add} alt='' />
        <span className={styles.ButtonChart}>{name}</span>
      </Button>
    </div>
  )
}

export default CreateButton
