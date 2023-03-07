import React from 'react'

import { Button } from 'antd'
import styles from './Button.less'
import 'antd/dist/antd.css'
// @params 类型 Type 大小 size  宽度 width  名称 name

function RectangleButton(props: any) {
  const { width, name, type, size, onClick, height, style } = props
  return (
    <div style={{ width, height }} className={style}>
      <Button className={styles.RectangleButton} block onClick={onClick} type={type} size={size}>
        {name}
      </Button>
    </div>
  )
}

export default RectangleButton
