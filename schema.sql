CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE Products(
  itemId INT NOT NULL AUTO_INCREMENT,
  productName VARCHAR(45) NOT NULL,
  departmentName VARCHAR(45) NOT NULL,
  price DECIMAL(10, 4) NOT NULL,
  stockQuantity INT(10) NOT NULL,
  PRIMARY KEY (itemId));

INSERT INTO Products (productName,departmentName,price,stockQuantity) VALUES ('Light bulbs','Home Improvement',9.99,50);
INSERT INTO Products (productName,departmentName,price,stockQuantity) VALUES ('Computer Speakers','Electronics',99.99,20);
INSERT INTO Products (productName,departmentName,price,stockQuantity) VALUES ('Air Jordan 1','Shoes',349.99,70);
INSERT INTO Products (productName,departmentName,price,stockQuantity) VALUES ('Coca-Cola 12 pack','Grocery',4.50,200);
INSERT INTO Products (productName,departmentName,price,stockQuantity) VALUES ('iPad','Electronics',799.00,15);
INSERT INTO Products (productName,departmentName,price,stockQuantity) VALUES ('Candy','Grocery',0.99,100);
INSERT INTO Products (productName,departmentName,price,stockQuantity) VALUES ('White T-Shirt','Apparel',4.99,300);
INSERT INTO Products (productName,departmentName,price,stockQuantity) VALUES ('Socks 3 pack','Apparel',9.99,65);
INSERT INTO Products (productName,departmentName,price,stockQuantity) VALUES ('Cards Against Humanity','Games',25.00,10);
INSERT INTO Products (productName,departmentName,price,stockQuantity) VALUES ('The Girl on the Train','Books',9.99,1000);
