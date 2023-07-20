import create from 'zustand'
import {
  ArgeementAction,
  ArgeementActionState,
  DragableStatusAction,
  DragableStatuState,
  DragCmps,
  ItemListState,
  ItemState,
  LeftAction,
  LeftActionState,
  RightAction,
  RightStateType
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
  DragList: [
    { sender_id: 1, target_type: '3', name: 'Yj1', peripheral: '1', gu_cnt0: 1, gu_w0: 2 },
    { sender_id: 2, target_type: '3', name: 'Yj2', peripheral: '2', gu_cnt0: 1, gu_w0: 2 },
    { sender_id: 3, target_type: '3', name: 'Yj3', peripheral: '3', gu_cnt0: 1, gu_w0: 2 },
    { sender_id: 4, target_type: '3', name: 'Yj4', peripheral: '1', gu_cnt0: 1, gu_w0: 2 },
    { sender_id: 5, target_type: '3', name: 'Yj5', peripheral: '2', gu_cnt0: 1, gu_w0: 2 },
    { sender_id: 6, target_type: '3', name: 'Yj6', peripheral: '3', gu_cnt0: 1, gu_w0: 2 },
    { sender_id: 7, target_type: '3', name: 'Yj7', peripheral: '1', gu_cnt0: 1, gu_w0: 2 },
    { sender_id: 8, target_type: '3', name: 'Yj8', peripheral: '2', gu_cnt0: 1, gu_w0: 2 },
    { sender_id: 9, target_type: '3', name: 'Yj9', peripheral: '3', gu_cnt0: 1, gu_w0: 2 },
    { sender_id: 10, target_type: '3', name: 'Yj10', peripheral: '1', gu_cnt0: 1, gu_w0: 2 },
    { sender_id: 11, target_type: '3', name: 'Yj11', peripheral: '2', gu_cnt0: 1, gu_w0: 2 },
    { sender_id: 12, target_type: '3', name: 'Yj12', peripheral: '3', gu_cnt0: 1, gu_w0: 2 }
  ],
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

export { useExicitationId, useModalExcitationStore, DragableDragingStatusStore, RightDragListStore, LeftDropListStore, ArgeementDropListStore }
