import SearchInput from 'Src/components/Input/searchInput/searchInput'
import DefaultValueTips from 'Src/components/Tips/defaultValueTips'
import CreateButton from 'Src/components/Button/createButton'
import Table from 'antd/lib/table'
import ConfigProvider from 'antd/lib/config-provider'
import { useEffect, useRef, useState } from 'react'
import * as React from 'react'
import { message } from 'antd'
import { RouteComponentProps, StaticContext, useHistory, withRouter } from 'react-router'
import zhCN from 'antd/lib/locale/zh_CN'
import deleteImage from 'Image/Deletes.svg'
import PaginationsAge from 'Src/components/Pagination/Pagina'
import { statusList, statusMap } from 'Src/util/DataMap/dataMap'
import { DownOutlined } from '@ant-design/icons/lib/icons'
import { taskList, deleteTasks } from 'Src/services/api/taskApi'
import { throwErrorMessage } from 'Src/util/message'
import CommonModle from 'Src/components/Modal/projectMoadl/CommonModle'
import globalStyle from 'Src/view/Project/project/project.less'
import UseWebsocket from 'Src/webSocket/useWebSocket'
import styles from './task.less'

const customizeRender = () => <DefaultValueTips content='暂无任务' />

const request = {
  project_id: -1,
  key_word: '',
  page: 1,
  page_size: 10,
  status: null,
  sort_field: 'create_time',
  sort_order: 'descend'
}

interface Resparams {
  project_id: number
  key_word?: string
  page: number
  status: number | string | null
  page_size: number
  sort_field?: string
  sort_order?: string
}
interface statusItemType {
  lable: string
  value: number | string
}
type statusValue = string | number

interface projectListType {
  [key: string]: string | number
}
interface projectPropsType<T> {
  projectInfo: T
}
interface results {
  status: 0 | 2 | 1 | 3 | 4 | 5
}

