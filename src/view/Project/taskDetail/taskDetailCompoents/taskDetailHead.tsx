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
import { bgTest, deleteExampleTask, stopcontuine, stoppaused, stoptest, test_target } from 'Src/services/api/taskApi'
import UseWebsocket from 'Src/webSocket/useWebSocket'
import styles from '../taskDetail.less'

interface propsResTaskDetailType<T> {
  taskDetailInfo: T
  jumpLookTaskInfo: () => void
  setUpdateStatus: any
}

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />
function TaskDetailHead(props: propsResTaskDetailType<ResTaskDetail>) {
  const { name, update_time, status, id, project_id } = props.taskDetailInfo
  const [messageInfo] = UseWebsocket()
  const [spinStatus, setSpinStatus] = React.useState(false)

  const [index, setIndex] = React.useState(0)
  const history = useHistory()
  const inScale = () => {
    history.push({
      pathname: '/projects/TaskDetail/Scale',
      state: { isTesting: true }
    })
  }

  React.useEffect(() => {
    if (messageInfo) {
      setSpinStatus(false)
      props.setUpdateStatus(`${Math.random()}${new Date()}`)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageInfo])

  const continueOrStop = React.useCallback(async () => {
    if (spinStatus) return
    if (status === 2) {
      // 停止任务  通过任务ID
      setSpinStatus(true)
      setIndex(4)
      try {
        const res = await stoppaused({ task_id: id })
        return res
      } catch (error) {
        setSpinStatus(false)
        throwErrorMessage(error)
      }
    } else {
      // 继续任务
      setIndex(5)
      setSpinStatus(true)
      try {
        const res = await stopcontuine({ task_id: id })
        return res
      } catch (error) {
        setSpinStatus(false)
        throwErrorMessage(error)
      }
    }
  }, [id, spinStatus, status])

  const beginOrOver = React.useCallback(async () => {
    if (spinStatus) return
    if (status === 2 || status === 3) {
      setIndex(1)
      // 停止任务  通过任务ID
      setSpinStatus(true)
      try {
        const res = await stoptest({ task_id: id })
        return res
      } catch (error) {
        throwErrorMessage(error)
        setSpinStatus(false)
      }
    }
    if (status === 0 || status === 1) {
      setSpinStatus(true)
      setIndex(2)
      try {
        const res = await test_target({ task_id: id })
        return res
      } catch (error) {
        setSpinStatus(false)
        throwErrorMessage(error)
      }
    }
  }, [id, spinStatus, status])

  const beginTests = React.useCallback(async () => {
    if (spinStatus) return
    setSpinStatus(true)
    setIndex(3)
    try {
      const res = await bgTest({ task_id: id as number })
      return res
    } catch (error) {
      setSpinStatus(false)
      message.error(error)
    }
  }, [id, spinStatus])
  const lookTaskInfo = React.useCallback(() => {
    props.jumpLookTaskInfo()
  }, [props])

  const deleteTests = React.useCallback(async (project_id, id) => {
    try {
      const res = await deleteExampleTask(project_id, id)
      return res
    } catch (error) {
      throwErrorMessage(error)
    }
  }, [])

  return (
    <div className={styles.taskDetailHead_Main}>
      <div className={styles.taskDetailHead_Main_left}>
        <span className={styles.taskDetailHead_Main_left_title}>{`${name}`}</span>
        <div className={styles.taskDetailHead_Main_left_footer}>
          <span> 任务描述:121</span>
          <span style={{ paddingLeft: '20px', paddingRight: '20px' }}>
            {' '}
            {[0, 1, 4, 5].includes(status)
              ? `  开始时间 : ${getTime(update_time)} | 结束时间 : ${getTime(update_time)}`
              : `  开始时间 : ${getTime(update_time)}`}{' '}
          </span>
          <div className={styles.taskDetailCard_Main_left_footer_detail}>
            <span role='time' onClick={lookTaskInfo}>
              查看任务信息
            </span>
            <RightOutlined />
          </div>
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
        {[2, 3].includes(status) && (
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
          {status === 2 || status === 3 ? (
            <>
              <Spin spinning={spinStatus && index === 1} indicator={antIcon}>
                <img className={styles.ImageSize} src={over} alt='stopCourse' />
              </Spin>
              <span>结束实例</span>
            </>
          ) : (
            <>
              <Tooltip placement='bottom' title='重新测试当前实例（重新发送已经测试过的用例）'>
                <Spin spinning={spinStatus && index === 2} indicator={antIcon}>
                  <img className={styles.ImageSize} src={Begin} alt='beginCourse' />
                </Spin>
              </Tooltip>
              <span>重测实例</span>
            </>
          )}
        </div>
        {[0, 1, 4, 5, 6].includes(status) && (
          <div
            role='button'
            className={styles.ImageContioner}
            tabIndex={0}
            onClick={() => {
              beginTests()
            }}
          >
            {[0, 1, 4, 5, 6].includes(status) && (
              <>
                <Tooltip placement='bottom' title='重新测试当前实例（重新发送已经测试过的用例）'>
                  <Spin spinning={spinStatus && index === 3} indicator={antIcon}>
                    <img className={styles.ImageSize} src={Begin} alt='beginCourse' />
                  </Spin>
                </Tooltip>
                <span>开始测试</span>
              </>
            )}
          </div>
        )}
        {[2, 3].includes(status) && (
          <div
            className={styles.ImageContioner}
            role='button'
            tabIndex={0}
            onClick={() => {
              continueOrStop()
            }}
          >
            {[2].includes(status) ? (
              <Spin spinning={spinStatus && index === 4} indicator={antIcon}>
                <img className={styles.ImageSize} src={stopCourse} alt='stopCourse' />
              </Spin>
            ) : [3].includes(status) ? (
              <Spin spinning={spinStatus && index === 5} indicator={antIcon}>
                <img src={Begin} className={styles.ImageSize} alt='stopCourse' />
              </Spin>
            ) : null}
            <span>{status === 2 ? '暂停实例' : '继续实例'}</span>
          </div>
        )}
        {[0, 1, 4, 5].includes(status) ? (
          <div
            className={styles.ImageContioner}
            role='button'
            tabIndex={0}
            onClick={() => {
              deleteTests(project_id, id)
            }}
          >
            <img src={DeleteCourse} alt='DeleteCourse' className={styles.ImageSize} />
            <span>删除实例</span>
          </div>
        ) : null}
      </div>
      <span>{}</span>
    </div>
  )
}

export default React.memo(TaskDetailHead)
