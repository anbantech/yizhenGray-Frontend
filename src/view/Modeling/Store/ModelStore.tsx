// import { create } from 'zustand'
// import ModelDrawStoreType from './ModleStore'

import { create } from 'zustand'

import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges
} from 'reactflow'
import { deleteModelTarget, getModelTargetList, updateModelTarget } from 'Src/services/api/modelApi'
import { throwErrorMessage } from 'Src/util/message'
import { ModelDetails, NewModelListStore } from './ModleStore'
// import { message } from 'antd'

type RFState = {
  nodes: Node[]
  edges: Edge[]
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  getModelDetails: () => void
  setNodes: (nodesValue: Node[]) => void
  setEdges: (edgesValue: Edge[]) => void
}

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create<RFState>((set, get) => ({
  nodes: [],
  edges: [],
  setNodes: (nodesValue: Node[]) => {
    set({ nodes: nodesValue })
  },
  setEdges: (edgesValue: Edge[]) => {
    set({
      edges: edgesValue
    })
  },
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes)
    })
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges)
    })
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges)
    })
  },
  getModelDetails: () => {
    const treeNode = {
      name: 'dsp4198231',
      id: '1',
      children: [
        {
          name: '外设1',
          id: '1-1',
          children: [
            {
              name: '寄存器',
              id: '1-1-1'
            },
            {
              name: '寄存器2',
              id: '1-1-2'
            }
          ]
        },
        {
          name: '外设2',
          id: '1-2'
        }
      ]
    }
    const converTreeToNode = (node: any) => {
      const result = []
      result.push({
        data: { label: `Node ${node.name}` },
        type: 'custom',
        id: node.id as string,
        position: { x: 0, y: 0 }
      })
      if (node.children && node.children.length > 0) {
        node.children.forEach((item: any) => {
          result.push(...converTreeToNode(item))
        })
      }
      return result
    }
    const nodeArray = converTreeToNode(treeNode)
    const converTreeToEdges = (node: any) => {
      const links: any[] = []
      if (node.children && node.children.length > 0) {
        node.children.forEach((item: any) => {
          const source = node.id
          const target = item.id
          links.push({ id: `${source}->${target}`, source, target, type: 'smoothstep' })
          links.push(...converTreeToEdges(item))
        })
      }
      return links
    }
    const edgeArray = converTreeToEdges(treeNode)
    set({ nodes: [...nodeArray], edges: [...edgeArray] })
  }
}))

const useNewModelingStore = create<NewModelListStore>((set, get) => ({
  total: 0,
  modelId: null,
  loading: false,
  modelList: [],
  params: {
    key_word: '',
    page: 1,
    page_size: 10,
    sort_field: 'create_time',
    sort_order: 'descend'
  },
  setKeyWords: (key_words: string) => {
    const { params } = get()
    set({ params: { ...params, key_word: key_words, page: 1 } })
  },
  setPage: (page: Record<string, number>) => {
    const { params } = get()
    set({ params: { ...params, ...page } })
  },
  getModelList: () => {},
  setModelId: (val: number) => {
    set({ modelId: val })
  },
  getModelTargetList: async () => {
    const { toggleFn } = get()
    try {
      toggleFn()
      const res = await getModelTargetList()
      if (res.data) {
        set({ modelList: [...res.data.results], total: res.data.total })
      }
      toggleFn()
    } catch (error) {
      toggleFn()
      throwErrorMessage(error)
    }
  },
  updateModelTargetList: async () => {
    const { modelId } = get()
    try {
      const res = await updateModelTarget(modelId)
    } catch {}
  },
  deleteModelTarget: async () => {
    const { modelId } = get()
    try {
      const res = await deleteModelTarget(`${modelId}`)

      return res
    } catch (error) {
      throwErrorMessage(error)
      return error
    }
  },
  toggleFn: () => {
    const { loading } = get()
    set({ loading: !loading })
  }
}))

const useModelDetailsStore = create<ModelDetails>((set, get) => ({
  tabs: 'customMadePeripheral',
  keyWord: '',
  setTabs: val => {
    set({ tabs: val })
  },
  setKeyWord: val => {
    set({ keyWord: val })
  }
}))
export { useStore, useNewModelingStore, useModelDetailsStore }
