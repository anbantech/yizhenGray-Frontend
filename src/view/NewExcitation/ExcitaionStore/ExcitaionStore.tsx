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
  RouterProps,
  Sender_idType,
  sendList
} from './ExcitationStoreParams'

const useModalExcitationStore = create((set: any) => ({
  modal: false,
  closeModal: () => set({ modal: false }),
  openModal: () => set({ modal: true })
}))

// 激励列表的 sender_id 存取
const useExicitationSenderId = create<Sender_idType>((set: any) => ({
  sender_id: null,
  setSender_id: (id: number | null) => {
    set(() => ({
      sender_id: id
    }))
  }
}))

const RightDragListStore = create<RightStateType & RightAction & ListAllItemFn & ListFnStateValue>(set => ({
  DragList: [],
  checkAllList: [],
  indeterminate: false,
  all: false,
  checkAllSenderIdList: (listValue: CheckboxValueType[]) => {
    set(() => ({
      checkAllList: listValue
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
  },
  setRightList: (item: ItemState) => {
    set(() => ({
      DragList: item
    }))
  },
  clearCheckList() {
    set(() => ({
      checkAllList: [],
      indeterminate: false,
      all: false
    }))
  }
}))

const LeftDropListStore = create<LeftAction & sendList & ListFn & LeftActionState>((set, get) => ({
  DropList: [],
  gu_cnt0: 1,
  gu_w0: 0,
  name: '',
  desc: '',
  updated: false,
  paramsChange: false,
  detailData: {},
  setParamsChange: (val: boolean) => {
    set(() => ({
      paramsChange: val
    }))
  },
  setTitleorDesc: (type: string, val: string) => {
    if (type === 'name') {
      set(() => ({
        name: val
      }))
    }
    if (type === 'desc') {
      set(() => ({
        desc: val
      }))
    }
  },
  setLeftList: (item: ItemListState) => {
    set(() => ({
      DropList: [...item]
    }))
  },
  LeftDragIndexFn: () => {
    const { DropList } = get()
    const uselessIndex = DropList.findIndex((item: any) => item.sender_id === -1)
    return uselessIndex
  },
  increase: (type: string) => {
    if (type === 'gu_cnt0') {
      set(state => ({
        gu_cnt0: state.gu_cnt0 < 20 ? state.gu_cnt0 + 1 : 20
      }))
    }
    if (type === 'gu_w0') {
      set(state => ({
        gu_w0: state.gu_w0 < 100 ? state.gu_w0 + 1 : 100
      }))
    }
  },
  decrease: (type: string) => {
    if (type === 'gu_cnt0') {
      set(state => ({
        gu_cnt0: state.gu_cnt0 > 1 ? state.gu_cnt0 - 1 : 1
      }))
    }
    if (type === 'gu_w0') {
      set(state => ({
        gu_w0: state.gu_w0 > 0 ? state.gu_w0 - 1 : 0
      }))
    }
  },
  setValue: (type: string, val: number) => {
    if (type === 'gu_cnt0') {
      set(() => ({
        gu_cnt0: val
      }))
    }
    if (type === 'gu_w0') {
      set(() => ({
        gu_w0: val
      }))
    }
  },
  setDestoryEverything: () => {
    set(() => ({
      DropList: [],
      gu_cnt0: 1,
      name: '',
      desc: '',
      gu_w0: 0,
      sender_id: -1,
      detailData: {}
    }))
  },
  setDetailData: state => {
    set({
      detailData: state,
      name: state.name,
      desc: state.desc,
      gu_cnt0: state.gu_cnt0,
      gu_w0: state.gu_w0,
      DropList: state.group_data_list[1],
      updated: state.updated
    })
  }
}))

// 是否正在拖拽
const DragableDragingStatusStore = create<DragableStatuState & DragableStatusAction>(set => ({
  dragableDragingStatus: false,
  setDragableStatus: (bool: boolean) => {
    set(() => ({
      dragableDragingStatus: bool
    }))
  }
}))

// 协议弹窗
const ArgeementDropListStore = create<ArgeementAction & ArgeementActionState>((set, get) => ({
  DropList: [],
  gu_cnt0: 1,
  gu_w0: 1,
  name: '',
  peripheral: '',
  DropListRef: [],
  detaileStatus: false,
  setLeftList: (item: DragCmps[]) => {
    set(() => ({
      DropList: [...item]
    }))
  },
  LeftDragIndexFn: () => {
    const { DropList } = get()
    const uselessIndex = DropList.findIndex((item: any) => item.id === -1)
    return uselessIndex
  },
  increase: (type: string) => {
    if (type === 'gu_cnt0') {
      set(state => ({
        gu_cnt0: state.gu_cnt0 < 20 ? state.gu_cnt0 + 1 : 20
      }))
    }
    if (type === 'gu_w0') {
      set(state => ({
        gu_w0: state.gu_w0 < 100 ? state.gu_w0 + 1 : 100
      }))
    }
  },
  decrease: (type: string) => {
    if (type === 'gu_cnt0') {
      set(state => ({
        gu_cnt0: state.gu_cnt0 > 1 ? state.gu_cnt0 - 1 : 1
      }))
    }
    if (type === 'gu_w0') {
      set(state => ({
        gu_w0: state.gu_w0 > 0 ? state.gu_w0 - 1 : 0
      }))
    }
  },
  setValue: (type: string, val: number) => {
    if (type === 'gu_cnt0') {
      set(() => ({
        gu_cnt0: val
      }))
    }
    if (type === 'gu_w0') {
      set(() => ({
        gu_w0: val
      }))
    }
  },
  setDropListRef: (ref: any, index: number) => {
    const { DropListRef } = get()
    const DropListRefCopy = DropListRef
    DropListRefCopy[index] = ref
    set(() => ({
      DropListRef: DropListRefCopy
    }))
  },
  destoryEveryItem: () => {
    set(() => ({
      DropList: [],
      gu_cnt0: 1,
      gu_w0: 0,
      name: '',
      peripheral: '',
      DropListRef: [],
      detaileStatus: false
    }))
  },
  setDeatilStatus: (val: boolean) => {
    set(() => ({ detaileStatus: val }))
  },
  setHead: (val: Record<string, any>) => {
    set(() => ({
      name: val.name,
      gu_cnt0: val.gu_cnt0,
      gu_w0: val.gu_w0,
      peripheral: val.peripheral
    }))
  }
}))

const useRequestStore = create<ExcitationListStateFn & ExcitationListState>((set, get) => ({
  params: {
    target_type: '1',
    key_word: '',
    status: null,
    page: 1,
    page_size: 20,
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
      params: { ...params, page: val }
    }))
  },

  setKeyWord: (value: string) => {
    const { params } = get()
    set(() => ({
      params: { ...params, key_word: value, page: 1 }
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
      checkAllList: listValue
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
  },
  clearCheckList: () => {
    set(() => ({
      checkAllList: [],
      indeterminate: false,
      all: false
    }))
  }
}))

const GlobalStatusStore = create<GlobalStatusType>(set => ({
  updateStatus: false,
  sendBtnStatus: true,
  detailStatus: true,
  setSendBtnStatus: (val: boolean) => {
    set(() => ({
      sendBtnStatus: val
    }))
  },
  setUpdateStatus: (val: boolean) => {
    set(() => ({
      updateStatus: val
    }))
  },
  setDetailStatus: (val: boolean) => {
    set(() => ({
      detailStatus: val
    }))
  }
}))

// 路由
const RouterStore = create<RouterProps>(set => ({
  RouterChange: false,
  ModalStatus: false,
  setShowModal: (val: boolean) => {
    set(() => ({
      ModalStatus: val
    }))
  },
  setRouterChange: (val: boolean) => {
    set(() => ({
      RouterChange: val
    }))
  },
  reRouterBoolean: () => {
    return true
  }
}))

export {
  useExicitationSenderId,
  useModalExcitationStore,
  DragableDragingStatusStore,
  RightDragListStore,
  LeftDropListStore,
  ArgeementDropListStore,
  useRequestStore,
  checkListStore,
  GlobalStatusStore,
  RouterStore
}
