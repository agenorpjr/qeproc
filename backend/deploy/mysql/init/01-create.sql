CREATE TABLE qeprocdb.users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    password VARCHAR(100),
    rule VARCHAR(5)
);