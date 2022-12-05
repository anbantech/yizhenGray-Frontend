// import { RightOutlined } from '@ant-design/icons'
import { RightOutlined } from '@ant-design/icons'
import * as React from 'react'
import { ResTaskDetail } from 'Src/globalType/Response'
import styles from './taskDetail.less'

interface propsResTaskDetailType<T> {
  taskDetailInfo: T
  lookLog: () => void
}

interface cardProps {
  lookLog: () => void
  value: string | number | null
  concent: string
}

export const statusMap = {
  0: {
    label: '结束',
    color: styles.roundStatusGray
  },
  1: {
    label: '异常',
    color: styles.roundStatusRed
  },
  2: {
    label: '测试中',
    color: styles.roundStatusGreen
  },
  3: {
    label: '暂停',
    color: styles.roundStatusBlack
  },
  4: {
    label: '待测试',
    color: styles.roundStatusYellow
  },
  5: {
    label: '离线',
    color: styles.roundStatusGray
  },
  6: {
    label: '重放中',
    color: styles.roundStatusBlue
  }
}
const CardComponents = (props: cardProps) => {
  const { value, concent, lookLog } = props
  return (
    <div className={styles.taskDetailCard_Main}>
      <div className={styles.card_Header}>
        <span className={styles.cardConcent}>{concent}</span>
        {concent === '测试总条数(条)' ? (
          <div
            className={styles.taskDetailCard_Main_left_footer_detail}
            role='log'
            onClick={() => {
              lookLog()
            }}
          >
            <span>日志</span>
            <RightOutlined />
          </div>
        ) : null}
      </div>
      {concent !== '状态' ? (
        <span className={styles.cardTaskDetail}>{value}</span>
      ) : (
        <div>
          <span className={statusMap[(value as 0 | 1 | 2 | 3 | 4 | 5 | 6) || 0].color}>
            {statusMap[(value as 0 | 1 | 2 | 3 | 4 | 5 | 6) || 0].label}
          </span>
        </div>
      )}
    </div>
  )
}
type stringKey = Record<string, string>
const showTitleMap = {
  test_num: '测试总条数(条)',
  crash_num: 'Crash数量',
  coverage: '覆盖率',
  test_speed: '测试速率(帧/秒)',
  test_time: '运行时长',
  status: '状态'
}
function TaskDetailCard(props: propsResTaskDetailType<ResTaskDetail>) {
  const taskMapInfo = props.taskDetailInfo
  const { lookLog } = props
  return (
    <div className={styles.taskDetailCard}>
      {Object.keys(showTitleMap).map((item: string) => {
        return (
          <div key={Math.random()}>
            <CardComponents
              lookLog={lookLog}
              concent={showTitleMap[item as keyof typeof showTitleMap]}
              value={taskMapInfo[item as keyof typeof taskMapInfo]}
            />
          </div>
        )
      })}
    </div>
  )
}

export default React.memo(TaskDetailCard)
