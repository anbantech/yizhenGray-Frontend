import React from 'react'
import defaultValueImage from 'Src/asstes/image/defalutValue.svg'

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
    <div>
      <img src={defaultValueImage} alt='' />
      <span> {content} </span>
    </div>
  )
}

export default DefaultValueTips
