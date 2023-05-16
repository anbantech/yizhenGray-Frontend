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
      <Tooltip title='交互规则：发送阶段、准备阶段+发送阶段、准备阶段+发送阶段+销毁阶段、发送阶段+销毁阶段' placement='bottom'>
        <QuestionCircleOutlined style={{ fontSize: '18px' }} />
      </Tooltip>
    </div>
  )
}

const WarnTip = () => {
  return (
    <div className={StyleSheet.stepTip}>
      <Tooltip title='缺陷结果包含错误信息,警告信息(警告信息不是异常用例)' placement='bottom'>
        <QuestionCircleOutlined style={{ fontSize: '15px' }} />
      </Tooltip>
    </div>
  )
}

const InfoTip = () => {
  return (
    <div className={StyleSheet.stepInfoTip}>
      <Tooltip title='填写crash数量后，任务运行中只要运行时长或crash数量达到' placement='bottom'>
        <QuestionCircleOutlined style={{ fontSize: '15px' }} />
      </Tooltip>
    </div>
  )
}
export { Tip, StepTip, WarnTip, InfoTip }
