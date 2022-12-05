import { TaskList } from 'Src/globalType/Param'
import { ResTaskList, ResTaskDetail } from 'Src/globalType/Response'
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
