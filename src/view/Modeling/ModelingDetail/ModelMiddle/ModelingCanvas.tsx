import React, { useCallback, useEffect } from 'react'
import { useEventListener } from 'ahooks-v2'
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Node,
  Edge,
  NodeTypes,
  BackgroundVariant,
  getOutgoers,
  useReactFlow,
  useNodesInitialized
} from 'reactflow'
import { useLocation } from 'react-router'
import DeleteNodeModal from 'Src/components/Modal/nodeDraw/deleteNodeMoal'
import useAnimatedNodes from '../../ModelingMaterials/useAnimatedNodes'
import useExpandCollapse from '../../ModelingMaterials/useExpandCollapse'

import 'reactflow/dist/style.css'
import styles from '../../model.less'
import { LoactionState } from '../ModelLeft/ModelingLeftIndex'

import { RightDetailsAttributesStore } from '../../Store/ModeleRightListStore/RightListStoreList'
import CustomNode from '../../ModelingMaterials/CustomNode'
import CustomTargetNode from '../../ModelingMaterials/CustomTargetNode'

import PherilarlCustomNode from '../../ModelingMaterials/PherilarlCustomNode'

import CustomRegisterNode from '../../ModelingMaterials/CustomRegisterNode'
import { MiddleStore } from '../../Store/ModelMiddleStore/MiddleStore'

import { AttributesType, titleFlagMap } from '../../Store/MapStore'
import { formItemParamsCheckStore, publicAttributes, useLeftModelDetailsStore } from '../../Store/ModelStore'

