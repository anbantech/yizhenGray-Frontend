import {
  CustomMadePeripheralListParams,
  newPeripheralsParams,
  newSetDataHanderParams,
  newSetRegisterParams,
  newSetTimerParams,
  ProcessorListParams,
  TimerListParams,
  paramsCheck
} from 'Src/globalType/Param'
import request from 'Src/services/request/request'

// 参数校验

function validatorParams(params: paramsCheck) {
  return request.post('/api/v1.0/models/platforms/verify', params)
}

// 获取目标机列表
function getModelTargetList(params: any) {
  return request.get('/api/v1.0/models/platforms/query', { params })
}
// 获取目标机详情
function getTargetDetails(id: number) {
  return request.get(`/api/v1.0/models/platforms/get/${id}`)
}

// 创建目标机
function createModelTarget(params: { name: string; processor: string; desc?: string }) {
  return request.post('/api/v1.0/models/platforms/save', params)
}
// 更新目标机
function updateModelTarget(id: number | null, params: { name: string; processor: string; desc?: string }) {
  return request.put(`/api/v1.0/models/platforms/update/${id}`, params)
}
// 删除目标机
function deleteModelTarget(id: string | null) {
  return request.delete(`/api/v1.0/models/platforms/remove`, { params: { platforms: id } })
}

// 获取外设列表
function getCustomMadePeripheralList(params: CustomMadePeripheralListParams) {
  return request.get(`/api/v1.0/models/peripherals/query`, { params })
}

// 获取数据处理器列表
function getProcessorList(params: ProcessorListParams) {
  return request.get(`/api/v1.0/models/data_processor/query`, { params })
}

// 获取定时器列表
function getTimerList(params: TimerListParams) {
  return request.get(`/api/v1.0/models/timers/query`, { params })
}

// 新建外设
function newSetPeripheral(params: newPeripheralsParams) {
  return request.post(`/api/v1.0/models/peripherals/save`, params)
}
// 新建寄存器
function newSetRegister(params: newSetRegisterParams) {
  return request.post(`/api/v1.0/models/registers/save`, params)
}
// 新建数据处理器
function newSetDataHander(params: newSetDataHanderParams) {
  return request.post(`/api/v1.0/models/data_processor/save`, params)
}
// 新建定时器
function newSetTimer(params: newSetTimerParams) {
  return request.post(`/api/v1.0/models/timers/save`, params)
}
export {
  newSetPeripheral,
  newSetRegister,
  newSetDataHander,
  newSetTimer,
  getModelTargetList,
  getTimerList,
  createModelTarget,
  getProcessorList,
  updateModelTarget,
  deleteModelTarget,
  getCustomMadePeripheralList,
  getTargetDetails,
  validatorParams
}
