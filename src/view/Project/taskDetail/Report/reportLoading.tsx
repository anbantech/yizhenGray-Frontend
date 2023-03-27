import React from 'react'
import styles from './Report.less'

interface ReportValue {
  value: string
}

const ReportLoading: React.FC<ReportValue> = (props: ReportValue) => {
  const { value } = props
  return (
    <div className={styles.reportLoadingBody}>
      <div className={styles.loading}>
        <h2>{value}</h2>
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
