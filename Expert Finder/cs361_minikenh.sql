-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 30, 2020 at 02:45 AM
-- Server version: 10.4.15-MariaDB-log
-- PHP Version: 7.4.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cs361_minikenh`
--

-- --------------------------------------------------------

--
-- Table structure for table `Experts`
--

CREATE TABLE `Experts` (
  `ExpertID` int(11) NOT NULL,
  `FirstName` varchar(255) NOT NULL,
  `LastName` varchar(255) NOT NULL,
  `ProfileEmail` varchar(255) NOT NULL,
  `ProfilePicture` varchar(255) DEFAULT NULL,
  `About` varchar(2048) DEFAULT NULL,
  `GithubLink` varchar(255) DEFAULT NULL,
  `LinkedInLink` varchar(255) DEFAULT NULL,
  `TwitterLink` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Experts`
--

INSERT INTO `Experts` (`ExpertID`, `FirstName`, `LastName`, `ProfileEmail`, `ProfilePicture`, `About`, `GithubLink`, `LinkedInLink`, `TwitterLink`) VALUES
(1, 'Hillary', 'Miniken', 'minikenh@oregonstate.edu', 'profpic', 'My Name is Hillary, I live in Washington', 'Git', 'LinkedIN', 'Twit'),
(2, 'Connor', 'Lunsford', 'Lunsfordc@oregonstate.edu', 'profpic', 'My Name is Connor', 'Git', 'LinkedIN', 'Twit'),
(3, 'Jacob', 'Schiemenz', 'SchiemenzJ@oregonstate.edu', 'profpic', 'My Name is Jacob', 'Git', 'LinkedIN', 'Twit'),
(4, 'John', 'Knox', 'KnoxJ@oregonstate.edu', 'profpic', 'My Name is John', 'Git', 'LinkedIN', 'Twit'),
(5, 'Jeremy', 'Rowley', 'RowleyJ@oregonstate.edu', 'profpic', 'My Name is Jeremy', 'Git', 'LinkedIN', 'Twit');

-- --------------------------------------------------------

--
-- Table structure for table `ExpertSkills`
--

CREATE TABLE `ExpertSkills` (
  `ExpertSkillsID` int(11) NOT NULL,
  `FK_ExpertID` int(11) NOT NULL,
  `FK_SkillID` int(11) NOT NULL,
  `Experience` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `ExpertSkills`
--

INSERT INTO `ExpertSkills` (`ExpertSkillsID`, `FK_ExpertID`, `FK_SkillID`, `Experience`) VALUES
(1, 1, 1, 3),
(2, 1, 2, 4),
(3, 5, 1, 7),
(4, 5, 3, 1),
(5, 2, 4, 8),
(6, 2, 2, 4),
(7, 4, 1, 3),
(8, 3, 6, 5);

-- --------------------------------------------------------

--
-- Table structure for table `SkillCategory`
--

CREATE TABLE `SkillCategory` (
  `CategoryID` int(11) NOT NULL,
  `CategoryName` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `SkillCategory`
--

INSERT INTO `SkillCategory` (`CategoryID`, `CategoryName`) VALUES
(1, 'Skill'),
(2, 'Industry'),
(3, 'Course');

-- --------------------------------------------------------

--
-- Table structure for table `Skills`
--

CREATE TABLE `Skills` (
  `SkillID` int(11) NOT NULL,
  `SkillName` varchar(255) NOT NULL,
  `FK_CategoryID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Skills`
--

INSERT INTO `Skills` (`SkillID`, `SkillName`, `FK_CategoryID`) VALUES
(1, 'C++', 1),
(2, 'Javascript', 1),
(3, 'NodeJS', 1),
(4, 'CS325', 3),
(5, 'Font End Development', 2),
(6, 'Systems Engineer', 2),
(7, 'CS340', 3);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Experts`
--
ALTER TABLE `Experts`
  ADD PRIMARY KEY (`ExpertID`);

--
-- Indexes for table `ExpertSkills`
--
ALTER TABLE `ExpertSkills`
  ADD PRIMARY KEY (`ExpertSkillsID`),
  ADD KEY `FK_ExpertID` (`FK_ExpertID`),
  ADD KEY `FK_SkillID` (`FK_SkillID`);

--
-- Indexes for table `SkillCategory`
--
ALTER TABLE `SkillCategory`
  ADD PRIMARY KEY (`CategoryID`);

--
-- Indexes for table `Skills`
--
ALTER TABLE `Skills`
  ADD PRIMARY KEY (`SkillID`),
  ADD KEY `FK_CategoryID` (`FK_CategoryID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Experts`
--
ALTER TABLE `Experts`
  MODIFY `ExpertID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `ExpertSkills`
--
ALTER TABLE `ExpertSkills`
  MODIFY `ExpertSkillsID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `SkillCategory`
--
ALTER TABLE `SkillCategory`
  MODIFY `CategoryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Skills`
--
ALTER TABLE `Skills`
  MODIFY `SkillID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ExpertSkills`
--
ALTER TABLE `ExpertSkills`
  ADD CONSTRAINT `ExpertSkills_ibfk_1` FOREIGN KEY (`FK_ExpertID`) REFERENCES `Experts` (`ExpertID`),
  ADD CONSTRAINT `ExpertSkills_ibfk_2` FOREIGN KEY (`FK_SkillID`) REFERENCES `Skills` (`SkillID`);

--
-- Constraints for table `Skills`
--
ALTER TABLE `Skills`
  ADD CONSTRAINT `Skills_ibfk_1` FOREIGN KEY (`FK_CategoryID`) REFERENCES `SkillCategory` (`CategoryID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
