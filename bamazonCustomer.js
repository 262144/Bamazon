var inquirer = require('inquirer');
var mysql = require('mysql');
var Table = require('cli-table')


var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'root',
	database: 'bamazon'
});


connection.connect(function(err){
	if(err) throw err;
	console.log('connected as id ' + connection.threadId);
	start();
});


function start(){
	var table = new Table({
		head: ['Welcome to bamazon stringed instruments! Check out our inventory:'],
		colWidths: [75]
	});
	console.log(table.toString());
	setTimeout(showInventory, 1000);
	setTimeout(askWhatToDo, 2000);
}


function showInventory(){
	connection.query('SELECT * FROM products', function(err, res){
		if(err){
			console.log(err);
		}
		var table = new Table({
			head: ['Item #', 'Product Name', 'Dept', 'Price', 'In Stock'], colWidths: [8, 35, 15, 7, 10]
		});
		for (var i = 0; i < res.length; i++) {	 
			table.push([res[i].item_id, res[i].product_name, res[i].dept_name, '$' + res[i].price, res[i].stock_quantity]);
		}
    console.log(table.toString());
	});
}


function askWhatToDo() {
	inquirer.prompt(
	{
		type: 'list',
		message: '------- What would you like to do? -------',
		choices: ['Place an order.', 'Quit'],
		name: 'choice'
	}).then(function(answer){
		switch(answer.choice){

		case 'Place an order.':
		getItemId();
		break;

		case 'Quit':
		console.log('You chose to quit.  Thanks for visiting bamazon!');
		connection.end();
		break;
		}
	});
}



function getItemId (){
	inquirer.prompt([ 
	{
		type: 'input',
		name: 'id',
		message: 'Enter a product ID or \"cancel\".'
	}
	]).then(function(input){
		if(input.id === 'cancel'){
			askWhatToDo();
		}else {
			var queryStr = 'SELECT item_id, product_name, price, stock_quantity FROM products WHERE ?';
			connection.query(queryStr, {item_id:input.id}, function (err, res){
				if (res.length == 0) {
					console.log('Invalid entry. Try again.');
					setTimeout(getItemId, 1500);
				} else{
					getQuantity(res);
				}
			});
		}
	}); // end of .then function
}



function getQuantity(res){
	inquirer.prompt([{
		type:'input',
		name: 'quantity',
		message: 'Please enter a quantity.'
	}
	]).then(function(input){
		var inStock = res[0].stock_quantity;
		var quantity = input.quantity;
		if(inStock < quantity || isNaN(quantity) || quantity == 0){
			console.log('We have ' + inStock + ' ' + res[0].product_name + '(s) in stock.  \n Please enter a valid quantity.')
			getQuantity(res);
		}else {
			finishPurchase(res, quantity);
		}
	});
}


function finishPurchase(res, quantity){
	var id = res[0].item_id;
	var price = res[0].price;
	var quantityInStock = res[0].stock_quantity;
	quantityInStock -= quantity;
	updateQuantity(quantityInStock, id);
	console.log('The cost of your purchase is $' + quantity*price + '.  Thank you for buying from BAMAZON STRINGS!');
	askWhatToDo();
}

function updateQuantity(quantityInStock, id){
	connection.query('UPDATE bamazon.products SET ? WHERE ?',
		[{ stock_quantity: quantityInStock },
		{ item_id: id }],
		function(err, res) {
			if (err) console.log(err);
	});
}
