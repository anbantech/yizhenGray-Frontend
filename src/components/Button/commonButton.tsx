import React from 'react'
import { Button } from 'antd'
import 'antd/dist/antd.css'
// @params 类型 Type 大小 size  宽度 width  名称 name

interface buttonStyleType {
  name?: string
  size?: 'small' | 'middle' | 'large' | undefined
  type?: 'link' | 'text' | 'ghost' | 'default' | 'primary' | 'dashed' | undefined
  onClick?: () => void
  buttonStyle: any
}
const CommonButton: React.FC<buttonStyleType> = props => {
  const { name, size, type, onClick, buttonStyle } = props
  return (
    <Button className={buttonStyle} type={type} size={size} block onClick={onClick}>
      {name}
    </Button>
  )
}

export default CommonButton
