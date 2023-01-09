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
