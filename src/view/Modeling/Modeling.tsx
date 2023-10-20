// import shallow from 'zustand/shallow'

// import React, { useState } from 'react'
// import ReactFlow, {
//   Background,
//   SelectionMode,
//   BackgroundVariant,
//   Controls,
//   ReactFlowProvider,
//   useReactFlow,
//   // useOnSelectionChange,
//   // getOutgoers,
//   ConnectionLineType,
//   applyNodeChanges,
//   OnEdgesChange,
//   applyEdgeChanges,
//   MarkerType
// } from 'reactflow'
// import 'reactflow/dist/style.css'

// import ModelStore from 'Src/view/Modeling/Store/ModelStore'
// import CustomNode from './CustomNode'
// import useAutoLayout from './useLayout'
// import styles from './model.less'

// const panOnDrag = [1, 2]

// const defaultEdgeOptions = {
//   type: 'smoothstep',
//   markerEnd: { type: MarkerType.ArrowClosed },
//   pathOptions: { offset: 5 }
// }
// type ExampleProps = {
//   direction?: any
// }
// const nodeTypes: Record<string, any> = {
//   custom: CustomNode
// }

// const proOptions = {
//   account: 'paid-pro',
//   hideAttribution: true
// }
// const ReactFlowPro = ({ direction = 'TB' }: ExampleProps) => {
//   const { fitView } = useReactFlow()

//   useAutoLayout({ direction })
//   const { getModelDetails } = ModelStore()

//   // const [nodes, setNodes] = useState<Node<NodeData>[]>(initialElements.nodes)
//   // const [edges, setEdges] = useState<Edge[]>(initialElements.edges)
//   const nodesItem = ModelStore(state => state.nodesItem)
//   const edgesItem = ModelStore(state => state.edgesItem)
//   // 获取筛选节点数据
//   // const SelectionChangeLogger = () => {
//   //   useOnSelectionChange({
//   //     // onChange: ({ nodes, edges }) => console.log('changed selection', nodes, edges)
//   //   })
//   //   return null
//   // }
//   // 框选删除更新界面
//   // const deleteNodeRef = React.useRef<any[]>([])
//   // const fn = React.useCallback(
//   //   (deleted: any) => {
//   //     deleted.reduce((acc, node) => {
//   //       const outgoers = getOutgoers(node, nodes, edges)
//   //       if (outgoers.length > 0) {
//   //         deleteNodeRef.current.push(outgoers)
//   //         fn(outgoers)
//   //       }
//   //     }, edges)
//   //   },
//   //   [edges, nodes]
//   // )
//   // const onNodesDelete = React.useCallback(
//   //   deleted => {
//   //     fn(deleted)
//   //     const deleteNodeArray = deleteNodeRef.current.concat(deleted).flat(Infinity)
//   //     const node = nodes.filter(item => {
//   //       return !deleteNodeArray.some(data => data.id === item.id)
//   //     })
//   //
//   //     const edge = edges.filter(item => {
//   //       return !deleteNodeArray.some(data => data.id === item.target)
//   //     })
//   //     // onLayouts(node, edge)
//   //   },
//   //   [fn, nodes, edges]
//   // )

//   // const onNodesChange: OnNodesChange = (changes: NodeChange[]) => {
//   //   console.log(changes)
//   //   setNodes(nodes => applyNodeChanges(changes, nodes))
//   // }

//   // const onEdgesChange: OnEdgesChange = (changes: EdgeChange[]) => {
//   //   setEdges(edges => applyEdgeChanges(changes, edges))
//   // }
//   React.useEffect(() => {
//     if (getModelDetails) {
//       getModelDetails()
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])

//   React.useEffect(() => {
//     fitView({ duration: 400 })
//   }, [nodesItem, fitView])

