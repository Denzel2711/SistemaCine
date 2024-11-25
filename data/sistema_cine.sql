/*
SQLyog Community v13.3.0 (64 bit)
MySQL - 10.4.32-MariaDB : Database - sistema_cine
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`sistema_cine` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci */;

USE `sistema_cine`;

/*Table structure for table `funciones` */

DROP TABLE IF EXISTS `funciones`;

CREATE TABLE `funciones` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `PeliculaId` int(11) NOT NULL,
  `SalaId` int(11) NOT NULL,
  `Fecha` date NOT NULL,
  `Hora` time NOT NULL,
  `Precio` decimal(10,2) NOT NULL,
  `Estado` tinyint(4) DEFAULT 1,
  PRIMARY KEY (`Id`),
  KEY `PeliculaId` (`PeliculaId`),
  KEY `SalaId` (`SalaId`),
  CONSTRAINT `funciones_ibfk_1` FOREIGN KEY (`PeliculaId`) REFERENCES `peliculas` (`Id`),
  CONSTRAINT `funciones_ibfk_2` FOREIGN KEY (`SalaId`) REFERENCES `salas` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

/*Data for the table `funciones` */

insert  into `funciones`(`Id`,`PeliculaId`,`SalaId`,`Fecha`,`Hora`,`Precio`,`Estado`) values 
(1,2,1,'2024-11-25','01:41:00',1324.00,1),
(2,1,1,'2024-11-25','03:09:00',1257.00,0);

/*Table structure for table `peliculas` */

DROP TABLE IF EXISTS `peliculas`;

CREATE TABLE `peliculas` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Titulo` varchar(100) NOT NULL,
  `Genero` varchar(50) NOT NULL,
  `Duracion` int(11) NOT NULL,
  `Estado` tinyint(4) DEFAULT 1,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

/*Data for the table `peliculas` */

insert  into `peliculas`(`Id`,`Titulo`,`Genero`,`Duracion`,`Estado`) values 
(1,'Cars','Animación',140,0),
(2,'Rápidos y Furiosos','Acción',180,1);

/*Table structure for table `salas` */

DROP TABLE IF EXISTS `salas`;

CREATE TABLE `salas` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(50) NOT NULL,
  `Capacidad` int(11) NOT NULL,
  `Tipo` varchar(30) NOT NULL,
  `Estado` tinyint(4) DEFAULT 1,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

/*Data for the table `salas` */

insert  into `salas`(`Id`,`Nombre`,`Capacidad`,`Tipo`,`Estado`) values 
(1,'Sala 1',25,'Normal',1),
(2,'Sala 2',50,'3D',1);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
