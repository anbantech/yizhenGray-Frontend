/* eslint-disable no-param-reassign */
import { useMemo } from 'react'
import { Node, Edge, Position } from 'reactflow'
import { HierarchyNode, HierarchyPointNode, stratify, tree } from 'd3-hierarchy'
import { ExpandCollapseNode } from './types'

export type UseExpandCollapseOptions = {
  layoutNodes?: boolean
  treeWidth?: number
  treeHeight?: number
}
const getPosition = (x: number, y: number, direction: any) => {
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

function isHierarchyPointNode(
  pointNode: HierarchyNode<ExpandCollapseNode> | HierarchyPointNode<ExpandCollapseNode>
): pointNode is HierarchyPointNode<ExpandCollapseNode> {
  return (
    typeof (pointNode as HierarchyPointNode<ExpandCollapseNode>).x === 'number' &&
    typeof (pointNode as HierarchyPointNode<ExpandCollapseNode>).y === 'number'
  )
}
const positionMap: Record<string, Position> = {
  T: Position.Top,
  L: Position.Left,
  R: Position.Right,
  B: Position.Bottom
}
const direction = 'LR'
function useExpandCollapse(
  nodes: Node[],
  edges: Edge[],
  { layoutNodes = true, treeWidth = 240, treeHeight = 130 }: UseExpandCollapseOptions = {}
): { nodes: Node[]; edges: Edge[] } {
  return useMemo(() => {
    const hierarchy = stratify<ExpandCollapseNode>()
      .id(d => d.id)
      .parentId((d: Node) => edges.find((e: Edge) => e?.target === d.id)?.source)(nodes)

    hierarchy.descendants().forEach((d: any) => {
      d.data.data.expandable = !!d.children?.length
      d.children = d.data.data.expanded ? d.children : undefined
    })

    const layout = tree<ExpandCollapseNode>()
      .nodeSize([treeWidth, treeHeight])
      .separation(() => 1)

    const root = layoutNodes ? layout(hierarchy) : hierarchy

    return {
      nodes: root.descendants().map(d => ({
        ...d.data,
        // This bit is super important! We *mutated* the object in the `forEach`
        // above so the reference is the same. React needs to see a new reference
        // to trigger a re-render of the node.
        data: { ...d.data.data },
        sourcePosition: positionMap[direction[1]],
        targetPosition: positionMap[direction[0]],
        position: isHierarchyPointNode(d) ? getPosition(d.x, d.y, 'LR') : getPosition(d.data.position.x, d.data.position.y, 'LR')
      })),
      edges: edges.filter(edge => root.find(h => h.id === edge.source) && root.find(h => h.id === edge.target))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges, layoutNodes, treeWidth, treeHeight, nodes.length, edges.length])
}

export default useExpandCollapse
