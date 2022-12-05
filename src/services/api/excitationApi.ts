import request from 'Src/services/request/request'
import { ExcitationList, createExcitation, ExcitationParams } from 'Src/globalType/Param'
import { ResExcitationList, ResCreExcitationList } from 'Src/globalType/Response'

export function createExcitationListFn(params: createExcitation) {
  return request.post<ResCreExcitationList>('/api/v1.0/stimulus/save', params)
}
export function excitationListFn(params: ExcitationList) {
  return request.get<ResExcitationList>('/api/v1.0/temp_and_sti/query', { params })
}

export function removeExcitation(id: number | string) {
  return request.delete('/api/v1.0/stimulus/remove', { params: { stimulus: id } })
}

export function updateExcitation(params: createExcitation, id: number) {
  return request.put<null>(`/api/v1.0/stimulus/update/${id}`, params)
}

export function getPortList() {
  return request.get<string[]>(`/api/v1.0/temp_and_sti/query/port`)
}

export function createExcitationFn(params: ExcitationParams) {
  return request.post<any>(`/api/v1.0/temp_and_sti/save/single`, params)
}
