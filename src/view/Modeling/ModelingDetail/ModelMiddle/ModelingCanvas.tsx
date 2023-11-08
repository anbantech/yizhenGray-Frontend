import React, { useEffect } from 'react'
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Node,
  Edge,
  NodeTypes,
  SelectionMode,
  BackgroundVariant,
  Controls,
  useOnSelectionChange,
  useEdgesState,
  useNodesState,
  useReactFlow
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
  const [nodes, setNodes, onNodesChange] = useNodesState(nodeStore)
  const [edges, setEdges, onEdgesChange] = useEdgesState(edgeStore)
  const nodeId = useFlowStore(state => state.nodeId)
  const { fitView } = useReactFlow()
  const changeView = useFlowStore(state => state.changeView)
  const { nodes: visibleNodes, edges: visibleEdges } = useExpandCollapse(nodes, edges, { treeWidth, treeHeight }, changeView)
  const { nodes: animatedNodes } = useAnimatedNodes(visibleNodes, { animationDuration })

  // 获取筛选节点数据
  const SelectionChangeLogger = () => {
    useOnSelectionChange({
      // onChange: ({ nodes, edges }) => console.log('changed selection', nodes, edges)
    })
    return null
  }
  useEffect(() => {
    if (!nodeId) return
    setNodes(nds =>
      nds.map(n => {
        if (n.id === nodeId) {
          return {
            ...n,
            data: { ...n.data, expanded: !n.data.expanded }
          }
        }

        return n
      })
    )
  }, [changeView, nodeId, setNodes])
  useEffect(() => {
    setTimeout(() => {
      // duration is used for a smooth animation
      fitView({ duration: 200 })
    }, 100)
  }, [animatedNodes, fitView])
  return (
    <div className={styles.container}>
      <ReactFlow
        fitView
        nodes={animatedNodes}
        edges={visibleEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        proOptions={proOptions}
        nodeTypes={nodeTypes}
        // onNodeClick={onNodeClick}
        className={styles.viewport}
        zoomOnDoubleClick={false}
        selectionOnDrag
        panOnScroll
        // onNodesDelete={onNodesDelete}
        panOnDrag={panOnDrag}
        selectionMode={SelectionMode.Partial}
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