import { getModelListDetails } from '../ModelingRight/ModelingRightCompoents'
import CustomControls from '../../ModelingMaterials/CustomControls'
// import CustomMenu from '../../ModelingMaterials/CustomMenu'

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
// const panOnDrag = [1, 2]
const options = {
  includeHiddenNodes: false
}
function ReactFlowPro({ edgeStore, nodeStore, treeWidth = 205, treeHeight = 125, animationDuration = 200 }: ExpandCollapseExampleProps) {
  const rightAttributeMap = RightDetailsAttributesStore(state => state.rightAttributeMap)
  const platform_id = MiddleStore(state => state.platform_id)
  const nodesInitialized = useNodesInitialized(options)
  const { getNode, setCenter } = useReactFlow()
  const setTabs = useLeftModelDetailsStore(state => state.setTabs)
  const setTypeDetailsAttributes = RightDetailsAttributesStore(state => state.setTypeDetailsAttributes)
  const onEdgesChange = MiddleStore(state => state.onEdgesChange)
  const onConnect = MiddleStore(state => state.onConnect)
  const onNodesChange = MiddleStore(state => state.onNodesChange)
  const focusNodeId = RightDetailsAttributesStore(state => state.focusNodeId)
  const upDateNodesAndEdges = MiddleStore(state => state.upDateNodesAndEdges)
  const setMenuStatus = MiddleStore(state => state.setMenuStatus)
  const setOpenMenu = MiddleStore(state => state.setOpenMenu)
  const upDateLeftExpandArrayFn = MiddleStore(state => state.upDateLeftExpandArrayFn)
  const deleteInfo = MiddleStore(state => state.deleteInfo)
  const saveCanvas = MiddleStore(state => state.saveCanvas)
  const tabs = useLeftModelDetailsStore(state => state.tabs)
  const deleteTreeNode = MiddleStore(state => state.deleteTreeNode)
  const ref = React.useRef(null)
  const unSelect = formItemParamsCheckStore(state => state.unSetTabs)

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
      event.stopPropagation()
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
      // eslint-disable-next-line array-callback-return
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
    (deleted, error_code) => {
      getDeleteNodeAndAdge(deleted)
      const deleteNodeArray = deleteNodeRef.current.concat(deleted).flat(Infinity)
      const node = nodeStore
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

      const edge = edgeStore.filter(item => {
        return !deleteNodeArray.some(data => data.id === item.target)
      })

      saveCanvas([...node], [...edge], platform_id as string)
      if (platform_id) getModelListDetails(+platform_id, tabs)
      upDateNodesAndEdges([...node], [...edge])
      setTypeDetailsAttributes('Target', null)
      return deleteTreeNode(false, { node: [] })
    },
    [getDeleteNodeAndAdge, nodeStore, edgeStore, saveCanvas, platform_id, tabs, upDateNodesAndEdges, setTypeDetailsAttributes, deleteTreeNode]
  )

  const getParentNode = React.useCallback(
    (node: Node<any, string | undefined>) => {
      const selectId: string[] = []

      const getAllParentId = (id: string, item: Node[]) => {
        item.map(element => {
          if (element.id === id && id !== element.data.parentId) {
            selectId.push(element.id)
            if (element.data.parentId) {
              getAllParentId(element.data.parentId, animatedNodes)
            }
            return
          }
          return []
        })
      }
      getAllParentId(node.id, animatedNodes)

      return selectId
    },
    [animatedNodes]
  )

  const onNodeClick = useCallback(
    (event, node) => {
      event.stopPropagation()
      event.preventDefault()
      unSelect()
      const { flag, id, builtIn } = node.data
      if (platform_id) {
        if (flag === 1) {
          setTabs(builtIn ? 'boardLevelPeripherals' : 'customMadePeripheral')
          getModelListDetails(+platform_id, builtIn ? 'boardLevelPeripherals' : 'customMadePeripheral')
        } else if (flag === 3) {
          setTabs('dataHandlerNotReferenced')
          getModelListDetails(+platform_id, 'dataHandlerNotReferenced')
        } else if (flag === 2) {
          setTabs(builtIn ? 'boardLevelPeripherals' : 'customMadePeripheral')
          getModelListDetails(+platform_id, builtIn ? 'boardLevelPeripherals' : 'customMadePeripheral')
        }
      }
      setOpenMenu()
      rightAttributeMap(AttributesType[flag as keyof typeof AttributesType], id)
      const res = getParentNode(node)
      upDateLeftExpandArrayFn(res)
    },
    [unSelect, platform_id, setOpenMenu, rightAttributeMap, getParentNode, upDateLeftExpandArrayFn, setTabs]
  )

  const keyDownHandler = React.useCallback(
    (ev: KeyboardEvent) => {
      ev.stopPropagation()
      if (ev.code !== 'Delete') return
      const { node } = deleteInfo

      if (!node?.node?.length) return
      deleteTreeNode(true)
    },
    [deleteInfo, deleteTreeNode]
  )

  useEventListener('keydown', keyDownHandler, { target: ref })

  const listenBeforeLoad = React.useCallback(() => {
    if (platform_id) {
      saveCanvas(nodeStore, edgeStore, platform_id)
    }
  }, [platform_id, saveCanvas, nodeStore, edgeStore])

  useEventListener('beforeunload', listenBeforeLoad)

  const onSelectionChange = React.useCallback(
    (params: { nodes: Node[]; edges: Edge[] }) => {
      // console.log(params)
      const { nodes } = params

      if (nodes.length === 0) return deleteTreeNode(false, { node: [], edge: [] })
      // 不符合要求的节点
      const notNodeArray: Node[] = []

      const node = nodes.filter((item: Node) => {
        if ([1, 2].includes(item.data.flag) && item.data.builtIn) {
          notNodeArray.push(item)
        }
        return [1, 2, 3].includes(item.data.flag) && !item.data.builtIn
      })

      if (node.length === 1) {
        const nodeArray = [{ id: String(node[0].data.id), data: { flag: node[0].data.flag } }]
        const nodeInfo = {
          node: nodeArray,
          title: titleFlagMap[node[0].data.flag as keyof typeof titleFlagMap][0],
          content: `${titleFlagMap[node[0].data.flag as keyof typeof titleFlagMap][1]}${node[0].data.label}`
        }

        return deleteTreeNode(false, nodeInfo)
      }

      deleteTreeNode(false, { node })
    },
    [deleteTreeNode]
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
          setCenter(centerX, centerY, { duration: 200, zoom: 0.6 })
        }
      }
    },
    [getNode, setCenter]
  )

  useEffect(() => {
    if (focusNodeId && nodesInitialized) {
      centerNode(focusNodeId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusNodeId, nodesInitialized])

  return (
    <div className={styles.container}>
      {animatedNodes && (
        <ReactFlow
          fitView
          ref={ref}
          fitViewOptions={{ minZoom: 1 }}
          deleteKeyCode={null}
          nodes={animatedNodes}
          edges={visibleEdges}
          onNodeClick={onNodeClick}
          onConnect={onConnect}
          nodesFocusable={Boolean(1)}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          proOptions={proOptions}
          nodeTypes={nodeTypes}
          zoomOnDoubleClick={false}
          selectionOnDrag
          panOnScroll
          // elevateNodesOnSelect
          onPaneClick={onPaneClick}
          onNodeContextMenu={onNodeContextMenu}
          // panOnDrag={panOnDrag}
          // selectionMode={SelectionMode.Partial}
          onSelectionChange={onSelectionChange}
          minZoom={0.0001}
        >
          <Background variant={BackgroundVariant.Dots} gap={24} size={1} />
          <CustomControls />
        </ReactFlow>
      )}
      {deleteInfo.visibility && (
        <DeleteNodeModal deleteInfo={deleteInfo} deleteTreeNode={deleteTreeNode} visibility={deleteInfo.visibility} onNodesDelete={onNodesDelete} />
      )}
    </div>
  )
}

function ReactFlowWrapper() {
  const platformsId = (useLocation() as LoactionState).state?.id
  const platformsIdmemo = React.useMemo(() => platformsId, [platformsId])
  const getModelDetails = MiddleStore(state => state.getModelDetails)
  const nodeStore = MiddleStore(state => state.nodes)
  const edgeStore = MiddleStore(state => state.edges)
  const setPortList = publicAttributes(state => state.setPortList)

  useEffect(() => {
    if (platformsIdmemo) {
      setPortList()
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
