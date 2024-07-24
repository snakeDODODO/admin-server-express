/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 80035
 Source Host           : localhost:3306
 Source Schema         : financial-management-system

 Target Server Type    : MySQL
 Target Server Version : 80035
 File Encoding         : 65001

 Date: 24/07/2024 12:23:44
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for department
-- ----------------------------
DROP TABLE IF EXISTS `department`;
CREATE TABLE `department`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `company_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '部门',
  `sort` int NULL DEFAULT NULL COMMENT '排序',
  `parent_id` bigint NOT NULL COMMENT '父级id',
  `status` tinyint NULL DEFAULT NULL COMMENT '状态',
  `createtime` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `path` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '父节点ID路径',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of department
-- ----------------------------
INSERT INTO `department` VALUES (1, '无心科技', 1, 0, 1, '2024-06-26 15:46:39', NULL);
INSERT INTO `department` VALUES (2, '深圳总公司', 1, 1, 1, '2024-06-26 15:46:42', '1/2');
INSERT INTO `department` VALUES (3, '广西分公司', 2, 1, 1, '2024-06-26 15:46:44', NULL);
INSERT INTO `department` VALUES (4, '研发部', 1, 3, 1, '2024-06-26 15:46:47', NULL);
INSERT INTO `department` VALUES (5, '市场部', 2, 3, 1, '2024-06-26 15:46:49', NULL);
INSERT INTO `department` VALUES (7, '商务部', 3, 3, 1, '2015-09-09 20:00:23', '1/3/7');
INSERT INTO `department` VALUES (8, '人事部', 4, 3, 0, '2015-09-09 20:00:23', '1/3/8');

-- ----------------------------
-- Table structure for dictionary
-- ----------------------------
DROP TABLE IF EXISTS `dictionary`;
CREATE TABLE `dictionary`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `status` tinyint NOT NULL COMMENT '状态',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of dictionary
-- ----------------------------
INSERT INTO `dictionary` VALUES (1, 'gender', '性别', 1);
INSERT INTO `dictionary` VALUES (2, 'status', '状态', 1);

-- ----------------------------
-- Table structure for dictionarydata
-- ----------------------------
DROP TABLE IF EXISTS `dictionarydata`;
CREATE TABLE `dictionarydata`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `dictionaryname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `dictionaryvalue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `status` tinyint NULL DEFAULT NULL,
  `dictionary_id` int NOT NULL COMMENT '关联父字典ID',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `dictionary_id`(`dictionary_id` ASC) USING BTREE,
  CONSTRAINT `dictionary_id` FOREIGN KEY (`dictionary_id`) REFERENCES `dictionary` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dictionarydata
-- ----------------------------
INSERT INTO `dictionarydata` VALUES (1, 'man', '男', 1, 1);
INSERT INTO `dictionarydata` VALUES (2, 'woman', '女', 1, 1);
INSERT INTO `dictionarydata` VALUES (8, 'noraml2', '性别未知', 0, 1);

-- ----------------------------
-- Table structure for resource
-- ----------------------------
DROP TABLE IF EXISTS `resource`;
CREATE TABLE `resource`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `path` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '路径',
  `title` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '名称',
  `type` tinyint NULL DEFAULT NULL COMMENT '路由操作类型',
  `icon` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '图标',
  `cache` tinyint NULL DEFAULT NULL COMMENT '缓存',
  `parent_id` bigint NULL DEFAULT NULL COMMENT '父级ID',
  `affix` tinyint NULL DEFAULT NULL COMMENT '固钉',
  `breadcrumb` tinyint NULL DEFAULT NULL COMMENT '是否要显示在面包屑上',
  `hidden` tinyint NULL DEFAULT NULL COMMENT '是否要显示在菜单上',
  `createtime` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `updatetime` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间',
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '菜单名',
  `redirect` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '重定向路径',
  `component` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '组件路径',
  `sort` int NULL DEFAULT NULL COMMENT '排序',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 24 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of resource
-- ----------------------------
INSERT INTO `resource` VALUES (3, 'user', '用户管理', 1, NULL, 1, 6, 0, 1, 0, '2023-08-01 23:06:56', '2023-08-15 20:31:18', 'user', NULL, '/settings/user', 1);
INSERT INTO `resource` VALUES (4, 'role', '角色管理', 1, NULL, 1, 6, 0, 1, 0, '2023-08-01 23:06:58', '2023-08-15 00:32:50', 'role', NULL, '/settings/role', 2);
INSERT INTO `resource` VALUES (5, 'resource', '菜单管理', 1, NULL, 1, 6, 0, 1, 0, '2023-08-01 23:07:00', '2023-08-15 20:23:54', 'resource', NULL, '/settings/resource', 3);
INSERT INTO `resource` VALUES (6, '/settings', '系统管理', 0, 'ep-setting', 0, 0, 0, 1, 0, '2023-08-01 23:15:36', '2024-07-23 16:28:25', 'settings', '/settings/user', '', 5);
INSERT INTO `resource` VALUES (9, '/bill', '账单管理', 0, 'ep-notebook', 0, 0, NULL, 0, 0, '2024-07-23 17:22:34', '2024-07-23 17:22:34', 'bill', '/bill/income', '', 2);
INSERT INTO `resource` VALUES (11, 'income', '日常账本', 1, NULL, 1, 9, 0, 0, 0, '2023-08-15 13:07:59', '2024-07-23 14:53:41', 'income', NULL, '/bill/income', 1);
INSERT INTO `resource` VALUES (12, 'department', '部门管理', 1, NULL, 1, 6, 0, 0, 0, '2024-06-06 12:26:09', '2024-06-06 13:24:35', 'department', NULL, '/settings/department', 4);
INSERT INTO `resource` VALUES (13, 'dictionary', '字典管理', 1, NULL, 1, 6, 0, 0, 0, '2024-06-06 12:27:19', '2024-06-06 12:30:47', 'dictionary', NULL, '/settings/dictionary', 5);
INSERT INTO `resource` VALUES (16, 'classification', '分类管理', 1, NULL, 1, 9, 0, 0, 0, '2024-07-22 20:17:35', '2024-07-23 14:53:54', 'classification', NULL, '/bill/classification', 2);
INSERT INTO `resource` VALUES (19, '/property', 'property', 0, '', 1, 0, 0, 0, 0, '2024-07-24 00:04:29', '2024-07-24 00:04:29', 'property', '/property/index', '', 3);
INSERT INTO `resource` VALUES (20, '/statistics', 'statistics', 0, '', 1, 0, 0, 0, 0, '2024-07-24 00:06:29', '2024-07-24 00:06:29', 'statistics', '/statistics/index', '', 4);
INSERT INTO `resource` VALUES (22, ' index', '资产管理', 1, 'grommet-icons:money', 1, 19, 0, 0, 0, '2024-07-24 00:21:45', '2024-07-24 00:21:45', 'property', NULL, '/property/index', 1);
INSERT INTO `resource` VALUES (23, 'index', '数据统计', 1, 'bi:bar-chart', 1, 20, 0, 0, 0, '2024-07-24 00:06:31', '2024-07-24 00:06:31', 'statistics', NULL, '/statistics/index', 1);

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '名称',
  `sys_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '权限字符',
  `status` tinyint NOT NULL COMMENT '状态',
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '创建时间',
  `updatetime` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES (1, '超级管理员', 'admin', 1, '2023-08-11 12:00:43', '2023-08-11 12:00:45');
