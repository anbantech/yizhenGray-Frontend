type State = {
  status: number
}

type Action = {
  setStatus: (status: State['status']) => void
}

type TaskRequestParams = {
  project_id: null | number
  key_word?: string
  page: number
  status: number | string | null
  page_size: number
  sort_field?: string
  sort_order?: string
}

type TaskListState<T> = {
  TaskListData: [] | Record<string, any>
  request: T
  loading: boolean
  TaskDetail: Record<string, any> | null
  TaskId: number | null
  status: number | null
  getTaskDeatil: (id: number | null) => Promise
  setTaskID: (id: number | null) => void
  hasMoreData: boolean
  setTaskListData: (value: []) => void
  getTasKList: (id: number) => void
  setHasMore: (val: boolean) => void
  setPage: (val: number) => void
  setKeyWord: (val: string) => void
  initData: () => void
  loadMoreData: () => void
  toggleLoading: () => void
}

type ParamsStore = {
  task_id: null | number
  key_word?: string
  page: number
  status: number | string | null
  page_size: number
  sort_field?: string
  sort_order?: string
}

type TableState = {
  params: ParamsStore
  total: number
  TableListData: any
  loading: boolean
}

type TableAction = {
  initParams: (id: number) => void
  setTotal: (value: number) => void
  reset: () => void
  setTaskList: (data: Record<string, any>[]) => void
  setPage: (page: number, pageSize: number) => void
  setKeyWord: (word: string) => void
  setStatus: (value: string | null) => void
  getTaskInstancesList: () => void
  toggleLoading: () => void
}
