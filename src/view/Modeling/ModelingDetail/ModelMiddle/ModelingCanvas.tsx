import React, { useCallback, useEffect, useState } from 'react'
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Node,
  Edge,
  NodeTypes,
  SelectionMode,
  BackgroundVariant,
  Controls,
  useReactFlow,
  getOutgoers
} from 'reactflow'
import { useLocation } from 'react-router'
import useAnimatedNodes from '../../ModelingMaterials/useAnimatedNodes'
import useExpandCollapse from '../../ModelingMaterials/useExpandCollapse'
import 'reactflow/dist/style.css'
import styles from '../../model.less'
import { LoactionState } from '../ModelLeft/ModelingLeftIndex'
import { useFlowStore } from '../../Store/ModelStore'
import CustomNode from '../../ModelingMaterials/CustomNode'
import CustomTargetNode from '../../ModelingMaterials/CustomTargetNode'
import PherilarlCustomNode from '../../ModelingMaterials/PherilarlCustomNode'
import CustomRegisterNode from '../../ModelingMaterials/CustomRegisterNode'

const proOptions = { account: 'paid-pro', hideAttribution: true }

const nodeTypes: NodeTypes = {
  custom: CustomNode,
  targetNode: CustomTargetNode,
  peripheralNode: PherilarlCustomNode,
  registerNode: CustomRegisterNode
}

type ExpandCollapseExampleProps = {
  treeWidth?: number
  treeHeight?: number
  animationDuration?: number
  edgeStore: Edge[]
  nodeStore: Node[]
}
const panOnDrag = [1, 2]
function ReactFlowPro({ edgeStore, nodeStore, treeWidth = 100, treeHeight = 220, animationDuration = 300 }: ExpandCollapseExampleProps) {
  const onEdgesChange = useFlowStore(state => state.onEdgesChange)
  const onNodesChange = useFlowStore(state => state.onNodesChange)
  const upDateNodesAndEdges = useFlowStore(state => state.upDateNodesAndEdges)
  const setMenuStatus = useFlowStore(state => state.setMenuStatus)
  const setOpenMenu = useFlowStore(state => state.setOpenMenu)
  const zindexNode = useFlowStore(state => state.zindexNode)
  const ref = React.useRef(null)

  // const { fitView } = useReactFlow()
  const { nodes: visibleNodes, edges: visibleEdges } = useExpandCollapse(nodeStore, edgeStore, {
    treeWidth,
    treeHeight
  })
  const { nodes: animatedNodes } = useAnimatedNodes(visibleNodes, {
    animationDuration
  })

  // 获取筛选节点数据

  const onNodeContextMenu = useCallback(
    (event, Node) => {
      // Prevent native context menu from showing
      event.preventDefault()
      setMenuStatus(Node.data.id)
    },
    [setMenuStatus]
  )

  // Close the context menu if it's open whenever the window is clicked.
  const onPaneClick = useCallback(() => setOpenMenu(), [setOpenMenu])

  //  框选删除更新界面
  const deleteNodeRef = React.useRef<any[]>([])
  const getDeleteNodeAndAdge = React.useCallback(
    (deleted: any) => {
      deleted.reduce((acc: any, node: Node<any, string | undefined>) => {
        const outgoers = getOutgoers(node, nodeStore, edgeStore)
        if (outgoers.length > 0) {
          deleteNodeRef.current.push(outgoers)
          getDeleteNodeAndAdge(outgoers)
        }
      }, edgeStore)
      return deleteNodeRef.current
    },
    [edgeStore, nodeStore]
  )

  const onNodesDelete = React.useCallback(
    deleted => {
      getDeleteNodeAndAdge(deleted)
      const deleteNodeArray = deleteNodeRef.current.concat(deleted).flat(Infinity)
      const node = nodeStore.filter(item => {
        return !deleteNodeArray.some(data => data.id === item.id)
      })

      const edge = edgeStore.filter(item => {
        return !deleteNodeArray.some(data => data.id === item.target)
      })
      upDateNodesAndEdges([...node], [...edge])
    },
    [getDeleteNodeAndAdge, nodeStore, edgeStore, upDateNodesAndEdges]
  )

  // useEffect(() => {
  //   fitView({ maxZoom: 0.5 })
  // }, [fitView])
  const onNodeClick = useCallback(
    (event, node) => {
      event.stopPropagation()
      setOpenMenu()
    },
    [setOpenMenu]
  )
  return (
    <div className={styles.container}>
      {/* <MiddleHeaderBar /> */}
      {animatedNodes && (
        <ReactFlow
          fitView
          ref={ref}
          nodes={animatedNodes}
          edges={visibleEdges}
          onNodeClick={onNodeClick}
          nodesFocusable={Boolean(1)}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          proOptions={proOptions}
          nodeTypes={nodeTypes}
          className={styles.viewport}
          zoomOnDoubleClick={false}
          selectionOnDrag
          panOnScroll
          elevateNodesOnSelect
          onPaneClick={onPaneClick}
          onNodeContextMenu={onNodeContextMenu}
          onNodesDelete={onNodesDelete}
          panOnDrag={panOnDrag}
          selectionMode={SelectionMode.Partial}
          // minZoom={-Infinity}
          // maxZoom={Infinity}
          // zoomActivationKeyCode=
        >
          <Background variant={BackgroundVariant.Dots} gap={24} size={1} />
          <Controls />
        </ReactFlow>
      )}
    </div>
  )
}

function ReactFlowWrapper() {
  const platformsId = (useLocation() as LoactionState).state?.id
  const platformsIdmemo = React.useMemo(() => platformsId, [platformsId])
  const getModelDetails = useFlowStore(state => state.getModelDetails)
  const nodeStore = useFlowStore(state => state.nodes)
  const edgeStore = useFlowStore(state => state.edges)

  useEffect(() => {
    if (platformsIdmemo) {
      getModelDetails(platformsIdmemo)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platformsIdmemo])
  return (
    <ReactFlowProvider>
      {nodeStore.length >= 1 && edgeStore.length >= 1 && <ReactFlowPro nodeStore={nodeStore} edgeStore={edgeStore} />}
    </ReactFlowProvider>
  )
}

export default ReactFlowWrapper
