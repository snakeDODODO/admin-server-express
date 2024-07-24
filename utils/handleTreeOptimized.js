const departmentChange = {
  handleTreeOptimized(data) {
    // 1. 构建节点映射
    const nodeMap = {}
    data.forEach((node) => {
      node.children = []
      nodeMap[node.id] = node
    })

    // 辅助函数：递归地对子节点进行排序  
  function sortChildren(nodes) {  
    nodes.forEach((node) => {  
      // 对当前节点的子节点进行排序  
      node.children.sort((a, b) => a.sort - b.sort);  
      // 递归地对子节点的子节点进行排序  
      sortChildren(node.children);  
    });  
  }  

    // 2. 构建父子关系、排序和去重，并构建根节点列表
    const rootNodes = []
    data.forEach((node) => {
      const parent = nodeMap[node.parent_id]
      if (parent) {
        // 在添加子节点时进行排序和去重
        if (!parent.children.find((child) => child.id === node.id)) {
          parent.children.push(node)
        }
      } else {
        rootNodes.push(node)
      }
    })

    // 排序根节点和子节点
    // 排序根节点  
    rootNodes.sort((a, b) => a.sort - b.sort);  
  
    // 对根节点的子节点及其所有后代进行排序  
    sortChildren(rootNodes);  
  
    return rootNodes
  },
}

module.exports = departmentChange
