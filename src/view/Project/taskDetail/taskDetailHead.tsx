import { RightOutlined } from '@ant-design/icons'
import * as React from 'react'
import stopCourse from 'Src/asstes/image/stopCourse.svg'
import Begin from 'Src/asstes/image/BeginCourse.svg'
import monitor from 'Src/asstes/image/monitor.svg'
import DeleteCourse from 'Src/asstes/image/DeleteCourse.svg'
import report from 'Src/asstes/image/report.svg'
import over from 'Src/asstes/image/overTask.svg'
import styles from './taskDetail.less'

function TaskDetailHead() {
  return (
    <div className={styles.taskDetailHead_Main}>
      <div className={styles.taskDetailHead_Main_left}>
        <span className={styles.taskDetailHead_Main_left_title}>任务名称:大叔大婶</span>
        <div className={styles.taskDetailHead_Main_left_footer}>
          <span> 任务描述:121</span>
          <span> 开始时间:121</span>
          <div className={styles.taskDetailCard_Main_left_footer_detail}>
            <span>查看任务信息</span>
            <RightOutlined />
          </div>
        </div>
      </div>
      <div>
        <img src={stopCourse} alt='' />
        <img src={Begin} alt='' />
        <img src={monitor} alt='' />
        <img src={DeleteCourse} alt='' />
        <img src={report} alt='' />
        <img src={over} alt='' />
      </div>
      <span>{}</span>
    </div>
  )
}

export default React.memo(TaskDetailHead)
