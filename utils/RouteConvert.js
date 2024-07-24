const routeConvert = {
  // handleTreeOptimized(resourceList) {
  //   // 过滤数组，找到父id相同的数据 => 抽取的公共方法,参数也是公共抽取
  //   // resourceList需要多次查找,因为其是一个一维结构的数组,变成树形结构就要重复查找,干脆抽出来就不用在方法内部重复调用
  //   const getChildMenuItems = (parentId) => resourceList.filter((item) => item.parent_id === parentId)
  //   // 生成路由单对象并验证子路由是否存在然后决定是否递归（使用递归根据parent_id层层寻找）*
  //   const buildRoute = (menuItem) => {
  //     // 结构需要的值
  //     const { id, path, name, redirect, cache, affix, type, hidden, title, sort, icon, component } = menuItem
  //     // 构建并生成单个动态路由对象
  //     const route = {
  //       id,
  //       path,
  //       name,
  //       redirect,
  //       component, // 替换为实际的组件路径
  //       meta: {
  //         cache,
  //         affix,
  //         type,
  //         hidden,
  //         title,
  //         sort,
  //         icon,
  //       },
  //     }

  //     // 寻找当前父id对应的子路由id数组
  //     const children = getChildMenuItems(menuItem.id)
  //     // 找到则循环递归
  //     if (children.length > 0) {
  //       // 再次调用生成路由数组兼排序的方法追加数据
  //       route.children = buildRoutes(children)
  //     }

  //     return route
  //   }

  //   // 生成路由数组 =>
  //   // 1. 逐层查找对应id数组
  //   // 2. 对应id数组调用生成数组路由方法
  //   // 3. 数组路由方法中先排序,然后用map传入单个对象调用生成路由方法
  //   // 4. 生成单个路由对象方法会返回单个路由对象,还会调用外部过滤方法查找是否还有与当前id对应的子路由数据
  //   // 5. 有则再调用生成路由数组对象方法,递归调用 = 生成多个路由 => 生成单个路由,最终没有的时候就会层层返回
  //   // 6. 其中还会对每一层进行排序和去重
  //   // 7. 最终返回完整的属性结构对象
  //   const buildRoutes = (menuList) => {
  //     menuList.sort((a, b) => (b.sort || 0) - (a.sort || 0))
  //     // 使用map方法抽取单个对象调用生成单个对象路由方法
  //     const uniqueRoutes = []
  //     // 递归去重
  //     menuList.forEach((menuItem) => {
  //       const existingRouteIndex = uniqueRoutes.findIndex((route) => route.path === menuItem.path && route.name === menuItem.name)
  //       if (existingRouteIndex === -1) {
  //         uniqueRoutes.push(buildRoute(menuItem))
  //       } else {
  //         const existingRoute = uniqueRoutes[existingRouteIndex]
  //         if (menuItem.children && menuItem.children.length > 0) {
  //           existingRoute.children = buildRoutes([...existingRoute.children, ...menuItem.children])
  //         }
  //       }
  //     })

  //     return uniqueRoutes
  //   }

  //   // 启动，先找到顶级菜单，层层递归筛选
  //   const rootMenuItems = getChildMenuItems('0')
  //   // 找到的顶级菜单作为参数调用生成路由方法
  //   const vueRouterRoutes = buildRoutes(rootMenuItems)
  //   // 返回递归的生成数组结果
  //   return vueRouterRoutes
  // },
  handleTreeOptimized(data) {
    // 1. 构建节点映射
    const nodeMap = {}
    data.forEach((node) => {
      node.children = []
      nodeMap[node.id] = node
    })

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
    rootNodes.sort((a, b) => a.sort - b.sort)
    rootNodes.forEach((node) => {
      node.children.sort((a, b) => a.sort - b.sort)
    })

    // 构建 Vue Router 路由配置
    function convertToRoutes(nodes) {
      return nodes.map((node) => {
        const route = {
          id: node.id,
          path: node.path,
          name: node.name,
          redirect: node.redirect,
          component: node.component, // 替换为实际的组件路径
          meta: {
            title: node.title, // 可以根据需要添加其他元数据
            cache: node.cache,
            affix: node.affix,
            type: node.type,
            hidden: node.hidden,
            title: node.title,
            sort: node.sort,
            icon: node.icon,
          },
        }

        if (node.children && node.children.length > 0) {
          route.children = convertToRoutes(node.children)
        }

        return route
      })
    }

    // 将优化后的树状结构数据转换为 Vue Router 路由配置
    return convertToRoutes(rootNodes)
  },
}

module.exports = routeConvert
