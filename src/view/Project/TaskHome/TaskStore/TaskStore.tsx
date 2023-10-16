import { TaskDetail, taskList, taskTest } from 'Src/services/api/taskApi'
import { throwErrorMessage } from 'Src/util/message'
import { create } from 'zustand'

const TaskStatusStore = create<State & Action>(set => ({
  status: 0,
  setStatus: (status: number) => set(() => ({ status })),
  setWebSocket: () => {}
}))

const TaskListDataStore = create<TaskListState<TaskRequestParams>>((set, get) => ({
  TaskId: null,
  hasMoreData: true,
  TaskListData: [],
  TaskDetail: null,
  status: null,
  request: {
    project_id: null,
    key_word: '',
    page: 1,
    page_size: 20,
    status: null,
    sort_field: 'create_time',
    sort_order: 'descend'
  },
  loading: false,
  setTaskID: id => {
    set({ TaskId: id })
  },
  setTaskListData: (value: []) => ({ TaskListData: [...value] }),
  getTasKList: async (id: number) => {
    const { request, setHasMore, TaskId, toggleLoading } = get()
    if (!id) return
    try {
      toggleLoading()
      const res = await taskList({ ...request, project_id: id })
      if (res.data) {
        const newList = [...res.data.results]
        if (newList.length === 0) {
          setHasMore(false)
          set({ TaskListData: [...res.data.results] })
          return toggleLoading()
        }
        if (newList.length === res.data.total) {
          setHasMore(false)
        } else {
          setHasMore(true)
        }
        if (!TaskId) {
          set({ TaskId: newList[0].id })
        }
        set({ TaskListData: [...res.data.results] })
        toggleLoading()
      }
    } catch (error) {
      throwErrorMessage(error, { 1008: '服务异常' })
    }
  },
  getTaskDeatil: async (id: number | null) => {
    if (!id) return
    try {
      const res = await TaskDetail(`${id}`)
      set({ TaskDetail: res.data })
    } catch (error) {
      throwErrorMessage(error, { 1008: '服务异常' })
    }
  },
  setHasMore: (val: boolean) => {
    set(() => ({
      hasMoreData: val
    }))
  },

  setPage: (val: number) => {
    const { request } = get()
    set(() => ({
      request: { ...request, page: val }
    }))
  },

  setKeyWord: (value: string) => {
    const { request } = get()
    set(() => ({
      request: { ...request, key_word: value, page: 1 }
    }))
  },
  loadMoreData: () => {
    const { request } = get()
    const newPage = request.page_size + 10
    set(() => ({
      request: { ...request, page_size: newPage }
    }))
  },
  initData: () => {
    set(() => ({
      request: {
        project_id: null,
        key_word: '',
        page: 1,
        page_size: 20,
        status: null,
        sort_field: 'create_time',
        sort_order: 'descend'
      }
    }))
  },
  toggleLoading: () => {
    set({ loading: !get().loading })
  }
}))

const TaskTableStore = create<TableState & TableAction>((set, get) => ({
  params: {
    task_id: null,
    key_word: '',
    page: 1,
    page_size: 10,
    status: null,
    sort_field: 'create_time',
    sort_order: 'descend'
  },
  total: 0,
  TableListData: [],
  loading: false,
  setTotal: (value: number) => {
    set({ total: value })
  },
  initParams: (id: number) =>
    set(() => ({
      params: {
        task_id: id,
        key_word: '',
        page: 1,
        page_size: 10,
        status: null,
        sort_field: 'create_time',
        sort_order: 'descend'
      }
    })),
  toggleLoading: () => {
    set({ loading: !get().loading })
  },
  setTaskList: data => {
    set({ TableListData: [...data] })
  },
  setPage: (page, pageSize) => {
    const { params } = get()
    set(() => ({
      params: { ...params, page, page_size: pageSize }
    }))
  },
  setKeyWord: word => {
    const { params } = get()
    set(() => ({
      params: { ...params, key_word: word, page: 1 }
    }))
  },

  setStatus: value => {
    const { params } = get()
    set(() => ({
      params: { ...params, status: value, page: 1 }
    }))
  },
  getTaskInstancesList: async () => {
    const { setTotal, setTaskList, params, toggleLoading } = get()
    toggleLoading()
    try {
      const listResult = await taskTest(params)
      if (listResult.data) {
        setTotal(listResult.data.total)
        setTaskList(listResult.data.results)
      }
      toggleLoading()
      return listResult
    } catch (error) {
      throwErrorMessage(error)
    }
  },
  reset: () => {
    const { params } = get()
    set(() => ({
      params: { ...params, key_word: '', page: 1, page_size: 10, status: null, sort_field: 'create_time', sort_order: 'descend' }
    }))
  }
}))

export { TaskListDataStore, TaskStatusStore, TaskTableStore }