//   return (
//     <ReactFlow
//       proOptions={proOptions}
//       nodes={nodesItem as any}
//       nodeTypes={nodeTypes}
//       edges={edgesItem}
//       // onNodesChange={onNodesChange}
//       // onEdgesChange={onEdgesChange}
//       // onNodesChange={onNodesChange}
//       panOnDrag={panOnDrag}
//       // onNodesDelete={onNodesDelete}
//       connectionLineType={ConnectionLineType.SmoothStep}
//       selectionMode={SelectionMode.Partial}
//       panOnScroll
//       fitView
//       defaultEdgeOptions={defaultEdgeOptions}
//       selectionOnDrag
//     >
//       {/* <Background variant={BackgroundVariant.Dots} gap={24} size={1} />
//       <Controls /> */}
//       {/* <SelectionChangeLogger /> */}
//     </ReactFlow>
//   )
// }
// function Flow() {
//   return (
//     <div style={{ width: '90vw   ', height: '80vh' }}>
//       <ReactFlowProvider>
//         <ReactFlowPro />
//       </ReactFlowProvider>
//     </div>
//   )
// }

// export default Flow

// import shallow from 'zustand/shallow'

// import React, { useState } from 'react'
// import ReactFlow, {
//   Background,
//   SelectionMode,
//   BackgroundVariant,
//   Controls,
//   ReactFlowProvider,
//   useReactFlow,
//   // useOnSelectionChange,
//   // getOutgoers,
//   ConnectionLineType,
//   applyNodeChanges,
//   OnEdgesChange,
//   applyEdgeChanges,
//   MarkerType
// } from 'reactflow'
// import 'reactflow/dist/style.css'

// import ModelStore from 'Src/view/Modeling/Store/ModelStore'
// import CustomNode from './CustomNode'
// import useAutoLayout from './useLayout'
// import styles from './model.less'

// const panOnDrag = [1, 2]

// const defaultEdgeOptions = {
//   type: 'smoothstep',
//   markerEnd: { type: MarkerType.ArrowClosed },
//   pathOptions: { offset: 5 }
// }
// type ExampleProps = {
//   direction?: any
// }
// const nodeTypes: Record<string, any> = {
//   custom: CustomNode
// }

// const proOptions = {
//   account: 'paid-pro',
//   hideAttribution: true
// }
// const ReactFlowPro = ({ direction = 'TB' }: ExampleProps) => {
//   const { fitView } = useReactFlow()

//   useAutoLayout({ direction })
//   const { getModelDetails } = ModelStore()

//   // const [nodes, setNodes] = useState<Node<NodeData>[]>(initialElements.nodes)
//   // const [edges, setEdges] = useState<Edge[]>(initialElements.edges)
//   const nodesItem = ModelStore(state => state.nodesItem)
//   const edgesItem = ModelStore(state => state.edgesItem)

//   React.useEffect(() => {
//     if (getModelDetails) {
//       getModelDetails()
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])

//   React.useEffect(() => {
//     fitView({ duration: 400 })
//   }, [nodesItem, fitView])

//   return (
//     <ReactFlow
//       proOptions={proOptions}
//       nodes={nodesItem as any}
//       nodeTypes={nodeTypes}
//       edges={edgesItem}
//       // onNodesChange={onNodesChange}
//       // onEdgesChange={onEdgesChange}
//       // onNodesChange={onNodesChange}
//
//       // onNodesDelete={onNodesDelete}
//       connectionLineType={ConnectionLineType.SmoothStep}
//       selectionMode={SelectionMode.Partial}
//
//       fitView
//       defaultEdgeOptions={defaultEdgeOptions}
//
//     >
//       {/* <Background variant={BackgroundVariant.Dots} gap={24} size={1} />
//       <Controls /> */}
//       {/* <SelectionChangeLogger /> */}
//     </ReactFlow>
//   )
// }
// function Flow() {
//   return (
//     <div style={{ width: '90vw   ', height: '80vh' }}>
//       <ReactFlowProvider>
//         <ReactFlowPro />
//       </ReactFlowProvider>
//     </div>
//   )
// }

