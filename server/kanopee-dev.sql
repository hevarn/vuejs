-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mar. 24 mars 2020 à 12:39
-- Version du serveur :  10.4.11-MariaDB
-- Version de PHP : 7.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `kanopee`
--

-- --------------------------------------------------------

--
-- Structure de la table `atelier`
--

CREATE TABLE `atelier` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `link1` varchar(255) NOT NULL,
  `link2` varchar(255) NOT NULL,
  `userSupport` varchar(255) NOT NULL,
  `kulteurSupport` varchar(255) NOT NULL,
  `duration` varchar(255) NOT NULL,
  `link3` varchar(255) DEFAULT NULL,
  `link4` varchar(255) DEFAULT NULL,
  `link5` varchar(255) DEFAULT NULL,
  `link6` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `atelier`
--

INSERT INTO `atelier` (`id`, `title`, `description`, `link1`, `link2`, `userSupport`, `kulteurSupport`, `duration`, `link3`, `link4`, `link5`, `link6`) VALUES
(46, 'QUELS LÉGUMES POUR MA SOUPE ?', 'dsmlfk,dlmfg,nmdfj,ds', 'www.google.fr', 'www.google.fr', 'uploads/userSupport-1579025576633.pdf', 'uploads/kulteurSupport-1579025576649.pdf', '36', '', '', '', ''),
(61, 'QUELS LÉGUMES POUR MA SOUPE ?', 'dsmlfk,dlmfg,nmdfj,ds', 'www.google.fr', 'www.google.fr', 'uploads/userSupport-1579019500013.pdf', 'uploads/kulteurSupport-1579019500059.pdf', '33', '', '', '', ''),
(62, 'QUELS LÉGUMES POUR MA SOUPE ?', 'dsmlfk,dlmfg,nmdfj,ds', 'www.google.fr', 'www.google.fr', 'uploads/userSupport-1579019569670.pdf', 'uploads/kulteurSupport-1579019569691.pdf', '35', '', '', '', ''),
(63, 'dfdfdf', 'les légumes ', 'www.google.fr', 'www.google.fr', 'uploads/userSupport-1579025741001.pdf', 'uploads/kulteurSupport-1579025741016.pdf', '37', '', '', '', '');

-- --------------------------------------------------------

--
-- Structure de la table `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `qty` int(11) NOT NULL,
  `priceTotalTTC` decimal(5,2) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userUserId` int(11) DEFAULT NULL,
  `pdtProductId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `cart`
--

INSERT INTO `cart` (`id`, `qty`, `priceTotalTTC`, `createdAt`, `updatedAt`, `userUserId`, `pdtProductId`) VALUES
(65, 17, '99.99', '2020-03-05 15:38:54', '2020-03-05 16:24:33', 1, 9),
(66, 1, '14.78', '2020-03-05 15:54:00', '2020-03-05 15:54:00', 1, 5),
(67, 8, '99.99', '2020-03-05 15:55:57', '2020-03-05 15:58:49', 1, 5),
(69, 10, '99.99', '2020-03-05 16:02:59', '2020-03-05 16:03:01', 1, 14),
(70, 1, '14.78', '2020-03-05 16:04:21', '2020-03-05 16:04:21', 1, 5),
(71, 1, '11.00', '2020-03-05 16:04:30', '2020-03-05 16:04:30', 1, 14),
(72, 1, '14.78', '2020-03-05 16:04:52', '2020-03-05 16:04:52', 1, 5),
(73, 1, '14.78', '2020-03-05 16:05:21', '2020-03-05 16:05:21', 1, 5),
(74, 8, '99.99', '2020-03-05 16:06:09', '2020-03-05 16:06:18', 1, 5),
(75, 3, '33.00', '2020-03-05 16:06:20', '2020-03-05 16:06:21', 1, 14),
(76, 10, '99.99', '2020-03-05 16:07:18', '2020-03-05 16:07:30', 1, 5),
(77, 1, '11.00', '2020-03-10 13:09:26', '2020-03-10 13:09:26', 1, 14),
(78, 1, '2.74', '2020-03-20 12:41:06', '2020-03-20 12:41:06', 1, 13),
(79, 1, '11.00', '2020-03-20 12:41:07', '2020-03-20 12:41:07', 1, 14),
(80, 16, '236.48', '2020-03-20 12:41:11', '2020-03-20 12:41:11', 1, 5),
(82, 8, '118.24', '2020-03-24 10:44:43', '2020-03-24 10:45:12', 1, 5),
(83, 5, '55.00', '2020-03-24 10:53:22', '2020-03-24 10:53:27', 1, 14),
(84, 4, '44.00', '2020-03-24 10:55:05', '2020-03-24 10:55:11', 1, 14),
(85, 0, '0.00', '2020-03-24 10:59:41', '2020-03-24 10:59:41', 1, 5),
(86, 0, '0.00', '2020-03-24 11:00:09', '2020-03-24 11:00:13', 1, 5),
(87, 1, '11.00', '2020-03-24 11:00:35', '2020-03-24 11:01:32', 1, 14),
(88, 1, '0.00', '2020-03-24 11:01:35', '2020-03-24 11:01:35', 1, 11),
(89, 1, '0.00', '2020-03-24 11:02:05', '2020-03-24 11:02:05', 1, 8),
(90, 5, '55.00', '2020-03-24 11:02:29', '2020-03-24 11:02:34', 1, 14),
(91, 2, '29.56', '2020-03-24 11:05:33', '2020-03-24 11:35:02', 1, 5),
(92, 1, '14.78', '2020-03-24 11:35:43', '2020-03-24 11:36:45', 1, 5),
(93, 1, '14.78', '2020-03-24 11:36:47', '2020-03-24 11:36:50', 1, 5);

-- --------------------------------------------------------

--
-- Structure de la table `event`
--

CREATE TABLE `event` (
  `id` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `atelierId` int(11) DEFAULT NULL,
  `siteId` int(11) DEFAULT NULL,
  `startAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `endAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `eventType` enum('Atelier','Culture-entretien','Distribution') NOT NULL DEFAULT 'Atelier',
  `color` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `event`
--

INSERT INTO `event` (`id`, `userId`, `atelierId`, `siteId`, `startAt`, `endAt`, `eventType`, `color`, `description`) VALUES
(59, 4, 46, 1, '2020-01-16 00:00:00', '2020-01-17 00:00:00', 'Atelier', '', NULL),
(62, 4, NULL, 1, '2020-01-14 00:00:00', '2020-01-15 00:00:00', 'Distribution', 'red', 'toto');

-- --------------------------------------------------------

--
-- Structure de la table `message`
--

CREATE TABLE `message` (
  `id` int(11) NOT NULL,
  `content` varchar(255) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `role` enum('message','question') NOT NULL DEFAULT 'message'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `message`
--

INSERT INTO `message` (`id`, `content`, `userId`, `createdAt`, `updatedAt`, `role`) VALUES
(7, 'Les pousses commencent à sortir!', 4, '2019-12-17 14:42:47.767745', '2019-12-17 14:42:47.842108', 'message'),
(8, 'Il reste encore quelques places dans l\'atelier de demain, pensez à vous incrire', 7, '2019-12-17 14:42:47.767745', '2019-12-17 14:42:47.842108', 'message'),
(9, 'Ah oui j\'ai oublié de m\'inscrire pour demain! Je le fais tout de suite, merci!', 7, '2019-12-17 14:42:47.767745', '2019-12-17 14:42:47.842108', 'message'),
(10, 'J\'ai adoré l\'atelier de la semaine dernière, hyper intéressant!', 4, '2019-12-17 14:42:47.767745', '2019-12-17 14:42:47.842108', 'message'),
(12, 'Y a-t-il un atelier de prévu sur les semis?', 7, '2020-01-09 15:44:34.473935', '2020-01-09 15:44:34.473935', 'question'),
(13, 'Quand passe le kulteur?', 4, '2020-01-09 15:45:26.512703', '2020-01-09 15:45:26.512703', 'question');

-- --------------------------------------------------------

--
-- Structure de la table `participation`
--

CREATE TABLE `participation` (
  `id` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `eventId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `pdt_buyhistory`
--

