import { Drawer } from 'antd'
import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism' // 选择适合你的主题
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
        <SyntaxHighlighter language='csharp' style={vscDarkPlus}>
          {markDown}
        </SyntaxHighlighter>
      </Drawer>
    </div>
  )
}
