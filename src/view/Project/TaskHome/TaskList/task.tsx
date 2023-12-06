import SearchInput from 'Src/components/Input/searchInput/searchInput'
import CreateButton from 'Src/components/Button/createButton'

import { useEffect, useRef, useState } from 'react'
import * as React from 'react'
import { message, Tooltip } from 'antd'
import { RouteComponentProps, StaticContext, useHistory, withRouter } from 'react-router'

import testing from 'Src/assets/Contents/Group692.svg'
import { deleteTasks } from 'Src/services/api/taskApi'
import { throwErrorMessage } from 'Src/util/message'
import CommonModle from 'Src/components/Modal/projectMoadl/CommonModle'
import globalStyle from 'Src/view/Project/project/project.less'
import InfiniteScroll from 'react-infinite-scroll-component'
import styles from './task.less'
import { TaskListDataStore } from '../TaskStore/TaskStore'

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
  status: number
}

export interface projectInfoType {
  projectId: number
  projectDesc: string
  projectName: string
}

const Task: React.FC<RouteComponentProps<any, StaticContext, projectPropsType<projectInfoType>> & results> = props => {
  const { loadMoreData, hasMoreData, setKeyWord, setTaskListData, setPage, setTaskID } = TaskListDataStore()
  const TaskId = TaskListDataStore(state => state.TaskId)
  const loading = TaskListDataStore(state => state.loading)
  const TaskListData = TaskListDataStore(state => state.TaskListData)

  const ChoiceTaskId = React.useMemo(() => {
    if (TaskId) {
      return TaskId
    }
    if (TaskListData.length >= 1) {
      return (TaskListData as Record<string, any>[])[0].id
    }
  }, [TaskId, TaskListData])
  const { projectInfo } = props.location?.state
  const { status } = props
  const layoutRef = useRef<any>()
  const history = useHistory()

  // 动态设置虚拟列表高度
  const [height, setHeight] = useState(700)

  //  删除弹出框
  const [CommonModleStatus, setCommonModleStatus] = useState<boolean>(false)

  //
  const [spinning, setSpinning] = useState(false)
  const updateParams = (value: string) => {
    setTaskListData([])
    setKeyWord(value)
  }
  // 新建任务
  const jumpNewCreateTask = () => {
    history.push({
      pathname: '/Projects/Tasks/CreateTask',
      state: { projectInfo, taskInfo: { editTask: false } }
    })
  }

  // 删除弹出框函数
  const CommonModleClose = (value: boolean) => {
    setCommonModleStatus(value)
  }

  const deleteProjectRight = React.useCallback(async () => {
    setSpinning(true)
    try {
      const res = await deleteTasks(projectInfo.projectId, `${TaskId}`)
      if (res.data) {
        if (res.data.success_list.length > 0) {
          setTaskListData([])
          message.success('删除成功')
        } else {
          message.error(res.data.fail_list[0])
        }
        setPage(1)
      }
      setSpinning(false)
      CommonModleClose(false)
    } catch (error) {
      CommonModleClose(false)
      throwErrorMessage(error, { 1009: '任务删除失败', 1007: '操作频繁' })
    }
  }, [TaskId, projectInfo.projectId, setPage, setTaskListData])

  // 跳转修改任务
  const fixTask = (item: any) => {
    history.push({
      pathname: '/Projects/Tasks/FixTask',
      state: { projectInfo, taskInfo: { data: item, editTaskMode: true } }
    })
  }

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
          <Tooltip placement='bottomLeft' title={projectInfo?.projectName || ''}>
            <span className={styles.taskLeft_header_title}>{projectInfo?.projectName || ''}</span>
          </Tooltip>
          <CreateButton width='100%' height='36px' borderRadius='4px' name='新建任务' size='small' type='primary' onClick={jumpNewCreateTask} />
        </div>
        <SearchInput className={styles.taskInput} placeholder='根据名称搜索任务' onChangeValue={updateParams} />
      </div>
      <div className={styles.concentBody}>
        {/* <Spin spinning={loading}> */}
        {!loading && (
          <InfiniteScroll
            dataLength={TaskListData.length}
            next={loadMoreData}
            hasMore={hasMoreData}
            height={height}
            loader={
              <div style={{ textAlign: 'center' }}>
                <div className={styles.listLine} />
                <div className={styles.concentList}>内容已经加载完毕</div>
              </div>
            }
            endMessage={
              <div style={{ textAlign: 'center' }}>
                <div className={styles.listLine} />
                <div className={styles.concentList}>内容已经加载完毕</div>
              </div>
            }
          >
            {TaskListData?.map((item: any) => {
              return (
                <div
                  tabIndex={item.id}
                  role='button'
                  className={ChoiceTaskId === item.id ? styles.itemActive : styles.item}
                  onClick={() => {
                    setTaskID(item.id)
                  }}
                  key={item.id}
                >
                  <span>
                    <img
                      className={[2, 3, 4, 7, 8].includes(status !== undefined ? status : item.status) ? styles.iconShow : styles.icon}
                      src={testing}
                      alt=''
                    />
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
        )}
        {/* </Spin> */}
      </div>
      <CommonModle
        btnName='删除'
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
