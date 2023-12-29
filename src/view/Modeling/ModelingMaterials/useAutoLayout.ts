import { Node, Edge, Position } from 'reactflow'
import { HierarchyNode, HierarchyPointNode, stratify, tree } from 'd3-hierarchy'
import { ExpandCollapseNode } from './types'

const positionMap: Record<string, Position> = {
  T: Position.Top,
  L: Position.Left,
  R: Position.Right,
  B: Position.Bottom
}

// the layout direction (T = top, R = right, B = bottom, L = left, TB = top to bottom, ...)
export type Direction = 'TB' | 'LR' | 'RL' | 'BT'

export type Options = {
  direction: Direction
}

const getPosition = (x: number, y: number, direction?: Direction) => {
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

const direction = 'TB'
// initialize the tree layout (see https://observablehq.com/@d3/tree for examples)

function isHierarchyPointNode(
  pointNode: HierarchyNode<ExpandCollapseNode> | HierarchyPointNode<ExpandCollapseNode>
): pointNode is HierarchyPointNode<ExpandCollapseNode> {
  return (
    typeof (pointNode as HierarchyPointNode<ExpandCollapseNode>).x === 'number' &&
    typeof (pointNode as HierarchyPointNode<ExpandCollapseNode>).y === 'number'
  )
}

function Layout(nodes: Node[], edges: Edge[]) {
  const hierarchy = stratify<ExpandCollapseNode>()
    .id(d => d.id)
    .parentId((d: Node) => edges.find((e: Edge) => e?.target === d.id)?.source)(nodes)

  const layout = tree<ExpandCollapseNode>()
    .nodeSize([200, 100])
    .separation(() => 1)

  const root = layout(hierarchy)

  return {
    nodeArray: root.descendants().map((d: any) => ({
      ...d.data,
      // This bit is super important! We *mutated* the object in the `forEach`
      // above so the reference is the same. React needs to see a new reference
      // to trigger a re-render of the node.
      data: { ...d.data.data },
      sourcePosition: positionMap[direction[1]],
      targetPosition: positionMap[direction[0]],
      position: isHierarchyPointNode(d) ? getPosition(d.x, d.y) : getPosition(d.data.position.x, d.data.position.y)
    })),
    edgesArray: edges.filter(edge => root.find(h => h.id === edge.source) && root.find(h => h.id === edge.target))
  }
}

export default Layout
