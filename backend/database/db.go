package database

import (
	"api_qeproc/models"
	"log"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var (
	DB  *gorm.DB
	err error
)

func ConnectDB() {
	conn := "root:Quant@2025(r)@tcp(127.0.0.1:3306)/qeprocdb?charset=utf8mb4&parseTime=True&loc=Local"
	DB, err = gorm.Open(mysql.Open(conn))
	if err != nil {
		log.Panic("MySql não conectado")
	}
	DB.AutoMigrate(&models.User{})
}
