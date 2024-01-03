import TreeNodeLeaf from './treeNodeLeaf'
import TreeNodeRoot from './treeNodeRoot'

const TreeNodeSFC = () => {
  throw new Error(
    'TreeNode component can only be used by its attrs: Leaf, Root. eg: Try to use it as <TreeNode.Leaf>...</TreeNode.Leaf> or <TreeNode.Root>...</TreeNode.Root>.'
  )
}

TreeNodeSFC.Leaf = TreeNodeLeaf
TreeNodeSFC.Root = TreeNodeRoot

export default TreeNodeSFC
