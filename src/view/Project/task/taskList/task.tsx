import SearchInput from 'Src/components/Input/searchInput/searchInput'
import CreateButton from 'Src/components/Button/createButton'

import { useEffect, useRef, useState } from 'react'
import * as React from 'react'
import { message } from 'antd'
import { RouteComponentProps, StaticContext, useHistory, withRouter } from 'react-router'
import detail_icon from 'Src/assets/image/icon_detail.svg'
import delete_icon from 'Src/assets/image/icon_delete.svg'
import { taskList, deleteTasks } from 'Src/services/api/taskApi'
import { throwErrorMessage } from 'Src/util/message'
import CommonModle from 'Src/components/Modal/projectMoadl/CommonModle'
import globalStyle from 'Src/view/Project/project/project.less'
import InfiniteScroll from 'react-infinite-scroll-component'
import styles from './task.less'

const request = {
  project_id: -1,
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
  //
  const layoutRef = useRef<any>()
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

  // 新建任务
  const jumpNewCreateTask = () => {
    history.push({
      pathname: '/projects/Tasks/createTask',
      state: { projectInfo, taskInfo: { editTask: false } }
    })
  }

  // 更新参数获取列表
  const updateParams = (value: string) => {
    setParams({ ...params, key_word: value, page: 1 })
  }

  //  更改页码
  const loadMoreData = () => {
    const newPage = params.page + 1
    setParams({ ...params, page: newPage })
  }

  // 更新右侧列表

  const updateInstanceList = (id: string) => {
    setModalData({ ...modalData, taskId: id })
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

  // 获取任务列表
  const getTaskList = async (value: Resparams) => {
    try {
      const result = await taskList(value)
      if (result.data) {
        const newList = taskLists.concat(result.data.results)
        if (newList.length === result.data.total) {
          setHasMore(false)
        }
        setTaskList([...newList])
      }
      return result
    } catch (error) {
      throwErrorMessage(error)
    }
  }

  const getLayout = () => {
    setHeight(layoutRef.current.clientHeight)
  }
  useEffect(() => {
    getLayout()
    getTaskList({ ...params })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  return (
    <div className={styles.taskLeft_list} ref={layoutRef}>
      <div className={globalStyle.AnBan_header}>
        <div className={styles.taskHeadr}>
          <span className={styles.taskLeft_header_title}>{projectInfo?.projectName || ''}</span>
          <CreateButton width='100%' height='36px' borderRadius='4px' name='新建任务' size='small' type='primary' onClick={jumpNewCreateTask} />
        </div>
        <SearchInput className={styles.taskInput} placeholder='根据名称搜索任务' onChangeValue={updateParams} />
      </div>
      <div className={styles.concentBody}>
        <InfiniteScroll
          dataLength={taskLists.length}
          next={loadMoreData}
          hasMore={hasMoreData}
          height={height - 214}
          loader={<h4>正在加载中ing</h4>}
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>已经全部加载完成,No_hasMoreData!!!</b>
            </p>
          }
        >
          {/* <div className={styles.concentBody}> */}
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
                <span>{item.name}</span>
                <div className={styles.icon_layout}>
                  <img src={detail_icon} alt='' />
                  <img src={delete_icon} alt='' />
                </div>
              </div>
            )
          })}
          {/* </div> */}
        </InfiniteScroll>
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
