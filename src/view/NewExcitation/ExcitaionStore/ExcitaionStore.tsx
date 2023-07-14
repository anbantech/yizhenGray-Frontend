import create from 'zustand'

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
    { sender_id: 3, target_type: '3', name: 'Yj3', peripheral: '3', gu_cnt0: 1, gu_w0: 2 }
  ],
  setRightList: (item: ItemState) => {
    set(() => ({
      DragList: item
    }))
  }
}))

const LeftDropListStore = create<LeftAction & LeftActionState>((set, get) => ({
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

export { useExicitationId, useModalExcitationStore, DragableDragingStatusStore, RightDragListStore, LeftDropListStore }
