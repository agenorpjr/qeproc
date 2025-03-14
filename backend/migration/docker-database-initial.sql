create table produtos(
    ID serial primary key,
    produto varchar,
    descricao varchar
);

INSERT INTO produtos(produto, descricao) VALUES ('Notebook', 'Notebook padrão I5, 8GB Ram, SSD 240GB'),('Celular', 'Celular padrão Samsung'),('Cabo Cat6', 'Caixa de cabo cat6 com 250mts');