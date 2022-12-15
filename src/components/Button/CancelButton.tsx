import React from 'react'
import { Button } from 'antd'
import styles from './Button.less'
import 'antd/dist/antd.css'

// @params 操作

function CancelButton(props: any) {
  const { onClick, name, width, height } = props
  return (
    <>
      <Button type='default' style={{ width, height }} onClick={onClick} className={styles.export_template_button}>
        {name}
      </Button>
    </>
  )
}
export default CancelButton
