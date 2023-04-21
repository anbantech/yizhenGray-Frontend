import React from 'react'
import { Cascader } from 'antd'
import styles from './check.less'

interface checkDetail {
  Checked: (value: string) => void
  getPopupContainer: any
  positionErrorFrameData: any
}
function Check(props: checkDetail) {
  const { Checked, getPopupContainer, positionErrorFrameData } = props
  const options = [
    {
      value: 'bin',
      label: '二进制'
    },
    {
      value: 'decimal',
      label: '十进制'
    },
    {
      value: 'hex',
      label: '十六进制'
    }
  ]

  const onChange = (value: any) => {
    Checked(value[0])
  }

  return (
    <>
      <Cascader
        allowClear={false}
        options={options}
        value={positionErrorFrameData}
        onChange={onChange}
        placeholder='请选择'
        className={styles.Cascader}
        getPopupContainer={getPopupContainer}
      />
    </>
  )
}

export default Check
