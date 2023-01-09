import React from 'react'

import styles from './MainBorder.less'

function MainBorder(props: any) {
  const { name, wrapperClass, containerWrapperStyle } = props

  let titleTsx
  if (typeof name === 'string') {
    titleTsx = <span className={styles.title}>{name}</span>
  } else if (typeof name === 'function') {
    titleTsx = <div className={styles.title}>{name()}</div>
  } else {
    throw new TypeError('name props must be string or render function')
  }

  return (
    <div className={`${styles.flow} ${wrapperClass}`}>
      <div className={styles.flowMain}>
        {titleTsx}
        <div className={styles.catLine} />
        <div className={styles.contioner} style={containerWrapperStyle}>
          {props.children}
        </div>
      </div>
    </div>
  )
}

export default MainBorder