export interface projectInfoType {
  projectId: number
  projectDesc: string
  projectName: string
}
// Todo 隐藏删除修改功能
const disPlayNone = false
const Task: React.FC<RouteComponentProps<any, StaticContext, projectPropsType<projectInfoType>>> = props => {
  const { projectInfo } = props.location?.state
  const history = useHistory()
  // 任务列表参数
  const [params, setParams] = useState<Resparams>({ ...request, project_id: projectInfo.projectId })

  // 项目管理
  const [taskLists, setTaskList] = useState<any>([])

  // 页码
  const [total, setTotal] = useState<number>()

  // 筛选任务状态
  const [statusOperationStatus, setStatusOperationStatus] = useState<boolean>(false)

  // 状态显示控制
  const [isShows, setShow] = useState<statusValue>(-2)

  // 弹窗
  const [modalData, setModalData] = useState({ taskId: '', fixTitle: false, isModalVisible: false })

  //  删除弹出框
  const [CommonModleStatus, setCommonModleStatus] = useState<boolean>(false)

  //  注册 webSocket
  const [messageInfo] = UseWebsocket()

  // 新建任务
  const jumpNewCreateTask = () => {
    history.push({
      pathname: '/projects/Tasks/createTask',
      state: { projectInfo, taskInfo: { editTask: false } }
    })
  }

  // 筛选状态菜单控制
  const operattion = (operation: boolean) => {
    setStatusOperationStatus(!operation)
  }

  // 更新参数获取列表
  const updateParams = (value: string) => {
    setParams({ ...params, key_word: value })
  }

  //  更改页码
  const changePage = (page: number, type: string, pageSize: number) => {
    setParams({ ...params, page, page_size: pageSize })
  }

  // 选择任务状态
  const checkStatus = (value: string | number | null) => {
    setShow(value as number)
    if (value === '') {
      setParams({ ...params, status: null })
    } else {
      setParams({ ...params, status: `${value}` })
    }
    setStatusOperationStatus(false)
  }
  // 状态菜单
  const StatusMenuComponents = () => {
    return (
      <div className={styles.statusMenu}>
        {statusList.map((item: statusItemType) => {
          return (
            <div key={item.value} className={styles.size}>
              <div
                className={[styles.checkblue, `${isShows === item.value ? styles.checkBlue : styles.checkblack}`].join(' ')}
                onClick={() => {
                  checkStatus(item.value)
                }}
                role='time'
              >
                {' '}
                {item.lable}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const jumpTasksDetail = (value: any) => {
    const task_id = value.id
    history.push({
      pathname: '/projects/Tasks/Detail',
      state: { projectInfo, taskInfo: { editTask: false, task_id } }
    })
  }

  const deleteTask = (value: boolean, id: any) => {
    setModalData({ ...modalData, taskId: id })
    setCommonModleStatus(value)
  }

  const deleteProjectRight = async () => {
    try {
      const res = await deleteTasks(projectInfo.projectId, modalData.taskId)
      if (res.data) {
        setParams({ ...params, key_word: '', page: 1 })
        setCommonModleStatus(false)
        message.success('删除成功')
      }
    } catch (error) {
      throwErrorMessage(error, { 1009: '项目删除失败' })
    }
  }

  // 删除弹出框函数
  const CommonModleClose = (value: boolean) => {
    setCommonModleStatus(value)
  }

  // 修改任务
  const fixTask = (value: any) => {
    if ([0, 1, 4].includes(value.status)) {
      history.push({
        pathname: '/projects/Tasks/fixTask',
        state: { projectInfo, taskInfo: { editTask: true, data: value } }
      })
    } else {
      message.error('任务正在运行中,请结束任务')
    }
  }
  const timer = useRef<any>()
  // 表格title
  const columns = [
    {
      width: '8%',
      title: '任务名称',
      dataIndex: 'name',
      key: 'name',
      // eslint-disable-next-line react/display-name
      render: (_: any, row: any) => {
        return (
          <span className={styles.tableProjectName} role='time' onClick={() => {}}>
            {row.name}
          </span>
        )
      }
    },
    {
      width: '20%',
      title: '描述',
      dataIndex: 'desc',
      key: 'desc'
    },
    {
      width: '10%',
      title: '运行时长',
      dataIndex: 'test_time',
      key: 'test_time',
      // eslint-disable-next-line react/display-name
      render: (_: any, row: any) => {
        return <span>{`${row.test_time}`}</span>
      }
    },
    {
      width: '10%',
      title: 'Crash数量',
      dataIndex: 'error_num',
      key: 'error_num'
    },

    {
      width: '15%',
      // eslint-disable-next-line react/display-name
      title: () => (
        <div className={styles.statusList_boby}>
          <div
            role='button'
            tabIndex={0}
            onClick={() => {
              operattion(statusOperationStatus)
            }}
          >
            <span>任务状态</span>
            <DownOutlined rotate={statusOperationStatus ? -180 : 0} />
          </div>
          {statusOperationStatus ? <StatusMenuComponents /> : null}
        </div>
      ),
      dataIndex: 'status',
      // eslint-disable-next-line react/display-name
      render: (text: any, row: results) => {
        return (
          <div className={styles.status}>
            <span className={statusMap[row.status].color} />
            <span>{statusMap[row.status].label}</span>
          </div>
        )
      }
    },
    {
      width: '15%',
      title: '更多操作',
      dataIndex: 'operations',
      key: 'operations',
      // eslint-disable-next-line react/display-name
      render: (_: any, row: any) => {
        return (
          <div className={globalStyle.Opera_detaile}>
            <span
              role='button'
              tabIndex={0}
              onClick={() => {
                jumpTasksDetail(row)
              }}
            >
              查看详情
            </span>
            {disPlayNone && (
              <>
                {' '}
                <span
                  style={{ marginLeft: '10px', marginRight: '10px' }}
                  role='button'
                  tabIndex={0}
                  onClick={() => {
                    fixTask(row)
                  }}
                >
                  修改
                </span>
                <img
                  src={deleteImage}
                  alt=''
                  onClick={() => {
                    deleteTask(true, row.id)
                  }}
                />
              </>
            )}
          </div>
        )
      }
    }
  ]

  // 获取任务列表
  const getTaskList = async (value: Resparams) => {
    try {
      const result = await taskList(value)
      if (result.data) {
        setTotal(result.data.total)
        setTaskList(result.data.results)
      }
      return result
    } catch (error) {
      throwErrorMessage(error)
    }
  }

  useEffect(() => {
    if (messageInfo || params) {
      timer.current = setInterval(() => {
        getTaskList(params)
      }, 1000)
    }
    return () => {
      clearInterval(timer.current)
    }
  }, [params, messageInfo])
  return (
    <div className={globalStyle.AnBan_main}>
      <div className={globalStyle.AnBan_header}>
        <div>
          <span className={globalStyle.AnBan_header_title}>{projectInfo?.projectName || ''}</span>
          <span className={styles.projectDescStyle}>{`项目描述 : ${projectInfo?.projectDesc || ''}`}</span>
        </div>

        <div className={globalStyle.AnBan_header_bottom}>
          <SearchInput placeholder='根据名称搜索任务' onChangeValue={updateParams} />
          <CreateButton width='146px' name='新建任务' size='large' type='primary' onClick={jumpNewCreateTask} />
        </div>
      </div>
      <div className={globalStyle.tableConcent}>
        <ConfigProvider locale={zhCN} renderEmpty={customizeRender}>
          <Table rowKey='id' dataSource={taskLists} columns={columns} pagination={false} />
        </ConfigProvider>
      </div>
      <div className={globalStyle.AnBan_PaginationsAge}>
        <PaginationsAge length={total} num={10} getParams={changePage} pagenums={params.page} />
      </div>
      <CommonModle
        IsModalVisible={CommonModleStatus}
        deleteProjectRight={deleteProjectRight}
        CommonModleClose={CommonModleClose}
        name='删除任务'
        concent='关联任务会被停止，关联数据会一并被删除，是否确定删除？'
      />
    </div>
  )
}

export default withRouter(Task)
