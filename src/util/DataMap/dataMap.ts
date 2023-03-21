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
    label: '重放暂停',
    color: styles.roundStatusReplay
  },
  10: {
    label: '未知',
    color: styles.roundStatusBlue
  }
}
type CrashInfoType = Record<number, string>
export const CrashInfoMap: CrashInfoType = {
  0xe101: '堆栈溢出',
  0xe102: 'RAM区向下溢出',
  0xe103: 'RAM区向上溢出',
  0xe104: 'FLASH区向下溢出',
  0xe105: 'FLASH区向上溢出',
  0xe106: 'ROM区向下溢出',
  0xe107: 'ROM区向上溢出',
  0xe108: '读取保护区域 ',
  0xe109: '写入保护区域 ',
  0xe10a: '代码区破坏错误 ',
  0xe201: 'malloc分配失败 ',
  0xe202: 'Calloc分配失败',
  0xe203: 'Realloc分配失败',
  0xe301: '除零错误',
  0xe302: '无符号整形溢出',
  0xe303: '非法数据',
  0xe402: '非法指令',
  0xe304: '浮点数溢出',
  0xe305: '定点数溢出',
  0xe401: '中断嵌套',
  0xe403: '死循环，支持对于死循环缺陷类型的自动识别',
  0xe404: '看门狗超时',
  0xe405: '系统复位错误',
  0xef01: '隐式整形符号转换 ',
  0xef02: '隐式整形截取',
  0xef03: '隐式无符号整形截取',
  0xe204: 'Free 双重释放',
  0xe205: '未释放重分配',
  0xe206: '内存泄露',
  0xe40f: '程序跑飞'
}
