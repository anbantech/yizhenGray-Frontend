import { create } from 'zustand'

const useModalExcitationStore = create(set => ({
  modal: false,
  closeModal: () => set({ modal: false }),
  openModal: () => set({ modal: true })
}))

const useExicitationId = create(set => ({
  id: null,
  setId: () => set((state: any) => ({ id: state.id }))
}))

export { useExicitationId, useModalExcitationStore }
