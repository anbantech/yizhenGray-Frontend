import { throwErrorMessage } from 'Src/util/common'
// eslint-disable-next-line import/extensions
import ELK from 'elkjs/lib/elk.bundled.js'
import { useCallback } from 'react'
import { useReactFlow } from 'reactflow'

const elk = new ELK()
export const useLayoutedElements = (setNodes: any) => {
  const { fitView, getEdges, getNodes } = useReactFlow()
  const defaultOptions = {
    'elk.algorithm': 'layered',
    'elk.layered.spacing.nodeNodeBetweenLayers': 100,
    'elk.spacing.nodeNode': 80,
    'elk.layered.nodePlacement.bk.fixedAlignment': 'BALANCED'
    // 'nodePlacement.strategy': 'BRANDES_KOEPF'
  }
  // Extract unique node IDs from edges
  // const edgeNodeIds = new Set(edges.flatMap(edge => [edge.source, edge.target]))

  // // Filter nodes that have corresponding edges
  // const nodesWithEdges = nodes.filter(node => edgeNodeIds.has(node.id))
  console.log(getEdges())
  const getLayoutedElements = useCallback(
    options => {
      const layoutOptions = { ...defaultOptions, ...options }
      const graph = {
        id: 'root',
        layoutOptions,
        children: getNodes() as any,
        edges: getEdges() as any
      }

      elk
        .layout(graph)
        .then(({ children }) => {
          // By mutating the children in-place we saves ourselves from creating a
          // needless copy of the nodes array.
          children?.forEach((node: any) => {
            // eslint-disable-next-line no-param-reassign
            node.position = { x: node.x, y: node.y }
          })
          setNodes(children)
          window.requestAnimationFrame(() => {
            fitView()
          })
          return '1'
        })
        .catch(error => {
          throwErrorMessage(error)
        })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return { getLayoutedElements }
}