// export default Flow

import React, { useEffect, useState, MouseEvent, DragEvent, DragEventHandler } from 'react'
import ReactFlow, {
  MarkerType,
  ReactFlowProvider,
  useReactFlow,
  Node,
  Edge,
  NodeTypes,
  OnNodesChange,
  applyNodeChanges,
  NodeMouseHandler,
  NodeChange,
  OnEdgesChange,
  EdgeChange,
  applyEdgeChanges,
  Background,
  BackgroundVariant,
  Controls,
  SelectionMode,
  useOnSelectionChange,
  getOutgoers
} from 'reactflow'

import CustomNode from './CustomNode'
import useAutoLayout, { Direction } from './useLayout'

import 'reactflow/dist/style.css'
import styles from './model.less'

const nodeTypes: NodeTypes = {
  custom: CustomNode
}

const proOptions = {
  account: 'paid-pro',
  hideAttribution: true
}

const defaultEdgeOptions = {
  type: 'smoothstep',
  markerEnd: { type: MarkerType.ArrowClosed },
  pathOptions: { offset: 5 }
}

type ExampleProps = {
  direction?: Direction
}

type NodeData = {
  label: string
}
const getModelDetails = () => {
  const treeNode = {
    name: 'dsp4198231',
    id: '1',
    children: [
      {
        name: '外设1',
        id: '1-1',
        children: [
          {
            name: '寄存器',
            id: '1-1-1'
          },
          {
            name: '寄存器2',
            id: '1-1-2'
          }
        ]
      },
      {
        name: '外设2',
        id: '1-2'
      }
    ]
  }
  const converTreeToNode = (node: any) => {
    const result = []
    result.push({
      data: { label: `Node ${node.name}` },
      type: 'custom',
      id: node.id as string,
      position: { x: 0, y: 0 },
      draggable: false
    })
    if (node.children && node.children.length > 0) {
      node.children.forEach((item: any) => {
        result.push(...converTreeToNode(item))
      })
    }
    return result
  }
  const nodeArray = converTreeToNode(treeNode)
  const converTreeToEdges = (node: any) => {
    const links: any[] = []
    if (node.children && node.children.length > 0) {
      node.children.forEach((item: any) => {
        const source = node.id
        const target = item.id
        links.push({ id: `${source}->${target}`, source, target, type: 'smoothstep' })
        links.push(...converTreeToEdges(item))
      })
    }
    return links
  }
  const edgeArray = converTreeToEdges(treeNode)
  return { edgeArray, nodeArray }
}

const panOnDrag = [1, 2]
/**
 * This example shows how you can automatically arrange your nodes after adding child nodes to your graph.
 */
