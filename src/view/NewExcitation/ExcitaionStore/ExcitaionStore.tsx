import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { create } from 'zustand'
import {
  ArgeementAction,
  ArgeementActionState,
  DragableStatusAction,
  DragableStatuState,
  DragCmps,
  ExcitationListState,
  ExcitationListStateFn,
  GlobalStatusType,
  ItemListState,
  ItemState,
  LeftAction,
  LeftActionState,
  ListAllItemFn,
  ListFn,
  ListFnStateValue,
  RightAction,
  RightStateType,
  sendList,
  UpdateStatusFn
} from './ExcitationStoreParams'

const useModalExcitationStore = create((set: any) => ({
  modal: false,
  closeModal: () => set({ modal: false }),
  openModal: () => set({ modal: true })
}))

const useExicitationId = create((set: any) => ({
  id: null,
  setId: () => set((state: any) => ({ id: state.id }))
}))

const RightDragListStore = create<RightStateType & RightAction>(set => ({
  DragList: [],
  setRightList: (item: ItemState) => {
    set(() => ({
      DragList: item
    }))
  }
}))

const LeftDropListStore = create<LeftAction & LeftActionState>((set, get) => ({
  inputValue: {
    gu_cnt0: 1,
    gu_w0: 1
  },
  DropList: [],
  setLeftList: (item: ItemListState) => {
    set(() => ({
      DropList: [...item]
    }))
  },
  LeftDragIndexFn: () => {
    const { DropList } = get()
    const uselessIndex = DropList.findIndex((item: any) => item.sender_id === -1)
    return uselessIndex
  }
}))

const DragableDragingStatusStore = create<DragableStatuState & DragableStatusAction>(set => ({
  dragableDragingStatus: false,
  setDragableStatus: (bool: boolean) => {
    set(() => ({
      dragableDragingStatus: bool
    }))
  }
}))

const ArgeementDropListStore = create<ArgeementAction & ArgeementActionState>((set, get) => ({
  DropList: [],
  setLeftList: (item: DragCmps[]) => {
    set(() => ({
      DropList: [...item]
    }))
  },

  LeftDragIndexFn: () => {
    const { DropList } = get()
    const uselessIndex = DropList.findIndex((item: any) => item.id === -1)
    return uselessIndex
  }
}))

const sendExcitaionListStore = create<sendList & ListFn>(set => ({
  sender_id: -1,
  checkList: (id: number) => {
    set(() => ({
      sender_id: id
    }))
  },
  detailData: {},
  setDetailData: state => set({ detailData: state })
}))

const useRequestStore = create<ExcitationListStateFn & ExcitationListState>((set, get) => ({
  params: {
    target_type: '1',
    key_word: '',
    status: null,
    page: 1,
    page_size: 10,
    sort_field: 'create_time',
    sort_order: 'descend'
  },

  hasMoreData: true,
  setHasMore: (val: boolean) => {
    set(() => ({
      hasMoreData: val
    }))
  },

  setPage: (val: number) => {
    const { params } = get()
    set(() => ({
      params: { ...params, page_size: val }
    }))
  },

  setKeyWord: (value: string) => {
    const { params } = get()
    set(() => ({
      params: { ...params, key_word: value }
    }))
  },

  loadMoreData: () => {
    const { params } = get()
    const newPage = params.page_size + 10
    set(() => ({
      params: { ...params, page_size: newPage }
    }))
  }
}))

const checkListStore = create<ListAllItemFn & ListFnStateValue>(set => ({
  checkAllList: [],
  indeterminate: false,
  all: false,
  checkAllSenderIdList: (listValue: CheckboxValueType[]) => {
    set(() => ({
      checkAllList: [...listValue]
    }))
  },
  setIndeterminate: (val: boolean) => {
    set(() => ({
      indeterminate: val
    }))
  },
  setCheckAll: (val: boolean) => {
    set(() => ({
      all: val
    }))
  }
}))

const GlobalStatusStore = create<UpdateStatusFn & GlobalStatusType>(set => ({
  updateStatus: false,
  setUpdateStatus: (val: boolean) => {
    set(() => ({
      updateStatus: !val
    }))
  }
}))

export {
  useExicitationId,
  useModalExcitationStore,
  DragableDragingStatusStore,
  sendExcitaionListStore,
  RightDragListStore,
  LeftDropListStore,
  ArgeementDropListStore,
  useRequestStore,
  checkListStore,
  GlobalStatusStore
}
