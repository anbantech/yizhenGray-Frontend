import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, message } from 'antd'
import ReactFlow, {
  Background,
  BackgroundVariant,
  ConnectionLineType,
  useReactFlow,
  Edge,
  Node,
  NodeTypes,
  Panel,
  ReactFlowProvider,
  getOutgoers,
  useNodesInitialized
} from 'reactflow'
import { useLocation } from 'react-router'
import { useEventListener } from 'ahooks-v2'
import DeleteNodeModal from 'Src/components/Modal/nodeDraw/deleteNodeMoal'
import { AlignLeftOutlined } from '@ant-design/icons'
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
import CustomRegisterNode from '../../ModelingMaterials/CustomRegisterNode'
import { useLayoutedElements } from '../../ModelingMaterials/useElkLayout'

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
  setEdgesAndNodes: state.setEdgesAndNodes,
  setEdges: state.setEdges,
  setNodes: state.setNodes,
  saveCanvas: state.saveCanvas
})

const nodeTypes: NodeTypes = {
  TargetNode: CustomTargetNode,
  TimerNode: CustomTimerNode,
  HandlerNode: CustomHandlerNode,
  registerNode: CustomRegisterNode,
  peripheralNode: CustomPeripheralNode
}

// 保持原点在屏幕中心
// const nodeOrigin: NodeOrigin = [0.5, 0.5]

const options = {
  includeHiddenNodes: false
}

