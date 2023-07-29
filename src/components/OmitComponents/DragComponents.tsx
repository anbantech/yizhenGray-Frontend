import React from 'react'
import style from './omit.less'

const menuMap = [
  { type: 'detail', title: '查看/修改激励详情', StyleSheet: style.detail, styleImage: style.taskListLeft_lookInfo },
  { type: 'info', title: '查看关联信息', StyleSheet: style.info, styleImage: style.taskListLeft_linkInfo },
  { type: 'export', title: '导出', StyleSheet: style.export, styleImage: style.taskListLeft_exportInfo },
  { type: 'delete', title: '删除', StyleSheet: style.delete, styleImage: style.taskListLeft_detailImg }
]

function DragComponentsMemo({ setOpen, onChange, id }: any) {
  return (
    <div
      onMouseLeave={() => {
        setOpen(false)
      }}
      className={style.ItemBodyMenu}
    >
      {menuMap.map(item => {
        return (
          <div
            key={item.type}
            className={item.StyleSheet}
            role='time'
            onClick={() => {
              onChange(item.type, id)
            }}
          >
            <div className={item.styleImage} />
            <div style={{ marginLeft: '8px' }}>{item.title}</div>
          </div>
        )
      })}
    </div>
  )
}

const DragComponents = React.memo(DragComponentsMemo)

export default DragComponents
