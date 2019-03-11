-- MySQL dump 10.16  Distrib 10.1.37-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: rm-uf69bwy8qgjy29637.mysql.rds.aliyuncs.com    Database: zq
-- ------------------------------------------------------
-- Server version	5.7.20-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `dungeon`
--

DROP TABLE IF EXISTS `dungeon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dungeon` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `uid` varchar(128) NOT NULL DEFAULT '',
  `dungeon_level` varchar(128) NOT NULL DEFAULT '',
  `state` int(11) NOT NULL DEFAULT '0',
  `createAt` varchar(10) NOT NULL DEFAULT '',
  `finishAt` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dungeon`
--

LOCK TABLES `dungeon` WRITE;
/*!40000 ALTER TABLE `dungeon` DISABLE KEYS */;
INSERT INTO `dungeon` VALUES (1,'oQWQQ5XBZz8zQpSbRPBzE2XWq5dE','1_1_1',0,'1551701932',NULL),(2,'oQWQQ5S-SFx0ZsK0otisJ-XoX_a4','1_1_1',0,'1551701947',NULL),(3,'oQWQQ5aR-Ts9keh0YISA0XKptTTM','1_1_1',0,'1551705904',NULL),(4,'oQWQQ5UZ4mO88wI7IDS3aP5u-uUg','1_1_1',0,'1551706058',NULL),(5,'oQWQQ5W4UzXR3D5pebbzF99-PBEE','1_1_1',0,'1551707404',NULL);
/*!40000 ALTER TABLE `dungeon` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dungeon_role`
--

