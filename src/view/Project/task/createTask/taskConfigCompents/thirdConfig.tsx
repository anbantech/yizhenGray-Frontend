import { Result } from 'antd'
import React from 'react'
import styles from './stepBaseConfig.less'

const ThirdConfig: React.FC = () => {
  return (
    <div className={styles.stepBaseMain}>
      <Result status='success' title='任务创建完成' />
    </div>
  )
}

export default ThirdConfig
