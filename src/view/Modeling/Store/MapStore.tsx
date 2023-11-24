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

const titleFlagMap = {
  1: ['删除自定义外设', '是否确认删除该自定义外设'],
  2: ['删除寄存器', '是否确认删除该寄存器'],
  3: ['删除数据处理器', '是否确认删除寄存器']
}

// 后端接口返回数据结构不统一 , 无法确定ts接口定义 返回
const AssembleDataHandlerFn = (data: any, tag: string) => {
  if (tag === '3') {
    const treeMap = new Map()
    data.forEach((element: any) => {
      const { register } = element
      register.forEach((item: any) => {
        if (item.peripheral) {
          const existingNode = treeMap.get(item.peripheral.id)
          const newNode = { ...item, children: [{ ...element }] }
          if (existingNode) {
            existingNode.children.push(newNode)
          } else {
            treeMap.set(item.peripheral.id, { ...item.peripheral, children: [newNode] })
          }
        }
      })
    })
    const result = [...treeMap.values()]
    return result
  }
  if (tag === '2') {
    const treeMap = new Map()
    data.forEach((item: any) => {
      const { peripheral } = item
      const existingNode = treeMap.get(peripheral.id)
      if (existingNode) {
        existingNode.children.push(item)
      } else {
        treeMap.set(peripheral.id, { ...peripheral, children: [item] })
      }
    })
    const result = [...treeMap.values()]
    return result
  }
  return []
}

const extractIdsFromTree = (node: any): string[] => {
  let ids: string[] = [String(node.id)]
  if (node.children && node.children.length > 0) {
    node.children.forEach((child: any) => {
      ids = [...ids, ...extractIdsFromTree(child)]
    })
  }
  return ids
}

export {
  rightFormCheckMap,
  extractIdsFromTree,
  titleMap,
  checkAsyncMap,
  NodeType,
  NodeZindex,
  AttributesType,
  errorCodeMapFn,
  AssembleDataHandlerFn,
  titleFlagMap,
  deleteMap
}
