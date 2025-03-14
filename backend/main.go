package main

import (
	"api_qeproc/database"
	"api_qeproc/routes"
	"fmt"
)

func main() {
	database.ConnectDB()

	fmt.Println("Iniciando o servidor Rest com Go")
	routes.HandleRequest()
}