CREATE TABLE `pdt_buyhistory` (
  `id` int(11) NOT NULL,
  `buyPrice1` decimal(5,2) NOT NULL,
  `buyPrice2` decimal(5,2) DEFAULT NULL,
  `buyPrice3` decimal(5,2) DEFAULT NULL,
  `buyPrice4` decimal(5,2) DEFAULT NULL,
  `buyPrice5` decimal(5,2) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `pdtReferenceId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `pdt_buyhistory`
--

INSERT INTO `pdt_buyhistory` (`id`, `buyPrice1`, `buyPrice2`, `buyPrice3`, `buyPrice4`, `buyPrice5`, `createdAt`, `updatedAt`, `pdtReferenceId`) VALUES
(13, '10.71', '10.17', '9.64', NULL, NULL, '2020-02-25 12:31:36', '2020-02-25 12:31:36', 9),
(14, '2.22', '2.11', '2.00', NULL, NULL, '2020-02-25 12:32:06', '2020-02-25 12:32:06', 10),
(15, '4.68', '4.45', '4.21', NULL, NULL, '2020-02-25 12:32:32', '2020-02-25 12:32:32', 11),
(16, '4.31', '4.09', '3.88', NULL, NULL, '2020-02-25 12:32:59', '2020-02-25 12:32:59', 12),
(17, '10.71', '10.17', '9.64', NULL, NULL, '2020-02-25 12:39:59', '2020-02-25 12:39:59', 13),
(18, '2.22', '2.11', '2.00', NULL, NULL, '2020-02-25 12:39:59', '2020-02-25 12:39:59', 14),
(19, '3.54', '3.45', '3.21', NULL, NULL, '2020-02-25 12:39:59', '2020-02-25 12:39:59', 15),
(20, '4.31', '4.09', '3.88', NULL, NULL, '2020-02-25 12:39:59', '2020-02-25 12:39:59', 16),
(21, '10.98', '10.77', '9.99', NULL, NULL, '2020-02-25 14:42:04', '2020-02-25 14:42:04', 9),
(22, '2.92', '2.79', '2.69', NULL, NULL, '2020-02-25 14:42:04', '2020-02-25 14:42:04', 10),
(23, '5.25', '4.99', '4.85', NULL, NULL, '2020-02-25 14:42:04', '2020-02-25 14:42:04', 11),
(24, '4.22', '3.99', '3.77', NULL, NULL, '2020-02-25 14:42:04', '2020-02-25 14:42:04', 12),
(27, '15.00', '14.00', '13.00', '12.00', NULL, '2020-02-28 09:46:41', '2020-02-28 09:46:41', 17),
(28, '16.00', '15.00', '14.00', '13.00', NULL, '2020-02-28 13:12:50', '2020-02-28 13:12:50', 17),
(29, '17.00', '16.00', '15.00', '14.00', NULL, '2020-02-28 13:13:22', '2020-02-28 13:13:22', 17),
(30, '5.00', '4.50', '4.00', '0.50', NULL, '2020-02-28 13:49:52', '2020-02-28 13:49:52', 18),
(31, '5.00', '4.00', '3.00', '2.00', '1.00', '2020-02-28 14:37:44', '2020-02-28 14:37:44', 19),
(33, '9.45', '9.32', '9.11', NULL, NULL, '2020-02-28 15:43:38', '2020-02-28 15:43:38', 9),
(34, '2.22', '2.11', '2.00', NULL, NULL, '2020-02-28 15:43:38', '2020-02-28 15:43:38', 10),
(35, '4.68', '4.45', '4.21', NULL, NULL, '2020-02-28 15:43:38', '2020-02-28 15:43:38', 11),
(36, '4.31', '4.09', '3.88', NULL, NULL, '2020-02-28 15:43:38', '2020-02-28 15:43:38', 12),
(37, '2.03', '1.93', '1.83', NULL, NULL, '2020-03-02 14:26:45', '2020-03-02 14:26:45', 21),
(38, '1.61', '1.53', '1.45', NULL, NULL, '2020-03-02 14:26:56', '2020-03-02 14:26:56', 22),
(39, '4.92', '4.81', '4.70', '3.89', NULL, '2020-03-02 14:28:05', '2020-03-02 14:28:05', 9),
(40, '2.22', '2.11', '2.00', NULL, NULL, '2020-03-02 14:28:05', '2020-03-02 14:28:05', 10),
(41, '4.68', '4.45', '4.21', NULL, NULL, '2020-03-02 14:28:05', '2020-03-02 14:28:05', 11),
(42, '4.31', '4.09', '3.88', NULL, NULL, '2020-03-02 14:28:05', '2020-03-02 14:28:05', 12),
(43, '10.00', NULL, NULL, NULL, NULL, '2020-03-02 14:47:28', '2020-03-02 14:47:28', 23);

-- --------------------------------------------------------

--
-- Structure de la table `pdt_category`
--

CREATE TABLE `pdt_category` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `providerName` varchar(50) NOT NULL,
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `pdt_category`
--

INSERT INTO `pdt_category` (`id`, `name`, `providerName`, `createdAt`, `updatedAt`) VALUES
(1, 'EXTRA', 'extra', NULL, NULL),
(2, 'I', '1', NULL, NULL),
(3, 'II', '2', NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `pdt_country`
--

CREATE TABLE `pdt_country` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL COMMENT 'pays: Italie',
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `pdt_country`
--

INSERT INTO `pdt_country` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'FRANCE', NULL, NULL),
(2, 'ESPAGNE', NULL, NULL),
(3, 'ITALIE', '2020-01-15', '2020-01-15'),
(4, 'MAROC', '2020-01-29', '2020-01-29'),
(5, 'BELGIQUE', '2020-01-29', '2020-01-29'),
(6, 'TUNISIE', '2020-01-29', '2020-01-29'),
(7, 'ANDORE', '2020-01-29', '2020-01-29'),
(8, 'MEXIQUE', '2020-02-03', '2020-02-03');

-- --------------------------------------------------------

--
-- Structure de la table `pdt_distance`
--

CREATE TABLE `pdt_distance` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL COMMENT 'AB , 0 à 100km ..',
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `pdt_distance`
--

INSERT INTO `pdt_distance` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, '0 km', NULL, '2020-01-29'),
(2, 'entre 0 et 100 km', NULL, '2020-01-29'),
(3, 'entre 100 et 500 km', NULL, NULL),
(4, 'entre 500 et 1000 km', '2020-01-29', '2020-01-29'),
(5, 'entre 1000 et 5000 km', '2020-01-29', '2020-01-29'),
(6, 'entre 5000 et 10000 km', '2020-01-29', '2020-01-29');

-- --------------------------------------------------------

--
-- Structure de la table `pdt_histories`
--

CREATE TABLE `pdt_histories` (
  `id` int(11) NOT NULL,
  `buyPrice1` int(11) NOT NULL,
  `buyPrice2` int(11) DEFAULT NULL,
  `buyPrice3` int(11) DEFAULT NULL,
  `buyPrice4` int(11) DEFAULT NULL,
  `buyPrice5` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `pdtReferenceId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `pdt_kind`
--

CREATE TABLE `pdt_kind` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `pdtTypeId` int(11) NOT NULL,
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `pdt_kind`
--

INSERT INTO `pdt_kind` (`id`, `name`, `pdtTypeId`, `createdAt`, `updatedAt`) VALUES
(3, 'Abricot', 1, NULL, NULL),
(4, 'Airelle', 1, NULL, NULL),
(5, 'Amande', 1, NULL, NULL),
(6, 'Ananas', 1, NULL, NULL),
(7, 'Avocat', 1, NULL, NULL),
(8, 'Banane', 1, NULL, NULL),
(9, 'Cassis', 1, NULL, NULL),
(10, 'Cerise', 1, NULL, NULL),
(11, 'Châtaigne', 1, NULL, NULL),
(12, 'Citron', 1, NULL, NULL),
(13, 'Clémentine', 1, NULL, NULL),
(14, 'Coing', 1, NULL, NULL),
(15, 'Datte', 1, NULL, NULL),
(16, 'Figue fraîche', 1, NULL, NULL),
(17, 'Fraise', 1, NULL, NULL),
(18, 'Fraise des bois', 1, NULL, NULL),
(19, 'Framboise', 1, NULL, NULL),
(20, 'Fruit de la passion', 1, NULL, NULL),
(21, 'Grenade', 1, NULL, NULL),
(22, 'Groseille', 1, NULL, NULL),
(23, 'Groseille à maquereau', 1, NULL, NULL),
(24, 'Kaki', 1, NULL, NULL),
(25, 'Kiwi', 1, NULL, NULL),
(26, 'Kumquat', 1, NULL, NULL),
(27, 'Litchi', 1, NULL, NULL),
(28, 'Mandarine', 1, NULL, NULL),
(29, 'Mangue', 1, NULL, NULL),
(30, 'Marron', 1, NULL, NULL),
(31, 'Melon', 1, NULL, NULL),
(32, 'Mirabelle', 1, NULL, NULL),
(33, 'Mûre', 1, NULL, NULL),
(34, 'Myrtille', 1, NULL, NULL),
(35, 'Nectarine', 1, NULL, NULL),
(36, 'Noisette', 1, NULL, NULL),
(37, 'Noix', 1, NULL, NULL),
(38, 'Orange', 1, NULL, NULL),
(39, 'Orange sanguine', 1, NULL, NULL),
(40, 'Pamplemousse', 1, NULL, NULL),
(41, 'Papaye', 1, NULL, NULL),
(42, 'Pastèque', 1, NULL, NULL),
(43, 'Pêche', 1, NULL, NULL),
(44, 'Poire', 1, NULL, NULL),
(45, 'Pomme', 1, NULL, NULL),
(46, 'Prune', 1, NULL, NULL),
(47, 'Quetsche', 1, NULL, NULL),
(48, 'Raisin', 1, NULL, NULL),
(49, 'Reine-claude', 1, NULL, NULL),
(50, 'Tomate', 1, NULL, NULL),
(51, 'Tomate charnue', 1, NULL, NULL),
(52, 'Tomate Peretti', 1, NULL, NULL),
(53, 'Ail', 2, NULL, NULL),
(54, 'Artichaut', 2, NULL, NULL),
(55, 'Asperge blanche', 2, NULL, NULL),
(56, 'Asperge verte', 2, NULL, NULL),
(57, 'Aubergine', 2, NULL, NULL),
(58, 'Bette', 2, NULL, NULL),
(59, 'Betterave rouge', 2, NULL, NULL),
(60, 'Brocoli', 2, NULL, NULL),
(61, 'Carotte', 2, NULL, NULL),
(62, 'Catalonia', 2, NULL, NULL),
(63, 'Céleri', 2, NULL, NULL),
(64, 'Céleri branche', 2, NULL, NULL),
(65, 'Céleri rave', 2, NULL, NULL),
(66, 'Chou blanc', 2, NULL, NULL),
(67, 'Chou de Bruxelles', 2, NULL, NULL),
(68, 'Chou frisé', 2, NULL, NULL),
(69, 'Chou Romanesco', 2, NULL, NULL),
(70, 'Chou rouge', 2, NULL, NULL),
(71, 'Chou-chinois', 2, NULL, NULL),
(72, 'Chou-fleur', 2, NULL, NULL),
(73, 'Chou-rave', 2, NULL, NULL),
(74, 'Cima di Rapa', 2, NULL, NULL),
(75, 'Citrouille', 2, NULL, NULL),
(76, 'Concombre', 2, NULL, NULL),
(77, 'Courge', 2, NULL, NULL),
(78, 'Courgette', 2, NULL, NULL),
(79, 'Cresson', 2, NULL, NULL),
(80, 'Endive', 2, NULL, NULL),
(81, 'Epinard', 2, NULL, NULL),
(82, 'Fenouil', 2, NULL, NULL),
(83, 'Haricot', 2, NULL, NULL),
(84, 'Laitue romaine', 2, NULL, NULL),
(85, 'Mâche', 2, NULL, NULL),
(86, 'Maïs', 2, NULL, NULL),
(87, 'Navet', 2, NULL, NULL),
(88, 'Oignon', 2, NULL, NULL),
(89, 'Panais', 2, NULL, NULL),
(90, 'Pâtisson', 2, NULL, NULL),
(91, 'Petit oignon blanc', 2, NULL, NULL),
(92, 'Petit pois', 2, NULL, NULL),
(93, 'Poireau', 2, NULL, NULL),
(94, 'Pois mange-tout', 2, NULL, NULL),
(95, 'Poivron', 2, NULL, NULL),
(96, 'Pomme de terre', 2, NULL, NULL),
(97, 'Potimarron', 2, NULL, NULL),
(98, 'Potiron', 2, NULL, NULL),
(99, 'Radis', 2, NULL, NULL),
(100, 'Radis long', 2, NULL, NULL),
(101, 'Rhubarbe', 2, NULL, NULL),
(102, 'Salsifis', 2, NULL, NULL),
(103, 'Topinambour', 2, NULL, NULL),
(104, 'test', 1, '2020-02-03', '2020-02-03'),
(105, 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 1, '2020-02-03', '2020-02-03'),
(106, 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 1, '2020-02-03', '2020-02-03'),
(107, 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 1, '2020-02-03', '2020-02-03'),
(108, 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 1, '2020-02-03', '2020-02-03'),
(109, 'tooyo', 2, '2020-02-03', '2020-02-03'),
(110, '87', 1, '2020-02-03', '2020-02-03'),
(111, 'okok', 2, '2020-02-03', '2020-02-03'),
(112, 'nnnnnnnn', 2, '2020-02-03', '2020-02-03'),
(113, 'nnnnnnnnn', 2, '2020-02-03', '2020-02-03'),
(114, '', 2, '2020-02-03', '2020-02-03'),
(115, 'ggggggggggggggggggggggg', 1, '2020-02-03', '2020-02-03'),
(116, 'kkkkkkkkkkkkkkkkkkkkkkkkkk', 1, '2020-02-03', '2020-02-03'),
(117, 'tototototottoot', 2, '2020-02-03', '2020-02-03'),
(118, 'kjkjjjkjjkj', 2, '2020-02-03', '2020-02-03'),
(119, 'erererrereererrrerererereerr', 1, '2020-02-03', '2020-02-03'),
(120, 'dodo', 3, '2020-02-03', '2020-02-03'),
(121, 'toto', 3, '2020-02-03', '2020-02-03'),
(122, 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz', 1, '2020-02-03', '2020-02-03'),
(123, 'toto', 1, '2020-02-04', '2020-02-04'),
(124, 'zozo', 3, '2020-02-04', '2020-02-04');

-- --------------------------------------------------------

--
-- Structure de la table `pdt_kulteurstocks`
--

CREATE TABLE `pdt_kulteurstocks` (
  `id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `solde` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `pdtReferenceId` int(11) DEFAULT NULL,
  `pdtStocksActionId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `pdt_ordercustomer`
--

CREATE TABLE `pdt_ordercustomer` (
  `id` int(11) NOT NULL,
  `qty` int(11) NOT NULL,
  `priceTotalTTC` decimal(5,2) NOT NULL,
  `paidId` varchar(255) NOT NULL,
  `orderId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `pdtProductId` int(11) DEFAULT NULL,
  `userUserId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `pdt_ordercustomer`
--

INSERT INTO `pdt_ordercustomer` (`id`, `qty`, `priceTotalTTC`, `paidId`, `orderId`, `createdAt`, `updatedAt`, `pdtProductId`, `userUserId`) VALUES
(3, 16, '104.80', 'pi_1GIB9hHEx14I0xscgCEq6q5m', 1583143545, '2020-03-02 10:05:45', '2020-03-02 10:05:45', 7, 2),
(6, 16, '105.00', 'pi_1GIBJxHEx14I0xsctn0ZfxDc', 1583144181, '2020-03-02 10:16:22', '2020-03-02 10:16:22', 7, 1),
(9, 16, '105.00', 'pi_1GIBOsHEx14I0xscRghSZUfD', 1583144486, '2020-03-02 10:21:26', '2020-03-02 10:21:26', 7, 1),
(18, 4, '29.00', 'pi_1GIBOsHEx14I0xscRghSZUfD', 1583144486, '2020-03-02 10:39:07', '2020-03-02 10:39:07', 10, 1),
(28, 4, '29.40', 'pi_1GIBtZHEx14I0xscJiasgl0P', 1583146389, '2020-03-02 10:53:10', '2020-03-02 10:53:10', 10, 1),
(29, 4, '29.40', 'pi_1GIBzgHEx14I0xsce9cyGn2f', 1583146768, '2020-03-02 10:53:34', '2020-03-02 10:53:34', 10, 1),
(31, 1, '6.33', 'pi_1GIBzgHEx14I0xsce9cyGn2f', 1583146768, '2020-03-02 10:59:28', '2020-03-02 10:59:28', 8, 1),
(32, 1, '18.00', 'pi_1GIBzgHEx14I0xsce9cyGn2f', 1583146768, '2020-03-02 10:59:28', '2020-03-02 10:59:28', 5, 1);

-- --------------------------------------------------------

--
-- Structure de la table `pdt_orderprovider`
--

CREATE TABLE `pdt_orderprovider` (
  `id` int(11) NOT NULL,
  `qty` int(11) NOT NULL,
  `orderNum` int(11) NOT NULL,
  `buyPrice` decimal(5,2) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `pdtProviderId` int(11) DEFAULT NULL,
  `pdtReferenceId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `pdt_orderprovider`
--

INSERT INTO `pdt_orderprovider` (`id`, `qty`, `orderNum`, `buyPrice`, `createdAt`, `updatedAt`, `pdtProviderId`, `pdtReferenceId`) VALUES
(1, 150, 1, '6.55', '2020-03-04 00:00:00', '2020-03-04 00:00:00', 1, 13),
(2, 118, 2, '7.72', '2020-03-04 00:00:00', '2020-03-04 00:00:00', 2, 16),
(3, 218, 3, '14.58', '2020-03-04 00:00:00', '2020-03-04 00:00:00', 3, 19),
(4, 148, 4, '25.36', '2020-03-04 00:00:00', '2020-03-04 00:00:00', 2, 10),
(5, 123, 2, '258.00', '2020-03-05 00:00:00', '2020-03-05 00:00:00', 2, 11),
(6, 48, 5, '169.92', '2020-03-12 12:39:57', '2020-03-12 12:39:57', 1, 15),
(7, 1, 5, '4.31', '2020-03-12 12:39:57', '2020-03-12 12:39:57', 2, 12),
(8, 1, 5, '4.92', '2020-03-12 12:39:57', '2020-03-12 12:39:57', 2, 9),
(18, 48, 6, '169.92', '2020-03-12 12:56:52', '2020-03-12 12:56:52', 1, 15),
(21, 1, 6, '4.31', '2020-03-12 12:56:52', '2020-03-12 12:56:52', 2, 12),
(23, 1, 6, '4.92', '2020-03-12 12:56:52', '2020-03-12 12:56:52', 2, 9),
(25, 48, 7, '169.92', '2020-03-12 12:57:39', '2020-03-12 12:57:39', 1, 15),
(27, 1, 7, '4.31', '2020-03-12 12:57:39', '2020-03-12 12:57:39', 2, 12),
(29, 1, 7, '4.92', '2020-03-12 12:57:39', '2020-03-12 12:57:39', 2, 9),
(30, 48, 8, '169.92', '2020-03-12 13:00:27', '2020-03-12 13:00:27', 1, 15),
(31, 1, 8, '4.31', '2020-03-12 13:00:27', '2020-03-12 13:00:27', 2, 12),
(32, 1, 8, '4.92', '2020-03-12 13:00:27', '2020-03-12 13:00:27', 2, 9),
(33, 48, 9, '169.92', '2020-03-12 13:19:08', '2020-03-12 13:19:08', 1, 15),
(34, 1, 9, '4.31', '2020-03-12 13:19:08', '2020-03-12 13:19:08', 2, 12),
(35, 1, 9, '4.92', '2020-03-12 13:19:08', '2020-03-12 13:19:08', 2, 9),
(36, 48, 10, '169.92', '2020-03-12 13:25:39', '2020-03-12 13:25:39', 1, 15),
(37, 1, 10, '4.31', '2020-03-12 13:25:39', '2020-03-12 13:25:39', 2, 12),
(38, 1, 10, '4.92', '2020-03-12 13:25:39', '2020-03-12 13:25:39', 2, 9),
(39, 12, 11, '60.00', '2020-03-12 13:30:24', '2020-03-12 13:30:24', 3, 18),
(40, 48, 12, '169.92', '2020-03-12 13:30:44', '2020-03-12 13:30:44', 1, 15),
(41, 1, 12, '4.31', '2020-03-12 13:30:44', '2020-03-12 13:30:44', 2, 12),
(42, 1, 12, '4.92', '2020-03-12 13:30:44', '2020-03-12 13:30:44', 2, 9),
(43, 48, 13, '169.92', '2020-03-12 16:19:52', '2020-03-12 16:19:52', 1, 15),
(44, 1, 13, '4.31', '2020-03-12 16:19:52', '2020-03-12 16:19:52', 2, 12),
(45, 1, 13, '4.92', '2020-03-12 16:19:52', '2020-03-12 16:19:52', 2, 9),
(46, 48, 14, '169.92', '2020-03-12 16:26:36', '2020-03-12 16:26:36', 1, 15),
(47, 1, 14, '4.31', '2020-03-12 16:26:36', '2020-03-12 16:26:36', 2, 12),
(48, 1, 14, '4.92', '2020-03-12 16:26:36', '2020-03-12 16:26:36', 2, 9),
(49, 48, 15, '169.92', '2020-03-12 16:42:08', '2020-03-12 16:42:08', 1, 15),
(50, 1, 15, '4.31', '2020-03-12 16:42:08', '2020-03-12 16:42:08', 2, 12),
(51, 1, 15, '4.92', '2020-03-12 16:42:08', '2020-03-12 16:42:08', 2, 9),
(52, 48, 16, '224.64', '2020-03-12 16:43:00', '2020-03-12 16:43:00', 2, 11),
(53, 1, 16, '4.31', '2020-03-12 16:43:00', '2020-03-12 16:43:00', 2, 12),
(54, 1, 16, '4.92', '2020-03-12 16:43:00', '2020-03-12 16:43:00', 2, 9),
(55, 4, 17, '20.00', '2020-03-18 16:06:51', '2020-03-18 16:06:51', 3, 18),
(56, 4, 17, '20.00', '2020-03-18 16:06:51', '2020-03-18 16:06:51', 3, 18),
(57, 4, 17, '20.00', '2020-03-18 16:06:51', '2020-03-18 16:06:51', 3, 18),
(58, 12, 19, '60.00', '2020-03-18 17:37:12', '2020-03-18 17:37:12', 3, 18),
(59, 12, 20, '60.00', '2020-03-18 17:44:21', '2020-03-18 17:44:21', 3, 18),
(60, 12, 21, '60.00', '2020-03-18 17:45:03', '2020-03-18 17:45:03', 3, 18),
(61, 12, 22, '60.00', '2020-03-18 17:46:42', '2020-03-18 17:46:42', 3, 18),
(62, 12, 23, '60.00', '2020-03-18 17:46:53', '2020-03-18 17:46:53', 3, 18),
(63, 12, 24, '60.00', '2020-03-18 17:50:44', '2020-03-18 17:50:44', 3, 18),
(64, 12, 25, '60.00', '2020-03-18 17:51:47', '2020-03-18 17:51:47', 3, 18),
(65, 12, 26, '60.00', '2020-03-18 17:52:54', '2020-03-18 17:52:54', 3, 18),
(66, 12, 27, '60.00', '2020-03-18 17:53:48', '2020-03-18 17:53:48', 3, 18),
(67, 12, 28, '60.00', '2020-03-19 09:19:26', '2020-03-19 09:19:26', 3, 18),
(68, 48, 29, '169.92', '2020-03-19 09:19:47', '2020-03-19 09:19:47', 1, 15),
(69, 1, 29, '4.31', '2020-03-19 09:19:47', '2020-03-19 09:19:47', 2, 12),
(70, 1, 29, '4.92', '2020-03-19 09:19:47', '2020-03-19 09:19:47', 2, 9),
(71, 12, 30, '60.00', '2020-03-19 09:19:55', '2020-03-19 09:19:55', 3, 18),
(72, 12, 31, '60.00', '2020-03-19 09:21:24', '2020-03-19 09:21:24', 3, 18),
(73, 12, 32, '60.00', '2020-03-19 09:21:39', '2020-03-19 09:21:39', 3, 18);

-- --------------------------------------------------------

--
-- Structure de la table `pdt_product`
--

CREATE TABLE `pdt_product` (
  `id` int(11) NOT NULL,
  `description` varchar(500) DEFAULT NULL COMMENT 'info: Sans taritement, ...',
  `sharedReference` varchar(50) NOT NULL,
  `display` tinyint(4) NOT NULL,
  `pdtDistanceId` int(11) NOT NULL COMMENT 'distance id: bio, 0km, ...',
  `pdtVarietyId` int(11) NOT NULL COMMENT 'varieté id: Agata',
  `pdtCategoryId` int(11) NOT NULL COMMENT 'categorie id: 1',
  `pdtWeightUnityId` int(11) NOT NULL COMMENT 'unité poids kg pice ...',
  `pdtCountryId` int(11) NOT NULL COMMENT 'country: France',
  `spotlight` tinyint(4) NOT NULL DEFAULT 0,
  `favouriteRefId` int(4) DEFAULT NULL,
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `pdt_product`
--

INSERT INTO `pdt_product` (`id`, `description`, `sharedReference`, `display`, `pdtDistanceId`, `pdtVarietyId`, `pdtCategoryId`, `pdtWeightUnityId`, `pdtCountryId`, `spotlight`, `favouriteRefId`, `createdAt`, `updatedAt`) VALUES
(5, 'ail blanc vrac test', 'Ail_Blan_3_1_1_Fra', 0, 2, 7, 3, 1, 1, 1, 9, '2020-02-25', '2020-02-28'),
(6, 'Lot de 3 têtes d\'ails', 'Ail_Blan_3_4_1_Fra', 1, 1, 7, 3, 4, 1, 0, 10, '2020-02-25', '2020-02-27'),
(7, 'ail violet brossé en vrac', 'Ail_Viol_3_1_2_Esp', 0, 2, 6, 3, 1, 2, 0, 15, '2020-02-25', '2020-02-25'),
(8, 'Ail noir en pot 200g', 'Ail_Noir_3_4_3_Esp', 0, 3, 14, 3, 4, 2, 0, 12, '2020-02-25', '2020-02-25'),
(9, 'abricot en vrac calibre extra !', 'Abri_Berg_1_1_1_FRA', 0, 1, 8, 1, 1, 1, 0, 17, '2020-02-26', '2020-02-28'),
(10, 'Abricot kulteur !', 'Abri_Earl_2_1_1_FRA', 0, 1, 9, 2, 1, 1, 0, 18, '2020-02-28', '2020-02-28'),
(11, 'abricot royal du sud de la france', 'Abri_Roya_2_3_1_FRA', 0, 1, 10, 2, 3, 1, 0, 20, '2020-02-28', '2020-02-28'),
(12, 'Superbe abricot du nord', 'Abri_Tomc_3_1_1_FRA', 0, 1, 11, 3, 1, 1, 0, 19, '2020-02-28', '2020-02-28'),
(13, 'tututtu', 'Aire_bleu_3_4_2_Fra', 1, 2, 50, 3, 4, 1, 1, 21, '2020-03-02', '2020-03-02'),
(14, 'kulteur', 'Anan_jaun_2_1_1_FRA', 0, 1, 16, 2, 1, 1, 1, 23, '2020-03-02', '2020-03-02');

-- --------------------------------------------------------

--
-- Structure de la table `pdt_provider`
--

CREATE TABLE `pdt_provider` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `adress` varchar(250) NOT NULL,
  `code` varchar(10) NOT NULL,
  `isSite` tinyint(4) NOT NULL,
  `pdtSiteGroupingId` int(11) DEFAULT NULL,
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `pdt_provider`
--

INSERT INTO `pdt_provider` (`id`, `name`, `adress`, `code`, `isSite`, `pdtSiteGroupingId`, `createdAt`, `updatedAt`) VALUES
(1, 'sarl les champs de listrac', '', 'chamLis', 0, 1, NULL, NULL),
(2, 'Pronadis', '', 'pronadi', 0, 1, NULL, NULL),
(3, 'Happy', '163 cours du General De Gaule', 'happy', 1, 1, '2020-02-27', '2020-02-27'),
(4, 'Covid-19', 'Monde entier', '', 1, 2, '2020-03-19', '2020-03-19');

-- --------------------------------------------------------

--
-- Structure de la table `pdt_references`
--

CREATE TABLE `pdt_references` (
  `id` int(11) NOT NULL,
  `kanopeeReference` varchar(255) NOT NULL,
  `providerReference` varchar(255) NOT NULL,
  `infoRef` varchar(500) DEFAULT NULL,
  `package` int(3) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `pdtProviderId` int(11) DEFAULT NULL,
  `pdtProductId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `pdt_references`
--

INSERT INTO `pdt_references` (`id`, `kanopeeReference`, `providerReference`, `infoRef`, `package`, `createdAt`, `updatedAt`, `pdtProviderId`, `pdtProductId`) VALUES
(9, 'Ail_Blan_3_1_1_Fra_pronadi', 'LEG176', 'AIL BLANC  SEC CAL 40/60/80, FRANCE, le KG', 5, '2020-02-25 12:31:36', '2020-02-25 12:31:36', 2, 5),
(10, 'Ail_Blan_3_4_1_Fra_pronadi', 'LEG895', 'AIL BLANC FILET DE 3 GROSSES TETE 50/70 X 20 UNITéS, LA PIECE', 20, '2020-02-25 12:32:06', '2020-02-25 12:32:06', 2, 6),
(11, 'Ail_Viol_3_1_2_Esp_pronadi', 'LEG445', 'AIL BLANC/VIOLET BROSSé SEC, CAL 40/60+, ESPAGNE, LE KG', 5, '2020-02-25 12:32:32', '2020-02-25 12:32:32', 2, 7),
(12, 'Ail_Noir_3_4_3_Esp_pronadi', 'LEG598', 'AIL NOIR ESPAGNE, LE POT', 1, '2020-02-25 12:32:59', '2020-02-25 12:32:59', 2, 8),
(13, 'Ail_Blan_3_1_1_Fra_chamLis', 'LEG617', 'AIL BLANC  SEC CAL 40/60/80, FRANCE, le KG', 5, '2020-02-25 12:39:59', '2020-02-25 12:39:59', 1, 5),
(14, 'Ail_Blan_3_4_1_Fra_chamLis', 'LEG059', 'AIL BLANC FILET DE 3 GROSSES TETE 50/70 X 20 UNITéS, LA PIECE', 20, '2020-02-25 12:39:59', '2020-02-25 12:39:59', 1, 6),
(15, 'Ail_Viol_3_1_2_Esp_chamLis', 'LEG544', 'AIL BLANC/VIOLET BROSSé SEC, CAL 40/60+, ESPAGNE, LE KG', 5, '2020-02-25 12:39:59', '2020-02-25 12:39:59', 1, 7),
(16, 'Ail_Noir_3_4_3_Esp_chamLis', 'LEG058', 'AIL NOIR ESPAGNE, LE POT', 1, '2020-02-25 12:39:59', '2020-02-25 12:39:59', 1, 8),
(17, 'Abri_Berg_1_1_1_FRA', 'abri-15', 'abricot vrac par lot de 15 kg', 15, '2020-02-28 09:10:00', '2020-02-28 09:10:00', 3, 9),
(18, 'Abri_Earl_2_1_1_FRA_happy', 'abri-16', 'nouveau lot de 18kg', 18, '2020-02-28 13:36:08', '2020-02-28 13:36:08', 3, 10),
(19, 'Abri_Tomc_3_1_1_FRA_happy', 'abri-14', 'lot de 22kg', 22, '2020-02-28 14:06:53', '2020-02-28 14:06:53', 3, 12),
(20, 'Abri_Roya_2_3_1_FRA_happy', 'abri-12', 'super abricot bien mûri', 12, '2020-02-28 14:55:50', '2020-02-28 14:55:50', 3, 11),
(21, 'Aire_bleu_3_4_2_Fra_pronadi', 'LEG570', 'ALGUE ALIMENTAIRE FRAICHE PANACHE 12*100GR, les 100gr', 12, '2020-03-02 14:26:45', '2020-03-02 14:26:45', 2, 13),
(22, 'Abri_Roya_2_3_1_FRA_pronadi', 'LEG027', 'AILLET BOTTE FRANCE, LA PIECE', 12, '2020-03-02 14:26:56', '2020-03-02 14:26:56', 2, 11),
(23, 'Anan_jaun_2_1_1_FRA_happy', '', 'kulteur', 5, '2020-03-02 14:45:21', '2020-03-02 14:45:21', 3, 14);

-- --------------------------------------------------------

--
-- Structure de la table `pdt_sellhistory`
--

CREATE TABLE `pdt_sellhistory` (
  `id` int(11) NOT NULL,
  `sellPrice` decimal(4,2) NOT NULL,
  `ratio` decimal(4,2) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `pdtProductId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `pdt_sellhistory`
--

INSERT INTO `pdt_sellhistory` (`id`, `sellPrice`, `ratio`, `createdAt`, `updatedAt`, `pdtProductId`) VALUES
(1, '18.00', '41.00', '2020-02-27 13:09:55', '2020-02-27 13:09:55', 5),
(2, '32.00', '67.00', '2020-02-27 13:11:57', '2020-02-27 13:11:57', 5),
(3, '18.00', '66.00', '2020-02-27 13:20:33', '2020-02-27 13:20:33', 5),
(4, '17.00', '35.00', '2020-02-27 13:21:59', '2020-02-27 13:21:59', 5),
(5, '22.00', '51.00', '2020-02-27 13:26:44', '2020-02-27 13:26:44', 5),
(6, '6.33', '50.00', '2020-02-27 13:30:50', '2020-02-27 13:30:50', 8),
(7, '6.55', '28.55', '2020-02-27 13:31:47', '2020-02-27 13:31:47', 7),
(8, '18.00', '20.00', '2020-02-28 09:47:35', '2020-02-28 09:47:35', 9),
(9, '19.00', '21.05', '2020-02-28 09:53:01', '2020-02-28 09:53:01', 9),
(10, '15.00', '26.80', '2020-02-28 12:44:53', '2020-02-28 12:44:53', 5),
(11, '12.00', '8.50', '2020-02-28 12:51:21', '2020-02-28 12:51:21', 5),
(12, '14.00', '21.57', '2020-02-28 12:58:30', '2020-02-28 12:58:30', 5),
(13, '15.00', '26.80', '2020-02-28 13:02:25', '2020-02-28 13:02:25', 5),
(14, '12.00', '8.50', '2020-02-28 13:08:50', '2020-02-28 13:08:50', 5),
(15, '7.35', '31.97', '2020-02-28 13:50:12', '2020-02-28 13:50:12', 10),
(16, '6.33', '50.00', '2020-02-28 15:42:10', '2020-02-28 15:42:10', 8),
(17, '14.78', '38.00', '2020-03-02 14:33:06', '2020-03-02 14:33:06', 5),
(18, '2.74', '35.00', '2020-03-02 14:34:40', '2020-03-02 14:34:40', 13),
(19, '22.61', '33.00', '2020-03-02 14:35:08', '2020-03-02 14:35:08', 9),
(20, '11.00', '10.00', '2020-03-02 14:49:37', '2020-03-02 14:49:37', 14);

-- --------------------------------------------------------

--
-- Structure de la table `pdt_sitegrouping`
--

CREATE TABLE `pdt_sitegrouping` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `opening` datetime NOT NULL,
  `closing` datetime NOT NULL,
  `isOpen` tinyint(1) NOT NULL,
  `isPrivate` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `pdt_sitegrouping`
--

INSERT INTO `pdt_sitegrouping` (`id`, `name`, `opening`, `closing`, `isOpen`, `isPrivate`, `createdAt`, `updatedAt`) VALUES
(1, 'Bordeaux 1', '2020-03-04 00:00:00', '2020-03-10 00:00:00', 1, 1, '2020-03-03 00:00:00', '2020-03-03 00:00:00'),
(2, 'Bordeaux 2', '2020-03-03 00:00:00', '2020-03-10 00:00:00', 1, 0, '2020-03-03 00:00:00', '2020-03-03 00:00:00');

-- --------------------------------------------------------

--
-- Structure de la table `pdt_stocks`
--

CREATE TABLE `pdt_stocks` (
  `id` int(11) NOT NULL,
  `referenceProvider` varchar(255) DEFAULT NULL,
  `qtyExpected` int(11) NOT NULL,
  `qtyReceived` int(11) NOT NULL,
  `buyPrice` decimal(5,2) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `pdtReferenceId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `pdt_stocksactions`
--

CREATE TABLE `pdt_stocksactions` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `pdt_stocksactions`
--

INSERT INTO `pdt_stocksactions` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'coucou', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(2, 'coucou', '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Structure de la table `pdt_type`
--

CREATE TABLE `pdt_type` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `pdt_type`
--

INSERT INTO `pdt_type` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'Fruits', NULL, NULL),
(2, 'Légumes', NULL, NULL),
(3, 'Fruits secs', '2020-01-29', '2020-01-29');

-- --------------------------------------------------------
--
-- Structure de la table `pdt_variety`
--

CREATE TABLE `pdt_variety` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `pdtKindId` int(11) NOT NULL,
  `picture` varchar(500) DEFAULT NULL,
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL,
  `preparationAdvice` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `pdt_variety`
--

INSERT INTO `pdt_variety` (`id`, `name`, `pdtKindId`, `picture`, `createdAt`, `updatedAt`, `preparationAdvice`) VALUES
(1, 'Golden', 45, 'https://www.voieverte.fr/wp-content/uploads/2016/04/VoieVerte_pomme_golden.jpg', NULL, NULL, NULL),
(2, 'Gala', 45, 'https://fridg-front.s3.amazonaws.com/media/products/332.jpg', NULL, NULL, NULL),
(3, 'agata', 96, 'https://toutlemondesyretrouve.fr/img/p/1/9/7/197-large_default.jpg', NULL, NULL, NULL),
(4, 'amandine', 96, 'https://cdn1.fermedesaintemarthe.com/I-Autre-7695_1200x1200-pomme-de-terre-amandine-nt.net.jpg', NULL, NULL, NULL),
(6, 'Violet', 53, 'https://www.monoprix.fr/assets/images/grocery/1687154/580x580.jpg?impolicy=High_Grocery', '2020-01-30', '2020-01-30', NULL),
(7, 'Blanc', 53, 'https://www.lespaniersgaronnais.com/1370-large_default/ail-rose-bio-cal-40-60-200g.jpg', '2020-01-30', '2020-01-30', 'Exemple de conseil'),
(8, 'Bergeron', 3, 'https://www.meillandrichardier.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/8/7/8733-8734-abricotier_bergeron-t1000.jpg', '2020-01-30', '2020-01-31', NULL),
(9, 'Early Blush', 3, 'https://catalogue.starfruits-diffusion.com/wp-content/uploads/2015/03/Early-Blush-2.jpg', '2020-01-30', '2020-01-30', NULL),
(10, 'Royal', 3, 'https://www.cmeilleur.fr/images/catalogue/abricot.jpg', '2020-01-30', '2020-01-30', NULL),
(11, 'Tomcot', 3, 'https://www.cot-international.eu/files/1441115760_MAGIC-COT.jpg', '2020-01-30', '2020-01-30', NULL),
(12, 'Orangered', 3, 'https://www.crosviguier.com/wp-content/uploads/2012/02/Orangered-AMA-002.jpg', '2020-01-30', '2020-01-30', NULL),
(13, 'Jumbocot', 3, 'https://www.gastronomiac.com/wp/wp-content/uploads/2015/12/abricot-jumbocot.jpg', '2020-01-30', '2020-01-30', NULL),
(14, 'Noir', 53, 'https://monpanierdasie.com/918-large_default/ail-noir-4-tetes.jpg', '2020-01-30', '2020-01-30', NULL),
(15, 'noir', 102, 'https://www.afnor.org/wp-content/uploads/2019/10/label_certification_bio.png', '2020-02-18', '2020-02-18', NULL),
(16, 'jaune', 6, 'https://www.afnor.org/wp-content/uploads/2019/10/label_certification_bio.png', '2020-02-18', '2020-02-18', NULL),
(17, 'rouge', 6, 'https://www.afnor.org/wp-content/uploads/2019/10/label_certification_bio.png', '2020-02-18', '2020-02-18', NULL),
(18, 'bleu', 6, 'https://www.afnor.org/wp-content/uploads/2019/10/label_certification_bio.png', '2020-02-18', '2020-02-18', NULL),
(19, 'vert', 6, 'https://www.afnor.org/wp-content/uploads/2019/10/label_certification_bio.png', '2020-02-18', '2020-02-18', NULL),
(20, 'violet', 6, 'https://www.afnor.org/wp-content/uploads/2019/10/label_certification_bio.png', '2020-02-18', '2020-02-18', NULL),
(21, 'brun', 6, 'https://www.afnor.org/wp-content/uploads/2019/10/label_certification_bio.png', '2020-02-18', '2020-02-18', NULL),
(22, 'noir', 6, 'https://www.afnor.org/wp-content/uploads/2019/10/label_certification_bio.png', '2020-02-19', '2020-02-19', NULL),
(23, 'beige', 6, 'https://www.afnor.org/wp-content/uploads/2019/10/label_certification_bio.png', '2020-02-19', '2020-02-19', NULL),
(24, 'rainbow', 6, 'https://www.afnor.org/wp-content/uploads/2019/10/label_certification_bio.png', '2020-02-19', '2020-02-19', NULL),
(25, 'rose', 6, 'https://www.afnor.org/wp-content/uploads/2019/10/label_certification_bio.png', '2020-02-19', '2020-02-19', NULL),
(26, 'green', 6, 'https://www.afnor.org/wp-content/uploads/2019/10/label_certification_bio.png', '2020-02-19', '2020-02-19', NULL),
(27, 'purple', 6, 'https://www.afnor.org/wp-content/uploads/2019/10/label_certification_bio.png', '2020-02-19', '2020-02-19', NULL),
(28, 'blue', 6, 'https://www.afnor.org/wp-content/uploads/2019/10/label_certification_bio.png', '2020-02-19', '2020-02-19', NULL),
(29, 'white', 6, 'https://www.afnor.org/wp-content/uploads/2019/10/label_certification_bio.png', '2020-02-19', '2020-02-19', NULL),
(30, 'rouge', 3, 'https://www.afnor.org/wp-content/uploads/2019/10/label_certification_bio.png', '2020-02-19', '2020-02-19', NULL),
(31, 'verte', 4, 'https://www.afnor.org/wp-content/uploads/2019/10/label_certification_bio.png', '2020-02-19', '2020-02-19', NULL),
(32, 'bleu', 4, 'https://www.afnor.org/wp-content/uploads/2019/10/label_certification_bio.png', '2020-02-19', '2020-02-19', NULL),
(33, 'noir', 4, 'https://www.afnor.org/wp-content/uploads/2019/10/label_certification_bio.png', '2020-02-19', '2020-02-19', NULL),
(34, 'jaune', 4, 'https://www.afnor.org/wp-content/uploads/2019/10/label_certification_bio.png', '2020-02-19', '2020-02-19', NULL),
(35, 'rouige', 4, 'https://www.afnor.org/wp-content/uploads/2019/10/label_certification_bio.png', '2020-02-19', '2020-02-19', NULL),
(36, 'blush', 4, 'https://www.afnor.org/wp-content/uploads/2019/10/label_certification_bio.png', '2020-02-19', '2020-02-19', NULL),
(37, 'chocolate', 6, 'https://www.afnor.org/wp-content/uploads/2019/10/label_certification_bio.png', '2020-02-19', '2020-02-19', NULL),
(38, 'chantilly', 6, 'https://www.afnor.org/wp-content/uploads/2019/10/label_certification_bio.png', '2020-02-19', '2020-02-19', NULL),
(39, 'cerise', 6, 'https://www.afnor.org/wp-content/uploads/2019/10/label_certification_bio.png', '2020-02-19', '2020-02-19', NULL),
(40, 'toto', 6, 'https://www.afnor.org/wp-content/uploads/2019/10/label_certification_bio.png', '2020-02-19', '2020-02-19', NULL),
(41, 'pink', 4, 'https://www.afnor.org/wp-content/uploads/2019/10/label_certification_bio.png', '2020-02-19', '2020-02-19', NULL),
(42, 'dur', 5, 'https://www.afnor.org/wp-content/uploads/2019/10/label_certification_bio.png', '2020-02-19', '2020-02-19', NULL),
(43, 'bleu', 54, 'https://www.afnor.org/wp-content/uploads/2019/10/label_certification_bio.png', '2020-02-19', '2020-02-19', NULL),
(44, 'bleu', 5, 'https://www.afnor.org/wp-content/uploads/2019/10/label_certification_bio.png', '2020-02-19', '2020-02-19', NULL),
(45, 'hey', 4, 'https://www.afnor.org/wp-content/uploads/2019/10/label_certification_bio.png', '2020-02-20', '2020-02-20', NULL),
(46, 'tetetete', 3, 'https://www.afnor.org/wp-content/uploads/2019/10/label_certification_bio.png', '2020-02-20', '2020-02-20', NULL),
(47, 'jjjjjj', 5, 'https://www.afnor.org/wp-content/uploads/2019/10/label_certification_bio.png', '2020-02-20', '2020-02-20', NULL),
(48, 'lavée', 61, 'https://lh3.googleusercontent.com/proxy/284VpahefHHrFkeXiMfvzS0f8wQpdkuY4WHD8HJlIEo1Uh9TmzT-Npj022ztmU5ZJaVQnkQs3G9kFZp13-VvYlpLC-8yNq4udHM5Tvpwd_9l0JdNDLkvyz7IKt87-Au15JZLZK0COuhUCoMbkRmL_Q', '2020-02-21', '2020-02-21', NULL),
(49, 'oioi', 55, 'https://www.afnor.org/wp-content/uploads/2019/10/label_certification_bio.png', '2020-02-21', '2020-02-21', NULL),
(50, 'bleu', 4, 'https://www.afnor.org/wp-content/uploads/2019/10/label_certification_bio.png', '2020-03-02', '2020-03-02', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `pdt_weight_unity`
--

CREATE TABLE `pdt_weight_unity` (
  `id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL COMMENT 'unité: les 500g, la botte, ...',
  `providerName` varchar(50) NOT NULL,
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `pdt_weight_unity`
--

INSERT INTO `pdt_weight_unity` (`id`, `name`, `providerName`, `createdAt`, `updatedAt`) VALUES
(1, 'KG', 'KG', NULL, '2020-01-29'),
(2, 'Pièce', 'Pc', NULL, NULL),
(3, 'Les 100g', '/100g', '2020-01-29', '2020-01-29'),
(4, 'L\'unité', 'U', '2020-02-18', '2020-02-18');

-- --------------------------------------------------------

--
-- Structure de la table `response`
--

CREATE TABLE `response` (
  `id` int(11) NOT NULL,
  `content` varchar(255) NOT NULL,
  `messageId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `imgUrl` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `response`
--

INSERT INTO `response` (`id`, `content`, `messageId`, `userId`, `imgUrl`, `createdAt`, `updatedAt`) VALUES
(1, 'Je veux des cornichons', NULL, NULL, '', '2019-12-17 14:42:47.918176', '2019-12-17 14:42:48.003284'),
(2, 'Je veux des cornichons', NULL, NULL, '', '2019-12-17 14:42:47.918176', '2019-12-17 14:42:48.003284'),
(3, 'Je veux des cornichons', NULL, NULL, '', '2019-12-17 14:42:47.918176', '2019-12-17 14:42:48.003284'),
(4, 'Je veux des cornichons', NULL, NULL, '', '2019-12-17 14:42:47.918176', '2019-12-17 14:42:48.003284'),
(5, 'Je veux des cornichons', NULL, NULL, '', '2019-12-17 14:42:47.918176', '2019-12-17 14:42:48.003284'),
(6, 'Je veux des cornichons', NULL, NULL, '', '2019-12-17 14:42:47.918176', '2019-12-17 14:42:48.003284');

-- --------------------------------------------------------

--
-- Structure de la table `site`
--

CREATE TABLE `site` (
  `id` int(11) NOT NULL,
  `code` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `postcode` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `site`
--

INSERT INTO `site` (`id`, `code`, `city`, `address`, `name`, `postcode`, `status`) VALUES
(1, '3333344', 'Bordeaux', 'wild code school', 'Bordeaux lac', '33000', ''),
(2, '3333344', 'Bordeaux', '34 rue de la basse-court', 'Floirac', '33000', '');

-- --------------------------------------------------------

--
-- Structure de la table `token`
--

CREATE TABLE `token` (
  `id` int(11) NOT NULL,
  `value` varchar(255) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `expiration` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `token`
--

INSERT INTO `token` (`id`, `value`, `userId`, `expiration`) VALUES
(1, '8e74ef0d5c99487743e85d67', 21, '2020-01-15 10:44:56.530287'),
(2, '191d3d1284bf6793932ba120', 22, '2020-01-15 10:44:56.530287'),
(3, '53bf0b9b35b38a48e9cb8a4f', 26, '2020-01-15 10:44:56.530287');

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `tel` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `siteId` int(11) DEFAULT NULL,
  `role` enum('ghost','user','kulteur','admin') NOT NULL DEFAULT 'ghost',
  `isActive` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id`, `firstName`, `lastName`, `password`, `tel`, `email`, `avatar`, `createdAt`, `siteId`, `role`, `isActive`) VALUES
(4, 'Alexis', 'PLEDEL', 'root', '0600547866', 'alexis.pledel@hotmail.fr', 'image', '2019-10-12 00:00:00.000000', NULL, 'kulteur', 0),
(7, 'fadi', 'rata', 'root', '0661171696', 'fadi.rata@live.fr', 'image', '2019-12-11 10:03:20.760000', NULL, 'kulteur', 0),
(15, 'Jean', 'ValJean', 'secret', '0600005035', 'alexis.pledel@gmail.fr', 'image', '2020-01-15 08:36:20.755449', NULL, 'kulteur', 0),
(21, 'John', 'Doe', '$argon2i$v=19$m=4096,t=3,p=1$Tx8p38ubpczQ+u12Sze0rg$OJMq6yGMm+1yoKWqlY5utTPvUNDs/njJICMJA0d7uFg', '0203040526', 'john@test.com', NULL, '2020-01-09 09:42:29.746545', 1, 'user', 0),
(22, 'Jane', 'Doe', '$argon2i$v=19$m=4096,t=3,p=1$15Mqabb3LRYy0DWDGjUXCw$jqS9TdPXclcfYE5PMwtIooP9+DcrUrSw8j5rzbPJI14', '0203040526', 'letizia.obiglio@gmail.com', NULL, '2020-01-09 09:43:59.347000', 1, 'user', 1),
(25, 'Jane', 'Doe', 'ok', '0203040526', 'fadi.r@gmail.com', NULL, '2020-01-15 09:06:01.530585', NULL, 'user', 0),
(26, 'Simon', 'Moi', '$argon2i$v=19$m=4096,t=3,p=1$jMteHWjT7xuWTZ/jsAHikg$5uYoWaTgIUoRbdJ4xeknmAQORBYkZY7fCAIvAstg8K4', '0600005035', 'simon.moi@gmail.fr', 'image', '2020-01-15 09:15:26.598864', NULL, 'kulteur', 0);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `userId` int(11) NOT NULL,
  `firstname` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `pdtProviderId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`userId`, `firstname`, `lastname`, `email`, `password`, `pdtProviderId`, `createdAt`, `updatedAt`) VALUES
(1, 'toto', 'toto', 'tot', 'o', 'toto', 3, '2020-02-06 00:00:00', '2020-02-06 00:00:00'),
(2, 'tata', 'tata', 'tata', 'tata', 'tata', 4, '2020-02-06 00:00:00', '2020-02-06 00:00:00');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `atelier`
--
ALTER TABLE `atelier`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `userUserId` (`userUserId`),
  ADD KEY `pdtProductId` (`pdtProductId`);

--
-- Index pour la table `event`
--
ALTER TABLE `event`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_01cd2b829e0263917bf570cb672` (`userId`),
  ADD KEY `FK_cd251e5ae161ca0b0f5d4e7b557` (`atelierId`),
  ADD KEY `FK_26628f2bfa10de03fea33f5b78d` (`siteId`);

--
-- Index pour la table `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_446251f8ceb2132af01b68eb593` (`userId`);

--
-- Index pour la table `participation`
--
ALTER TABLE `participation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_8ed09e9b7e0a3a150f9515f254f` (`userId`),
  ADD KEY `FK_834f264f10c81e99c5355c3255f` (`eventId`);

--
-- Index pour la table `pdt_buyhistory`
--
ALTER TABLE `pdt_buyhistory`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `pdt_buyHistory_ibfk_1` (`pdtReferenceId`);

--
-- Index pour la table `pdt_category`
--
ALTER TABLE `pdt_category`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `pdt_country`
--
ALTER TABLE `pdt_country`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `pdt_distance`
--
ALTER TABLE `pdt_distance`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `pdt_histories`
--
ALTER TABLE `pdt_histories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pdtReferenceId` (`pdtReferenceId`);

--
-- Index pour la table `pdt_kind`
--
ALTER TABLE `pdt_kind`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pdtTypeId` (`pdtTypeId`);

--
-- Index pour la table `pdt_kulteurstocks`
--
ALTER TABLE `pdt_kulteurstocks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pdtReferenceId` (`pdtReferenceId`),
  ADD KEY `pdtStocksActionId` (`pdtStocksActionId`);

--
-- Index pour la table `pdt_ordercustomer`
--
ALTER TABLE `pdt_ordercustomer`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `pdtProductId` (`pdtProductId`),
  ADD KEY `userUserId` (`userUserId`);

--
-- Index pour la table `pdt_orderprovider`
--
ALTER TABLE `pdt_orderprovider`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `pdtProviderId` (`pdtProviderId`),
  ADD KEY `pdtReferenceId` (`pdtReferenceId`);

--
-- Index pour la table `pdt_product`
--
ALTER TABLE `pdt_product`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sharedReference` (`sharedReference`),
  ADD KEY `categoryId` (`pdtCategoryId`),
  ADD KEY `weightUnityId` (`pdtWeightUnityId`),
  ADD KEY `varietyId` (`pdtVarietyId`),
  ADD KEY `countryId` (`pdtCountryId`),
  ADD KEY `pdt_product_ibfk_7` (`pdtDistanceId`);

--
-- Index pour la table `pdt_provider`
--
ALTER TABLE `pdt_provider`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pdtSiteGroupingId` (`pdtSiteGroupingId`);

--
-- Index pour la table `pdt_references`
--
ALTER TABLE `pdt_references`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `pdt_references_ibfk_1` (`pdtProviderId`),
  ADD KEY `pdt_references_ibfk_2` (`pdtProductId`);

--
-- Index pour la table `pdt_sellhistory`
--
ALTER TABLE `pdt_sellhistory`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `pdtProductId` (`pdtProductId`);

--
-- Index pour la table `pdt_sitegrouping`
--
ALTER TABLE `pdt_sitegrouping`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Index pour la table `pdt_stocks`
--
ALTER TABLE `pdt_stocks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `pdtReferenceId` (`pdtReferenceId`);

--
-- Index pour la table `pdt_stocksactions`
--
ALTER TABLE `pdt_stocksactions`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `pdt_type`
--
ALTER TABLE `pdt_type`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `pdt_variety`
--
ALTER TABLE `pdt_variety`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pdtKindId` (`pdtKindId`);

--
-- Index pour la table `pdt_weight_unity`
--
ALTER TABLE `pdt_weight_unity`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `response`
--
ALTER TABLE `response`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_55355cff637ed9244fbbfee2b49` (`messageId`),
  ADD KEY `FK_a5386ec7299fc4d00b8735ecd42` (`userId`);

--
-- Index pour la table `site`
--
ALTER TABLE `site`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `token`
--
ALTER TABLE `token`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `REL_94f168faad896c0786646fa3d4` (`userId`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`),
  ADD KEY `FK_ff204932278b8bcb5d75986f851` (`siteId`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`),
  ADD UNIQUE KEY `userId` (`userId`),
  ADD KEY `pdtProviderId` (`pdtProviderId`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `atelier`
--
ALTER TABLE `atelier`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT pour la table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=94;

--
-- AUTO_INCREMENT pour la table `event`
--
ALTER TABLE `event`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT pour la table `message`
--
ALTER TABLE `message`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT pour la table `participation`
--
ALTER TABLE `participation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `pdt_buyhistory`
--
ALTER TABLE `pdt_buyhistory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT pour la table `pdt_category`
--
ALTER TABLE `pdt_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `pdt_country`
--
ALTER TABLE `pdt_country`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `pdt_distance`
--
ALTER TABLE `pdt_distance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `pdt_histories`
--
ALTER TABLE `pdt_histories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `pdt_kind`
--
ALTER TABLE `pdt_kind`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=125;

--
-- AUTO_INCREMENT pour la table `pdt_kulteurstocks`
--
ALTER TABLE `pdt_kulteurstocks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `pdt_ordercustomer`
--
ALTER TABLE `pdt_ordercustomer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT pour la table `pdt_orderprovider`
--
ALTER TABLE `pdt_orderprovider`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT pour la table `pdt_product`
--
ALTER TABLE `pdt_product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `pdt_provider`
--
ALTER TABLE `pdt_provider`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `pdt_references`
--
ALTER TABLE `pdt_references`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT pour la table `pdt_sellhistory`
--
ALTER TABLE `pdt_sellhistory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT pour la table `pdt_sitegrouping`
--
ALTER TABLE `pdt_sitegrouping`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `pdt_stocks`
--
ALTER TABLE `pdt_stocks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `pdt_stocksactions`
--
ALTER TABLE `pdt_stocksactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `pdt_type`
--
ALTER TABLE `pdt_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `pdt_variety`
--
ALTER TABLE `pdt_variety`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT pour la table `pdt_weight_unity`
--
ALTER TABLE `pdt_weight_unity`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `response`
--
ALTER TABLE `response`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `site`
--
ALTER TABLE `site`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `token`
--
ALTER TABLE `token`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`userUserId`) REFERENCES `users` (`userId`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`pdtProductId`) REFERENCES `pdt_product` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `event`
--
ALTER TABLE `event`
  ADD CONSTRAINT `FK_01cd2b829e0263917bf570cb672` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_26628f2bfa10de03fea33f5b78d` FOREIGN KEY (`siteId`) REFERENCES `site` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_cd251e5ae161ca0b0f5d4e7b557` FOREIGN KEY (`atelierId`) REFERENCES `atelier` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Contraintes pour la table `message`
--
ALTER TABLE `message`
  ADD CONSTRAINT `FK_446251f8ceb2132af01b68eb593` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Contraintes pour la table `participation`
--
ALTER TABLE `participation`
  ADD CONSTRAINT `FK_834f264f10c81e99c5355c3255f` FOREIGN KEY (`eventId`) REFERENCES `event` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_8ed09e9b7e0a3a150f9515f254f` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Contraintes pour la table `pdt_buyhistory`
--
ALTER TABLE `pdt_buyhistory`
  ADD CONSTRAINT `pdt_buyHistory_ibfk_1` FOREIGN KEY (`pdtReferenceId`) REFERENCES `pdt_references` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `pdt_histories`
--
ALTER TABLE `pdt_histories`
  ADD CONSTRAINT `pdt_histories_ibfk_1` FOREIGN KEY (`pdtReferenceId`) REFERENCES `pdt_references` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `pdt_kind`
--
ALTER TABLE `pdt_kind`
  ADD CONSTRAINT `pdt_kind_ibfk_1` FOREIGN KEY (`pdtTypeId`) REFERENCES `pdt_type` (`id`);

--
-- Contraintes pour la table `pdt_kulteurstocks`
--
ALTER TABLE `pdt_kulteurstocks`
  ADD CONSTRAINT `pdt_kulteurstocks_ibfk_1` FOREIGN KEY (`pdtReferenceId`) REFERENCES `pdt_references` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `pdt_kulteurstocks_ibfk_2` FOREIGN KEY (`pdtStocksActionId`) REFERENCES `pdt_stocksactions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `pdt_ordercustomer`
--
ALTER TABLE `pdt_ordercustomer`
  ADD CONSTRAINT `pdt_orderCustomer_ibfk_1` FOREIGN KEY (`pdtProductId`) REFERENCES `pdt_product` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `pdt_orderCustomer_ibfk_2` FOREIGN KEY (`userUserId`) REFERENCES `users` (`userId`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `pdt_orderprovider`
--
ALTER TABLE `pdt_orderprovider`
  ADD CONSTRAINT `pdt_orderProvider_ibfk_1` FOREIGN KEY (`pdtProviderId`) REFERENCES `pdt_provider` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `pdt_orderProvider_ibfk_2` FOREIGN KEY (`pdtReferenceId`) REFERENCES `pdt_references` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `pdt_product`
--
ALTER TABLE `pdt_product`
  ADD CONSTRAINT `pdt_product_ibfk_1` FOREIGN KEY (`pdtCategoryId`) REFERENCES `pdt_category` (`id`),
  ADD CONSTRAINT `pdt_product_ibfk_2` FOREIGN KEY (`pdtWeightUnityId`) REFERENCES `pdt_weight_unity` (`id`),
  ADD CONSTRAINT `pdt_product_ibfk_3` FOREIGN KEY (`pdtVarietyId`) REFERENCES `pdt_variety` (`id`),
  ADD CONSTRAINT `pdt_product_ibfk_6` FOREIGN KEY (`pdtCountryId`) REFERENCES `pdt_country` (`id`),
  ADD CONSTRAINT `pdt_product_ibfk_7` FOREIGN KEY (`pdtDistanceId`) REFERENCES `pdt_distance` (`id`);

--
-- Contraintes pour la table `pdt_provider`
--
ALTER TABLE `pdt_provider`
  ADD CONSTRAINT `pdt_provider_ibfk_1` FOREIGN KEY (`pdtSiteGroupingId`) REFERENCES `pdt_sitegrouping` (`id`);

--
-- Contraintes pour la table `pdt_references`
--
ALTER TABLE `pdt_references`
  ADD CONSTRAINT `pdt_references_ibfk_1` FOREIGN KEY (`pdtProviderId`) REFERENCES `pdt_provider` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `pdt_references_ibfk_2` FOREIGN KEY (`pdtProductId`) REFERENCES `pdt_product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `pdt_sellhistory`
--
ALTER TABLE `pdt_sellhistory`
  ADD CONSTRAINT `pdt_sellHistory_ibfk_1` FOREIGN KEY (`pdtProductId`) REFERENCES `pdt_product` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `pdt_stocks`
--
ALTER TABLE `pdt_stocks`
  ADD CONSTRAINT `pdt_stocks_ibfk_1` FOREIGN KEY (`pdtReferenceId`) REFERENCES `pdt_references` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `pdt_variety`
--
ALTER TABLE `pdt_variety`
  ADD CONSTRAINT `pdt_variety_ibfk_1` FOREIGN KEY (`pdtKindId`) REFERENCES `pdt_kind` (`id`);

--
-- Contraintes pour la table `response`
--
ALTER TABLE `response`
  ADD CONSTRAINT `FK_55355cff637ed9244fbbfee2b49` FOREIGN KEY (`messageId`) REFERENCES `message` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_a5386ec7299fc4d00b8735ecd42` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Contraintes pour la table `token`
--
ALTER TABLE `token`
  ADD CONSTRAINT `FK_94f168faad896c0786646fa3d4a` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Contraintes pour la table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `FK_ff204932278b8bcb5d75986f851` FOREIGN KEY (`siteId`) REFERENCES `site` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Contraintes pour la table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`pdtProviderId`) REFERENCES `pdt_provider` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
