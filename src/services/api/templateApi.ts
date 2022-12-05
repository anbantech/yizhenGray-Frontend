import { protocol_List } from 'Src/globalType/Param'
import { Resprotocol_List } from 'Src/globalType/Response'
import request from 'Src/services/request/request'

export function TelList(params: protocol_List) {
  return request.get<Resprotocol_List>('/api/v1.0/templates/query', { params })
}
