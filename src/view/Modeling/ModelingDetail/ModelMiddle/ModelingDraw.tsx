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

// 1. 主要就是更新节点,边已经在初始化的时候全部填入数组当中,操作节点的时候 添加 或者 删除 都是要更新 节点的 , 然后拉取画布详情,完成页面更新
import React, { useEffect, useState } from 'react'
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
  getOutgoers,
  EdgeTypes,
  useNodesState,
  useEdgesState
} from 'reactflow'
import { useLocation } from 'react-router'
import CustomNode from '../../ModelingMaterials/CustomNode'
import CustomTargetNode from '../../ModelingMaterials/CustomTargetNode'
import useAutoLayout, { Direction } from '../../useLayout'

import 'reactflow/dist/style.css'
import styles from '../../model.less'
import { MiddleStore } from '../../Store/ModelStore'

import { LoactionState } from '../ModelLeft/ModelingLeftIndex'
import useAlwaysLayout from './changeLayout'
import useLayout from '../../useLayoutChange'

const nodeTypes: NodeTypes = {
  custom: CustomNode,
  targetNode: CustomTargetNode
}

const proOptions = {
  account: 'paid-pro',
  hideAttribution: true
}

type ExampleProps = {
  direction?: Direction
  edgeStore: Edge[]
  nodeStore: Node[]
}

type NodeData = {
  label: string
}

const panOnDrag = [1, 2]
/**
 * This example shows how you can automatically arrange your nodes after adding child nodes to your graph.
 */
function FlowPro({ direction = 'LR', edgeStore, nodeStore }: ExampleProps) {
  const { fitView } = useReactFlow()
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const changeView = MiddleStore(state => state.changeView)
  // useAutoLayout({ direction })
  const layoutedNodes = useLayout(nodes, edges, changeView, { direction })
  const fn1 = (nodeArray: any, edgeArray: any) => {
    setNodes([...nodeArray])
    setEdges([...edgeArray])
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

  useEffect(() => {
    if (nodeStore && edgeStore) {
      fn1(nodeStore, edgeStore)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeStore, edgeStore])
  useEffect(() => {
    setTimeout(() => {
      // duration is used for a smooth animation
      fitView({ duration: 400 })
    }, 100)
  }, [layoutedNodes, fitView])

  return (
    <div className={styles.container}>
      <ReactFlow
        className={styles.reactFlow}
        proOptions={proOptions}
        nodeTypes={nodeTypes}
        nodes={layoutedNodes}
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
        // defaultEdgeOptions={defaultEdgeOptions}
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
const ReactFlowWrapper = () => {
  const platformsId = (useLocation() as LoactionState).state?.id
  const platformsIdmemo = React.useMemo(() => platformsId, [platformsId])
  const getModelDetails = MiddleStore(state => state.getModelDetails)
  const nodeStore = MiddleStore(state => state.nodes)
  const edgeStore = MiddleStore(state => state.edges)
  useEffect(() => {
    if (platformsIdmemo) {
      getModelDetails(platformsIdmemo)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platformsIdmemo])
  return (
    <ReactFlowProvider>{nodeStore.length >= 1 && edgeStore.length >= 1 && <FlowPro nodeStore={nodeStore} edgeStore={edgeStore} />}</ReactFlowProvider>
  )
}

export default ReactFlowWrapper
