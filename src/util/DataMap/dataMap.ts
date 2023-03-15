import styles from 'Src/view/Project/task/taskList/task.less'

export const statusList = [
  { lable: '全部', value: '' },
  { lable: '正常结束', value: 0 },
  { lable: '异常结束', value: 1 },
  { lable: '测试中', value: 2 },
  { lable: '暂停', value: 3 },
  { lable: '异常暂停', value: 4 },
  { lable: '准备中', value: 5 },
  { lable: '待测试', value: 6 },
  { lable: '停止中', value: 7 },
  { lable: '重放中', value: 8 },
  { lable: '重放暂停', value: 9 }
  // { lable: '离线', value: 5 },
]

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
    label: '未知',
    color: styles.roundStatusBlue
  }
}
