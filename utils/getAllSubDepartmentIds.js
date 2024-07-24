const DepartmentModule = require('../models/DepartmentModule')
const getAllSubDepartmentIds = async (departmentId) => {
  const department = await DepartmentModule.findByPk(departmentId);
  if (!department) {
    throw new Error('Department not found');
  }

  let subDepartmentIds = [department.id];
  const subDepartments = await DepartmentModule.findAll({ where: { parent_id: departmentId } });
  for (const subDepartment of subDepartments) {
    subDepartmentIds = subDepartmentIds.concat(await getAllSubDepartmentIds(subDepartment.id));
  }

  return subDepartmentIds;
};

module.exports = getAllSubDepartmentIds