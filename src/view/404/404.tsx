import * as React from 'react'
import { Link } from 'react-router-dom'
import styles from './404.less'

const NoMatch: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <h1>404</h1>
        <h2>Opps! 你要找的内容走丢了...</h2>
        <h3>！没有找到您要访问的地址</h3>
        <h3>！或您访问的地址不存在</h3>
        <h3>
          ！您可以返回<Link to='/'>首页</Link>继续访问
        </h3>
      </div>
    </div>
  )
}

export default NoMatch
