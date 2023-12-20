import React, { useEffect } from 'react'
import { Node, Edge, Position, useReactFlow } from 'reactflow'
import { stratify, tree } from 'd3-hierarchy'

// the layout direction (T = top, R = right, B = bottom, L = left, TB = top to bottom, ...)
export type Direction = 'TB' | 'LR' | 'RL' | 'BT'

export type Options = {
  direction: Direction
}

const positionMap: Record<string, Position> = {
  T: Position.Top,
  L: Position.Left,
  R: Position.Right,
  B: Position.Bottom
}

const getPosition = (x: number, y: number, direction: Direction) => {
  switch (direction) {
    case 'LR':
      return { x: y, y: x }
    case 'RL':
      return { x: -y, y: -x }
    case 'BT':
      return { x: -x, y: -y }
    default:
      return { x, y }
  }
}

// initialize the tree layout (see https://observablehq.com/@d3/tree for examples)
const layout = tree<Node>()
  .nodeSize([200, 200])
  // the node size configures the spacing between the nodes ([width, height])
  // this is needed for creating equal space between all nodes
  .separation(() => 1)

const direction = 'TB'

function useInitAutoLayout(nodes: Node[], edges: Edge[]) {
  const { getNodes, getEdges, setNodes, setEdges, fitView } = useReactFlow()
  const [tmEdges, setTmEdges] = React.useState<any[]>([])
  const [tmNodes, setTmNodes] = React.useState<any[]>([])
  useEffect(() => {
    // only run the layout if there are nodes and they have been initialized with their dimensions
    if (nodes?.length > 0) {
      const hierarchy = stratify<Node>()
        .id(d => d.id)
        // get the id of each node by searching through the edges
        // this only works if every node has one connection
        .parentId((d: Node) => edges.find((e: Edge) => e.target === d.id)?.source)(nodes)
      // run the layout algorithm with the hierarchy data structure

      const root = layout(hierarchy)
      const nodeArray = nodes.map(node => {
        // find the node in the hierarchy with the same id and get its coordinates
        const { x, y } = root.find(d => d.id === node.id) || {
          x: node.position.x,
          y: node.position.y
        }
        return {
          ...node,
          sourcePosition: positionMap[direction[1]],
          targetPosition: positionMap[direction[0]],
          position: getPosition(x, y, direction),
          style: { opacity: 1 }
        }
      })
      const edgesArray = edges.map(edge => ({ ...edge, style: { opacity: 1 } }))
      setTmEdges(edgesArray)
      setTmNodes(nodeArray)
    }

    // set the React Flow nodes with the positions from the layout\
  }, [getNodes, getEdges, setNodes, setEdges, fitView, nodes, edges])
  return { nodes: tmNodes, edges: tmEdges }
}

export default useInitAutoLayout
