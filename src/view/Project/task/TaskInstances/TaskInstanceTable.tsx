import SearchInput from 'Src/components/Input/searchInput/searchInput'
import DefaultValueTips from 'Src/components/Tips/defaultValueTips'
import CreateButton from 'Src/components/Button/createButton'
import Table from 'antd/lib/table'
import ConfigProvider from 'antd/lib/config-provider'
import { useEffect, useState } from 'react'
import * as React from 'react'
import { message } from 'antd'
import { RouteComponentProps, StaticContext, useHistory, withRouter } from 'react-router'
import zhCN from 'antd/lib/locale/zh_CN'
import deleteImage from 'Src/assets/image/icon_delete.svg'
import PaginationsAge from 'Src/components/Pagination/Pagina'
import { reset_mode_Map, statusList, statusMap } from 'Src/util/DataMap/dataMap'
import { DownOutlined } from '@ant-design/icons/lib/icons'
import { deleteExampleTask, taskTest } from 'Src/services/api/taskApi'
import { throwErrorMessage } from 'Src/util/message'
import CommonModle from 'Src/components/Modal/projectMoadl/CommonModle'
import globalStyle from 'Src/view/Project/project/project.less'
import NewTaskInstance from 'Src/components/Modal/taskModal/newTaskInstance'
import { getTime } from 'Src/util/baseFn'

import styles from '../taskList/task.less'
import TaskInstancesStyle from './TaskInstance.less'
import { InstancesContext } from '../TaskIndex'

const customizeRender = () => <DefaultValueTips content='暂无实例' />

const request = {
  task_id: '',
  key_word: '',
  page: 1,
  page_size: 10,
  status: null,
  sort_field: 'create_time',
  sort_order: 'descend'
}

