import {
  CustomMadePeripheralListParams,
  newPeripheralsParams,
  newSetDataHanderParams,
  newSetRegisterParams,
  newSetTimerParams,
  ProcessorListParams,
  TimerListParams,
  paramsCheck,
  updateDataHandelParams
} from 'Src/globalType/Param'
import request from 'Src/services/request/request'

// 参数校验

function validatorParams(params: paramsCheck) {
  return request.post('/api/v1.0/models/parameters/verify', params)
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

// 获取定时器详情
function getTimerDetails(id: number) {
  return request.get(`/api/v1.0/models/timers/get/${id}`)
}
// 获取数据处理器详情
function getDataHandlerDetails(id: number) {
  return request.get(`/api/v1.0/models/data_processor/get/${id}`)
}

// 获取寄存器详情
function getRegisterDetails(id: number) {
  return request.get(`/api/v1.0/models/registers/get/${id}`)
}

// 获取外设详情
function getPeripheralsDetails(id: number) {
  return request.get(`/api/v1.0/models/peripherals/get/${id}`)
}

// 更新定时器

function updateTimer(
  id: number | null | string,
  params: { name: string; period: string | number; interrupt: string | number; platform_id: string | number | null }
) {
  return request.put(`/api/v1.0/models/timers/update/${id}`, params)
}

// 更新数据处理器
function updateDataHandler(id: number | null | string, params: updateDataHandelParams) {
  return request.put(`/api/v1.0/models/data_processor/update/${id}`, params)
}

// 更新寄存器

function updateRegister(id: number | null | string, params: any) {
  return request.put(`/api/v1.0/models/registers/update/${id}`, params)
}

// 更新外设

function updatePeripherals(
  id: string,
  params: {
    platform_id: string | number | null
    name: string | number
    kind: string | number
    base_address: string | number
    address_length: string | number
    desc: string | number
  }
) {
  return request.put(`/api/v1.0/models/peripherals/update/${id}`, params)
}

// 获取画布
function getCanvas(id: number) {
  return request.get(`/api/v1.0/models/canvas/get/${id}`)
}

// 保存画布

function saveCanvasAsync(params: any) {
  return request.post('/api/v1.0/models/canvas/save', params)
}

// 删除控件

function deleteConrolsFn(id: any) {
  return request.delete('/api/v1.0/models/controls/remove', { params: id })
}

// 生成脚本
function scriptGenerator(id: number | string, params?: { preview: boolean }) {
  return request.get(`/api/v1.0/models/script/generate/${id}`, { params })
}

// 下载脚本
function downLoadScript(id: number | string) {
  return request.get(`/api/v1.0/models/script/download/${id}`)
}

// 预览ELT
function viewELT(id: string | number) {
  return request.get(`/api/v1.0/models/controls/preview/${id}`)
}

export {
  deleteConrolsFn,
  scriptGenerator,
  downLoadScript,
  updateDataHandler,
  getDataHandlerDetails,
  saveCanvasAsync,
  getRegisterDetails,
  getPeripheralsDetails,
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
  validatorParams,
  getCanvas,
  getTimerDetails,
  updateTimer,
  updatePeripherals,
  updateRegister,
  viewELT
}
