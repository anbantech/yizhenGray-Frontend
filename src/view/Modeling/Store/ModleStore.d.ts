import { Node, Edge } from 'reactflow'

type NodeItem = {
  id: string
  data: Record<string, string>
  position: Record<string, number>
  type: string
}

type EdgeItem = {
  id: string
  source: string
  target: string
}

type ModelData = {
  name: string
  id: string
  children?: ModelData[]
}

export interface ModelDrawStoreType {
  nodesItem: Node[]
  edgesItem: Edge[]
  setNodes: (nodes: Node[]) => void
  setEdges: (edges: Edge[]) => void
  getModelDetails: () => void
}

type ModelListType = {
  id: number
  name: string
  desc: string | null
  processor: string
}[]

type ModelParams = {
  key_word?: string
  page: number
  page_size: number
  sort_field?: string
  sort_order?: string
}

export interface NewModelListStore {
  modelId: number | null
  loading: boolean
  total: number
  params: ModelParams
  modelList: [] | ModelListType
  setKeyWords: (key_words: string) => void
  setPage: (page: Record<string, number>) => void
  getModelTargetList: () => void
  updateModelTargetList: (id: number) => void
  deleteModelTarget: () => Promise
  setModelId: (val: number) => void
  toggleFn: () => void
}

export interface ModelDetails {
  tabs: string
  setTabs: (val: string) => void
  keyWord: string
  setKeyWord: (val: string) => void
}