interface Resparams {
  task_id: number
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

const TaskInstanceTable: React.FC<RouteComponentProps<any, StaticContext, projectPropsType<projectInfoType>>> = props => {
  const InstancesDetail = React.useContext(InstancesContext)
  const { projectInfo } = props.location?.state

  const history = useHistory()

  // 控制新建实列modal
  const [visibility, setVisibility] = useState(false)

  // 关闭modal
  const choiceModal = () => {
    setVisibility(!visibility)
  }

  const inputRef = React.useRef<any>()

  // 任务列表参数
  const [params, setParams] = useState<Resparams>({ ...request, task_id: InstancesDetail.task_detail.id })

  // 项目管理
  const [taskLists, setTaskList] = useState<any>([])

  // 页码
  const [total, setTotal] = useState<number>()

  // 筛选任务状态
  const [statusOperationStatus, setStatusOperationStatus] = useState<boolean>(false)

  // 状态显示控制
  const [isShows, setShow] = useState<statusValue | null>('')

  // 弹窗
  const [modalData, setModalData] = useState({ instances_id: '', fixTitle: false, isModalVisible: false })

  // 筛选状态菜单控制
  const operattion = (operation: boolean) => {
    setStatusOperationStatus(!operation)
  }

  // 更新参数获取列表
  const updateParams = (value: string) => {
    setParams({ ...params, key_word: value, page: 1 })
  }

  //  更改页码
  const changePage = (page: number, type: string, pageSize: number) => {
    setParams({ ...params, page, page_size: pageSize })
  }

  // 选择任务状态
  const checkStatus = React.useCallback(
    (value: string | number | null) => {
      setShow(value as number)
      if (value === '') {
        setParams({ ...params, status: null, page: 1 })
      } else {
        setParams({ ...params, status: `${value}`, page: 1 })
      }
      setStatusOperationStatus(false)
    },
    [params]
  )

  // 状态菜单
  const StatusMenuComponents = React.useCallback(() => {
    return (
      <div
        className={styles.statusMenu}
        onMouseLeave={() => {
          setStatusOperationStatus(false)
        }}
      >
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
  }, [checkStatus, isShows])

  const jumpTasksDetail = (value: any) => {
    const { task_id } = value
    history.push({
      pathname: '/Projects/Tasks/Detail',
      state: { projectInfo, taskInfo: { editTask: false, task_id }, instanceInfo: value }
    })
  }

  const deleteTask = (value: boolean, id: any) => {
    setModalData({ ...modalData, isModalVisible: value, instances_id: id })
  }

  const deleteProjectRight = React.useCallback(async () => {
    try {
      const res = await deleteExampleTask(InstancesDetail.task_detail.id, modalData.instances_id)
      if (res.data) {
        InstancesDetail.getDetail(InstancesDetail.task_detail.id)
        setParams({ ...params, key_word: '', page: 1 })
        setModalData({ ...modalData, isModalVisible: false })
        message.success('实例删除成功')
      }
    } catch (error) {
      throwErrorMessage(error, { 1009: '实例删除失败' })
    }
  }, [InstancesDetail, modalData, params])

  // 删除弹出框函数
  const CommonModleClose = (value: boolean) => {
    setModalData({ ...modalData, isModalVisible: value })
  }

  // 表格title
  const columns = [
    {
      width: '8%',
      title: '实例编号',
      dataIndex: 'num',
      key: 'num',
      // eslint-disable-next-line react/display-name
      render: (_: any, row: any) => {
        return (
          <span
            className={styles.tableProjectName}
            role='time'
            onClick={() => {
              jumpTasksDetail(row)
            }}
          >
            {row.num}
          </span>
        )
      }
    },
    {
      width: '8%',
      title: '设定时长',
      dataIndex: 'work_time_str',
      key: 'work_time_str'
    },
    {
      width: '8%',
      title: '运行时长',
      dataIndex: 'test_time',
      key: 'test_time',
      // eslint-disable-next-line react/display-name
      render: (_: any, row: any) => {
        return <span>{`${row.test_time}`}</span>
      }
    },
    {
      width: '8%',
      title: '复位方式',
      dataIndex: 'reset_mode',
      key: 'reset_mode',
      // eslint-disable-next-line react/display-name
      render: (_: any, row: any) => {
        return <span style={{ color: '#333333' }}>{reset_mode_Map[row.reset_mode as keyof typeof reset_mode_Map]}</span>
      }
    },
    {
      width: '8%',
      title: '缺陷数量',
      dataIndex: 'defects_count',
      key: 'defects_count'
    },
    {
      width: '11%',
      // eslint-disable-next-line react/display-name
      title: () => (
        <div className={styles.statusList_boby} style={{ cursor: 'pointer' }}>
          <div
            role='button'
            tabIndex={0}
            onClick={() => {
              operattion(statusOperationStatus)
            }}
          >
            <span>实例状态</span>
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
            <span style={{ color: '#333333' }}>{statusMap[row.status].label}</span>
          </div>
        )
      }
    },
    {
      width: '15%',
      title: '新建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      // eslint-disable-next-line react/display-name
      render: (_: any, row: any) => {
        return <span style={{ color: '#333333' }}>{getTime(row.create_time)}</span>
      }
    },
    {
      width: '12%',

      // eslint-disable-next-line react/display-name
      title: () => {
        return <span style={{ display: 'block', width: '100%', textAlign: 'right' }}>操作</span>
      },
      dataIndex: 'operations',
      key: 'operations',
      // eslint-disable-next-line react/display-name
      render: (_: any, row: any) => {
        return (
          <div className={globalStyle.Opera_detaile}>
            <span
              style={{ marginLeft: '10px', marginRight: '20px' }}
              role='button'
              className={styles.hoverOpera}
              tabIndex={0}
              onClick={() => {
                jumpTasksDetail(row)
              }}
            >
              查看详情
            </span>

            <img
              src={deleteImage}
              alt=''
              onClick={() => {
                deleteTask(true, row.id)
              }}
            />
          </div>
        )
      }
    }
  ]

  // 获取实列列表
  const getTaskInstancesList = async (value: Resparams) => {
    const val = { ...value }
    try {
      const listResult = await taskTest(val)
      if (listResult.data) {
        setTotal(listResult.data.total)
        setTaskList(listResult.data.results)
      }
      return listResult
    } catch (error) {
      throwErrorMessage(error)
    }
  }

  useEffect(() => {
    getTaskInstancesList(params)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  useEffect(() => {
    setParams({
      ...params,
      key_word: '',
      page: 1,
      page_size: 10,
      status: null,
      sort_field: 'create_time',
      sort_order: 'descend',
      task_id: InstancesDetail?.task_detail?.id
    })
    setShow('')
    inputRef.current?.save()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [InstancesDetail?.task_detail?.id, visibility, InstancesDetail?.task_detail?.status])

  return (
    <div className={globalStyle.AnBan_main}>
      <div className={styles.instance_header}>
        <div className={styles.instanceListLeft}>
          <span>实例列表</span>
          <SearchInput ref={inputRef} placeholder='根据实例编号搜索实例' className={TaskInstancesStyle.Inputs} onChangeValue={updateParams} />
        </div>
        <CreateButton
          width='146px'
          name='新建实例'
          height='36px'
          borderRadius='4px'
          size='middle'
          type='primary'
          onClick={() => {
            setVisibility(true)
          }}
        />
      </div>
      <div className={globalStyle.tableConcent}>
        <ConfigProvider locale={zhCN} renderEmpty={customizeRender}>
          <Table rowKey='id' className={TaskInstancesStyle.table} dataSource={taskLists} columns={columns} pagination={false} />
        </ConfigProvider>
      </div>
      <div className={globalStyle.AnBan_PaginationsAge}>
        <PaginationsAge length={total} num={params.page_size} getParams={changePage} pagenums={params.page} />
      </div>
      <CommonModle
        IsModalVisible={modalData.isModalVisible}
        deleteProjectRight={deleteProjectRight}
        CommonModleClose={CommonModleClose}
        ing='删除中'
        btnName='删除'
        name='删除实例'
        concent='是否确认删除？'
      />
      {visibility ? (
        <NewTaskInstance visibility={visibility} isDetail={0} task_id={InstancesDetail.task_detail.id} choiceModal={choiceModal} width='592px' />
      ) : null}
    </div>
  )
}

export default withRouter(TaskInstanceTable)
