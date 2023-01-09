import React from 'react'
import defaultValueImage from 'Image/defalutValue.svg'
import styles from './defaultValueTips.less'

type contentType = string

interface propsType<T> {
  content: T
}
/*
 *  缺省组件
 */

const DefaultValueTips: React.FC<propsType<contentType>> = (props: propsType<contentType>) => {
  const { content } = props
  return (
    <div className={styles.Tips_Main}>
      <img src={defaultValueImage} alt='' />
      <span> {content} </span>
    </div>
  )
}

export default DefaultValueTips
