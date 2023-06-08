// import { RightOutlined } from '@ant-design/icons'
import { RightOutlined } from '@ant-design/icons'
// import { Badge } from 'antd'
import * as React from 'react'
import { ResTaskDetail } from 'Src/globalType/Response'
import styles from '../taskDetail.less'

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
    label: '未知',
    color: styles.roundStatusBlue
  }
}

const CardComponents = (props: cardProps) => {
  const { value, concent, lookLog } = props
  return (
    <div className={styles.taskDetailCard_Main}>
      <div className={styles.card_Header}>
        <span className={styles.cardConcent}>{concent}</span>
        {concent === '用例总数(条)' ? (
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
      ) : value === 4 ? (
        // <Badge.Ribbon text='异常暂停' color='red' style={{ top: '-25px' }}>
        <div>
          <span className={statusMap[(value as 0 | 1 | 2 | 3 | 4 | 5 | 6) || 0]?.color}>
            {statusMap[(value as 0 | 1 | 2 | 3 | 4 | 5 | 6) || 0].label}
          </span>
        </div>
      ) : (
        // </Badge.Ribbon>
        <div>
          <span className={statusMap[(value as 0 | 1 | 2 | 3 | 4 | 5 | 6) || 0]?.color}>
            {statusMap[(value as 0 | 1 | 2 | 3 | 4 | 5 | 6) || 0].label}
          </span>
        </div>
      )}
    </div>
  )
}

type stringKey = Record<string, string>
const showTitleMap = {
  test_num: '用例总数(条)',
  error_num: 'Crash数量',
  coverage: '覆盖率',
  test_speed: '测试速率(帧/秒)',
  test_time: '运行时长',
  status: '状态'
}

function TaskDetailCard(props: propsResTaskDetailType<ResTaskDetail>) {
  const taskMapInfo = props.taskDetailInfo
  const { lookLog } = props
  const NumCard = () => {
    return (
      <div className={styles.coverage_main}>
        <div className={styles.card_coverage}>
          <span className={styles.cardConcent}>Crash数量</span>
          <span className={styles.cardTaskDetail}>{taskMapInfo.error_num}</span>
        </div>
        <div className={styles.card_line} />
        <div style={{ paddingLeft: '10px' }} className={styles.card_coverage}>
          <span className={styles.cardConcent}>Warn数量</span>
          <span className={styles.cardTaskDetail}>{taskMapInfo.warning_count || 0}</span>
        </div>
      </div>
    )
  }

  const CoverageCard = () => {
    return (
      <div className={styles.coverage_main}>
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
  return (
    <div className={styles.taskDetailCard}>
      {Object.keys(showTitleMap).map((item: string) => {
        return (
          <div key={Math.random()} className={item === 'coverage' || item === 'error_num' ? styles.cardBodys : styles.cardBody}>
            {item === 'coverage' ? (
              <CoverageCard />
            ) : item === 'error_num' ? (
              <NumCard />
            ) : (
              <CardComponents
                lookLog={lookLog}
                concent={showTitleMap[item as keyof typeof showTitleMap]}
                value={taskMapInfo[item as keyof typeof taskMapInfo]}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default React.memo(TaskDetailCard)
