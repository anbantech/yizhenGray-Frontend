import { DownOutlined } from '@ant-design/icons'
import { Tree } from 'antd'
import React, { Children } from 'react'
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
  const data = [
    {
      id: 23,
      name: 'PLL',
      children: [
        {
          id: 74,
          name: 'PLL_PID'
        },
        {
          id: 76,
          name: 'PLL_MULT',
          Children: [
            {
              id: 23213,
              name: '数据处理器'
            }
          ]
        },
        {
          id: 77,
          name: 'PLL_DIV0'
        },
        {
          id: 78,
          name: 'PLL_DIV1'
        },
        {
          id: 79,
          name: 'PLL_DIV2'
        },
        {
          id: 80,
          name: 'PLL_DIV3'
        },
        {
          id: 81,
          name: 'PLL_OSCDIV1'
        },
        {
          id: 75,
          name: 'PLL_USR_UCR'
        }
      ]
    }
  ]
  const treeData = defaultData => {
    const loop = data => {
      return data.map(item => {
        const title = item.name
        const key = item.id
        const id = item.id
        const icon = ls[item.type] // Use the icon from ls based on the type
        if (item.children) {
          return {
            title,
            key,
            id,
            icon,
            children: loop(item.children)
          }
        }
        return {
          title,
          key,
          id,
          icon
        }
      })
    }
    return loop(defaultData)
  }
  return (
    <div>
      {' '}
      {customMadePeripheralList?.map((item: any) => {
        return (
          <div key={item.id}>
            <Tree fieldNames={{ title: 'name', key: 'id' }} treeData={data} />
          </div>
        )
      })}
    </div>
  )
}
const treeData = defaultData => {
  const loop = data => {
    return data.map(item => {
      const title = item.name
      const key = item.id
      const id = item.id
      const icon = ls[item.type] // Use the icon from ls based on the type
      if (item.children) {
        return {
          title,
          key,
          id,
          icon,
          children: loop(item.children)
        }
      }
      return {
        title,
        key,
        id,
        icon
      }
    })
  }
  return loop(defaultData)
}
export default ModelingLeftTabList
