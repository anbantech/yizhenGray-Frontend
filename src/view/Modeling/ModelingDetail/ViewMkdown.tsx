import { Drawer } from 'antd'
import React from 'react'
import { vieMarkDown } from '../Store/ModelStore'

// Did you know you can use tildes instead of backticks for code in markdown? ✨

export default function ViewMarkdown(props: { markDown: string; open: boolean }) {
  const { markDown, open } = props
  const { setOpen } = vieMarkDown()
  const onClose = () => {
    setOpen()
  }
  return (
    <div>
      <Drawer width={640} placement='right' visible={open} closable={false} onClose={onClose}>
        <pre>{JSON.stringify(markDown, null, 2)}</pre>
      </Drawer>
    </div>
  )
}
