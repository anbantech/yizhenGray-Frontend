import { QuestionCircleOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import * as React from 'react'
import StyleSheet from './excitationDraw.less'

const Tip = () => {
  return (
    <div className={StyleSheet.Tip}>
      <Tooltip title='（节拍单元默认200毫秒）' placement='bottom'>
        <QuestionCircleOutlined style={{ marginLeft: '-20px' }} />
      </Tooltip>
    </div>
  )
}

export default Tip
