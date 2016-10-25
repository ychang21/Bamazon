var mysql = require('mysql');
var inquirer = require('inquirer');
var productList = [];
//establishing connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username
    password: "", //Your password
    database: "bamazon_DB"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Welcome customer: " + connection.threadId);
    console.log("This is our available products")
    list();
})

//displaying all items in a table form
function list(){
    connection.query('SELECT * FROM Products', function(err, result) {
        for (var i = 0; i<result.length; i++) {
            console.log("\n" + "Item ID: " + result[i].itemId + " | Product Name: " + result[i].productName + " | Department Name: " + result[i].departmentName + " | Price: $" + result[i].price + " | Stock Quantity: " + result[i].stockQuantity);
            productList.push(result[i]);
            console.log("----------------------------------------------------------------------------------------------------------------");
        }
        whichProduct();
    })
};

//selecting item and how many of the item
function whichProduct() {
    inquirer.prompt([{
        name: "item",
        type: "input",
        message: "Which item are you interested in purchasing(Use Item Id number)?",
        validate: function(value) {
            if ((isNaN(value) == false) && (0 < parseInt(value) <= productList.length)) {
                return true;
            } else {
                return false;
            }
            }
        }, {
            name: "quantity",
            type: "input",
            message: "How many would you like to order?",
            validate: function(value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    ]).then(function(answer) {
        var item = parseInt(answer.item);
        var amount = parseInt(answer.quantity);
        var cost = (productList[item - 1].price * amount);
        if(productList[item - 1].stockQuantity < amount) {
            console.log("Insufficient Quantity! Please try again.");
            whichProduct();
            // return;
        } else {
            connection.query("UPDATE Products SET ? WHERE ?", [
                {stockQuantity: (productList[item - 1].stockQuantity - amount)}, {itemId: item}], function(err, res){
            if(err) throw err;
            console.log("Your order has been successfully processed.");
            console.log("Your total is $" + (cost.toFixed(2))+ ".");
            productList = [];
            again();
        });
        }
    })

};

//prompts if they would like to continue shopping
function again() {
    inquirer.prompt({
        name: "shop",
        type: "list",
        message: "Would you like to keep shopping?",
        choices: ["Yes", "No"]
    }).then(function(answer){
        if(answer.shop == "Yes"){
            list();
        } else {
            console.log("Please come back soon!");
            connection.end();
        }
    })
};


