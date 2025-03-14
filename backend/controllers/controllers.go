package controllers

import (
	"api_qeproc/database"
	"api_qeproc/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Home(c *gin.Context) {
	c.JSON(200, "Home Page")
}

func UmUser(c *gin.Context) {
	email := c.Param("email")
	var p models.User
	database.DB.Where("email = ?", email).First(&p)
	if p.ID == 0 {
		c.JSON(http.StatusNotFound, "User não encontrado")
		return
	}
	c.JSON(200, p)
}

/* func TodosUsers(c *gin.Context) {
	var p []models.User
	database.DB.Find(&p)
	c.JSON(200, p)
}



func InsertUser(c *gin.Context) {
	var p models.User
	if err := c.ShouldBindJSON(&p); err != nil {
		c.JSON(400, gin.H{
			"erro": err.Error()})
		return
	}
	database.DB.Create(&p)
	c.JSON(http.StatusOK, p)
}

func DeleteUser(c *gin.Context) {
	id := c.Param("id")
	var p models.User
	if err := c.ShouldBindJSON(&p); err != nil {
		c.JSON(400, gin.H{
			"erro": err.Error()})
		return
	}
	database.DB.Delete(&p, id)
}

func EditUser(c *gin.Context) {
	id := c.Param("id")
	var p models.User
	database.DB.First(&p, id)
	if err := c.ShouldBindJSON(&p); err != nil {
		c.JSON(400, gin.H{
			"erro": err.Error()})
		return
	}
	database.DB.Model(&p).UpdateColumns(p)
}

func BuscaUser(c *gin.Context) {
	user := c.Param("user")
	var p models.User
	database.DB.Where(&models.User{Email: user}).First(&p)
	if p.ID == 0 {
		c.JSON(http.StatusNotFound, "User não encontrado")
		return
	}
	c.JSON(http.StatusOK, p)

}
*/
