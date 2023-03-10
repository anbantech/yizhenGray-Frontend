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

const StepTip = () => {
  return (
    <div className={StyleSheet.stepTip}>
      <Tooltip title='交互规则：测试阶段、准备阶段+测试阶段、准备阶段+测试阶段+销毁阶段、测试阶段+销毁阶段' placement='bottom'>
        <QuestionCircleOutlined style={{ fontSize: '18px' }} />
      </Tooltip>
    </div>
  )
}
export { Tip, StepTip }
