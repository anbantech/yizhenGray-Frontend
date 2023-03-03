import React from 'react'
import content from 'Src/assets/image/Project.svg'
import styles from './NoData.less'

function NoData(props: any) {
  const { title } = props
  return (
    <div className={styles.Content_main}>
      <img src={content} style={{ width: '200px', height: '200px' }} alt='' />
      <span className={styles.chart}>{title}</span>
    </div>
  )
}

export default NoData
