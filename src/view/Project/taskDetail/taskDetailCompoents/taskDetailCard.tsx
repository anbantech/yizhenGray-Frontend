// import { RightOutlined } from '@ant-design/icons'
import { RightOutlined } from '@ant-design/icons'
// import { Badge } from 'antd'
import * as React from 'react'
import { ResTaskDetail } from 'Src/globalType/Response'
import { generateUUID } from 'Src/util/common'
import styles from '../taskDetail.less'
import cardStyles from './taskCard.less'

interface propsResTaskDetailType<T> {
  taskDetailInfo: T
  lookLog: () => void
  InitTask: () => void
}

interface cardProps {
  lookLog: () => void
  value: string | number | null
  concent: string
}

interface cardPropsCommon {
  value: string | number | null
  concent: string
}

interface CardStatus {
  value: string | number | null
  concent: string
  InitTask: () => void
}

export const statusMap = {
  0: {
    label: '正常结束',
    color: styles.roundStatusNormalEnd
  },
  1: {
    label: '异常结束',
    color: styles.roundStatusErrorEnd
  },
  2: {
    label: '测试中',
    color: styles.roundStatusTesting
  },
  3: {
    label: '暂停',
    color: styles.roundStatusPaused
  },
  4: {
    label: '异常暂停',
    color: styles.roundStatusErrorPaused
  },
  5: {
    label: '准备中',
    color: styles.roundStatusReady
  },
  6: {
    label: '待测试',
    color: styles.roundStatusWaitTesting
  },

  7: {
    label: '停止中',
    color: styles.roundStatusStoping
  },
  8: {
    label: '重放中',
    color: styles.roundStatusReplay
  },
  9: {
    label: '重放暂停',
    color: styles.roundStatusReplay
  },
  10: {
    label: '固件启动异常',
    color: styles.roundStatusErrorEnd
  }
}

type stringKey = Record<string, string>
const showTitleMap = {
  total: '用例总数(条)',
  defects_count: '缺陷数量',
  coverage: '覆盖率',
  test_speed: '测试速率(帧/秒)',
  test_time: '运行时长',
  status: '状态'
}

const TestNumComponentsMemo = (props: cardProps) => {
  const { lookLog, value, concent } = props
  return (
    <div className={[cardStyles.testNum, cardStyles.commonCard].join(' ')}>
      <div className={cardStyles.commonConcnet} style={{ display: 'flex', flexDirection: 'column' }}>
        <span className={styles.cardConcent}>{concent}</span>
        <span className={styles.cardTaskDetail}>{value}</span>
      </div>
      <div
        className={[styles.taskDetailCard_Main_left_footer_detail, cardStyles.rightDetail].join(' ')}
        role='log'
        onClick={() => {
          lookLog()
        }}
      >
        <span>日志</span>
        <RightOutlined />
      </div>
    </div>
  )
}
const TestNumComponents = React.memo(TestNumComponentsMemo)

const CommonComponentsMemo = (props: cardPropsCommon) => {
  const { value, concent } = props
  return (
    <div className={[cardStyles.commonCardConcent, cardStyles.commonCard].join(' ')}>
      <span className={styles.cardConcent}>{concent}</span>
      <span className={styles.cardTaskDetail}>{value}</span>
    </div>
  )
}
const CommonComponents = React.memo(CommonComponentsMemo)

const CoverageCardMemo = (porps: Record<string, ResTaskDetail>) => {
  const { taskMapInfo } = porps
  return (
    <div className={[cardStyles.coverageCommon, cardStyles.commonCard].join(' ')}>
      <div className={styles.card_coverage}>
        <span className={styles.cardConcent}>分支覆盖率</span>
        <span className={styles.cardTaskDetail}>{taskMapInfo.branch_coverage}</span>
      </div>
      <div className={styles.card_line} />
      <div style={{ paddingLeft: '10px' }} className={styles.card_coverage}>
        <span className={styles.cardConcent}>语句覆盖率</span>
        <span className={styles.cardTaskDetail}>{taskMapInfo.statement_coverage}</span>
      </div>
    </div>
  )
}
const CoverageCard = React.memo(CoverageCardMemo)

const StatusCardComponentsMemo = (props: CardStatus) => {
  const { value, concent, InitTask } = props
  return (
    <div className={[cardStyles.commonCardConcent, cardStyles.commonCard].join(' ')}>
      <div className={cardStyles.cardErrorDetail}>
        <span className={styles.cardConcent}>{concent}</span>
        <div className={[styles.taskDetailCard_Main_left_footer_detail, cardStyles.rightDetail].join(' ')} role='time' onClick={InitTask}>
          <span>查看详情</span>
          <RightOutlined />
        </div>
      </div>

      <span className={statusMap[(value as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 10) || 0]?.color}>
        {statusMap[(value as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 10) || 0].label}
      </span>
    </div>
  )
}
const StatusCardComponents = React.memo(StatusCardComponentsMemo)

function TaskDetailCard(props: propsResTaskDetailType<ResTaskDetail>) {
  const taskMapInfo = props.taskDetailInfo
  const { lookLog, InitTask } = props

  return (
    <div className={styles.taskDetailCard}>
      {Object.keys(showTitleMap).map((item: string) => {
        return (
          <React.Fragment key={generateUUID()}>
            {item === 'total' ? (
              <TestNumComponents
                lookLog={lookLog}
                concent={showTitleMap[item as keyof typeof showTitleMap]}
                value={taskMapInfo[item as keyof typeof taskMapInfo]}
              />
            ) : item === 'coverage' ? (
              <CoverageCard taskMapInfo={taskMapInfo} />
            ) : item === 'status' ? (
              <StatusCardComponents
                InitTask={InitTask}
                concent={showTitleMap[item as keyof typeof showTitleMap]}
                value={taskMapInfo[item as keyof typeof taskMapInfo]}
              />
            ) : (
              <CommonComponents concent={showTitleMap[item as keyof typeof showTitleMap]} value={taskMapInfo[item as keyof typeof taskMapInfo]} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default React.memo(TaskDetailCard)