DROP TABLE IF EXISTS `dungeon_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dungeon_role` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `did` int(11) NOT NULL,
  `roleInfo` text NOT NULL,
  `createAt` varchar(10) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dungeon_role`
--

LOCK TABLES `dungeon_role` WRITE;
/*!40000 ALTER TABLE `dungeon_role` DISABLE KEYS */;
INSERT INTO `dungeon_role` VALUES (1,1,'{\"name\":\"战士\",\"posX\":3,\"posY\":1,\"hp\":150,\"curHp\":150,\"role_id\":1,\"job\":1,\"atk_range\":1,\"cleanoffpath_buff_rate\":100,\"basic_cardgroupid\":1000,\"move_speed\":600,\"basic_cardnum\":3,\"boost_status_category\":\"weapon_Sword\\r\\nweapon_Axe\",\"description\":\"劈砍劈！砍劈砍！\",\"ep\":5,\"pstr\":4,\"pdef\":0,\"mstr\":0,\"mdef\":0,\"hit\":1000,\"cli\":0,\"agi\":0,\"fpow\":0,\"wpow\":0,\"apow\":0,\"epow\":0,\"lpow\":0,\"dpow\":0,\"curEp\":5}','1551701932'),(2,2,'{\"name\":\"战士\",\"posX\":3,\"posY\":1,\"hp\":150,\"curHp\":150,\"role_id\":1,\"job\":1,\"atk_range\":1,\"cleanoffpath_buff_rate\":100,\"basic_cardgroupid\":1000,\"move_speed\":600,\"basic_cardnum\":3,\"boost_status_category\":\"weapon_Sword\\r\\nweapon_Axe\",\"description\":\"劈砍劈！砍劈砍！\",\"ep\":5,\"pstr\":4,\"pdef\":0,\"mstr\":0,\"mdef\":0,\"hit\":1000,\"cli\":0,\"agi\":0,\"fpow\":0,\"wpow\":0,\"apow\":0,\"epow\":0,\"lpow\":0,\"dpow\":0,\"curEp\":5}','1551701947'),(3,3,'{\"name\":\"战士\",\"posX\":3,\"posY\":1,\"hp\":150,\"curHp\":150,\"role_id\":1,\"job\":1,\"atk_range\":1,\"cleanoffpath_buff_rate\":100,\"basic_cardgroupid\":1000,\"move_speed\":600,\"basic_cardnum\":3,\"boost_status_category\":\"weapon_Sword\\r\\nweapon_Axe\",\"description\":\"劈砍劈！砍劈砍！\",\"ep\":5,\"pstr\":4,\"pdef\":0,\"mstr\":0,\"mdef\":0,\"hit\":1000,\"cli\":0,\"agi\":0,\"fpow\":0,\"wpow\":0,\"apow\":0,\"epow\":0,\"lpow\":0,\"dpow\":0,\"curEp\":5}','1551705904'),(4,4,'{\"name\":\"战士\",\"posX\":3,\"posY\":1,\"hp\":150,\"curHp\":150,\"role_id\":1,\"job\":1,\"atk_range\":1,\"cleanoffpath_buff_rate\":100,\"basic_cardgroupid\":1000,\"move_speed\":600,\"basic_cardnum\":3,\"boost_status_category\":\"weapon_Sword\\r\\nweapon_Axe\",\"description\":\"劈砍劈！砍劈砍！\",\"ep\":5,\"pstr\":4,\"pdef\":0,\"mstr\":0,\"mdef\":0,\"hit\":1000,\"cli\":0,\"agi\":0,\"fpow\":0,\"wpow\":0,\"apow\":0,\"epow\":0,\"lpow\":0,\"dpow\":0,\"curEp\":5}','1551706058'),(5,5,'{\"name\":\"战士\",\"posX\":3,\"posY\":1,\"hp\":150,\"curHp\":150,\"role_id\":1,\"job\":1,\"atk_range\":1,\"cleanoffpath_buff_rate\":100,\"basic_cardgroupid\":1000,\"move_speed\":600,\"basic_cardnum\":3,\"boost_status_category\":\"weapon_Sword\\r\\nweapon_Axe\",\"description\":\"劈砍劈！砍劈砍！\",\"ep\":5,\"pstr\":4,\"pdef\":0,\"mstr\":0,\"mdef\":0,\"hit\":1000,\"cli\":0,\"agi\":0,\"fpow\":0,\"wpow\":0,\"apow\":0,\"epow\":0,\"lpow\":0,\"dpow\":0,\"curEp\":5}','1551707404');
/*!40000 ALTER TABLE `dungeon_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gameconf`
--

DROP TABLE IF EXISTS `gameconf`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gameconf` (
  `version` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `url` varchar(256) NOT NULL DEFAULT '',
  `valid` int(11) NOT NULL DEFAULT '0',
  `createAt` varchar(10) NOT NULL DEFAULT '',
  PRIMARY KEY (`version`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gameconf`
--

LOCK TABLES `gameconf` WRITE;
/*!40000 ALTER TABLE `gameconf` DISABLE KEYS */;
INSERT INTO `gameconf` VALUES (1,'http://magiclizi.b0.upaiyun.com/ZQ/1550114896.zip',0,''),(3,'http://magiclizi.b0.upaiyun.com/config-upload/1550164270.zip',0,''),(4,'http://magiclizi.b0.upaiyun.com/config-upload/1550164736.zip',0,''),(5,'http://magiclizi.b0.upaiyun.com/config-upload/1550476789.zip',0,''),(6,'http://magiclizi.b0.upaiyun.com/config-upload/1550563329.zip',0,''),(7,'http://magiclizi.b0.upaiyun.com/config-upload/1550576452.zip',0,''),(8,'http://magiclizi.b0.upaiyun.com/config-upload/1550579258.zip',0,''),(9,'0',0,''),(10,'0',0,''),(11,'0',0,''),(12,'0',0,''),(13,'0',0,''),(14,'http://magiclizi.b0.upaiyun.com/config-upload/1550580329.zip',0,''),(15,'0',0,''),(16,'http://magiclizi.b0.upaiyun.com/config-upload/1550580329.zip',0,'1550580329'),(17,'0',0,''),(18,'http://magiclizi.b0.upaiyun.com/config-upload/1550580904.zip',0,'1550580904'),(19,'http://magiclizi.b0.upaiyun.com/ZQ/latest.zip',0,''),(20,'http://magiclizi.b0.upaiyun.com/ZQ/latest.zip',0,''),(21,'http://magiclizi.b0.upaiyun.com/ZQ/latest.zip',0,''),(22,'http://magiclizi.b0.upaiyun.com/ZQ/latest.zip',1,''),(23,'http://magiclizi.b0.upaiyun.com/config-upload/1550587033.zip',0,'1550587033'),(24,'http://magiclizi.b0.upaiyun.com/config-upload/1550587084.zip',0,'1550587084'),(25,'http://magiclizi.b0.upaiyun.com/config-upload/1550648125.zip',0,'1550648125'),(26,'http://magiclizi.b0.upaiyun.com/config-upload/1550648548.zip',0,'1550648548'),(27,'http://magiclizi.b0.upaiyun.com/config-upload/1550648586.zip',0,'1550648586'),(28,'http://magiclizi.b0.upaiyun.com/config-upload/1550648848.zip',0,'1550648848'),(29,'http://magiclizi.b0.upaiyun.com/config-upload/1550649082.zip',0,'1550649082'),(30,'http://magiclizi.b0.upaiyun.com/config-upload/1550676186.zip',0,'1550676186'),(31,'http://magiclizi.b0.upaiyun.com/config-upload/1550676312.zip',0,'1550676312'),(32,'http://magiclizi.b0.upaiyun.com/config-upload/1550830866.zip',0,'1550830866'),(33,'http://magiclizi.b0.upaiyun.com/config-upload/1551387896.zip',0,'1551387896');
/*!40000 ALTER TABLE `gameconf` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `player`
--

DROP TABLE IF EXISTS `player`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `player` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `wx_uid` varchar(128) NOT NULL DEFAULT '',
  `role` int(11) NOT NULL DEFAULT '1',
  `dungeon_level` varchar(128) NOT NULL DEFAULT '1_1_1',
  `dungeon_role` int(11) DEFAULT NULL,
  `createAt` varchar(10) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `wx_uid` (`wx_uid`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `player`
--

LOCK TABLES `player` WRITE;
/*!40000 ALTER TABLE `player` DISABLE KEYS */;
INSERT INTO `player` VALUES (1,'oQWQQ5XBZz8zQpSbRPBzE2XWq5dE',1,'1_1_1',1,'1551701932'),(2,'oQWQQ5S-SFx0ZsK0otisJ-XoX_a4',1,'1_1_1',2,'1551701947'),(3,'oQWQQ5aR-Ts9keh0YISA0XKptTTM',1,'1_1_1',3,'1551705904'),(4,'oQWQQ5UZ4mO88wI7IDS3aP5u-uUg',1,'1_1_1',4,'1551706058'),(5,'oQWQQ5W4UzXR3D5pebbzF99-PBEE',1,'1_1_1',5,'1551707404');
/*!40000 ALTER TABLE `player` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-03-04 23:56:45
