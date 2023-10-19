import { Button } from 'antd'
import dagre from 'dagre'
import { stratify, tree, hierarchy } from 'd3-hierarchy'
import React from 'react'
import ReactFlow, {
  Background,
  SelectionMode,
  BackgroundVariant,
  Controls,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  useOnSelectionChange,
  useReactFlow,
  getOutgoers,
  ConnectionLineType,
  Panel
} from 'reactflow'
import 'reactflow/dist/style.css'

const position = { x: 0, y: 0 }
const edgeType = 'smoothstep'

// const initialNodes = [
//   {
//     id: '1',
//     type: 'input',
//     data: { label: 'input' },
//     position: { x: 0, y: 0 }
//   },
//   {
//     id: '2',
//     data: { label: 'node 2' },
//     position: { x: 0, y: 100 }
//   },
//   {
//     id: '2a',
//     data: { label: 'node 2a' },
//     position: { x: 0, y: 200 }
//   },
//   {
//     id: '2b',
//     data: { label: 'node 2b' },
//     position: { x: 0, y: 300 }
//   },
//   {
//     id: '2c',
//     data: { label: 'node 2c' },
//     position: { x: 0, y: 400 }
//   },
//   {
//     id: '2d',
//     data: { label: 'node 2d' },
//     position: { x: 0, y: 500 }
//   },
//   {
//     id: '3',
//     data: { label: 'node 3' },
//     position: { x: 200, y: 100 }
//   }
// ]
// const initialEdges = [
//   { id: 'e12', source: '1', target: '2', type: edgeType, animated: true },
//   { id: 'e13', source: '1', target: '3', type: edgeType, animated: true },
//   { id: 'e22a', source: '2', target: '2a', type: edgeType, animated: true },
//   { id: 'e22b', source: '2', target: '2b', type: edgeType, animated: true },
//   { id: 'e22c', source: '2', target: '2c', type: edgeType, animated: true },
//   { id: 'e2c2d', source: '2c', target: '2d', type: edgeType, animated: true },
//   { id: 'e45', source: '4', target: '5', type: edgeType, animated: true },
//   { id: 'e56', source: '5', target: '6', type: edgeType, animated: true },
//   { id: 'e57', source: '5', target: '7', type: edgeType, animated: true }
// ]

const treeData = {
  name: '2',
  id: 1,
  children: [
    {
      id: 1 - 1,
      name: 'Cain1'
    },
    {
      id: 1 - 2,
      name: 'Cain2'
    }
  ]
}
const root = hierarchy(treeData)
const treeLayout = tree().size([400, 200]) // 设置树形图的宽度和高度
treeLayout(root as any)

const panOnDrag = [1, 2]
const dagreGraph = new dagre.graphlib.Graph()
dagreGraph.setDefaultEdgeLabel(() => ({}))

const nodeWidth = 172
const nodeHeight = 36

const getLayoutedElements = (nodes: any, edges: any, direction = 'TB') => {
  const isHorizontal = direction === 'LR'
  dagreGraph.setGraph({ rankdir: direction })

  nodes.forEach((node: any) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
  })

  edges.forEach((edge: any) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  dagre.layout(dagreGraph)

  nodes.forEach((node: any) => {
    const nodeWithPosition = dagreGraph.node(node.id)
    console.log(nodeWithPosition)
    node.targetPosition = isHorizontal ? 'left' : 'top'
    node.sourcePosition = isHorizontal ? 'right' : 'bottom'
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y
    }

    return node
  })

  return { nodes, edges }
}

const g = tree()

const getLayoutedElementOs = (nodes: any, edges: any, options) => {
  if (nodes.length === 0) return { nodes, edges }

  const { width, height } = document.querySelector(`[data-id="${nodes[0].id}"]`)?.getBoundingClientRect()
  const hierarchy = stratify()
    .id(node => node.id)
    .parentId(node => edges.find(edge => edge.target === node.id)?.source)
  const root = hierarchy(nodes)
  const layout = g.nodeSize([width * 2, height * 2])(root)

  return {
    nodes: layout.descendants().map(node => ({ ...node.data, position: { x: node.x, y: node.y } })),
    edges
  }
}

const LayoutFlow = () => {
  const { fitView } = useReactFlow()
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes as any)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const onLayout = React.useCallback(
    direction => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, direction)
      setNodes([...layoutedNodes])
      setEdges([...layoutedEdges])
    },
    [nodes, edges, setNodes, setEdges]
  )

  const onLayouts = React.useCallback(
    (nodes, edges, direction = 'LR') => {
      console.log(nodes, edges)
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElementOs(nodes, edges, direction)
      setNodes([...layoutedNodes])
      setEdges([...layoutedEdges])
      window.requestAnimationFrame(() => {
        fitView()
      })
    },
    [setNodes, setEdges, fitView]
  )
  const setTreeTopoData = React.useCallback(
    (nodes, edges, direction = 'LR') => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, direction)
      console.log(layoutedNodes)
      setNodes([...layoutedNodes])
      setEdges([...layoutedEdges])
      window.requestAnimationFrame(() => {
        fitView()
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nodes, edges]
  )

  const onConnect = () => {
    // 禁止手动连线
    return false
  }
  // 获取筛选节点数据
  const SelectionChangeLogger = () => {
    useOnSelectionChange({
      // onChange: ({ nodes, edges }) => console.log('changed selection', nodes, edges)
    })
    return null
  }
  // 框选删除更新界面
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
      onLayouts(node, edge)
    },
    [fn, nodes, edges, onLayouts]
  )

  React.useEffect(() => {
    setTreeTopoData(nodes, edges)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      panOnDrag={panOnDrag}
      onNodesDelete={onNodesDelete}
      connectionLineType={ConnectionLineType.SmoothStep}
      selectionMode={SelectionMode.Partial}
      panOnScroll
      selectionOnDrag
      fitView
    >
      <Background variant={BackgroundVariant.Dots} gap={24} size={1} />
      <Controls />
      <Panel position='top-right'>
        <Button role='time' onClick={() => onLayout('TB')}>
          vertical layout
        </Button>
        <Button role='time' onClick={() => onLayout('LR')}>
          horizontal layout
        </Button>
      </Panel>
      <SelectionChangeLogger />
    </ReactFlow>
  )
}
function Flow() {
  return (
    <div style={{ width: '90vw   ', height: '80vh' }}>
      <ReactFlowProvider>
        <LayoutFlow />
      </ReactFlowProvider>
    </div>
  )
}

export default Flow
