import React, { useEffect, useState } from 'react'
import zhCN from 'antd/lib/locale/zh_CN'
import { Pagination, ConfigProvider } from 'antd'
import 'antd/dist/antd.css'
import styles from './page.less'

function NoShowSizeChangerPagina(props: any) {
  const { length, getParams, num, pagenums, tag } = props
  const onPage = (page: number, pageSize: number) => {
    if (tag === 'detail') {
      getParams(page, 'page')
    } else {
      getParams(page, 'page', pageSize)
    }
  }
  const [nums, setNums] = useState(10)
  useEffect(() => {
    if (num) {
      setNums(num)
    }
  }, [num])
  return (
    <>
      {length > 0 ? (
        <div className={styles.pagePosition}>
          <ConfigProvider locale={zhCN}>
            <Pagination pageSize={nums} total={length} pageSizeOptions={[num]} showQuickJumper current={pagenums} onChange={onPage} showSizeChanger />
          </ConfigProvider>
          <div className={styles.total}>
            <span>总共 {length} 条</span>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default NoShowSizeChangerPagina
