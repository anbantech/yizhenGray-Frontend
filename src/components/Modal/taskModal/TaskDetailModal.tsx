import React from 'react'
import { getTime } from 'Src/util/baseFn'
import { CrashInfoMapLog } from 'Src/util/DataMap/dataMap'

import TaskStyles from 'Src/view/Project/task/createTask/newCreateTask.less'
import styles from '../BaseModle.less'

function TaskDetailModal(props: any) {
  const { name, value } = props

  const getFileName = (value: string) => {
    if (!value) return ''
    const splitArray = value.split('\\')
    return splitArray[splitArray.length - 1]
  }

  return (
    <div className={TaskStyles.taskMain}>
      <div className={TaskStyles.taskMain_header}>
        <span className={TaskStyles.taskMain_title}>{name}</span>
      </div>

      <div className={value?.caseType ? styles.bottomBody : styles.bottomAll}>
        {Object.keys(value.crash_info).map(item => {
          return (
            <div className={styles.background} key={item}>
              {Object.keys(value.crash_info).length >= 1 && (
                <div className={styles.concent_layout}>
                  <div className={styles.concent_layoutLeft}>
                    <div className={styles.pc}>
                      <span className={styles.detailLeft} style={{ paddingRight: '10px' }}>
                        缺陷结果 :{' '}
                      </span>{' '}
                      <span> {CrashInfoMapLog[+item]}</span>
                    </div>
                    <div className={styles.pc}>
                      <span className={styles.detailLeft} style={{ paddingRight: '10px' }}>
                        用例编号 :{' '}
                      </span>{' '}
                      <span> {value.msg_index} </span>
                    </div>
                    <div className={styles.pc}>
                      <span className={styles.detailLeft} style={{ paddingRight: '24px' }}>
                        文件名 :{' '}
                      </span>{' '}
                      <span> {getFileName(value.crash_info[+item]?.payload.fileName)}</span>
                    </div>

                    <div className={styles.pc}>
                      <span style={{ paddingRight: '37px' }} className={styles.detailLeft}>
                        行号 :{' '}
                      </span>{' '}
                      <span> {value.crash_info[+item]?.payload.lines} </span>
                    </div>
                  </div>
                  <div className={styles.concent_layoutRight}>
                    <div className={styles.pc}>
                      <span className={styles.detailLeft} style={{ paddingRight: '18px' }}>
                        PC指针 :{' '}
                      </span>
                      <div className={styles.pcRight}>
                        {value.crash_info[+item]?.payload?.PC.map((item: string) => {
                          return (
                            <div key={item} className={styles.pcRightConcent}>
                              <span className={styles.pcRightConcentChart}> {item}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    <div className={styles.pc}>
                      <span className={styles.detailLeft} style={{ paddingRight: '24px' }}>
                        函数名 :{' '}
                      </span>{' '}
                      <span> {value.crash_info[+item]?.payload.funcName} </span>
                    </div>
                    <div className={styles.pc}>
                      <span style={{ paddingRight: '10px' }} className={styles.detailLeft}>
                        发现时间 :{' '}
                      </span>{' '}
                      <span> {`${getTime(value.create_time)}`} </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TaskDetailModal
