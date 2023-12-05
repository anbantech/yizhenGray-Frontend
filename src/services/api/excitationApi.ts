import request from 'Src/services/request/request'
import {
  ExcitationList,
  createExcitation,
  ExcitationParams,
  doubleExcitationParams,
  groupParams,
  excitation_1Params,
  dataStructureParams,
  UpdateOneExcitaionListParams
} from 'Src/globalType/Param'
import { ResCreExcitationList, getAllRes, excitationRes, checkoutDataStructureRes, ResExcitationListNew } from 'Src/globalType/Response'

export function createExcitationListFn(params: createExcitation) {
  return request.post<ResCreExcitationList>('/api/v1.0/stimulus/save', params)
}
export function excitationListFn(params: ExcitationList) {
  return request.get<ResExcitationListNew>('/api/v1.0/temp_and_sti/sender/query', { params })
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
// 新建级联
export function createDoubleExcitationFn(params: doubleExcitationParams) {
  return request.post<any>(`/api/v1.0/temp_and_sti/save/group`, params)
}

// 新建级联unit
export function createGroup_unitFn(params: doubleExcitationParams) {
  return request.post<any>(`/api/v1.0/temp_and_sti/save/group_unit`, params)
}

export function getAllExcitationFn(id: number) {
  return request.get<getAllRes>(`/api/v1.0/temp_and_sti/get/${id}`)
}

export function createGroupFn(params: groupParams) {
  return request.post<any>('/api/v1.0/temp_and_sti/save/work', params)
}

// 新建激励

export function createExcitationFn_1(params: excitation_1Params) {
  return request.post<excitationRes>('/api/v1.0/temp_and_sti/save/sti', params)
}

//

export function getExcitationFn_1(id: number) {
  return request.get<excitationRes>(`/api/v1.0/temp_and_sti/get/sti/${id}`)
}

// 交互结构校验

export function checkDataStructure(params: dataStructureParams) {
  return request.post<checkoutDataStructureRes>('/api/v1.0/temp_and_sti/save/work_check', params)
}

export function lookUpDependenceUnit(id: number) {
  return request.get<any>(`/api/v1.0/temp_and_sti/sender/relevance/query/${id}`)
}

export function lookUpDependencePeripheral(id: number) {
  return request.get<any>(`/api/v1.0/temp_and_sti/peripheral/relevance/query/${id}`)
}

// 更新端口信息

export function updateOneExcitaionList(id: number, params: UpdateOneExcitaionListParams) {
  return request.put<any>(`/api/v1.0/temp_and_sti/update/sti/${id}`, params)
}

//  更新激励单元
export function updatTwoExcitaionList(id: number, params: ExcitationParams) {
  return request.put<any>(`/api/v1.0/temp_and_sti/update/single/${id}`, params)
}

// 更新激励嵌套

export function updatThreeExcitaionList(id: number, params: doubleExcitationParams) {
  return request.put<any>(`/api/v1.0/temp_and_sti/update/group_unit/${id}`, params)
}

// 更新交互
export function updatFourWork(id: number, params: doubleExcitationParams) {
  return request.put<any>(`/api/v1.0/temp_and_sti/update/work/${id}`, params)
}

// 删除端口
export function deleteneExcitaionList(id: string) {
  return request.delete<any>('/api/v1.0/temp_and_sti/remove/sti', { params: { stimulus: id } })
}

export function deleteneExcitaionListMore(id: string) {
  return request.delete<any>('/api/v1.0/temp_and_sti/sender/remove', { params: { senders: id } })
}
// v1.3版本激励删除 更新 创建
// 删除 激励
export function deleteExcitationSignal(id: string) {
  return request.put<any>('/api/v1.0/temp_and_sti/sender/remove', { params: { senders: id } })
}

// 创建激励
export function createExcitationList(params: any) {
  return request.post('/api/v1.0/temp_and_sti/interaction/save', params)
}

// 更新激励
export function updateExcitationList(id: number, params: any) {
  return request.put<any>(`/api/v1.0/temp_and_sti/interaction/update/${id}`, params)
}

// 更新激励控件

export function updateControl(id: number, params: any) {
  return request.put<any>(`/api/v1.0/temp_and_sti/single/update/${id}`, params)
}

export function getExcitaionDeatilFn(id: number | string) {
  return request.get<any>(`/api/v1.0/temp_and_sti/sender/get/${id}`)
}

export function saveExcitaionFn(params: any) {
  return request.post<any>(`/api/v1.0/temp_and_sti/single/save`, params)
}
