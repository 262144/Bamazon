# Bamazon

## BamazonCustomer.js

At startup, the application displays a welcome message and the product table, both formatted with the node module 'cli-table'.  An inquirer menu gives the user two options: 1) Place an order or 2) Quit.

![Exampe 1](/images/01.png)

If the user chooses to quit, the SQL connection is closed and the application terminates.  If the user chooses to place an order, the user is asked to enter a product id or "cancel".  If the user chooses to cancel, the start up menu appears (see above).  For any other entry, the application checks that the entry is a valid product id.  If it is not, the user is asked to try again.

![Exampe 2](/images/02.png)

If the user enters a valid product id, the application asks for the quantity to purchase.  If the quantity to purchase is not a number, or if the number is greater than what is in stock, the user is asked to enter a valid quantity.

![Exampe 3](/images/03.png)

If the user enters a valid quantity, the application displays the purchase cost, thanks the user, and displays the startup menu.

![Exampe 4](/images/04.png)

Behind the scenes, the quantity of the item in stock is updated.  In the example, the user purchased five 4/4 violins at $300 apiece.  The initial stock was 38.  Notice that the display shows that the purchase price is $1500.  If we display the table again, we see that the quantity of 4/4 size violins has been updated to 33:

![Exampe 5](/images/05.png)
