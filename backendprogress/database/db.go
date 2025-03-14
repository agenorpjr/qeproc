package database

import (
	"api_qeproc/models"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	DB  *gorm.DB
	err error
)

func ConnectDB() {
	conn := "host=localhost user=root password=root dbname=root port=5432 sslmode=disable"
	DB, err = gorm.Open(postgres.Open(conn))
	if err != nil {
		log.Panic("Postgress não conectado")
	}
	DB.AutoMigrate(&models.Produto{})
}