INSERT INTO `role` VALUES (2, '普通用户', 'ordinary', 1, '2023-08-12 17:11:29', '2023-08-12 17:11:29');
INSERT INTO `role` VALUES (3, '测试用户', 'test', 1, '2024-07-01 18:54:45', '2024-07-01 18:54:45');
INSERT INTO `role` VALUES (16, '测试1', 'test1', 1, '2024-07-01 18:54:44', '2024-07-01 18:54:44');

-- ----------------------------
-- Table structure for role_resource
-- ----------------------------
DROP TABLE IF EXISTS `role_resource`;
CREATE TABLE `role_resource`  (
  `role_id` bigint NOT NULL COMMENT '角色ID',
  `resource_id` bigint NOT NULL COMMENT '资源ID',
  PRIMARY KEY (`role_id`, `resource_id`) USING BTREE,
  INDEX `resource_id`(`resource_id` ASC) USING BTREE,
  CONSTRAINT `role_resource_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `role_resource_ibfk_2` FOREIGN KEY (`resource_id`) REFERENCES `resource` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of role_resource
-- ----------------------------
INSERT INTO `role_resource` VALUES (1, 3);
INSERT INTO `role_resource` VALUES (2, 3);
INSERT INTO `role_resource` VALUES (3, 3);
INSERT INTO `role_resource` VALUES (1, 4);
INSERT INTO `role_resource` VALUES (3, 4);
INSERT INTO `role_resource` VALUES (1, 5);
INSERT INTO `role_resource` VALUES (1, 6);
INSERT INTO `role_resource` VALUES (2, 6);
INSERT INTO `role_resource` VALUES (1, 9);
INSERT INTO `role_resource` VALUES (3, 9);
INSERT INTO `role_resource` VALUES (1, 11);
INSERT INTO `role_resource` VALUES (3, 11);
INSERT INTO `role_resource` VALUES (1, 12);
INSERT INTO `role_resource` VALUES (1, 13);
INSERT INTO `role_resource` VALUES (1, 16);
INSERT INTO `role_resource` VALUES (3, 16);
INSERT INTO `role_resource` VALUES (1, 19);
INSERT INTO `role_resource` VALUES (1, 20);
INSERT INTO `role_resource` VALUES (1, 22);
INSERT INTO `role_resource` VALUES (1, 23);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `username` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '用户名',
  `password` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '密码',
  `nickname` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '姓名',
  `avatar` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '头像',
  `phone` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '手机号码',
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `lasttime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP COMMENT '最后登录时间',
  `status` tinyint NOT NULL COMMENT '状态',
  `department_id` bigint NULL DEFAULT NULL COMMENT '所属部门ID',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `department_id`(`department_id` ASC) USING BTREE,
  CONSTRAINT `department_id` FOREIGN KEY (`department_id`) REFERENCES `department` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 55 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'admin', '123456', '超级管理员', NULL, '18815838307', '2023-07-27 21:32:17', '2024-07-06 14:11:13', 1, 4);
