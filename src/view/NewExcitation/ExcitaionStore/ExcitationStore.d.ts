type RightAction = {
  setRightList: (item: ItemState) => void
}

interface RightStateType {
  DragList: Record<string, any>[]
}

type ItemState = Record<string, any>[]

type LeftAction = {
  setLeftList: (item: ItemListState) => void
  LeftDragIndexFn: () => number
}

interface LeftActionState {
  DropList: ListType[] | []
}

type ItemListState = ListType[]

type ListType = {
  sender_id: number
  name: string
  peripheral: string
  gu_cnt0: number
  gu_w0: number
  isItemDragging?: boolean
}

type DragableStatusAction = {
  setDragableStatus: (bool: boolean) => void
}

type DragableStatuState = {
  dragableDragingStatus: boolean
}
