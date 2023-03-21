import { LoadingOutlined, RightOutlined } from '@ant-design/icons'
import * as React from 'react'
import { ResTaskDetail } from 'Src/globalType/Response'
import { getTime } from 'Src/util/baseFn'
import { message, Spin, Tooltip } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import stopCourse from 'Image/stopCourse.svg'
import Begin from 'Image/BeginCourse.svg'
import monitor from 'Image/monitor.svg'
import DeleteCourse from 'Image/DeleteCourse.svg'
import report from 'Image/report.svg'
import over from 'Image/overTask.svg'
import { throwErrorMessage } from 'Src/util/message'
import { bgTest, deleteExampleTask, rePlayTask, stopcontuine, stoppaused, stoptest } from 'Src/services/api/taskApi'
import UseWebsocket from 'Src/webSocket/useWebSocket'
import styles from '../taskDetail.less'
import { taskDetailInfoType } from '../taskDetail'
import { projectInfoType } from '../../task/taskList/task'

interface taskDetailType<S, T> {
  projectInfo: T
  taskInfo: S
}

interface propsResTaskDetailType<T> {
  taskDetailInfo: T
  jumpLookTaskInfo: () => void
  setUpdateStatus: any
  infoMap: taskDetailType<taskDetailInfoType, projectInfoType>
}

