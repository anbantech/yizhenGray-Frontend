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
  setDestoryEverything: () => void
  increase: (type: string) => void
  decrease: (type: string) => void
  setValue: (type: string, val: number) => void
}

interface LeftActionState {
  DropList: ListType[] | []
  gu_cnt0: number
  gu_w0: number
  name: string
  desc: string
  updated: boolean
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
  increase: (type: string) => void
  decrease: (type: string) => void
  setValue: (type: string, val: number) => void
  setDropListRef: (ref: any, index: number) => void
  destoryEveryItem: () => void
  setHead: (val: Record<string, any>) => void
  setDeatilStatus: (val: boolean) => void
}

interface ArgeementActionState {
  DropList: DragCmps[]
  gu_cnt0: number
  gu_w0: number
  name: string
  peripheral: string
  DropListRef: any[]
  detaileStatus: boolean
}

type ItemListState = ListType[] | any[]

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
  detailData: Record<string, any>
}

interface ListFn {
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
  clearCheckList: () => void
}

type ListFnStateValue = {
  checkAllList: CheckboxValueType[]
  indeterminate: boolean
  all: boolean
}

type GlobalStatusType = {
  updateStatus: boolean
  setUpdateStatus: (val: boolean) => void
  sendBtnStatus: boolean
  setSendBtnStatus: (val: boolean) => void
}

interface RouterProps {
  RouterChange: boolean
  ModalStatus: boolean
  setRouterChange: (val: boolean) => void
  reRouterBoolean: () => void
  setShowModal: (val: boolean) => void
}

interface Sender_idType {
  sender_id: number | null
  setSender_id: (id: number | null) => void
}

interface ExcitationLisSendBtnType {
  sendBtnStatus: boolean
}
