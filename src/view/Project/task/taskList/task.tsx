import SearchInput from 'Src/components/Input/searchInput/searchInput'
import CreateButton from 'Src/components/Button/createButton'

import { useEffect, useRef, useState } from 'react'
import * as React from 'react'
import { message, Tooltip } from 'antd'
import { RouteComponentProps, StaticContext, useHistory, withRouter } from 'react-router'

import testing from 'Src/assets/Contents/Group692.svg'
import { taskList, deleteTasks } from 'Src/services/api/taskApi'
import { throwErrorMessage } from 'Src/util/message'
import CommonModle from 'Src/components/Modal/projectMoadl/CommonModle'
import globalStyle from 'Src/view/Project/project/project.less'
import InfiniteScroll from 'react-infinite-scroll-component'
import styles from './task.less'
import { InstancesContext } from '../TaskIndex'

const request = {
  project_id: '',
  key_word: '',
  page: 1,
  page_size: 20,
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
  taskListOne_id: string
}
interface results {
  status: 0 | 2 | 1 | 3 | 4 | 5
}

export interface projectInfoType {
  projectId: number
  projectDesc: string
  projectName: string
}
interface PropsData {
  checkInstances: (taskId: string) => void
}

const Task: React.FC<RouteComponentProps<any, StaticContext, projectPropsType<projectInfoType>> & PropsData> = props => {
  const InstancesDetail = React.useContext(InstancesContext)
  const { projectInfo, taskListOne_id } = props.location?.state
  const { checkInstances } = props
  const layoutRef = useRef<any>()
  const timerRef = React.useRef<any>()
  const history = useHistory()
  // 任务列表参数
  const [params, setParams] = useState<Resparams>({ ...request, project_id: projectInfo.projectId })
  // 动态设置虚拟列表高度
  const [height, setHeight] = useState(700)
  // 项目管理
  const [taskLists, setTaskList] = useState<any>([])

  // 数据是否还有更多
  const [hasMoreData, setHasMore] = useState(true)

  // 弹窗
  const [modalData, setModalData] = useState({ taskId: '', fixTitle: false, isModalVisible: false })

  //  删除弹出框
  const [CommonModleStatus, setCommonModleStatus] = useState<boolean>(false)

  //
  const [spinning, setSpinning] = useState(false)

  // 新建任务
  const jumpNewCreateTask = () => {
    history.push({
      pathname: '/projects/Tasks/createTask',
      state: { projectInfo, taskInfo: { editTask: false } }
    })
  }

  // 更新参数获取列表
  const updateParams = (value: string) => {
    setTaskList([])
    setParams({ ...params, key_word: value, page: 1 })
  }

  //  更改页码
  const loadMoreData = () => {
    const newPage = params.page_size + 10
    setParams({ ...params, page_size: newPage })
  }

  // 更新右侧列表
  const updateInstanceList = (id: string) => {
    setModalData({ ...modalData, taskId: id })
    checkInstances(id)
  }

  // 实列详情返回任务列表,左侧任务列表,与实列列表保持一致
  // 通过维护task_id,且通过路由,或者任务列表第一个数据拿值,并且判断taskList长度是否为空
  const keepCheckTask = React.useCallback(
    (id: string | number) => {
      if (id) {
        checkInstances(id as string)
        setModalData({ ...modalData, taskId: id as string })
      }
    },
    [checkInstances, modalData]
  )
  // 页面加载时 调用
  const backWebTask = (taskListOne_id: string) => {
    if (taskListOne_id) {
      setModalData({ ...modalData, taskId: taskListOne_id })
      checkInstances(taskListOne_id)
      return true
    }
    return false
  }

  useEffect(() => {
    backWebTask(taskListOne_id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 删除弹出框函数
  const CommonModleClose = (value: boolean) => {
    setCommonModleStatus(value)
  }

  const deleteProjectRight = async () => {
    setSpinning(true)
    try {
      const res = await deleteTasks(projectInfo.projectId, modalData.taskId)
      setModalData({ ...modalData, taskId: '' })
      if (res.data) {
        if (res.data.success_list.length > 0) {
          setTaskList([])
          message.success('删除成功')
        } else {
          message.error(res.data.fail_list[0])
        }
        setParams({ ...params, page: 1 })
      }
      setSpinning(false)
      CommonModleClose(false)
    } catch (error) {
      CommonModleClose(false)
      throwErrorMessage(error, { 1009: '任务删除失败' })
    }
  }

  // 获取任务列表
  const getTaskList = React.useCallback(
    async (value: Resparams) => {
      try {
        const result = await taskList(value)
        if (result.data) {
          const newList = [...result.data.results]
          if (newList.length === 0) {
            InstancesDetail.setInstance(false)
            setHasMore(false)
            return false
          }
          if (modalData.taskId) {
            keepCheckTask(modalData.taskId)
          } else {
            keepCheckTask(newList[0].id)
          }

          if (newList.length === result.data.total) {
            setHasMore(false)
          }
          setTaskList([...newList])
          InstancesDetail.setInstance(true)
        }
        return result
      } catch (error) {
        throwErrorMessage(error)
      }
    },
    [InstancesDetail, keepCheckTask, modalData.taskId]
  )

  // 跳转修改任务
  const fixTask = (item: any) => {
    history.push({
      pathname: '/projects/Tasks/fixTask',
      state: { projectInfo, taskInfo: { data: item, editTaskMode: true } }
    })
  }

  React.useEffect(() => {
    timerRef.current = setInterval(() => {
      getTaskList({ ...params })
    }, 60000)
    return () => {
      clearInterval(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, modalData?.taskId])

  useEffect(() => {
    getTaskList({ ...params })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, InstancesDetail?.task_detail?.status])

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { height } = entry.contentRect
        let num = 700
        if (height >= 1940 && height >= 2300) {
          num = height * 0.8
        } else if (height >= 1400 && height <= 1940) {
          num = height * 0.5
        } else {
          num = height * 0.2
        }
        setHeight(height - Math.ceil(num as number))
      }
    })

    if (layoutRef.current) {
      resizeObserver.observe(layoutRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <div className={styles.taskLeft_list} ref={layoutRef}>
      <div className={globalStyle.AnBan_header}>
        <div className={styles.taskHeadr}>
          <Tooltip placement='bottom' title={projectInfo?.projectName || ''}>
            <span className={styles.taskLeft_header_title}>{projectInfo?.projectName || ''}</span>
          </Tooltip>

          <CreateButton width='100%' height='36px' borderRadius='4px' name='新建任务' size='small' type='primary' onClick={jumpNewCreateTask} />
        </div>
        <SearchInput className={styles.taskInput} placeholder='根据名称搜索任务' onChangeValue={updateParams} />
      </div>
      <div className={styles.concentBody}>
        <InfiniteScroll
          dataLength={taskLists.length}
          next={loadMoreData}
          hasMore={hasMoreData}
          height={height}
          loader={
            <p style={{ textAlign: 'center' }}>
              <div className={styles.listLine} />
              <div className={styles.concentList}>内容已经加载完毕</div>
            </p>
          }
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <div className={styles.listLine} />
              <div className={styles.concentList}>内容已经加载完毕</div>
            </p>
          }
        >
          {taskLists.map((item: any) => {
            return (
              <div
                tabIndex={item.id}
                role='button'
                className={modalData.taskId === item.id ? styles.itemActive : styles.item}
                onClick={() => {
                  updateInstanceList(item.id)
                }}
                key={item.id}
              >
                <span>
                  <img className={[2, 3, 4, 7, 8].includes(item.status) ? styles.iconShow : styles.icon} src={testing} alt='' />
                  {item.name}
                </span>
                <div className={styles.icon_layout}>
                  <div
                    role='time'
                    onClick={() => {
                      fixTask(item)
                    }}
                    className={styles.taskListLeft_editImg}
                  />
                  <div
                    role='time'
                    className={styles.taskListLeft_detailImg}
                    onClick={() => {
                      CommonModleClose(true)
                    }}
                  />
                </div>
              </div>
            )
          })}
        </InfiniteScroll>
      </div>
      <CommonModle
        IsModalVisible={CommonModleStatus}
        spinning={spinning}
        deleteProjectRight={deleteProjectRight}
        CommonModleClose={CommonModleClose}
        ing='删除中'
        name='删除任务'
        concent='是否确认删除？'
      />
    </div>
  )
}

export default withRouter(Task)
