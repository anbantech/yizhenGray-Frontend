import React from 'react'
import { Button } from 'antd'
import exportImage_blue from 'Image/Template/export.svg'
import exportImage_white from 'Image/Template/export1.svg'
import styles from 'Src/view/template/BaseTemplate/createTemplateTitle.less'
import 'antd/dist/antd.css'

// @params 操作

function ExportButton(props: any) {
  const { onClick, name, width, height, disabled, marginRight } = props
  return (
    <>
      <Button type='default' style={{ width, height, marginRight }} disabled={disabled} onClick={onClick} className={styles.export_template_button}>
        <img src={exportImage_blue} alt='export' className={styles.deactive} />
        <img src={exportImage_white} alt='export' className={styles.active} />
        {name}
      </Button>
    </>
  )
}
export default ExportButton
