import * as React from 'react'
import { RouteComponentProps, StaticContext, withRouter } from 'react-router'
import { message, Table, Tooltip } from 'antd'

import PaginationsAge from 'Src/components/Pagination/Pagina'
import { useState } from 'react'
import styles from './taskDetail.less'

const request = {
  instance_id: '',
  page: 1,
  page_size: 12,
  sort_field: 'case_index',
  sort_order: 'descend',
  system: 'hex'
}
interface userParamsList {
  instance_id: string
  page: number
  page_size: number
  sort_field: string
  sort_order: string
  system: string
}

const TaskLog: React.FC<RouteComponentProps<any, StaticContext, any>> = props => {
  // const statusMap: statusList = {
  //   0: '未处理',
  //   1: '熵过滤通过，待发送',
  //   2: '熵过滤失败，不发送',
  //   3: '发送完成',
  //   4: '发送失败',
  //   5: '异常重试中',
  //   6: '处理中',
  //   7: '处理完成',
  //   8: '诊断错误',
  //   9: '处理失败'
  // }
  const [tableData, setTableData] = useState([])
  const columns = [
    {
      title: '用例编号',
      dataIndex: 'case_index',
      key: 'case_index',
      width: '100px'
    },
    {
      // eslint-disable-next-line react/display-name
      title: () => <p style={{ paddingLeft: '24px', marginBottom: '0' }}>用例内容</p>,
      dataIndex: 'send_data',
      key: 'send_data',
      className: `${styles.col}`,
      // eslint-disable-next-line react/display-name
      render: (tags: string[]) => (
        <div style={{ height: `${48 * tags.length}px` }}>
          {tags.map(tag => {
            return (
              <div key={Math.random()} style={{ height: `${100 / tags.length}%` }} className={styles.funName}>
                <Tooltip title={tag} placement='bottom' overlayClassName={styles.limitHeight}>
                  <span className={styles.casetitle}>{tag}</span>
                </Tooltip>
              </div>
            )
          })}
        </div>
      ),
      ellipsis: true
    },
    {
      title: '熵值',
      dataIndex: 'entropy',
      key: 'entropy',
      width: '200px'
    },
    {
      title: '阈值',
      dataIndex: 'threshold',
      key: 'threshold',
      width: '200px'
    },
    {
      title: '状态',
      width: '200px',
      dataIndex: 'status',
      key: 'status',
      // eslint-disable-next-line react/display-name
      render: (status: number, record: any) => {
        if (record.entropy > record.threshold) {
          return <span style={{ color: '#f50' }}>用例丢弃</span>
        }
        return <span>用例保留</span>
      }
    }
  ]

  return (
    <div className={styles.showTaskDetail_container}>
      <span className={styles.log_container_title}>日志</span>
      <div style={{ marginTop: '12px' }} className={styles.tableBoby}>
        <Table
          //   rowKey={(record: any) => `${record.case_index}_${base}`}
          pagination={false}
          //   loading={spinStatus}
          dataSource={tableData}
          columns={columns as any}
          bordered
        />
      </div>
      {/* {status !== 2 && <PaginationsAge length={total} num={12} getParams={getParams} pagenums={params.page} />} */}
    </div>
  )
}

export default withRouter(TaskLog)
