var mysql = require('mysql');
var inquirer = require('inquirer');
var productList = [];
var lowList = [];
//establishing connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username
    password: "", //Your password
    database: "bamazon_DB"
})

connection.connect(function(err) {
    if (err) throw err;
    console.log("Welcome back manager: " + connection.threadId);
    manage();
})

function manage() {
	productList = [];
    lowList = [];
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }).then(function(answer) {
        switch(answer.action) {
            case 'View Products for Sale':
                productsView();
            break;
            
            case 'View Low Inventory':
                inventoryView();
            break;
            
            case 'Add to Inventory':
                addToInventory();
            break;
            
            case 'Add New Product':
                addProduct();
            break;
        }
    })
};

//return to main menu
function menu() {
    inquirer.prompt({
        name: "return",
        type: "list",
        message: "Would you like to go back to the main menu?",
        choices: ["Yes", "No"]
    }).then(function(answer) {
        if(answer.return == "Yes") {
            manage();
        } else {
            console.log("You have logged out of the system");
            connection.end();
        }
    })
};

//displaying all items in a table form
function productsView(){
    connection.query('SELECT * FROM Products', function(err, result) {
        for (var i = 0; i<result.length; i++) {
            console.log("Item ID: " + result[i].itemId + " | Product Name: " + result[i].productName + " | Department Name: " + result[i].departmentName + " | price: " + result[i].price + " | Stock Quantity: " + result[i].stockQuantity);
            productList.push(result[i]);
            console.log("---------------------------------------------------------------------------------------------------------------");
        }
    menu();
    })
};

//low inventory < 5
function inventoryView() {
    var query = 'SELECT * FROM Products WHERE stockQuantity < 5';
        connection.query(query, function(err, result) {
            for (var i = 0; i < result.length; i++) {
                console.log("Item ID: " + result[i].itemId + " | Product Name: " + result[i].productName + " | Department Name: " + result[i].departmentName + " | price: " + result[i].price + " | Stock Quantity: " + result[i].stockQuantity);
                console.log("---------------------------------------------------------------------------------------------------------------");
                lowList.push(result[i]);
                }
            if(lowList.length != 0) {
                console.log("This the the list of inventory that is low");
            } else {
                console.log("No low inventory. Check again later");
            }
        menu();
     })
};

//adding to inventory
function addToInventory() {
    console.log("The current inventory list");
    connection.query('SELECT * FROM Products', function(err, result) {
        for (var i = 0; i<result.length; i++) {
            console.log("Item ID: " + result[i].itemId + " | Product Name: " + result[i].productName + " | Department Name: " + result[i].departmentName + " | price: " + result[i].price + " | Stock Quantity: " + result[i].stockQuantity);
            productList.push(result[i]);
            console.log("---------------------------------------------------------------------------------------------------------------");
        }
        inquirer.prompt([{
            name: "low",
            type: "input",
            message: "Which item would you like to add more inventory to (Use Item ID)?",
            validate: function(value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return false;
                }
            }
        }, {
            name: "add",
            type: "input",
            message: "How much inventory would you like to add?",
            validate: function(value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    ]).then(function(answer) {
        var lowInventory = parseInt(answer.low);
        var addingInventory = parseInt(answer.add);
        connection.query("UPDATE Products SET ? WHERE ?", [
                {stockQuantity: (productList[lowInventory - 1].stockQuantity + addingInventory)}, {itemId: lowInventory}], function(err, res){
            if(err) throw err;
            console.log("You have successfully added " + addingInventory + " to " + productList[lowInventory - 1].productName);
            menu();
        });
    })
    })
};

function addProduct() {
    inquirer.prompt([{
        name: "additionName",
        type: "input",
        message: "What is the name of the item you would like to add?"
    }, {
        name: "additionDepartment",
        type: "input",
        message: "Which department will this item be added to?"
    }, {
        name: "additionPrice",
        type: "input",
        message: "What is the price of the item?",
        validate: function(value) {
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
            }
    }, {
        name: "additionStock",
        type: "input",
        message: "How much stock would you like to add?",
        validate: function(value) {
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
            }
    }
    ]).then(function(answer) {
        var name = answer.additionName;
        var department = answer.additionDepartment;
        var priceItem = answer.additionPrice;
        var stock = answer.additionStock;
        connection.query("INSERT INTO Products SET ?", {
            productName: name,
            departmentName: department,
            price: priceItem,
            stockQuantity: stock
        }, function(err, res) {
            if(err) throw err;
            console.log("You have successfully added: " + name + " to department " + department + " with a price of $" + priceItem + " with " + stock + " units");
            menu();
        })
    })
};