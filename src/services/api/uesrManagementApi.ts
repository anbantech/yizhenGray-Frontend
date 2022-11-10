/*
 * @Author: youjiaqi 2430284055@qq.com
 * @Date: 2022-08-30 16:58:45
 * @LastEditors: youjiaqi 2430284055@qq.com
 * @LastEditTime: 2022-08-31 18:58:25
 * @FilePath: /yizhen-frontend/src/Api/uesrManagementApi.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from 'Src/services/request/request'

export function userLogInfo(params: any) {
  return request.get<any>(`/api/v1.0/users/logs`, { params })
}

export function exportUserLog(params: any) {
  return request.post<any>(`/api/v1.0/users/logs/download`, params, { responseType: 'blob' })
}

export function getUserList(params: any) {
  return request.get<any>(`/api/v1.0/users/query`, { params })
}

export function createUser(params: any) {
  return request.post<any>(`/api/v1.0/users/save`, params)
}
export function updateUser(id: number, params: any) {
  return request.put<any>(`/api/v1.0/users/update/${id}`, params)
}

export function deleteUserName(id: number, admin_password: any) {
  return request.delete<any>(`/api/v1.0/users/delete`, { params: { users: id }, data: { admin_password } })
}
