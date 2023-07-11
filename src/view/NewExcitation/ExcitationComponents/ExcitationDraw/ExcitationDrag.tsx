import Checkbox from 'antd/lib/checkbox'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import * as React from 'react'
import { useDrag } from 'react-dnd'
import dragImg from 'Src/assets/drag/icon_drag.png'
import OmitExcitationComponents from 'Src/components/OmitComponents/OmitExcitationComponents'
import StyleSheet from './excitationDraw.less'

const TestID = [
  { id: 1, name: '激励1' },
  { id: 2, name: '激励2' }
]

type DragableType = { id: number; name: string; keys: number }

type ChildRefType = { closeMenu: () => void } | null
// 拖拽列表的item
const Dragable = ({ id, name, keys }: DragableType) => {
  // 展示菜单
  const [updateMenue, setUpdateMenue] = React.useState<number>(-1)

  // 定义 ref
  const ref = React.useRef<ChildRefType>(null!)

  const onChange = (val: string) => {
    switch (val) {
      case '删除':
        // CommonModleClose(true)
        break
      case '查看关联信息':
        // getDependenceInfo()
        break
      case '修改':
        // jumpUpdateWeb(updateMenue)
        break
      default:
        return null
    }
  }

  const [{ isDragging }, drag] = useDrag({
    type: 'DragDropBox',
    item: {},
    end: () => {},
    collect: monitor => {
      const isDragging = monitor.isDragging()
      return { isDragging }
    }
  })
  const isShow = React.useMemo(() => {
    if (isDragging) {
      return false
    }
    return true
  }, [isDragging])
  return (
    <div ref={drag} key={keys} style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move' }} className={StyleSheet.excitationItem}>
      <div
        role='time'
        onMouseDown={() => {
          setUpdateMenue(-1)
          ref.current?.closeMenu()
        }}
      >
        <img className={StyleSheet.img_Body} src={dragImg} alt='' />
        <Checkbox value={id} />
        <span className={StyleSheet.dragItem_name} style={{ marginRight: '6px' }}>
          {' '}
          {name}
        </span>
      </div>
      <OmitExcitationComponents id={id} ref={ref} onChange={onChange} updateMenueFn={setUpdateMenue} status={updateMenue} />
    </div>
  )
}

// 拖拽区
function ExcitationDrag() {
  const onChange = (checkedValues: CheckboxValueType[]) => {
    console.log(checkedValues)
  }

  return (
    <div>
      <Checkbox.Group style={{ width: '100%' }} onChange={onChange}>
        {TestID.map(item => {
          return <Dragable id={item.id} name={item.name} key={item.id} keys={item.id} />
        })}
      </Checkbox.Group>
    </div>
  )
}

export default ExcitationDrag
