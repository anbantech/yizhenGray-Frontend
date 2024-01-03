import React from 'react'
import styles from './templateResult.less'

const TemplateResultTitle: React.FC = () => {
  return (
    <div className={styles.result_title_wrapper}>
      <span className={styles.result_title}>模板结果</span>
    </div>
  )
}

export default TemplateResultTitle
