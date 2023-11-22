const titleMap = {
  寄存器: 'register',
  数据处理器: 'processor',
  定时器: 'timer',
  外设: 'peripheral'
}

const checkAsyncMap = {
  peripheral: ['name', 'base_address'],
  timer: ['name'],
  processor: ['name', 'port'],
  register: ['name', 'relative_address']
}

// 右侧数据校验字典
const rightFormCheckMap = {
  Timer: ['name', 'period', 'interrupt'],
  Processor: [
    'name',
    'port',
    'interrupt',
    'sof',
    'eof',
    'algorithm',
    'length_member',
    'checksum_member',
    'framing_member',
    'peripheral_id',
    'register_id'
  ],
  Peripheral: ['name', 'kind', 'base_address', 'address_length', 'desc'],
  Register: ['peripheral_id', 'peripheral', 'name', 'relative_address', 'kind', 'finish', 'variety']
}
const NodeType = {
  1: 'peripheralNode',
  2: 'registerNode',
  3: 'custom',
  4: 'time',
  5: 'targetNode'
}

const deleteMap = {
  1: 'peripherals',
  2: 'registers',
  3: 'processors',
  4: 'timers'
}
const NodeZindex = {
  1: 1002,
  2: 1001,
  3: 1001,
  4: 1001,
  5: 1003
}

const AttributesType = {
  1: 'Peripheral',
  2: 'Register',
  3: 'Processor',
  4: 'Timer',
  5: 'Target'
}

const errorCodeMapFn = (code: number, node: any) => {
  switch (code) {
    case 1005:
      return `名称${node?.data?.name || node?.name}重复`
    case 7020:
      return '地址冲突'
    case 7019:
      return '端口冲突'
    case 7018:
      return '偏移地址越界'
    case 7022:
      return '偏移地址冲突'
    case 7023:
      return '地址大小不足'
    default:
      break
  }
}

const titleFlagMap = { 1: ['删除自定义外设', '是否确认删除该自定义外设'], 2: ['删除寄存器', '是否确认删除该寄存器'] }

export { rightFormCheckMap, titleMap, checkAsyncMap, NodeType, NodeZindex, AttributesType, errorCodeMapFn, titleFlagMap, deleteMap }
