# About
Node based API application.

# Requirements 
- Node >= 11.11.0
- Express >= 4.17.1
- MySql >= 5.* 

# Installation 
Please check you have node installed on your system then download project through this github URL.
- git clone https://github.com/mbbhatti/turing.git

To get all required packages run this command.
- npm install 

# Configuration
Get database form here https://github.com/zandoan/turing-backend/tree/master/database
Use this command to create .env file and make setting for email, database, auth token and etc. 
- npm run copy 


# Architecture
- app/Controllers contains all required application controllers for individual module.
- app/Models has base and individual associated table model for business logics.
- app/Modules contains custome modules validation, handler and helper files.
- .env file will contain the database, e-mail, auth token and testing configuration. 
- doc file cantains application documents
- Routes defines endpoints for all APIs with respect of controllers.
- test has all test cases for the main functions of the system.
- app.js used express framework for request/response, routes and database connection.

# Documentation 
- https://github.com/mbbhatti/turing/blob/master/doc/API-Documentation.pdf

# Run || Test
Use this command on localhost
- npm start/node app.js: it will provide a url to run application.
- npm test: It will use for test cases and you can uncomments console.log() to check api response for couple of main features. 
- DEBUG=express* node app.js command can also be used to get color detail of application flow in gitbash. 