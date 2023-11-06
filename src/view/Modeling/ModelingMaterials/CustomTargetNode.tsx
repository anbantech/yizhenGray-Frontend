import React, { useState, DragEvent, MouseEventHandler, Children } from 'react'
import { getConnectedEdges, getOutgoers, Handle, Node, NodeProps, Position, useEdges, useNodes, useReactFlow } from 'reactflow'
import cx from 'classnames'
import { IconMinus } from '@anban/iconfonts'
import styles from '../model.less'
import { useFlowStore } from '../Store/ModelStore'
import { use } from 'echarts/core'

function CustomTargetNode({ data, sourcePosition }: NodeProps) {
  const canvasData = useFlowStore(state => state.canvasData)
  const setChangeView = useFlowStore(state => state.setChangeView)
  const { setNodes, setEdges } = useFlowStore()
  const nodes = useNodes()
  const edges = useEdges()
  //   const onDrop = () => {
  //     setDropzoneActive(false)
  //   }

  //   const onDragOver = (evt: DragEvent<HTMLDivElement>) => {
  //     evt.preventDefault()
  //   }

  //   const onDragEnter = () => {
  //     setDropzoneActive(true)
  //   }

  //   const onDragLeave = () => {
  //     setDropzoneActive(false)
  //   }

  // const hideNode = React.useCallback(() => {
  //   const outgoers: Node<any, string | undefined>[] = []
  //   const connectedEdges: any[] = []
  //   const stack = []

  //   const currentNodeID = data.id
  //   stack.push(data)
  //   while (stack.length > 0) {
  //     const lastNode = stack.pop()
  //     const childnode = getOutgoers(lastNode, nodes, edges)
  //     console.log(childnode)
  //     const childedge = checkTarget(getConnectedEdges([lastNode], edges), currentNodeID)
  //     childnode.map((goer, key) => {
  //       stack.push(goer)
  //       outgoers.push(goer)
  //     })
  //     childedge.map((edge: any, key: any) => {
  //       connectedEdges.push(edge)
  //     })
  //   }

  //   const childNodeID = outgoers.map(node => {
  //     return node.id
  //   })
  //   const childEdgeID = connectedEdges.map(edge => {
  //     return edge.id
  //   })

  //   setNodes((node: any[]) => node.map(hideFn(hidden, childEdgeID, childNodeID)))
  //   setEdges((edge: any[]) => edge.map(hideFn(hidden, childEdgeID, childNodeID)))
  //   setHidden(!hidden)
  // }, [])
  const [hidden, setHidden] = useState(false)

  const hide = (hidden: boolean, childEdgeID: string[], childNodeID: string[]) => (nodeOrEdge: any) => {
    const newNodeOrEdge = nodeOrEdge

    if (childEdgeID.includes(nodeOrEdge.id) || childNodeID.includes(nodeOrEdge.id)) newNodeOrEdge.hidden = hidden
    return newNodeOrEdge
  }

  const checkTarget = (edge: any, id: number) => {
    const edges = edge.filter((ed: any) => {
      return ed.target !== id
    })
    return edges
  }

  const showNode = React.useCallback(() => {
    const outgoers: Node<unknown, string | undefined>[] = []
    const connectedEdges: any[] = []
    const stack = []
    const currentNodeID = data.id
    stack.push(data)
    while (stack.length > 0) {
      const lastNOde = stack.pop()
      const childnode = getOutgoers(lastNOde, nodes, edges)
      const childedge = checkTarget(getConnectedEdges([lastNOde], edges), currentNodeID)
      childnode.map((goer: any) => {
        if ([1, 5].includes(goer.flag)) {
          stack.push(goer)
          outgoers.push(goer)
        }

        // if ([1, 5].includes(goer.flag)) {
        //   return outgoers.push(goer)
        // }
        return false
      })
      childedge.map((edge: any) => {
        if (edge.flag === 5) return connectedEdges.push(edge)
        return false
      })
    }
    const childNodeID = outgoers.map(node => {
      return node.id
    })
    const childEdgeID = connectedEdges.map(edge => {
      return edge.id
    })
    const nodeData = nodes.map(element => hide(hidden, childEdgeID, childNodeID)(element))
    const edgeData = edges.map(element => hide(hidden, childEdgeID, childNodeID)(element))
    setNodes([...nodeData])
    setEdges([...edgeData])
    setHidden(!hidden)
    setChangeView(true)
    // 根据id 找出对应的节点和边
  }, [data, edges, hidden, nodes, setChangeView, setEdges, setNodes])

  const hideNode = React.useCallback(() => {}, [])
  return (
    <>
      <div className={styles.targetNode}>
        <Handle className={styles.handle} type='source' position={sourcePosition || Position.Bottom} />
        {data.label}
      </div>
      {[1].length > 0 ? (
        <div className={styles.handleNums} role='time' onClick={showNode}>
          {data.nums}
        </div>
      ) : (
        <div className={styles.closeImage} role='time' onClick={hideNode}>
          <IconMinus />
        </div>
      )}
    </>
  )
}

export default CustomTargetNode
