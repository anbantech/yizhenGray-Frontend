import React from 'react'
import styles from './Report.less'

const ReportLoading: React.FC = () => {
  return (
    <div className={styles.reportLoadingBody}>
      <div className={styles.loading}>
        <h2>报告正在生成中</h2>
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  )
}

export default ReportLoading
