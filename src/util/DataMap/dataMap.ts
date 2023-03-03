import styles from 'Src/view/Project/task/taskList/task.less'

export const statusList = [
  { lable: '全部', value: '' },
  { lable: '结束', value: 0 },
  { lable: '异常', value: 1 },
  { lable: '测试中', value: 2 },
  { lable: '暂停', value: 3 },
  { lable: '待测试', value: 4 },
  // { lable: '离线', value: 5 },
  { lable: '重放中', value: 6 }
]

export const statusMap = {
  0: {
    label: '正常结束',
    color: styles.roundStatusNormalEnd
  },
  1: {
    label: '测试中',
    color: styles.roundStatusTesting
  },
  2: {
    label: '暂停',
    color: styles.roundStatusPaused
  },
  3: {
    label: '异常暂停',
    color: styles.roundStatusErrorPaused
  },
  4: {
    label: '异常结束',
    color: styles.roundStatusErrorEnd
  },
  5: {
    label: '待测试',
    color: styles.roundStatusWaitTesting
  },
  6: {
    label: '重放中',
    color: styles.roundStatusReplay
  },
  7: {
    label: '停止中',
    color: styles.roundStatusStoping
  },
  8: {
    label: '准备中',
    color: styles.roundStatusReady
  },
  9: {
    label: '未知',
    color: styles.roundStatusBlue
  }
}
