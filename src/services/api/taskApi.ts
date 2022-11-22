import { TaskList } from 'Src/globalType/Param'
import { ResTaskList } from 'Src/globalType/Response'
import request from 'Src/services/request/request'

export function taskList(params: TaskList) {
  return request.get<ResTaskList>('/api/v1.0/tasks/query', { params })
}

export function deleteTasks(id: number, tasks: string) {
  return request.delete<any>('/api/v1.0/tasks/remove', { params: { project_id: id, tasks } })
}