function ReactFlowPro({ edges, nodes }: ExpandCollapseExampleProps) {
  const platform_id = LeftAndRightStore(state => state.platform_id)
  const nodesInitialized = useNodesInitialized(options)
  const tabs = LeftListStore(state => state.tabs)
  const {
    addEdge,
    setEdges,
    setNodes,
    setDeleNodeInfo,
    onNodesChange,
    onEdgesChange,
    createNode,
    saveCanvas,
    // onEdgeUpdate,
    layout,
    setEdgesAndNodes,
    updatePositionNode,
    deleteNodeInfo
  } = LowCodeStore(selector)

  // target is the node that the node is dragged over
  const [target, setTarget] = useState<any>(null)
  const selectId = LeftAndRightStore(state => state.selectLeftId)

  const dragRef = React.useRef<any>(null)
  const { getNode, setCenter } = useReactFlow()
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)
  const { getList } = LeftListStore()

  const ref = React.useRef(null)
  const nodeData = useMemo(() => {
    return nodes
  }, [nodes])

  const edgesData = useMemo(() => {
    return edges
  }, [edges])

  const { getLayoutedElements } = useLayoutedElements(setNodes)

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
        return message.warn('该节点已经存在画布中,无法重复添加')
      }

      // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10  but now we use project Api
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX + 50,
        y: event.clientY + 50
      })

      const matchingNode = nodes.find(node => {
        return node.position.x === position.x && node.position.y === position.y
      })

      if (matchingNode) {
        return message.warn('此节点放置位置,与其他节点重叠')
      }

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

  const onNodeDragStart = (evt: any, node: any) => {
    dragRef.current = node
  }

  // 当节点停止拖拽时
  const onNodeDragStop = React.useCallback(() => {
    if (target) {
      updatePositionNode(target, dragRef.current)
    }
    setTarget(null)
    dragRef.current = null
  }, [target, updatePositionNode])

  const onNodeDrag = React.useCallback(
    (evt: any, node: any) => {
      const centerX = node.position.x + node.width / 2
      const centerY = node.position.y + node.height / 2
      // find a node where the center point is inside
      // eslint-disable-next-line array-callback-return
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
      })
      setTarget(targetNode)
    },
    [nodes]
  )

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

  //  弹出框删除
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
    async (deleted, error_code?: any) => {
      if (deleted[0].data.flag === 5) return
      if (deleted.length === 1 && deleted[0].data.flag === 2) {
        const parent_id = nodeData.filter(item => item.id === deleted[0].id)
        await LeftAndRightStore.getState().getDataHandlerDetail(parent_id[0].data.parentId)
        await LeftAndRightStore.getState().updateHandlerData(true, { register_id: null })
      }
      getDeleteNodeAndAdge(deleted)
      const deleteNodeArray = deleteNodeRef.current.concat(deleted).flat(Infinity)
      const collectNode: any[] = []

      const node = nodeData
        .map((Node1: Node) => {
          const matchingItem = error_code?.find((item2: any) => Node1.id === String(item2.id))
          if (matchingItem) {
            // eslint-disable-next-line no-param-reassign
            Node1.data.error_code = matchingItem.error_code
          }
          return Node1
        })
        .filter(item => {
          return !deleteNodeArray.some(data => {
            if (data.data.flag === 3 && item.id === data.id) {
              collectNode.push(data.id)
            }
            return data.id === item.id
          })
        })

      if (collectNode.length >= 1) {
        await LeftAndRightStore.getState().getDataHandlerDetail(collectNode[0])
        await LeftAndRightStore.getState().updateHandlerData(true, {
          register_id: null,
          peripheral_id: null
        })
        // await LeftAndRightStore.getState().getDataHandlerDetail(collectNode[0])
      }

      const edge = edgesData.filter(item => {
        return !deleteNodeArray.some(data => data.id === item.target)
      })
      if (platform_id) {
        setEdgesAndNodes(node, edge, String(platform_id))
        await LeftAndRightStore.getState().setSelect(platform_id, 5)
      }
      await getList(tabs)
    },
    [getDeleteNodeAndAdge, nodeData, edgesData, platform_id, getList, setEdgesAndNodes, tabs]
  )

  // 线条删除 100%
  const onCanvasEdgesDelete = useCallback(
    async Edge => {
      const targetId = Edge[0].target // end
      const sourceId = Edge[0].source // begin
      const targetNode = nodeData.find(item => item.id === targetId)
      const newEdges = edgesData.filter(e => e.target !== targetId)
      setEdges(newEdges)

      // 删除外设--->数据处理器  需要更新数据处理器的外设 寄存器信息
      if (targetNode?.data.flag === 3) {
        // 删除寄存器节点
        const newNodeData = nodeData.filter((item: any) => item.data?.parentId !== targetId)
        setNodes(newNodeData)
        // 1.由于后端接口适配问题,现在删除数据处理器和外设的线 必须要 获取数据处理器详情
        await LeftAndRightStore.getState().getDataHandlerDetail(targetId)
        // 2.调用数据处理器更新接口,清空寄存器信息
        await LeftAndRightStore.getState().updateHandlerData(true, { register_id: null, peripheral_id: null })

        // await LeftAndRightStore.getState().getDataHandlerDetail(targetId)
        return saveCanvas(String(platform_id))
      }

      // 删除数据处理器--->寄存器  需要更新数据处理器的寄存器信息 并且删除寄存器节点
      if (targetNode?.data.flag === 2) {
        // 0.删除此节点,更新画布
        const newNodeData = nodeData.filter(item => item.id !== targetId)
        setNodes(newNodeData)

        // 1.由于后端接口适配问题,现在删除数据处理器和外设的线 必须要 获取数据处理器详情
        await LeftAndRightStore.getState().getDataHandlerDetail(sourceId)
        // 2.调用数据处理器更新接口,清空寄存器信息
        await LeftAndRightStore.getState().updateHandlerData(true, { register_id: null })

        // await LeftAndRightStore.getState().getDataHandlerDetail(sourceId)
        return saveCanvas(String(platform_id))
      }
    },
    [edgesData, nodeData, platform_id, saveCanvas, setEdges, setNodes]
  )

  const centerNode = useCallback(
    id => {
      const node = getNode(id)
      if (node) {
        const { x, y } = node.position
        const { width } = node
        const { height } = node
        if (width && height) {
          const centerX = x + width / 2
          const centerY = y + height / 2
          setCenter(centerX, centerY, { duration: 300, zoom: 1 })
        }
      }
    },
    [getNode, setCenter]
  )

  useEffect(() => {
    if (selectId && nodesInitialized) {
      centerNode(String(selectId))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectId, nodesInitialized])

  const layoutChange = React.useCallback(() => {
    if (layout(nodeData)) {
      getLayoutedElements({ 'elk.algorithm': 'layered', 'elk.direction': 'DOWN' })
    }
  }, [getLayoutedElements, layout, nodeData])

  return (
    <ReactFlow
      ref={ref}
      fitView
      onDrop={onDrop}
      nodes={nodeData}
      edges={edgesData}
      onConnect={addEdge}
      nodeTypes={nodeTypes}
      onNodeDrag={onNodeDrag}
      onDragOver={onDragOver}
      proOptions={proOptions}
      onNodeClick={onNodeClick}
      // onEdgeUpdate={onEdgeUpdate}
      deleteKeyCode={['Delete', 'Backspace']}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onInit={setReactFlowInstance}
      onNodesDelete={onNodesDelete}
      fitViewOptions={{ minZoom: 1 }}
      onNodeDragStop={onNodeDragStop}
      onNodeDragStart={onNodeDragStart}
      onEdgesDelete={onCanvasEdgesDelete}
      connectionLineType={ConnectionLineType.SmoothStep}
    >
      <Background variant={BackgroundVariant.Dots} gap={24} size={1} />
      <CustomControls />
      <Panel position='top-right'>
        <Button style={{ borderRadius: '4px' }} onClick={layoutChange}>
          <span>
            <AlignLeftOutlined style={{ marginRight: '15px' }} />
            一键对齐
          </span>
        </Button>
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
  }, [platformsId])
  return <ReactFlowProvider>{nodes.length && <ReactFlowPro nodes={nodes} edges={edges} />}</ReactFlowProvider>
}

export default LowCodeWrapper
