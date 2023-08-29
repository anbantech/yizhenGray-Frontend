import { LoadingOutlined, RightOutlined } from '@ant-design/icons'
import * as React from 'react'
import { ResTaskDetail } from 'Src/globalType/Response'
import { getTime } from 'Src/util/baseFn'
import { Spin, Tooltip } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import stopCourse from 'Image/stopCourse.svg'
import Begin from 'Image/BeginCourse.svg'
import monitor from 'Image/monitor.svg'
// import DeleteCourse from 'Image/DeleteCourse.svg'
import report from 'Image/report.svg'
import over from 'Image/overTask.svg'
import { bgTest, rePlayTask, stopcontuine, stoppaused, stoptest } from 'Src/services/api/taskApi'
import { throwErrorMessage } from 'Src/util/message'
import NewTaskInstance from 'Src/components/Modal/taskModal/newTaskInstance'
import styles from '../taskDetail.less'
import { taskDetailInfoType } from '../taskDetail'
import { projectInfoType } from '../../task/taskList/task'

interface taskDetailType<S, T> {
  projectInfo: T
  taskInfo: S
  instanceInfo: any
}

interface propsResTaskDetailType<T> {
  taskDetailInfo: T
  // jumpLookTaskInfo: () => void
  display: boolean
  depCollect: any
  RequsetParams: Record<string, any>
  infoMap: taskDetailType<taskDetailInfoType, projectInfoType>
}