interface InfoType {
  task_status: number
}

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />
function TaskDetailHead(props: propsResTaskDetailType<ResTaskDetail>) {
  const { taskInfo, projectInfo } = props.infoMap
  const { name, start_time, end_time, status, id, project_id, desc } = props.taskDetailInfo
  const [messageInfo] = UseWebsocket()
  const [spinStatus, setSpinStatus] = React.useState(false)

  const [index, setIndex] = React.useState(0)
  const history = useHistory()
  const inScale = () => {
    history.push({
      pathname: '/projects/Tasks/Detail/Scale',
      state: { taskInfo, projectInfo, test_Id: id, isTesting: true }
    })
  }

  React.useEffect(() => {
    if (messageInfo) {
      setSpinStatus(false)
      props.setUpdateStatus(messageInfo.task_status)
    }
  }, [messageInfo, props])

  const continueOrStop = React.useCallback(async () => {
    if (spinStatus) return
    if ([2, 8].includes(status)) {
      // 停止任务  通过任务ID
      setSpinStatus(true)
      setIndex(4)
      try {
        await stoppaused({ task_id: id })
        return
      } catch (error) {
        setSpinStatus(false)
        message.error(error.message)
      }
    } else {
      // 继续任务
      setIndex(5)
      setSpinStatus(true)
      try {
        await stopcontuine({ task_id: id })
        return
      } catch (error) {
        setSpinStatus(false)
        message.error(error.message)
      }
    }
  }, [id, spinStatus, status])

  const beginOrOver = React.useCallback(async () => {
    if (spinStatus) return
    if ([2, 3, 4, 8, 9].includes(status)) {
      setIndex(1)
      // 停止任务  通过任务ID
      setSpinStatus(true)
      try {
        await stoptest({ task_id: id })
        return
      } catch (error) {
        message.error(error.message)
        setSpinStatus(false)
      }
    }
    if (status === 0 || status === 1) {
      setSpinStatus(true)
      setIndex(2)
      try {
        await rePlayTask({ task_id: id })
        return
      } catch (error) {
        setSpinStatus(false)
        message.error(error.message)
      }
    }
  }, [id, spinStatus, status])

  const beginTests = React.useCallback(async () => {
    if (spinStatus) return
    setSpinStatus(true)
    setIndex(3)
    try {
      await bgTest({ task_id: id as number })
      return
    } catch (error) {
      setSpinStatus(false)
      message.error(error.message)
    }
  }, [id, spinStatus])
  const lookTaskInfo = React.useCallback(() => {
    props.jumpLookTaskInfo()
  }, [props])

  const deleteTests = React.useCallback(async (project_id, id) => {
    try {
      return await deleteExampleTask(project_id, id)
    } catch (error) {
      throwErrorMessage(error)
    }
  }, [])

  return (
    <div className={styles.taskDetailHead_Main}>
      <div className={styles.taskDetailHead_Main_left}>
        <div className={styles.taskDetailHead_Main_titlelayout}>
          <span className={styles.taskDetailHead_Main_left_title}>{`${name}`}</span>
          <div style={{ marginTop: '6px' }} className={styles.taskDetailCard_Main_left_footer_detail}>
            <span role='time' onClick={lookTaskInfo}>
              查看任务信息
            </span>
            <RightOutlined />
          </div>
        </div>
        <div className={styles.taskDetailHead_Main_left_footer}>
          <span> {`任务描述:${desc}`}</span>
          <span>
            {' '}
            {[0, 1].includes(status)
              ? `开始时间 : ${getTime(start_time)} | 结束时间 : ${getTime(end_time)}`
              : [2, 3, 4].includes(status)
              ? `开始时间 : ${getTime(start_time)}`
              : null}{' '}
          </span>
        </div>
      </div>
      <div className={styles.taskDetailHead_Main_right}>
        {[0, 1].includes(status) && (
          <Link to={`/OnlineReporting?id=${id}?name=${name}`} target='_blank' style={{ color: '#000000' }}>
            <div role='button' className={styles.ImageContioner} tabIndex={0}>
              <img className={styles.ImageSize} src={report} alt='stopCourse' />
              <span>查看报告</span>
            </div>
          </Link>
        )}
        {[2, 3, 4, 8, 9].includes(status) && (
          <div
            className={styles.ImageContioner}
            role='button'
            tabIndex={0}
            onClick={() => {
              inScale()
            }}
          >
            <img className={styles.ImageSize} src={monitor} alt='stopCourse' />
            <span>动态监控</span>
          </div>
        )}
        <div
          role='button'
          className={styles.ImageContioner}
          tabIndex={0}
          onClick={() => {
            beginOrOver()
          }}
        >
          {[2, 3, 4, 8, 9].includes(status) ? (
            <>
              <Spin spinning={spinStatus && index === 1} indicator={antIcon}>
                <img className={styles.ImageSize} src={over} alt='stopCourse' />
              </Spin>
              <span>结束任务</span>
            </>
          ) : [0, 1].includes(status) ? (
            <>
              <Tooltip placement='bottom' title='重新测试当前任务（重新发送已经测试过的用例）'>
                <Spin spinning={spinStatus && index === 2} indicator={antIcon}>
                  <img className={styles.ImageSize} src={Begin} alt='beginCourse' />
                </Spin>
              </Tooltip>
              <span>重测任务</span>
            </>
          ) : null}
        </div>
        {[0, 1, 5, 6].includes(status) && (
          <div
            role='button'
            className={styles.ImageContioner}
            tabIndex={0}
            onClick={() => {
              beginTests()
            }}
          >
            {[0, 1, 5, 6].includes(status) && (
              <>
                <Tooltip placement='bottom' title='开始测试当前任务'>
                  <Spin spinning={spinStatus && index === 3} indicator={antIcon}>
                    <img className={styles.ImageSize} src={Begin} alt='beginCourse' />
                  </Spin>
                </Tooltip>
                <span>开始测试</span>
              </>
            )}
          </div>
        )}
        {[2, 3, 4, 8, 9].includes(status) && (
          <div
            className={styles.ImageContioner}
            role='button'
            tabIndex={0}
            onClick={() => {
              continueOrStop()
            }}
          >
            {[2, 8].includes(status) ? (
              <Spin spinning={spinStatus && index === 4} indicator={antIcon}>
                <img className={styles.ImageSize} src={stopCourse} alt='stopCourse' />
              </Spin>
            ) : [3, 4, 9].includes(status) ? (
              <Spin spinning={spinStatus && index === 5} indicator={antIcon}>
                <img src={Begin} className={styles.ImageSize} alt='stopCourse' />
              </Spin>
            ) : null}
            <span>{[2, 8].includes(status) ? '暂停任务' : '继续任务'}</span>
          </div>
        )}
        {[-1].includes(status) ? (
          <div
            className={styles.ImageContioner}
            role='button'
            tabIndex={0}
            onClick={() => {
              deleteTests(project_id, id)
            }}
          >
            <img src={DeleteCourse} alt='DeleteCourse' className={styles.ImageSize} />
            <span>删除任务</span>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default React.memo(TaskDetailHead)
