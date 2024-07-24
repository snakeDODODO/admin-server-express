const DepartmentModule = require('../models/DepartmentModule')
// 递归生成path
const generatePath = async (department) => {
  let path = `${department.id}`;
  let currentParentId = department.parent_id;
  while (currentParentId) {
    const parentDepartment = await DepartmentModule.findByPk(currentParentId);
    if (parentDepartment) {
      path = `${parentDepartment.id}/${path}`;
      currentParentId = parentDepartment.parent_id;
    } else {
      break;
    }
  }
  return path;
}

module.exports = generatePath