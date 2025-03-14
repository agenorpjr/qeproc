package routes

import (
	"api_qeproc/controllers"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/handlers"
)

func HandleRequest() {
	r := gin.Default()
	r.GET("/", controllers.Home)
	r.GET("/api/produtos", controllers.TodosProdutos)
	r.POST("/api/produtos", controllers.InsertProduto)
	r.GET("/api/produtos/:id", controllers.UmProduto)
	r.PUT("/api/produtos/:id", controllers.DeleteProduto)
	r.PATCH("/api/produtos/:id", controllers.EditProduto)
	r.GET("/api/produtos/busca/:produto", controllers.BuscaProduto)
	r.Run(":8888")
	log.Fatal(http.ListenAndServe(":8888", handlers.CORS(handlers.AllowedHeaders([]string{"http://localhost:3000"}))(r)))
}