interface InfoType {
  task_status: number
}

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />
function TaskDetailHead(props: propsResTaskDetailType<ResTaskDetail>) {
  const { taskInfo, projectInfo, instanceInfo } = props.infoMap
  const { display, depCollect, RequsetParams } = props
  const { num, start_time, end_time, status, id } = props.taskDetailInfo
  const [spinStatus, setSpinStatus] = React.useState(false)

  const [index, setIndex] = React.useState(0)
  const history = useHistory()
  const inScale = () => {
    history.push({
      pathname: '/projects/Tasks/Detail/Scale',
      state: { taskInfo, projectInfo, instanceInfo, test_Id: id, isTesting: true }
    })
  }
  React.useEffect(() => {
    if (status) {
      setSpinStatus(false)
    }
  }, [status])
  // 控制新建实列modal
  const [visibility, setVisibility] = React.useState(false)
  const choiceModal = () => {
    setVisibility(!visibility)
  }

  const continueOrStop = React.useCallback(async () => {
    setSpinStatus(true)
    if (spinStatus) return
    let res
    if ([2].includes(status)) {
      // 停止任务  通过任务ID
      setIndex(4)
      try {
        res = await stoppaused({ instance_id: id })
      } catch (error) {
        throwErrorMessage(error, { 2003: '任务正在暂停中,请稍后在试', 1007: '操作频繁', 2007: '暂停失败' })
        setSpinStatus(false)
      }
    } else {
      // 继续任务
      setIndex(5)
      try {
        res = await stopcontuine({ instance_id: id })
      } catch (error) {
        throwErrorMessage(error, { 1007: '操作频繁' })
        setSpinStatus(false)
      }
    }
    if (res) {
      depCollect(true, { ...RequsetParams })
      setSpinStatus(false)
    }
  }, [RequsetParams, depCollect, id, spinStatus, status])

  const beginOrOver = React.useCallback(async () => {
    setSpinStatus(true)
    if (spinStatus) return
    let res
    if ([2, 3, 4, 8, 9].includes(status)) {
      setIndex(1)
      try {
        res = await stoptest({ instance_id: id })
      } catch (error) {
        throwErrorMessage(error, { 2003: '任务正在停止中,请稍后在试', 1007: '操作频繁', 2007: '停止失败' })
        setSpinStatus(false)
      }
    }
    if (status === 0 || status === 1) {
      setIndex(2)
      try {
        res = await rePlayTask({ instance_id: id })
      } catch (error) {
        throwErrorMessage(error, { 2009: '重放失败', 1007: '操作频繁', 3002: '仿真连接失败', 2007: '停止失败' })
        setSpinStatus(false)
      }
    }
    if (res) {
      depCollect(true, { ...RequsetParams })
      setSpinStatus(false)
    }
  }, [RequsetParams, depCollect, id, spinStatus, status])

  const beginTests = React.useCallback(async () => {
    setSpinStatus(true)
    if (spinStatus) return
    setIndex(3)
    let res
    try {
      res = await bgTest({ instance_id: id as number })
    } catch (error) {
      throwErrorMessage(error, { 2011: '任务运行数量超出限制', 2005: '任务启动失败', 3002: '仿真链接失败', 9000: '系统异常', 1007: '操作频繁' })
      setSpinStatus(false)
    }
    if (res) {
      depCollect(true, { ...RequsetParams })
      setSpinStatus(false)
    }
  }, [RequsetParams, depCollect, id, spinStatus])

  return (
    <div className={styles.taskDetailHead_Main}>
      <div className={styles.taskDetailHead_Main_left}>
        <div className={styles.taskDetailHead_Main_titlelayout}>
          <span className={styles.taskDetailHead_Main_left_title}>{`${num}`}</span>
          <div style={{ marginTop: '6px' }} className={styles.taskDetailCard_Main_left_footer_detail}>
            <span role='time' onClick={choiceModal}>
              查看停止条件
            </span>
            <RightOutlined />
          </div>
        </div>
        <div className={styles.taskDetailHead_Main_left_footer}>
          <span>
            {' '}
            {[0, 1].includes(status) ? (
              <span>
                {' '}
                开始时间 : {getTime(start_time)}
                <span className={styles.cloumnLine}> </span>
                <span> 结束时间 : {getTime(end_time)}</span>
              </span>
            ) : [2, 3, 4].includes(status) ? (
              `开始时间 : ${getTime(start_time)}`
            ) : null}{' '}
          </span>
        </div>
      </div>
      <div className={styles.taskDetailHead_Main_right}>
        {[0, 1].includes(status) && (
          <Link to={`/OnlineReporting?id=${id}?name=${num}`} target='_blank' style={{ color: '#000000' }}>
            <div role='button' className={styles.ImageContioner} tabIndex={0}>
              <img className={styles.ImageSize} src={report} alt='stopCourse' />
              <span>查看报告</span>
            </div>
          </Link>
        )}

        {[2, 3, 8, 9].includes(status) && (
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

        {[2, 3, 4, 8, 9].includes(status) && (
          <div
            role='button'
            className={styles.ImageContioner}
            tabIndex={0}
            onClick={() => {
              beginOrOver()
            }}
          >
            {
              [2, 3, 4, 8, 9].includes(status) && (
                <>
                  <Spin spinning={spinStatus && index === 1} indicator={antIcon}>
                    <img className={styles.ImageSize} src={over} alt='stopCourse' />
                  </Spin>
                  <span>结束任务</span>
                </>
              )
              //  [0, 1].includes(status) &&(
              //   <>
              //     <Tooltip placement='bottom' title='重新测试当前任务（重新发送已经测试过的用例）'>
              //       <Spin spinning={spinStatus && index === 2} indicator={antIcon}>
              //         <img className={styles.ImageSize} src={Begin} alt='beginCourse' />
              //       </Spin>
              //     </Tooltip>
              //     <span>重测任务</span>
              //   </>
              // )
            }
          </div>
        )}

        {!display && [0, 1, 5].includes(status) && (
          <div
            role='button'
            className={styles.ImageContioner}
            tabIndex={0}
            onClick={() => {
              beginTests()
            }}
          >
            {[0, 1, 5].includes(status) && (
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

        {[2, 3, 4].includes(status) && (
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
            ) : [3, 4].includes(status) ? (
              <Spin spinning={spinStatus && index === 5} indicator={antIcon}>
                <img src={Begin} className={styles.ImageSize} alt='stopCourse' />
              </Spin>
            ) : null}
            <span>{[2, 8].includes(status) ? '暂停任务' : '继续任务'}</span>
          </div>
        )}

        {/* {[-1].includes(status) ? (
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
        ) : null} */}
      </div>
      <NewTaskInstance visibility={visibility} isDetail={1} task_id={id} data={props.taskDetailInfo} choiceModal={choiceModal} width='522px' />
    </div>
  )
}

export default React.memo(TaskDetailHead)
