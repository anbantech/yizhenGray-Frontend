import { LoadingOutlined, RightOutlined } from '@ant-design/icons'
import * as React from 'react'
import { ResTaskDetail } from 'Src/globalType/Response'
import { getTime } from 'Src/until/baseFn'
import { Spin, Tooltip } from 'antd'
import { Link } from 'react-router-dom'
import stopCourse from 'Src/asstes/image/stopCourse.svg'
import Begin from 'Src/asstes/image/BeginCourse.svg'
import monitor from 'Src/asstes/image/monitor.svg'
import DeleteCourse from 'Src/asstes/image/DeleteCourse.svg'
import report from 'Src/asstes/image/report.svg'
import over from 'Src/asstes/image/overTask.svg'
import styles from './taskDetail.less'

interface propsResTaskDetailType<T> {
  taskDetailInfo: T
  jumpLookTaskInfo: () => void
}

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />
function TaskDetailHead(props: propsResTaskDetailType<ResTaskDetail>) {
  const { name, update_time, status, id } = props.taskDetailInfo
  const lookTaskInfo = React.useCallback(() => {
    props.jumpLookTaskInfo()
  }, [props])

  return (
    <div className={styles.taskDetailHead_Main}>
      <div className={styles.taskDetailHead_Main_left}>
        <span className={styles.taskDetailHead_Main_left_title}>{`${name}`}</span>
        <div className={styles.taskDetailHead_Main_left_footer}>
          <span> 任务描述:121</span>
          <span>
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
          <Link to={`/OnlineReport?id=${id}?name=${name}`} target='_blank' style={{ color: '#000000' }}>
            <div role='button' tabIndex={0}>
              <img className={styles.ImageSize} src={report} alt='stopCourse' />
              <span>查看报告</span>
            </div>
          </Link>
        )}
        {[2, 3].includes(status) && (
          <div className={styles.ImageContioner} role='button' tabIndex={0} onClick={() => {}}>
            <img className={styles.ImageSize} src={monitor} alt='stopCourse' />
            <span>动态监控</span>
          </div>
        )}
        <div role='button' className={styles.ImageContioner} tabIndex={0} onClick={() => {}}>
          {status === 2 || status === 3 ? (
            <>
              <Spin spinning={false} indicator={antIcon}>
                <img className={styles.ImageSize} src={over} alt='stopCourse' />
              </Spin>
              <span>结束实例</span>
            </>
          ) : (
            <>
              <Tooltip placement='bottom' title='重新测试当前实例（重新发送已经测试过的用例）'>
                <Spin spinning={false} indicator={antIcon}>
                  <img className={styles.ImageSize} src={Begin} alt='beginCourse' />
                </Spin>
              </Tooltip>
              <span>重测实例</span>
            </>
          )}
        </div>
        <div role='button' className={styles.ImageContioner} tabIndex={0} onClick={() => {}}>
          {[0, 1, 4, 5, 6].includes(status) && (
            <>
              <Tooltip placement='bottom' title='重新测试当前实例（重新发送已经测试过的用例）'>
                <Spin spinning={false} indicator={antIcon}>
                  <img className={styles.ImageSize} src={Begin} alt='beginCourse' />
                </Spin>
              </Tooltip>
              <span>开始测试</span>
            </>
          )}
        </div>
        {[2, 3].includes(status) && (
          <div className={styles.ImageContioner} role='button' tabIndex={0} onClick={() => {}}>
            {[2].includes(status) ? (
              <Spin spinning={false} indicator={antIcon}>
                <img className={styles.ImageSize} src={stopCourse} alt='stopCourse' />
              </Spin>
            ) : [3].includes(status) ? (
              <Spin spinning={false} indicator={antIcon}>
                <img src={Begin} className={styles.ImageSize} alt='stopCourse' />
              </Spin>
            ) : null}
            <span>{status === 2 ? '暂停实例' : '继续实例'}</span>
          </div>
        )}
        {[0, 1, 4, 5].includes(status) ? (
          <div className={styles.ImageContioner} role='button' tabIndex={0} onClick={() => {}}>
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
