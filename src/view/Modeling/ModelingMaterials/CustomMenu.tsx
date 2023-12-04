import React from 'react'

const CustomMenu = (props: any) => {
  // const reactFlowBounds = document?.querySelector('.react-flow').getBoundingClientRect()
  //   const position1 = {
  //     x: event.clientX - reactFlowBounds.left,
  //     y: event.clientY - reactFlowBounds.top
  //   }
  const { x, y } = props.menu
  return (
    <div style={{ position: 'absolute', width: 200, height: 200, background: 'yellow', left: x, top: y }}>
      <span> 22 </span>
    </div>
  )
}

export default CustomMenu
