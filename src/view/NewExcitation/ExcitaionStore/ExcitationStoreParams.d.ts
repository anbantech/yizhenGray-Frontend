interface RightStateType {
  DragList: Record<string, any>[]
}

type RightAction = {
  setRightList: (item: ItemState) => void
}

type ItemState = Record<string, any>[]

type LeftAction = {
  setLeftList: (item: ItemListState) => void
  LeftDragIndexFn: () => number
}

interface LeftActionState {
  DropList: ListType[] | []
  inputValue: {
    gu_cnt0: number
    gu_w0: number
  }
}

interface CmpsOnly {
  imgTitleSrc: string
  deleteImg: string
}

type Type = { type: string }

export type Cmps = Type & CmpsOnly
interface DragCmps {
  type: string
  id: number
  keys: string
  Components: any
}

type ArgeementAction = {
  setLeftList: (item: DragCmps[]) => void
  LeftDragIndexFn: () => number
}

interface ArgeementActionState {
  DropList: DragCmps[]
}

type ItemListState = ListType[]

type ListType = {
  sender_id: number
  name: string
  peripheral: string
  gu_cnt0: number
  gu_w0: number
  keys: string
  isItemDragging?: boolean
}

type DragableStatusAction = {
  setDragableStatus: (bool: boolean) => void
}

type DragableStatuState = {
  dragableDragingStatus: boolean
}

type sendList = {
  sender_id: number
  detailData: Record<string, any>
}

interface ListFn {
  checkList: (id: number) => void
  setDetailData: (state: any) => void
}

interface ExcitationListState {
  params: Record<string, any>
  hasMoreData: boolean
}

interface ExcitationListStateFn {
  setHasMore: (val: boolean) => void
  setPage: (val: number) => void
  setKeyWord: (val: string) => void
  loadMoreData: () => void
}

interface ListAllItemFn {
  checkAllSenderIdList: (val: checkedValues[]) => void
  setIndeterminate: (val: boolean) => void
  setCheckAll: (val: boolean) => void
}

type ListFnStateValue = {
  checkAllList: CheckboxValueType[]
  indeterminate: boolean
  all: boolean
}

type GlobalStatusType = {
  updateStatus: boolean
}

interface UpdateStatusFn {
  setUpdateStatus: (val: boolean) => void
}
