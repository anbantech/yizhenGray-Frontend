import * as React from 'react'
import Check from 'Src/components/check/Check'
import detailStyle from '../taskDetailUtil/Detail.less'

interface propsType {
  //   cancelMenu: (e: React.MouseEvent<HTMLDivElement>) => void
  Checked: (value: string) => void
  system: string
}
function CheckCompoents(props: propsType) {
  const { system, Checked } = props
  return (
    <div className={detailStyle.checkend}>
      <div className={detailStyle.checked} role='time'>
        <span className={detailStyle.CheckName}>筛选进制</span>
        <span className={detailStyle.colon}> : </span>
        <Check Checked={Checked} positionErrorFrameData={system} getPopupContainer={(triggerNode: any) => triggerNode.parentNode} />
      </div>
    </div>
  )
}

export default CheckCompoents
