import { beginTest, Createtask, exportTestLog, simulateNodeParams, simulateParams, targetsTest, TaskList, taskParamsFn } from 'Src/globalType/Param'
import { ResTaskList, ResTaskDetail, isCode } from 'Src/globalType/Response'
import request from 'Src/services/request/request'

export function taskList(params: TaskList) {
  return request.get<ResTaskList>('/api/v1.0/tasks/query', { params })
}

export function deleteTasks(id: number, tasks: string) {
  return request.delete<any>('/api/v1.0/tasks/remove', { params: { project_id: id, tasks } })
}

export function TaskDetail(id: string) {
  return request.get<ResTaskDetail>(`/api/v1.0/tasks/get/${id}`)
}

// 导出报告
export function exportReport(id: number) {
  return request.get<any>(`/api/v1.0/instances/report/${id}`)
}

// 创建任务

export function createTaskFn(params: taskParamsFn) {
  return request.post<any>('/api/v1.0/tasks/save', params)
}

export function bgTest(params: beginTest) {
  return request.post<isCode>('/api/v1.0/tasks/start', params)
}

// 暂停测试
export function stoppaused(params: any) {
  return request.post<null>('/api/v1.0/tasks/paused', params)
}

// 停止
export function stoptest(params: any) {
  return request.post<any>('/api/v1.0/tasks/stop', params)
}

// 手动继续测试

export function stopcontuine(params: any) {
  return request.post<null>('/api/v1.0/tasks/continue', params)
}

// 测试日志导出

export function testLog(id: number, params: exportTestLog) {
  return request.post<any>(`/api/v1.0/test-logs/download/${id}`, params, { responseType: 'blob', timeout: 0 })
}

// 流水账日志
export function testLogs(id: number, params: exportTestLog) {
  return request.post<any>(`/api/v1.0/test-logs/logs/download/${id}`, params, { responseType: 'blob', timeout: 0 })
}
// 诊断

export function diagnose(id: string, log_index: number) {
  return request.get<any>(`/api/v1.0/test-logs/diagnose/${id}?log_index=${log_index}`)
}

// 目标测试
export function test_target(params: targetsTest) {
  return request.post<isCode>('/api/v1.0/targets/test-connection', params)
}
// 查询关联任务

export function findTask(params: any) {
  return request.get<any>('/api/v1.0/tasks/query-tasks', { params })
}

// 任务状态查询
export function taskStatus(id: number | string) {
  return request.get(`/api/v1.0/tasks/status?tasks=${id}`)
}
// 删除实例
export function deleteExampleTask(project_id: any, id: number) {
  return request.delete<any>('/api/v1.0/instances/remove', { params: { project_id, task: id } })
}
// 更新任务信息
export function updateTask(id: number, params: Createtask) {
  return request.put<any>(`/api/v1.0/tasks/update/${id}`, params)
}

// 仿真启动

export function simulate(params: simulateParams) {
  return request.get<any>(`/api/v1.0/simulate/status`, { params })
}
// 寄存器/内存信息查询

export function simulateOption(params: simulateParams) {
  return request.get<any>(`/api/v1.0/simulate/action`, { params })
}

// 寄存器信息
export function getRegister(params: any) {
  return request.get<any>(`/api/v1.0/simulate/data`, { params })
}

// 仿真节点查询
export function getSimulateNode(params: simulateNodeParams) {
  return request.get<any>(`/api/v1.0/simulate/node`, { params })
}

// 用例生成详情

export function getUseCase(params: any) {
  return request.get<any>(`/api/v1.0/instances/cases`, { params })
}
