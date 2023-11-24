import React, { useCallback, useEffect } from 'react'
import { useEventListener } from 'ahooks-v2'
import ReactFlow, { ReactFlowProvider, Background, Node, Edge, NodeTypes, SelectionMode, BackgroundVariant, Controls, getOutgoers } from 'reactflow'
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

import { AttributesType } from '../../Store/MapStore'
import { publicAttributes, useLeftModelDetailsStore } from '../../Store/ModelStore'

import { getModelListDetails } from '../ModelingRight/ModelingRightCompoents'

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

function ReactFlowPro({ edgeStore, nodeStore, treeWidth = 120, treeHeight = 250, animationDuration = 300 }: ExpandCollapseExampleProps) {
  const rightAttrubutesMap = RightDetailsAttributesStore(state => state.rightAttrubutesMap)
  const platform_id = MiddleStore(state => state.platform_id)
  const setTabs = useLeftModelDetailsStore(state => state.setTabs)
  const setTypeDetailsAttributes = RightDetailsAttributesStore(state => state.setTypeDetailsAttributes)
  const onEdgesChange = MiddleStore(state => state.onEdgesChange)
  const onNodesChange = MiddleStore(state => state.onNodesChange)
  const upDateNodesAndEdges = MiddleStore(state => state.upDateNodesAndEdges)
  const setMenuStatus = MiddleStore(state => state.setMenuStatus)
  const setOpenMenu = MiddleStore(state => state.setOpenMenu)
  const upDateLeftExpandArrayFn = MiddleStore(state => state.upDateLeftExpandArrayFn)
  const deleteInfo = MiddleStore(state => state.deleteInfo)
  const saveCanvas = MiddleStore(state => state.saveCanvas)
  const tabs = useLeftModelDetailsStore(state => state.tabs)
  const deleteTreeNode = MiddleStore(state => state.deleteTreeNode)
  const ref = React.useRef(null)

  const { nodes: visibleNodes, edges: visibleEdges } = useExpandCollapse(nodeStore, edgeStore, {
    treeWidth,
    treeHeight
  })

  const { nodes: animatedNodes } = useAnimatedNodes(visibleNodes, {
    animationDuration
  })
  // console.log(visibleEdges)
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
      saveCanvas([...node], [...edge], platform_id as string)
      if (platform_id) getModelListDetails(+platform_id, tabs)
      upDateNodesAndEdges([...node], [...edge])
      setTypeDetailsAttributes('Target', null)
      deleteTreeNode(false, { node: [] })
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
      const { flag, id, builtIn } = node.data
      if (builtIn && platform_id) {
        setTabs('boardLevelPeripherals')
        getModelListDetails(+platform_id, 'boardLevelPeripherals')
      }
      setOpenMenu()
      rightAttrubutesMap(AttributesType[flag as keyof typeof AttributesType], id)
      const res = getParentNode(node)
      upDateLeftExpandArrayFn(res)
    },
    [setOpenMenu, rightAttrubutesMap, getParentNode, upDateLeftExpandArrayFn, setTabs, platform_id]
  )

  const keyDownHandler = React.useCallback(
    (ev: KeyboardEvent) => {
      if (ev.code !== 'Delete') return
      const { node } = deleteInfo
      if (!node?.node?.length) return
      deleteTreeNode(true)
    },
    [deleteInfo, deleteTreeNode]
  )

  useEventListener('keydown', keyDownHandler)

  const onSelectionChange = React.useCallback(
    (params: { nodes: Node[]; edges: Edge[] }) => {
      // console.log(params)
      const { nodes, edges } = params
      if (nodes.length === 0) return deleteTreeNode(false, { node: [], edge: [] })
      // 不符合要求的节点
      const notNodeArray: Node[] = []
      const node = nodes.filter((item: Node) => {
        if ([1, 2].includes(item.data.flag) && item.data.builtIn) {
          notNodeArray.push(item)
        }
        return [1, 2].includes(item.data.flag) && !item.data.builtIn
      })
      const edge = edges.filter((item: Edge) => {
        return !notNodeArray.find(node => {
          return node.id === item.target
        })
      })
      deleteTreeNode(false, { node, edge })
    },
    [deleteTreeNode]
  )

  return (
    <div className={styles.container}>
      {animatedNodes && (
        <ReactFlow
          fitView
          ref={ref}
          deleteKeyCode={null}
          nodes={animatedNodes}
          edges={visibleEdges}
          onNodeClick={onNodeClick}
          nodesFocusable={Boolean(1)}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          proOptions={proOptions}
          nodeTypes={nodeTypes}
          zoomOnDoubleClick={false}
          selectionOnDrag
          panOnScroll
          elevateNodesOnSelect
          onPaneClick={onPaneClick}
          onNodeContextMenu={onNodeContextMenu}
          panOnDrag={panOnDrag}
          selectionMode={SelectionMode.Partial}
          onSelectionChange={onSelectionChange}
          minZoom={-Infinity}
          maxZoom={Infinity}
        >
          <Background variant={BackgroundVariant.Dots} gap={24} size={1} />
          <Controls />
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
