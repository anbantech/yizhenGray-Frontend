import * as React from 'react'
import CheckCrashLevel from 'Src/components/check/CrashLevel'
import { CrashLevelTip } from 'Src/view/excitation/excitationComponent/Tip'
import detailStyle from '../taskDetailUtil/Detail.less'

interface propsType {
  //   cancelMenu: (e: React.MouseEvent<HTMLDivElement>) => void
  Checked: (value: string) => void
  system: number | null | string
}
function CheckCrashLevelCompoents(props: propsType) {
  const { system, Checked } = props
  return (
    <div className={detailStyle.checkend} style={{ marginRight: '24px' }}>
      <div className={detailStyle.checked} role='time'>
        <div className={detailStyle.CheckCrashLevel}>
          <span className={detailStyle.CheckName} style={{ marginRight: '6px' }}>
            缺陷级别{' '}
          </span>
          <CrashLevelTip />
          <span className={detailStyle.colon}> : </span>
        </div>
        <CheckCrashLevel Checked={Checked} positionErrorFrameData={system} getPopupContainer={(triggerNode: any) => triggerNode.parentNode} />
      </div>
    </div>
  )
}

export default CheckCrashLevelCompoents
