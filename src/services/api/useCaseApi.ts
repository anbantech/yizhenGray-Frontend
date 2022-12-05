import { useCaseParams } from 'Src/globalType/Param'
import request from '../request/request'

export function createUseCaseFn(params: useCaseParams) {
  return request.post<any>(`/api/v1.0/temp_and_sti/save/task_group`, params)
}
