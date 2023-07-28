import { Button } from 'antd'
import * as React from 'react'
import CreateButton from 'Src/components/Button/createButton'
import StyleSheet from '../excitationDraw.less'

function BtnCompoents({ setVsible, setNewCreate }: { setVsible: (val: boolean) => void; setNewCreate: (value: boolean) => void }) {
  return (
    <>
      <div className={StyleSheet.btn_header}>
        <CreateButton
          width='120px'
          height='35px'
          name='新建激励'
          type='primary'
          onClick={() => {
            setNewCreate(true)
          }}
        />
        <Button
          style={{ width: '80px', height: '36px', borderRadius: '4px' }}
          onClick={() => {
            setVsible(true)
          }}
        >
          {' '}
          导入
        </Button>
      </div>
    </>
  )
}

export default React.memo(BtnCompoents)
