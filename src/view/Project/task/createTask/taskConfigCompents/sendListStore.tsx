import { create } from 'zustand'

interface ListState {
  current: number
  preCurrent: () => void
  setCurrent: () => void
  setButtonStatus: (val: boolean) => void
  setBaseInfo: (val: Record<string, string>) => void
  baseInfo: {
    name: string
    desc: string
  }
  btnStatus: boolean
  excitationList: any
  gu_cnt0: number
  gu_w0: number
  checkList: any[]
  twoindeterminate: boolean
  twoCheckList: any[]
  twoAll: boolean
  threeindeterminate: boolean
  threeAll: boolean
  setExcitation: (val: any) => void
  setCheckList: (val: any) => void
  increase: (type: string) => void
  decrease: (type: string) => void
  setValue: (type: string, val: number) => void
  deleteEverything: () => void
  setTwoCheckList: (val: any) => void
  setTwoindeterminate: (val: boolean) => void
  setTwoAll: (val: boolean) => void
  setThreeindeterminate: (val: boolean) => void
  setThreeAll: (val: boolean) => void
}

const stepStore = create<ListState>((set, get) => ({
  current: 0,
  baseInfo: { name: '', desc: '' },
  btnStatus: true,
  excitationList: [],
  gu_cnt0: 1,
  gu_w0: 1,
  checkList: [],
  twoCheckList: [],
  twoindeterminate: false,
  twoAll: false,
  threeindeterminate: false,
  threeAll: false,
  setTwoCheckList: (val: any) => {
    set(() => ({
      twoCheckList: val
    }))
  },

  setThreeindeterminate: (val: boolean) => {
    set(() => ({
      threeindeterminate: val
    }))
  },
  setThreeAll: (val: boolean) => {
    set(() => ({
      threeAll: val
    }))
  },
  setTwoindeterminate: (val: boolean) => {
    set(() => ({
      twoindeterminate: val
    }))
  },
  setTwoAll: (val: boolean) => {
    set(() => ({
      twoAll: val
    }))
  },
  setCurrent: () => {
    set(state => ({
      current: state.current + 1
    }))
  },
  preCurrent: () => {
    const { setCheckList, current } = get()
    if (current === 2) {
      setCheckList([])
    }
    set(state => ({
      current: state.current - 1
    }))
  },
  setButtonStatus: (val: boolean) => {
    set(() => ({
      btnStatus: val
    }))
  },
  setBaseInfo: (val: Record<string, string>) => {
    set(() => ({
      baseInfo: { name: val.name, desc: val.desc }
    }))
  },
  setExcitation: (val: any[]) => {
    set(() => ({
      excitationList: val
    }))
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
  setCheckList: (val: any[]) => {
    set(() => ({
      checkList: val
    }))
  },

  deleteEverything: () =>
    set({
      current: 0,
      baseInfo: { name: '', desc: '' },
      btnStatus: true,
      excitationList: [],
      checkList: [],
      gu_cnt0: 1,
      gu_w0: 1,
      twoCheckList: [],
      twoindeterminate: false,
      twoAll: false,
      threeindeterminate: false,
      threeAll: false
    })
}))

export default stepStore
