package models

import "gorm.io/gorm"

type Produto struct {
	gorm.Model
	ID        uint   `json:"id"`
	Produto   string `json:"produto"`
	Descricao string `json:"descricao"`
}

var Produtos []Produto
