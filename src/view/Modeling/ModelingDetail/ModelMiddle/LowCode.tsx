import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from 'antd'
import ReactFlow, { Background, BackgroundVariant, ConnectionLineType, Edge, Node, NodeTypes, Panel, ReactFlowProvider, getOutgoers } from 'reactflow'
import { useLocation } from 'react-router'
import { useEventListener } from 'ahooks-v2'
import DeleteNodeModal from 'Src/components/Modal/nodeDraw/deleteNodeMoal'
import { LowCodeStoreType } from '../../Store/CanvasStore/canvasStoreType'
import 'reactflow/dist/style.css'
import { LowCodeStore, switchNodeType } from '../../Store/CanvasStore/canvasStore'
import CustomTargetNode from '../../ModelingMaterials/CustomTargetNode'
import CustomControls from '../../ModelingMaterials/CustomControls'
import CustomTimerNode from '../../ModelingMaterials/CustomTimerNode'
import CustomHandlerNode from '../../ModelingMaterials/CustomHandlerNode'
import CustomPeripheralNode from '../../ModelingMaterials/CustomPeripheralNode'
import { LoactionState } from '../ModelLeft/ModelingLeftIndex'
import { LeftListStore } from '../../Store/ModeleLeftListStore/LeftListStore'

import { LeftAndRightStore } from '../../Store/ModelLeftAndRight/leftAndRightStore'

type ExpandCollapseExampleProps = {
  edges: Edge[]
  nodes: Node[]
}
const proOptions = { account: 'paid-pro', hideAttribution: true }

const selector = (state: LowCodeStoreType) => ({
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  createNode: state.createNode,
  updatePositionNode: state.updatePositionNode,
  addEdge: state.addEdge,
  onEdgeUpdate: state.onEdgeUpdate,
  layout: state.layout,
  deleteNodeInfo: state.deleteNodeInfo,
  setDeleNodeInfo: state.setDeleNodeInfo,
  setEdgesAndNodes: state.setEdgesAndNodes
})

const nodeTypes: NodeTypes = {
  TargetNode: CustomTargetNode,
  TimerNode: CustomTimerNode,
  HandlerNode: CustomHandlerNode,
  registerNode: CustomTargetNode,
  peripheralNode: CustomPeripheralNode
}

// 保持原点在屏幕中心
// const nodeOrigin: NodeOrigin = [0.5, 0.5]

