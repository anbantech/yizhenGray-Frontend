import { QuestionCircleOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import * as React from 'react'
import StyleSheet from './excitationDraw.less'

const Tip = () => {
  return (
    <div className={StyleSheet.Tip} style={{ cursor: 'pointer' }}>
      <Tooltip title='（节拍单元默认200毫秒）' placement='bottom'>
        <QuestionCircleOutlined style={{ marginLeft: '-20px' }} />
      </Tooltip>
    </div>
  )
}

const StepTip = () => {
  return (
    <div className={StyleSheet.stepTip} style={{ cursor: 'pointer' }}>
      <Tooltip title='交互规则：发送阶段、准备阶段+发送阶段、准备阶段+发送阶段+销毁阶段、发送阶段+销毁阶段' placement='bottom'>
        <QuestionCircleOutlined style={{ fontSize: '18px' }} />
      </Tooltip>
    </div>
  )
}

const WarnTip = () => {
  return (
    <div className={StyleSheet.stepTip} style={{ cursor: 'pointer' }}>
      <Tooltip title='缺陷结果包含错误信息,警告信息(警告信息不是异常用例)' placement='bottom'>
        <QuestionCircleOutlined style={{ fontSize: '15px' }} />
      </Tooltip>
    </div>
  )
}

const InfoTip = () => {
  return (
    <div className={StyleSheet.stepInfoTip} style={{ cursor: 'pointer' }}>
      <Tooltip title='填写crash数量后，任务运行中只要运行时长或crash数量达到设置即可停止' placement='bottom'>
        <QuestionCircleOutlined style={{ fontSize: '15px' }} />
      </Tooltip>
    </div>
  )
}

const CrashTip = () => {
  return (
    <div className={StyleSheet.crashInfoTip} style={{ cursor: 'pointer' }}>
      <Tooltip title={<TipComponents />} placement='bottom'>
        <QuestionCircleOutlined style={{ fontSize: '15px' }} />
      </Tooltip>
    </div>
  )
}

const DropTip = () => {
  return (
    <div style={{ cursor: 'pointer' }}>
      <Tooltip title='单位为节拍，一个节拍默认为200ms' placement='bottom'>
        <QuestionCircleOutlined style={{ fontSize: '16px', color: '#CCCCCC', marginLeft: '16px' }} />
      </Tooltip>
    </div>
  )
}

const TipComponents = () => {
  return (
    <div className={StyleSheet.levelTooltip} style={{ cursor: 'pointer' }}>
      <span>致命缺陷 : 非法指令、程序跑飞</span>
      <span>
        严重缺陷 :
        看门狗超时、系统复位错误、堆栈溢出、RAM区向下溢出、RAM区向上溢出、FLASH区向下溢出、FLASH区向上溢出、ROM区向下溢出、ROM区向上溢出、读取保护区域、写入保护区域、代码区破坏错误
      </span>
      <span>一般缺陷 : malloc分配失败、calloc分配失败、realloc分配失败、双重释放、未释放重分配、非法数据、浮点数溢出</span>
      <span>建议 : 死循环、中断嵌套、定点数溢出、无符号整型溢出 </span>
    </div>
  )
}

const TipAllComponents = () => {
  return (
    <div className={StyleSheet.levelTooltip} style={{ cursor: 'pointer' }}>
      <span>默认上报所有内置缺陷</span>
    </div>
  )
}

const CrashLevelTip = () => {
  return (
    <Tooltip title={<TipComponents />} placement='bottom' overlayClassName={StyleSheet.overlay} style={{ cursor: 'pointer' }}>
      <QuestionCircleOutlined style={{ fontSize: '15px' }} />
    </Tooltip>
  )
}

export { Tip, StepTip, WarnTip, InfoTip, CrashTip, DropTip, CrashLevelTip, TipAllComponents }
