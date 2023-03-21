import React from 'react'
import zhCN from 'antd/lib/locale/zh_CN'
import { Pagination, ConfigProvider } from 'antd'
import 'antd/dist/antd.css'
import styles from './page.less'

function PaginationsAge(props: any) {
  const { length, getParams, num, pagenums, tag } = props
  console.log(num)
  const onPage = (page: number, pageSize: number) => {
    if (tag === 'detail') {
      getParams(page, 'page')
    } else {
      getParams(page, 'page', pageSize)
    }
  }

  return (
    <>
      {length > 0 ? (
        <div className={styles.pagePosition}>
          <ConfigProvider locale={zhCN}>
            <Pagination
              defaultPageSize={num}
              total={length}
              pageSizeOptions={[10, 20]}
              showQuickJumper
              current={pagenums}
              onChange={onPage}
              showSizeChanger
            />
          </ConfigProvider>
          <div className={styles.total}>
            <span>总共 {length} 条</span>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default PaginationsAge
