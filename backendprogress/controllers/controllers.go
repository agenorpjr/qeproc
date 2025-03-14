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

func TodosProdutos(c *gin.Context) {
	var p []models.Produto
	database.DB.Find(&p)
	c.JSON(200, p)
}

func UmProduto(c *gin.Context) {
	id := c.Param("id")
	var p models.Produto
	database.DB.First(&p, id)
	if p.ID == 0 {
		c.JSON(http.StatusNotFound, "Produto não encontrado")
		return
	}
	c.JSON(200, p)
}

func InsertProduto(c *gin.Context) {
	var p models.Produto
	if err := c.ShouldBindJSON(&p); err != nil {
		c.JSON(400, gin.H{
			"erro": err.Error()})
		return
	}
	database.DB.Create(&p)
	c.JSON(http.StatusOK, p)
}

func DeleteProduto(c *gin.Context) {
	id := c.Param("id")
	var p models.Produto
	if err := c.ShouldBindJSON(&p); err != nil {
		c.JSON(400, gin.H{
			"erro": err.Error()})
		return
	}
	database.DB.Delete(&p, id)
}

func EditProduto(c *gin.Context) {
	id := c.Param("id")
	var p models.Produto
	database.DB.First(&p, id)
	if err := c.ShouldBindJSON(&p); err != nil {
		c.JSON(400, gin.H{
			"erro": err.Error()})
		return
	}
	database.DB.Model(&p).UpdateColumns(p)
}

func BuscaProduto(c *gin.Context) {
	prod := c.Param("produto")
	var p models.Produto
	database.DB.Where(&models.Produto{Produto: prod}).First(&p)
	if p.ID == 0 {
		c.JSON(http.StatusNotFound, "Produto não encontrado")
		return
	}
	c.JSON(http.StatusOK, p)

}
