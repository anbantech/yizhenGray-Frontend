import React from 'react'
import { Cascader } from 'antd'
import styles from './check.less'

interface checkDetail {
  Checked: (value: string) => void
  getPopupContainer: any
  positionErrorFrameData: any
}
function CheckCrashLevel(props: checkDetail) {
  const { Checked, getPopupContainer, positionErrorFrameData } = props
  const options = [
    {
      value: '-1',
      label: '全部'
    },
    {
      value: '0',
      label: '致命'
    },
    {
      value: '1',
      label: '严重'
    },
    {
      value: '2',
      label: '一般'
    },
    {
      value: '3',
      label: '建议'
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
        value={positionErrorFrameData === '' ? '-1' : positionErrorFrameData}
        onChange={onChange}
        placeholder='请选择'
        className={styles.Cascader}
        getPopupContainer={getPopupContainer}
      />
    </>
  )
}

export default CheckCrashLevel
