import { CreateProject, ProjectList } from 'Src/globalType/Param'
import { ResProjectList, ResProjectDetails } from 'Src/globalType/Response'
import request from 'Src/services/request/request'

export function createProject(params: CreateProject) {
  return request.post<null>('/api/v1.0/projects/save', params)
}

export function updateProject(params: CreateProject, id: number) {
  return request.put<null>(`/api/v1.0/projects/update/${id}`, params)
}
export function removeProject(id: any) {
  return request.delete('/api/v1.0/projects/remove', { params: { projects: id } })
}

export function ProList(params: ProjectList) {
  return request.get<ResProjectList>('/api/v1.0/projects/query', { params })
}

export function ProDetail(project_id: string) {
  return request.get<ResProjectDetails>(`/api/v1.0/projects/get/${project_id}`)
}
