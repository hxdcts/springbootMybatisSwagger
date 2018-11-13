SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `mobile` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;


INSERT INTO `user` VALUES (1, 'test1', '13811210011', '13811210011');
INSERT INTO `user` VALUES (2, 'test2', '13811210012', '13811210012');
INSERT INTO `user` VALUES (3, 'test3', '13811210013', '13811210013');
INSERT INTO `user` VALUES (4, 'test4', '13811210014', '13811210014');
INSERT INTO `user` VALUES (5, 'test5', '13811210015', '13811210015');
INSERT INTO `user` VALUES (6, 'test6', '13811210016', '13811210016');
