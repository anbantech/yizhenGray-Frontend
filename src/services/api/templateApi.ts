import { TemplateListParams, DeleteTemplateParams } from 'Src/globalType/Param'
import { TemplateListResponse } from 'Src/globalType/Response'
import request from 'Src/services/request/request'

export function getTemplateList(params: TemplateListParams) {
  return request.get<TemplateListResponse>('/api/v1.0/templates/query', { params })
}

export function removeTemplate(params: DeleteTemplateParams) {
  return request.delete('/api/v1.0/templates/delete', { params })
}
