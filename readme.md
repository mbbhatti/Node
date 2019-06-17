# About

Node JS based API application.

# Requirements 
- Node  	V11.11.0
- Express 	V4.17.1
- MySql		V5 

# Installation 
Please check you have node installed on your system then download project through this github URL.

- git clone https://github.com/mbbhatti/turing.git

To get all required packages run this command.
- npm install 

# Database and Email Setup
Get database form here https://github.com/zandoan/turing-backend/tree/master/database

- Make database setting in configuration setting file
- Mailtrap used to send email and it's auth(user,pwd) can be updated in mail block of setting file as per your.

# Run project
Use this command on localhost
- npm start/node app.js: it will provide this url http://localhost:5000 url to run application.
- npm test: It will use for test cases and you can uncomments console.log() to check api response for couple of main features.

# Architecture

## Configuration
Contains database, E-mail, auth token and testing configuration files. 

## Controllers
Contains all required application controllers for individual module.

## Models
It has base and individual associated table model for business logics.

## Modules
It has for modules core logics
- Validation file used to check specific module input  
- Handler file has common or general controller purpose methods

## Routes
Define routes for all APIs with respect of controllers

## app.js
Used express framework for request/response, routes and database connection.

# Provide clear backend API documentation 
- Check API detail from API-Documentation.pdf file