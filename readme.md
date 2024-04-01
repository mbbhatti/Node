# About
Node based API application.

# Requirements 
- Node >= 11.11.0
- Express >= 4.17.1
- MySQL >= 5.* 

# Installation 
Please check you have node installed on your system then download project through this GitHub URL.
- git clone https://github.com/mbbhatti/node.git

To get all required packages run this command.
- npm install 

# Configuration
Get database form migration folder or https://github.com/zandoan/turing-backend/tree/master/database
- npm run copy to create .env file


# Architecture
project_root/
│
├── package.json
├── README.md
├── .gitignore
├── .env
├── config/
│   ├── index.js
│   ├── swagger.js
│   ├── model.js
│   └── database.js
│
├── src/
│   ├── index.js
│   ├── app.js
│   ├── routes/
│   │   ├── index.js
│   │   └── customer.js
│   │   └── order.js
│   │   └── product.js
│   │   └── shoppingCart.js
│   │   └── stripe.js
│   ├── controllers/
│   │   └── customerController.js
│   │   └── orderController.js
│   │   └── productController.js
│   │   └── shoppingCartController.js
│   │   └── stripeController.js
│   ├── models/
│   |   └── baseModel.js
│   |   └── ├── api/
│   │         └── customerModel.js
│   │         └── orderModel.js
│   │         └── productModel.js
│   │         └── shoppingCartModel.js
│   │         └── stripeModel.js
│   ├── utils/
│   │   └── customHelper.js
│   │   └── tokenVerification.js
│   └── ├── handler/
│         └── customerHandler.js
│         └── orderHandler.js
│         └── productHandler.js
│   └── ├── validation/
│         └── customerValidation.js
│         └── orderValidation.js
│         └── productValidation.js
│         └── shoppingCartValidation.js
│         └── striprValidation.js
│
├── tests/
│   ├── unit/
│     └── test-customer.js
│     └── test-order.js
│     └── test-product.js
│     └── test-shoppingCart.js
│     └── test-stripe.js
│
├── migrations/
│   └── database.sql
├── docs/
│     └── customer.js
│     └── order.js
│     └── product.js
│     └── shoppingCart.js
│     └── stripe.js

# Api Documentation 
- http://localhost:5000/docs/

# Run || Test
- npm start OR node app.js to run application.
- npm test for test cases.
- DEBUG=express* node app.js command can also be used to get color detail of application flow in gitbash.
