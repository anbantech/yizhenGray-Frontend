import { DownOutlined } from '@ant-design/icons'
import { Tree } from 'antd'
import React from 'react'
import { useModelDetailsStore, useNewModelingStore } from '../../Store/ModelStore'

interface LoactionState {
  state: Record<any, any>
}
function ModelingLeftTabList() {
  const customMadePeripheralList = useModelDetailsStore(state => state.customMadePeripheralList)
  //   const modelId = useNewModelingStore(state => state.modelId)
  //   const platformsIdmemo = React.useMemo(() => modelId, [modelId])
  //   const { getList } = useModelDetailsStore()
  //   const tabs = useModelDetailsStore(state => state.tabs)
  //   React.useEffect(() => {
  //     if (tabs && platformsIdmemo) {
  //       getList(tabs, platformsIdmemo)
  //     }
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [tabs, platformsIdmemo])
  return (
    <div>
      {' '}
      {customMadePeripheralList?.map((item: any) => {
        return (
          <div key={item.id}>
            <Tree showIcon defaultExpandAll defaultSelectedKeys={['0-0-0']} switcherIcon={<DownOutlined />} treeData={item} />
          </div>
        )
      })}
    </div>
  )
}

export default ModelingLeftTabList
