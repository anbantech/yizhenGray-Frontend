import styles from 'Src/view/Project/task/taskList/task.less'

export const statusList = [
  { lable: '全部', value: '' },
  { lable: '正常结束', value: 0 },
  { lable: '异常结束', value: 1 },
  { lable: '测试中', value: 2 },
  { lable: '暂停', value: 3 },
  { lable: '异常暂停', value: 4 },
  { lable: '准备中', value: 5 },
  // { lable: '待测试', value: 6 },
  { lable: '停止中', value: 7 },
  { lable: '重放中', value: 8 },
  // { lable: '重放暂停', value: 9 }a
  { lable: '固件初始化失败', value: 10 },
  { lable: '测试环境验证中', value: 11 }
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
  10: {
    label: '固件初始化失败',
    color: styles.roundStatusErrorPaused
  },
  11: {
    label: '测试环境验证中',
    color: styles.roundStatusReady
  }
}
type CrashInfoType = Record<number, string>
export const CrashInfoMap: CrashInfoType = {
  // 0xe101: '堆栈溢出',
  // 0xe102: 'RAM区向下溢出',
  // 0xe103: 'RAM区向上溢出',
  // 0xe104: 'FLASH区向下溢出',
  // 0xe105: 'FLASH区向上溢出',
  // 0xe106: 'ROM区向下溢出',
  // 0xe107: 'ROM区向上溢出',
  // 0xe108: '读取保护区域 ',
  // 0xe109: '写入保护区域 ',
  // 0xe10a: '代码区破坏错误 ',
  0xe201: 'Malloc分配失败 ',
  0xe202: 'Calloc分配失败',
  0xe203: 'Realloc分配失败',
  // 0xe301: '除零错误',
  0xe302: '无符号整型溢出',
  0xe303: '非法数据',
  // 0xe402: '非法指令',
  0xe304: '浮点数溢出',
  // 0xe305: '定点数溢出',
  0xe401: '中断嵌套',
  0xe403: '死循环',
  // 0xe404: '看门狗超时',
  // 0xe405: '系统复位错误',
  // 0xef01: '隐式整型符号转换 ',
  // 0xef02: '隐式整型截取',
  // 0xef03: '隐式无符号整型截取',
  0xe204: '双重释放',
  0xe205: '未释放重分配'
  // 0xe206: '内存泄露',
  // 0xe40f: '程序跑飞'
}

export const CrashInfoMapLog: CrashInfoType = {
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
  0xe201: 'Malloc分配失败 ',
  0xe202: 'Calloc分配失败',
  0xe203: 'Realloc分配失败',
  0xe301: '除零错误',
  0xe302: '无符号整型溢出',
  0xe303: '非法数据',
  0xe402: '非法指令',
  0xe304: '浮点数溢出',
  // 0xe305: '定点数溢出',
  0xe401: '中断嵌套',
  0xe403: '死循环',
  0xe404: '看门狗超时',
  0xe405: '系统复位错误',
  0xef01: '隐式整型符号转换 ',
  0xef02: '隐式整型截取',
  0xef03: '隐式无符号整型截取',
  0xe204: '双重释放',
  0xe205: '未释放重分配',
  0xe206: '内存泄露',
  0xe40f: '程序跑飞'
}

export const IntMap = {
  8: 'fixed_8',
  16: 'fixed_16',
  32: 'fixed_32',
  64: 'fixed_64'
}

export const StringMap = {
  string: 'unfixed'
}

export const CodeMap = {
  0: 'OK',
  1000: '未知异常',
  1001: '不支持的请求方法',
  1002: '缺少权限',
  1003: '认证失败',
  1004: '请求资源未找到',
  1005: '请求资源已存在',
  1006: '参数校验失败',
  1007: '操作频繁,请稍后再试',
  1008: '服务异常',
  1009: '删除失败',
  1010: '更新失败',
  1011: '数据导入中',
  1012: '过期令牌',
  1013: '无效令牌',
  1014: '未提供令牌',
  1015: '创建失败',
  2000: '项目/任务/实例异常',
  2001: '任务正在运行中',
  2002: '任务正在暂停中',
  2003: '任务正在停止中',
  2004: '任务已结束',
  2005: '启动失败',
  2006: '暂停失败',
  2007: '停止失败',
  2008: '继续失败',
  2009: '重放失败',
  2010: '任务未运行',
  2011: '任务运行数量超出限制',
  2013: '激励序列至少包含一个激励',
  2014: '任务不在可测状态',
  2015: '任务关联的所有激励协议数据需要一个变异的字段',
  2016: '任务未处于暂停状态',
  3000: '仿真通讯异常',
  3001: '未找到可用仿真节点',
  3002: '仿真终端无响应,请重启并检查网络',
  3003: '数据发送失败',
  3004: '数据接收失败',
  4000: '激励异常',
  4001: '数据段名称重复',
  5000: '激励序列异常',
  7000: '仿真终端无响应',
  7001: '仿真终端已启动，处于运行状态',
  7002: '仿真终端运行到准备就绪状态，可以接收激励数据',
  7003: '仿真任务结束',
  7004: '访问非法地址空间',
  7005: '程序跑飞',
  7006: '非法指令',
  7007: '仿真终端暂停',
  7008: '仿真终端停止',
  7009: '仿真终端已经复位',
  7010: '当前仅支持单仿真任务运行',
  7011: '当前任务不支持仿真操作',
  7012: '仿真硬件已经复位',
  7013: '仿真节点已运行',
  7014: '清除覆盖率失败',
  7015: '固件初始化异常',
  8000: '用户异常',
  8001: '用户数量已达上限',
  8002: '用户登录失败',
  9000: 'docker客户端报错',
  9001: '挂载卷已存在',
  9002: '挂载卷不存在',
  9003: '容器已存在',
  9004: '容器不存在',
  9005: '容器内容服务异常'
}

export const reset_mode_Map = {
  0: '不复位',
  1: '硬复位',
  2: '软复位'
}