function ReactFlowPro({ direction = 'LR' }: ExampleProps) {
  // this hook handles the computation of the layout once the elements or the direction changes
  const { fitView } = useReactFlow()

  useAutoLayout({ direction })
  const [nodes, setNodes] = useState<Node<NodeData>[]>([])
  const [edges, setEdges] = useState<Edge[]>([])

  // this function adds a new node and connects it to the source node
  // const createConnection = (sourceId: string) => {
  //   // create an incremental ID based on the number of elements already in the graph
  //   const targetId = `${nodes.length + 1}`

  //   const targetNode: Node<NodeData> = {
  //     id: targetId,
  //     data: { label: `Node ${targetId}` },
  //     position: { x: 0, y: 0 }, // no need to pass a position as it is computed by the layout hook
  //     type: 'custom',
  //     style: { opacity: 0 }
  //   }

  //   const connectingEdge: Edge = {
  //     id: `${sourceId}->${targetId}`,
  //     source: sourceId,
  //     target: targetId,
  //     style: { opacity: 0 }
  //   }

  //   setNodes(nodes => nodes.concat([targetNode]))
  //   setEdges(edges => edges.concat([connectingEdge]))
  // }

  const fn1 = () => {
    const { edgeArray, nodeArray } = getModelDetails()
    setNodes([...nodeArray])
    setEdges([...edgeArray])
  }
  // this function is called once the node from the sidebar is dropped onto a node in the current graph
  // const onDrop: DragEventHandler = (evt: DragEvent<HTMLDivElement>) => {
  //   // make sure that the event target is a DOM element
  //   if (evt.target instanceof Element) {
  //     // from the target element search for the node wrapper element which has the node id as attribute
  //     const targetId = evt.target.closest('.react-flow__node')?.getAttribute('data-id')

  //     if (targetId) {
  //       // now we can create a connection to the drop target node
  //       createConnection(targetId)
  //     }
  //   }
  // }

  // this function is called when a node in the graph is clicked
  // enables a second possibility to add nodes to the canvas
  // const onNodeClick: NodeMouseHandler = (_: MouseEvent, node: Node<NodeData>) => {
  //   // on click, we want to add create a new node connection the clicked node
  //   createConnection(node.id)
  // }

  const onNodesChange: OnNodesChange = (changes: NodeChange[]) => {
    setNodes(nodes => applyNodeChanges(changes, nodes))
  }

  const onEdgesChange: OnEdgesChange = (changes: EdgeChange[]) => {
    setEdges(edges => applyEdgeChanges(changes, edges))
  }

  // 获取筛选节点数据
  const SelectionChangeLogger = () => {
    useOnSelectionChange({
      // onChange: ({ nodes, edges }) => console.log('changed selection', nodes, edges)
    })
    return null
  }

  //  框选删除更新界面
  const deleteNodeRef = React.useRef<any[]>([])
  const fn = React.useCallback(
    (deleted: any) => {
      deleted.reduce((acc, node) => {
        const outgoers = getOutgoers(node, nodes, edges)
        if (outgoers.length > 0) {
          deleteNodeRef.current.push(outgoers)
          fn(outgoers)
        }
      }, edges)
    },
    [edges, nodes]
  )

  const onNodesDelete = React.useCallback(
    deleted => {
      fn(deleted)
      const deleteNodeArray = deleteNodeRef.current.concat(deleted).flat(Infinity)
      const node = nodes.filter(item => {
        return !deleteNodeArray.some(data => data.id === item.id)
      })

      const edge = edges.filter(item => {
        return !deleteNodeArray.some(data => data.id === item.target)
      })
      setNodes([...node])
      setEdges([...edge])
    },
    [fn, nodes, edges]
  )

  // const onNodesChange: OnNodesChange = (changes: NodeChange[]) => {
  //   console.log(changes)
  //   setNodes(nodes => applyNodeChanges(changes, nodes))
  // }

  // const onEdgesChange: OnEdgesChange = (changes: EdgeChange[]) => {
  //   setEdges(edges => applyEdgeChanges(changes, edges))
  // }

  useEffect(() => {
    fn1()
  }, [])
  // every time our nodes change, we want to center the graph again
  useEffect(() => {
    fitView({ duration: 400 })
  }, [nodes, fitView])

  return (
    <div className={styles.container} style={{ width: '80vw', height: '90vh' }}>
      <ReactFlow
        className={styles.reactFlow}
        proOptions={proOptions}
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        selectionOnDrag
        panOnScroll
        onNodesDelete={onNodesDelete}
        panOnDrag={panOnDrag}
        selectionMode={SelectionMode.Partial}
        // newly added edges get these options automatically
        defaultEdgeOptions={defaultEdgeOptions}
        minZoom={-Infinity}
        maxZoom={Infinity}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} />
        <Controls />
        <SelectionChangeLogger />
      </ReactFlow>
    </div>
  )
}

// as we are accessing the internal React Flow state in our component, we need to wrap it with the ReactFlowProvider
const ReactFlowWrapper = (props: ExampleProps) => {
  return (
    <ReactFlowProvider>
      <ReactFlowPro {...props} />
    </ReactFlowProvider>
  )
}

export default ReactFlowWrapper
