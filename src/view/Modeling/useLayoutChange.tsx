import { useCallback, useMemo } from 'react'
import { Node, Edge } from 'react-flow-renderer'
import { stratify, tree } from 'd3-hierarchy'
import { Position } from 'reactflow'

// the layout direction (T = top, R = right, B = bottom, L = left, TB = top to bottom, ...)
export type Direction = 'TB' | 'LR' | 'RL' | 'BT'

export type Options = {
  direction: Direction
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

const layout = tree<Node>()
  .nodeSize([200, 200])
  // the node size configures the spacing between the nodes ([width, height])
  // this is needed for creating equal space between all nodes
  .separation(() => 1)

const positionMap: Record<string, Position> = {
  T: Position.Top,
  L: Position.Left,
  R: Position.Right,
  B: Position.Bottom
}

function layoutGraph(nodes: Node[], edges: Edge[], changeView: boolean, { direction }: Options) {
  const hierarchy = stratify()
    .id((d: any) => d.id)
    .parentId((d: Node) => edges.find((e: Edge) => e.target === d.id)?.source)(
    nodes
      .filter(n => !n.hidden)
      .map(item => {
        console.log(item)
        return {
          ...item
        }
      })
  )

  const root = layout(hierarchy as any)

  return root.descendants().map((d: any) => {
    return {
      ...d.data,
      sourcePosition: positionMap[direction[1]],
      targetPosition: positionMap[direction[0]],
      position: getPosition(d.x, d.y, direction),
      opacity: 1
    }
  })
}

function useLayout(nodes: Node[], edges: Edge[], changeView: boolean, options: Options) {
  return useMemo(() => {
    if (nodes.length >= 1) {
      return layoutGraph(nodes, edges, changeView, options)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges, options, changeView])
}

export default useLayout