function ReactFlowPro({ edges, nodes }: ExpandCollapseExampleProps) {
  const platform_id = LeftAndRightStore(state => state.platform_id)
  const dragRef = React.useRef<any>(null)
  const {
    setDeleNodeInfo,
    onNodesChange,
    onEdgesChange,
    createNode,
    updatePositionNode,
    addEdge,
    onEdgeUpdate,
    layout,
    setEdgesAndNodes,
    deleteNodeInfo
  } = LowCodeStore(selector)
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)
  const { getList } = LeftListStore()
  const ref = React.useRef(null)
  const nodeData = useMemo(() => {
    return nodes
  }, [nodes])

  const edgesData = useMemo(() => {
    return edges
  }, [edges])

  const onDragOver = useCallback(event => {
    event.preventDefault()
    // eslint-disable-next-line no-param-reassign
    event.dataTransfer.dropEffect = 'move'
  }, [])

  // 侧边栏拖进画布中添加 节点
  const onDrop = useCallback(
    event => {
      event.preventDefault()

      const type = event.dataTransfer.getData('application/reactflow')
      const nodeInfo = JSON.parse(type)
      const { flag, id, name, error_code, tabs } = nodeInfo

      const ifId = nodes.some(item => String(item.id) === String(id))
      // check if the dropped element is valid
      if (ifId) {
        return
      }

      // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10  but now we use project Api
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - 150,
        y: event.clientY
      })
      const newNode = {
        data: {
          label: name,
          id: String(id),
          error_code,
          flag,
          tabs
        },
        type: switchNodeType(flag),
        id: String(id),
        position
      }

      createNode(newNode)
    },
    [createNode, nodes, reactFlowInstance]
  )

  // 当节点停止拖拽时
  const onNodeDragStop = () => {
    if (dragRef.current) {
      updatePositionNode(dragRef.current.id, {
        x: dragRef.current.position.x,
        y: dragRef.current.position.y + 100
      })
    }
    dragRef.current = null
  }

  const onNodeDrag = (evt: any, node: any) => {
    const centerX = node.position.x + node.width / 2
    const centerY = node.position.y + node.height / 2
    // find a node where the center point is inside
    const targetNode = nodes.find((n: any) => {
      if (n.width && n.height) {
        return (
          centerX > n.position.x &&
          centerX < n.position.x + n.width &&
          centerY > n.position.y &&
          centerY < n.position.y + n.height &&
          n.id !== node.id
        )
      }
      return node
    })
    if (targetNode) {
      dragRef.current = targetNode
    }
  }

  const onNodeClick = useCallback(
    (event, node) => {
      event.stopPropagation()
      event.preventDefault()
      LeftAndRightStore.getState().setSelect(node.id, node.data.flag)
      if (node.data.tabs) {
        getList(node.data.tabs)
      }
    },
    [getList]
  )

  //  框选删除更新界面
  const deleteNodeRef = React.useRef<any[]>([])

  const getDeleteNodeAndAdge = React.useCallback(
    (deleted: any) => {
      // eslint-disable-next-line array-callback-return
      deleted.reduce((acc: any, node: Node<any, string | undefined>) => {
        const outgoers = getOutgoers(node, nodeData, edgesData)
        if (outgoers.length > 0) {
          deleteNodeRef.current.push(outgoers)
          getDeleteNodeAndAdge(outgoers)
        }
      }, edgesData)
      return deleteNodeRef.current
    },
    [edgesData, nodeData]
  )

  const onNodesDelete = React.useCallback(
    (deleted, error_code) => {
      getDeleteNodeAndAdge(deleted)
      const deleteNodeArray = deleteNodeRef.current.concat(deleted).flat(Infinity)
      const node = nodeData
        .map((Node1: Node) => {
          const matchingItem = error_code.find((item2: any) => Node1.id === String(item2.id))
          if (matchingItem) {
            // eslint-disable-next-line no-param-reassign
            Node1.data.error_code = matchingItem.error_code
          }
          return Node1
        })
        .filter(item => {
          return !deleteNodeArray.some(data => data.id === item.id)
        })

      const edge = edgesData.filter(item => {
        return !deleteNodeArray.some(data => data.id === item.target)
      })
      if (platform_id) {
        setEdgesAndNodes(node, edge, String(platform_id))
        LeftAndRightStore.getState().setSelect(platform_id, 5)
      }
      getList('customPeripheral')
    },
    [getDeleteNodeAndAdge, nodeData, edgesData, platform_id, getList, setEdgesAndNodes]
  )

  return (
    <ReactFlow
      ref={ref}
      onDrop={onDrop}
      nodes={nodeData}
      edges={edgesData}
      onConnect={addEdge}
      nodeTypes={nodeTypes}
      onNodeDrag={onNodeDrag}
      onDragOver={onDragOver}
      proOptions={proOptions}
      onNodeClick={onNodeClick}
      onEdgeUpdate={onEdgeUpdate}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onInit={setReactFlowInstance}
      onNodeDragStop={onNodeDragStop}
      connectionLineType={ConnectionLineType.SmoothStep}
    >
      <Background variant={BackgroundVariant.Dots} gap={24} size={1} />
      <CustomControls />
      <Panel position='top-right'>
        <Button onClick={layout}>switch mode</Button>
      </Panel>
      {deleteNodeInfo.visibility && (
        <DeleteNodeModal
          deleteNodeInfo={deleteNodeInfo}
          setDeleNodeInfo={setDeleNodeInfo}
          visibility={deleteNodeInfo.visibility}
          onNodesDelete={onNodesDelete}
        />
      )}
    </ReactFlow>
  )
}

function LowCodeWrapper() {
  const { saveCanvas } = LowCodeStore()
  const nodes = LowCodeStore(state => state.nodes)
  const edges = LowCodeStore(state => state.edges)
  const platformsId = (useLocation() as LoactionState).state?.id
  // 首页获取目标机详情
  const getModelListDetails = LeftListStore(state => state.getModelListDetails)
  const listenBeforeLoad = React.useCallback(() => {
    if (platformsId) {
      saveCanvas(platformsId)
    }
  }, [platformsId, saveCanvas])
  useEventListener('beforeunload', listenBeforeLoad)
  useEffect(() => {
    getModelListDetails(platformsId)
    return () => {
      listenBeforeLoad()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <ReactFlowProvider>{nodes.length && <ReactFlowPro nodes={nodes} edges={edges} />}</ReactFlowProvider>
}

export default LowCodeWrapper
