const routeConvert = {
  //   // 启动，先找到顶级菜单，层层递归筛选
  //   const rootMenuItems = getChildMenuItems('0')
  //   // 找到的顶级菜单作为参数调用生成路由方法
  //   const vueRouterRoutes = buildRoutes(rootMenuItems)
  //   // 返回递归的生成数组结果
  //   return vueRouterRoutes
  // },
  handleTreeOptimized(data, isConvert = false) {
    // 1. 构建节点映射
    const nodeMap = {};
    data.forEach(node => {
      node.children = [];
      nodeMap[node.id] = node;
    });

    // 2. 构建父子关系、排序和去重，并构建根节点列表
    const rootNodes = [];
    data.forEach(node => {
      const parent = nodeMap[node.parent_id];
      if (parent) {
        // 在添加子节点时进行排序和去重
        if (!parent.children.find(child => child.id === node.id)) {
          parent.children.push(node);
        }
      } else {
        rootNodes.push(node);
      }
    });

    // 排序根节点和子节点
    rootNodes.sort((a, b) => a.sort - b.sort);
    rootNodes.forEach(node => {
      node.children.sort((a, b) => a.sort - b.sort);
    });

    // 构建 Vue Router 路由配置 （第二版）
    // function convertToRoutes(nodes) {
    //   return nodes.map(node => {
    //     const route = {
    //       id: node.id,
    //       path: node.path,
    //       name: node.name,
    //       redirect: node.redirect,
    //       component: node.component, // 替换为实际的组件路径
    //       meta: {
    //         title: node.title, // 可以根据需要添加其他元数据
    //         cache: node.cache,
    //         affix: node.affix,
    //         type: node.type,
    //         hidden: node.hidden,
    //         title: node.title,
    //         sort: node.sort,
    //         icon: node.icon,
    //         permission: node.permission
    //       }
    //     };

    //     if (node.children && node.children.length > 0) {
    //       route.children = convertToRoutes(node.children);
    //     }

    //     return route;
    //   });
    // }

    function convertToRoutes(nodes, parentRoute, transformButtons) {
      const routes = [];
      nodes.forEach(node => {
        // 如果是按钮类型，直接将 permission 添加到父节点的 meta.permission 数组中，不生成独立路由
        if (node.type === 2 && transformButtons) {
          if (parentRoute) {
            // 初始化父节点的 meta.permission 为数组
            if (!parentRoute.meta.permission) {
              parentRoute.meta.permission = [];
            }
            // 取出 permission 字段（假设 node.permission 存的是一个字符串）
            parentRoute.meta.permission.push(String(node.permission));
          }
          // 按钮节点不作为路由返回
        } else {
          // 构造一个新的路由对象
          const route = {
            id: node.id,
            path: node.path,
            name: node.name,
            redirect: node.redirect,
            component: node.component, // 这里一般需要经过懒加载转换（见其他工具函数）
            meta: {
              title: node.title,
              cache: node.cache,
              affix: node.affix,
              type: node.type,
              hidden: node.hidden,
              sort: node.sort,
              icon: node.icon,
              // 初始化 permission 数组，如果该节点本身有 permission 字段（例如接口 type=4），可以保留
              permission: node.permission ? [String(node.permission)] : []
            }
          };

          // 如果存在子节点，则递归转换
          if (node.children && node.children.length > 0) {
            // 注意：将当前 route 作为子节点转换时的父路由传入，
            // 这样子节点中如果有按钮类型，会追加到当前 route.meta.permission 数组中
            // route.children = convertToRoutes(node.children, route, isConvert);

            const childrenRoutes = convertToRoutes(node.children, route, transformButtons);
            // 如果转换后 children 数组不为空，再赋值；否则不保留 children 属性
            if (childrenRoutes.length > 0) {
              route.children = childrenRoutes;
            }
          }
          routes.push(route);
        }
      });
      return routes;
    }

    // 将优化后的树状结构数据转换为 Vue Router 路由配置
    return convertToRoutes(rootNodes, null, isConvert);
  }
};

module.exports = routeConvert;
