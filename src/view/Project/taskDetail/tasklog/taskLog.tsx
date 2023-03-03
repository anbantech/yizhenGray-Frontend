/* eslint-disable indent */
/* eslint-disable react/display-name */
import { DownOutlined } from '@ant-design/icons'
import { Dropdown, Menu, message, Space, Tooltip } from 'antd'
import globalStyle from 'Src/view/Project/project/project.less'
import React, { useCallback, useState } from 'react'
import { getTime } from 'Src/util/baseFn'
import { copyText } from 'Src/util/common'
import NoData from 'Src/view/404/NoData/NoData'
import errorFrameCopy from 'Src/assets/image/errorFrameCopy.svg'
import PaginationsAge from 'Src/components/Pagination/Pagina'
import styles from '../taskDetailUtil/Detail.less'

interface propsType {
  params: any
  logData: any
  total: number | undefined
  changePage: (page: number, pageSize: number) => void
  testTimeSort: (value: string) => void
  caseSort: (value: string) => void
}

interface DataType {
  case_content: string
  case_type: number
  crash_info: string
  create_time: string
  create_user: string
  id: number
  recv_data: string[]
  send_data: string[]
  update_time: string
  update_user: string
}

const DetailTestedTable: React.FC<propsType> = (props: propsType) => {
  const { params, total, logData, changePage, testTimeSort, caseSort } = props
  // const statusDesc = [
  //   '未处理',
  //   '熵过滤通过',
  //   '熵过滤失败',
  //   '发送完成',
  //   '发送失败',
  //   '异常重试中',
  //   '处理中',
  //   '处理完成',
  //   '诊断错误',
  //   '处理失败',
  //   '异常停止'
  // ]
  const [currentOpenId, setCurrentOpenId] = useState<number>(-1)

  const [currentType, setCurrentType] = useState('all')

  const [currentTypeTime, setCurrentTypeTime] = useState('ascend')

  const setOperation = (value1?: any, type?: string, value2?: any) => {
    switch (type) {
      case 'page':
        changePage(value1, value2)
        break
      case 'time':
        testTimeSort(value1)
        break
      case 'case_type':
        caseSort(value1)
        break
      default:
        return null
    }
  }

  const changeCurrentType = (e: any) => {
    setCurrentType(e.key)
    setOperation(e.key, 'case_type')
  }
  const changeTimeType = (e: any) => {
    setCurrentTypeTime(e.key)
    setOperation(e.key, 'time')
  }

  const menu = (
    <Menu selectable onClick={changeCurrentType} selectedKeys={[currentType]}>
      <Menu.Item key='' style={{ textAlign: 'center' }}>
        全部
      </Menu.Item>
      <Menu.Item key='1' style={{ textAlign: 'center' }}>
        是
      </Menu.Item>
      <Menu.Item key='0' style={{ textAlign: 'center' }}>
        否
      </Menu.Item>
    </Menu>
  )

  const menuTime = (
    <Menu selectable onClick={changeTimeType} selectedKeys={[currentTypeTime]}>
      <Menu.Item key='ascend' style={{ textAlign: 'center' }}>
        升序
      </Menu.Item>
      <Menu.Item key='descend' style={{ textAlign: 'center' }}>
        降序
      </Menu.Item>
    </Menu>
  )

  function IsWrongDownMenu() {
    return (
      <Dropdown overlay={menu}>
        <Space>
          异常用例
          <DownOutlined />
        </Space>
      </Dropdown>
    )
  }

  function TimeDownMenu() {
    return (
      <Dropdown overlay={menuTime}>
        <Space>
          发现时间
          <DownOutlined />
        </Space>
      </Dropdown>
    )
  }

  const changeToggleStatus = (id: number) => {
    setCurrentOpenId(id === currentOpenId ? -1 : id)
  }

  const copyTextFn = useCallback((text: string) => {
    return function c() {
      copyText(text)
      if (text) {
        message.success('复制成功')
      } else {
        message.error('空白文本无需复制')
      }
    }
  }, [])

  const HearConcentArray = ['用例编号', '发送数据 ', '发送时间', '用例状态', '接受数据', '是否异常', '操作']
  return (
    <div className={styles.tableList}>
      <div className={styles.tableListleftq}>
        <span className={styles.log}>测试详情</span>
      </div>
      <div className={styles.container}>
        <div className={styles.Header}>
          {HearConcentArray.map((item: string) => {
            return (
              <div className={styles.Header_Main} key={Math.random()}>
                {item === '发送时间' ? <TimeDownMenu /> : item === '用例状态' ? <IsWrongDownMenu /> : <span>{item} </span>}
              </div>
            )
          })}
        </div>
        {logData && (
          <div className={styles.Table_Boby}>
            {logData.map((item: DataType) => {
              return (
                <div key={item.id} className={styles.Table_concent}>
                  <Tooltip title={item.id}>
                    <div>{item.id}</div>
                  </Tooltip>
                  <div>
                    <div className={styles.dataInfoContainer}>
                      <Tooltip title={item.send_data[0]} placement='bottom' color='#ffffff' overlayClassName={styles.overlay}>
                        <span className={styles.dataLongInfo}>{item.send_data[0] || '无'}</span>
                      </Tooltip>
                      <span role='button' tabIndex={0} className={styles.footerSpanSend_copy} onClick={copyTextFn(item.send_data[0])}>
                        <img src={errorFrameCopy} alt='' />
                      </span>
                    </div>
                    <div style={{ display: currentOpenId === item.id ? 'block' : 'none' }} className={styles.dataShowContainer}>
                      {item.send_data.length > 1 &&
                        item.send_data.slice(1).map((send_data: string) => {
                          return (
                            <div className={styles.dataShowItem} key={`${send_data}_${Math.random()}`}>
                              <Tooltip title={send_data} placement='bottom' color='#ffffff' overlayClassName={styles.overlay}>
                                <span className={styles.dataLongInfo}>{send_data || '无'}</span>
                              </Tooltip>
                              <span role='button' tabIndex={0} className={styles.footerSpanSend_copy} onClick={copyTextFn(send_data)}>
                                <img src={errorFrameCopy} alt='' />
                              </span>
                            </div>
                          )
                        })}
                    </div>
                  </div>

                  <div>{getTime(item.update_time)}</div>

                  <div>{item.crash_info}</div>
                  <div className={styles.footerresve}>
                    <div className={styles.dataInfoContainer}>
                      <Tooltip title={item.recv_data[0]} placement='bottom' color='#ffffff' overlayClassName={styles.overlay}>
                        <span className={styles.dataLongInfo}>{item.recv_data[0] || '无'}</span>
                      </Tooltip>
                      <span role='button' tabIndex={0} className={styles.footerSpanSend_copy} onClick={copyTextFn(item.recv_data[0])}>
                        <img src={errorFrameCopy} alt='' />
                      </span>
                    </div>
                    <div style={{ display: currentOpenId === item.id ? 'block' : 'none' }} className={styles.dataShowContainer}>
                      {item.recv_data.length > 1 &&
                        item.recv_data.slice(1).map((recv_data: string) => {
                          return (
                            <div className={styles.dataShowItem} key={`${recv_data}_${Math.random()}`}>
                              <Tooltip title={recv_data} placement='bottom' color='#ffffff' overlayClassName={styles.overlay}>
                                <span className={styles.dataLongInfo}>{recv_data || '无'}</span>
                              </Tooltip>
                              <span role='button' tabIndex={0} className={styles.footerSpanSend_copy} onClick={copyTextFn(recv_data)}>
                                <img src={errorFrameCopy} alt='' />
                              </span>
                            </div>
                          )
                        })}
                    </div>
                  </div>
                  <div>{item.case_type ? '是' : '否'}</div>
                  <div className={globalStyle.Opera_detaile}>
                    <span role='button' tabIndex={0} onClick={() => {}}>
                      仿真信息
                    </span>
                    {item.send_data.length > 1 && (
                      <span role='button' tabIndex={0} onClick={() => changeToggleStatus(item.id)}>
                        {currentOpenId === item.id ? '收起' : '展开'}
                      </span>
                    )}
                    <span role='button' tabIndex={0} onClick={() => {}}>
                      重放
                    </span>
                  </div>
                </div>
              )
            })}
            {logData.length === 0 ? <NoData title='暂无数据' /> : null}
          </div>
        )}
      </div>
      <div className={globalStyle.AnBan_PaginationsAge}>
        <PaginationsAge length={total} num={10} getParams={setOperation} pagenums={params.page} />
      </div>
    </div>
  )
}

export default DetailTestedTable