INSERT INTO `user` VALUES (3, 'weibin', 'z306544321', '韦彬', '', '18815838307', '2023-07-26 20:56:52', '2024-07-24 11:16:14', 1, 4);
INSERT INTO `user` VALUES (27, 'test5', '123456', '测试5', NULL, '18815838307', '2023-08-01 14:35:46', '2024-07-06 14:11:14', 1, 5);
INSERT INTO `user` VALUES (28, 'test6', '123456', '测试6', NULL, '18815838307', '2023-08-01 14:36:29', '2024-07-10 20:46:13', 1, 7);
INSERT INTO `user` VALUES (47, 'test7', 'z123456', '测试7', NULL, '18815838307', '2024-07-12 21:46:06', '0000-00-00 00:00:00', 1, 2);
INSERT INTO `user` VALUES (48, 'sadsadsasa', 'adsadsadsa', '艾希', NULL, '18815838307', '2024-07-12 21:46:26', '0000-00-00 00:00:00', 1, 8);
INSERT INTO `user` VALUES (49, 'sadsads', 'adsadsadsa', '怪兽', NULL, '18815838307', '2024-07-12 21:46:47', '0000-00-00 00:00:00', 1, 7);
INSERT INTO `user` VALUES (50, 'sadsss', 'z123456', '陈显', NULL, '18815838307', '2024-07-12 21:47:17', '0000-00-00 00:00:00', 1, 5);
INSERT INTO `user` VALUES (51, 'test8', 'z123456', '杨豪杰', NULL, '18815838307', '2024-07-12 21:48:16', '0000-00-00 00:00:00', 1, 5);
INSERT INTO `user` VALUES (52, 'test9', 'z123456', '最最', NULL, '18815838307', '2024-07-12 21:48:41', '0000-00-00 00:00:00', 1, 5);
INSERT INTO `user` VALUES (53, 'test10', 'z123456', '哼哼', NULL, '18815838307', '2024-07-12 21:48:59', '0000-00-00 00:00:00', 1, 5);
INSERT INTO `user` VALUES (54, 'test11', 'z123456', 'ssss', NULL, '18815838307', '2024-07-12 21:49:52', '2024-07-12 22:46:18', 1, 7);

-- ----------------------------
-- Table structure for user_role
-- ----------------------------
DROP TABLE IF EXISTS `user_role`;
CREATE TABLE `user_role`  (
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `role_id` bigint NOT NULL COMMENT '角色ID',
  PRIMARY KEY (`user_id`, `role_id`) USING BTREE,
  INDEX `role_id`(`role_id` ASC) USING BTREE,
  CONSTRAINT `user_role_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_role_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user_role
-- ----------------------------
INSERT INTO `user_role` VALUES (1, 1);
INSERT INTO `user_role` VALUES (3, 2);
INSERT INTO `user_role` VALUES (3, 3);
INSERT INTO `user_role` VALUES (27, 3);
INSERT INTO `user_role` VALUES (28, 3);
INSERT INTO `user_role` VALUES (47, 3);
INSERT INTO `user_role` VALUES (48, 3);
INSERT INTO `user_role` VALUES (49, 3);
INSERT INTO `user_role` VALUES (50, 3);
INSERT INTO `user_role` VALUES (51, 3);
INSERT INTO `user_role` VALUES (52, 3);
INSERT INTO `user_role` VALUES (53, 3);
INSERT INTO `user_role` VALUES (54, 3);

SET FOREIGN_KEY_CHECKS = 1;
