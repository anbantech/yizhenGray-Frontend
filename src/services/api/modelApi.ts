import request from 'Src/services/request/request'

// 获取目标机列表
function getModelTargetList() {
  return request.post('/api/v1.0/models/platforms/query')
}

// 创建目标机
function createModelTarget() {
  return request.post('/api/v1.0/models/platforms/save')
}
// 更新目标机
function updateModelTarget(id: number | null) {
  return request.put(`/api/v1.0/models/platforms/update/${id}`)
}
// 删除目标机
function deleteModelTarget(id: string | null) {
  return request.delete(`/api/v1.0/models/platforms/remove`, { params: { platforms: id } })
}
export { getModelTargetList, createModelTarget, updateModelTarget, deleteModelTarget }
