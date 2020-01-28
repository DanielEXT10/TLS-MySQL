SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- Schema tls
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema tls
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `tls` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `tls`.`tools`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tls`.`tools` (
  `id_tool` INT NOT NULL AUTO_INCREMENT,
  `tool_type` VARCHAR(45) NOT NULL,
  `file_code` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_tool`),
  UNIQUE INDEX `id_tool` (`id_tool` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `tls`.`jobs`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tls`.`jobs` (
  `id_job` INT NOT NULL AUTO_INCREMENT,
  `customer` VARCHAR(45) NOT NULL,
  `tool_serial` VARCHAR(45) NOT NULL,
  `operator` VARCHAR(45) NULL DEFAULT NULL,
  `idtool` INT NOT NULL,
  `created_at` DATETIME NULL DEFAULT NOW(),
  UNIQUE INDEX `id_job` (`id_job` ASC) VISIBLE,
  PRIMARY KEY (`id_job`),
  INDEX `fk_jobs_tools_idx` (`idtool` ASC) VISIBLE,
  CONSTRAINT `idtool`
    FOREIGN KEY (`idtool`)
    REFERENCES `tls`.`tools` (`id_tool`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `tls`.`connections`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tls`.`connections` (
  `id_connection` INT NOT NULL AUTO_INCREMENT,
  `idtool` INT NOT NULL,
  `connection_description` VARCHAR(100) NOT NULL,
  `connection_type` VARCHAR(20) NULL,
  `thread_type` VARCHAR(20) NOT NULL,
  `operation` VARCHAR(20) NOT NULL,
  `target_torque` INT NOT NULL,
  PRIMARY KEY (`id_connection`),
  UNIQUE INDEX `id_connection` (`id_connection` ASC) VISIBLE,
  INDEX `fk_connections_tools1_idx` (`idtool` ASC) VISIBLE,
  CONSTRAINT `idtool`
    FOREIGN KEY (`idtool`)
    REFERENCES `tls`.`tools` (`id_tool`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `mydb`.`job_details`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tls`.`job_details` (
  `iddetail` INT NOT NULL,
  `idjob` INT NOT NULL,
  `idconn` INT NOT NULL,
  `measured_torque` INT NULL,
  `serviced_at` DATETIME NULL DEFAULT NOW(),
  PRIMARY KEY (`iddetail`),
  INDEX `fk_job_details_connections1_idx` (`idconn` ASC) VISIBLE,
  INDEX `fk_job_details_jobs_idx` (`idjob` ASC) VISIBLE,
  CONSTRAINT `idjob`
    FOREIGN KEY (`idjob`)
    REFERENCES `tls`.`jobs` (`id_job`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `idconn`
    FOREIGN KEY (`idconn`)
    REFERENCES `tls`.`connections` (`id_connection`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

USE `tls` ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;