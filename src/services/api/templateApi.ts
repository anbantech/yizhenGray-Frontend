import { TemplateListParams, DeleteTemplateParams, CreateTemplateParams, UpdateTemplateParams } from 'Src/globalType/Param'
import { TemplateListResponse, TemplateDetailInfo, Primitive } from 'Src/globalType/Response'
import request from 'Src/services/request/request'

/**
 * 获取模板列表
 */
export function getTemplateList(params: TemplateListParams) {
  return request.get<TemplateListResponse>('/api/v1.0/templates/query', { params })
}

/**
 * 删除模板
 */
export function removeTemplate(params: DeleteTemplateParams) {
  return request.delete('/api/v1.0/templates/delete', { params })
}

/**
 * 获取模板详情
 */
export function getTemplate(id: string, params: { type: 'user_defined' | 'default' | 'recycle_bin' }) {
  return request.get<TemplateDetailInfo>(`/api/v1.0/templates/get/${id}`, { params })
}

/**
 * 修改模板
 */
export function updateTemplate(params: UpdateTemplateParams) {
  return request.put(`/api/v1.0/templates/update/${params.templates_id}`, params)
}

/**
 * 创建模板
 */
export function createTemplate(params: CreateTemplateParams) {
  return request.post<{ id: number }>('/api/v1.0/templates/save', params)
}

/**
 * 获取原语列表数据
 */
export function getPrimitivesList() {
  return request.get<Primitive[]>('/api/v1.0/primitives/query')
}
