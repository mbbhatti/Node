/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - Customer
 *     summary: Login customer
 *     description: Authenticate customer and return JWT token with expiry time.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email of the customer
 *               password:
 *                 type: string
 *                 description: Password for the customer account
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for the authenticated user
 *                 expiry:
 *                   type: string
 *                   format: date-time
 *                   description: Expiry time of the token
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *
 * /register:
 *   post:
 *     tags:
 *       - Customer
 *     summary: Register customer
 *     description: Register a new customer and return a JWT token along with an expiry time.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email of the customer
 *               name:
 *                 type: string
 *                 description: Name of the customer
 *               password:
 *                 type: string
 *                 description: Password for the customer account
 *             required:
 *               - email
 *               - name
 *               - password
 *     responses:
 *       '200':
 *         description: Successful registration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for the registered user
 *                 expiry:
 *                   type: string
 *                   format: date-time
 *                   description: Expiry time of the token
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *     security: []
 *
 * /customer:
 *   put:
 *     tags:
 *       - Customer
 *     summary: Update customer profile
 *     description: Update customer profile and return updated object.
 *     parameters:
 *       - in: header
 *         name: USER-KEY
 *         schema:
 *           type: string
 *         required: true
 *         description: JWT token for authorization
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the customer
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email of the customer
 *               day_phone:
 *                 type: string
 *                 description: Daytime phone number
 *               eve_phone:
 *                 type: string
 *                 description: Evening phone number
 *               mob_phone:
 *                 type: string
 *                 description: Mobile phone number
 *             required:
 *               - name
 *               - email
 *     responses:
 *       '200':
 *         description: Successful profile update
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 customer_id:
 *                   type: integer
 *                   description: The ID of the customer
 *                 name:
 *                   type: string
 *                   description: Updated name of the customer
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: Updated email of the customer
 *                 credit_card:
 *                   type: string
 *                   description: Credit card number
 *                 address_1:
 *                   type: string
 *                   description: First line of address
 *                 address_2:
 *                   type: string
 *                   description: Second line of address
 *                 city:
 *                   type: string
 *                   description: City
 *                 region:
 *                   type: string
 *                   description: Region
 *                 postal_code:
 *                   type: string
 *                   description: Postal code
 *                 country:
 *                   type: string
 *                   description: Country
 *                 shipping_region_id:
 *                   type: integer
 *                   description: ID of the shipping region
 *                 day_phone:
 *                   type: string
 *                   description: Updated daytime phone number
 *                 eve_phone:
 *                   type: string
 *                   description: Updated evening phone number
 *                 mob_phone:
 *                   type: string
 *                   description: Updated mobile phone number
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *     security:
 *       - APIKeyHeader: []
 *     securityDefinitions:
 *         APIKeyHeader:
 *          type: apiKey
 *          in: header
 *          name: USER-KEY
 *
 * /customer/address:
 *   put:
 *     tags:
 *       - Customer
 *     summary: Update customer address
 *     description: Update customer address and return updated object.
 *     parameters:
 *       - in: header
 *         name: USER-KEY
 *         type: string
 *         required: true
 *         description: JWT token for authorization
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address_1:
 *                 type: string
 *                 description: First line of address
 *               address_2:
 *                 type: string
 *                 description: Second line of address
 *               city:
 *                 type: string
 *                 description: City
 *               region:
 *                 type: string
 *                 description: Region
 *               postal_code:
 *                 type: string
 *                 description: Postal code
 *               country:
 *                 type: string
 *                 description: Country
 *               shipping_region_id:
 *                 type: integer
 *                 description: ID of the shipping region
 *     responses:
 *       '200':
 *         description: Successful address update
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 customer_id:
 *                   type: integer
 *                   description: The ID of the customer
 *                 name:
 *                   type: string
 *                   description: Updated name of the customer
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: Updated email of the customer
 *                 credit_card:
 *                   type: string
 *                   description: Credit card number
 *                 address_1:
 *                   type: string
 *                   description: First line of address
 *                 address_2:
 *                   type: string
 *                   description: Second line of address
 *                 city:
 *                   type: string
 *                   description: City
 *                 region:
 *                   type: string
 *                   description: Region
 *                 postal_code:
 *                   type: string
 *                   description: Postal code
 *                 country:
 *                   type: string
 *                   description: Country
 *                 shipping_region_id:
 *                   type: integer
 *                   description: ID of the shipping region
 *                 day_phone:
 *                   type: string
 *                   description: Updated daytime phone number
 *                 eve_phone:
 *                   type: string
 *                   description: Updated evening phone number
 *                 mob_phone:
 *                   type: string
 *                   description: Updated mobile phone number
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *     security:
 *       - APIKeyHeader: []
 *     securityDefinitions:
 *         APIKeyHeader:
 *          type: apiKey
 *          in: header
 *          name: USER-KEY
 *
 *
 * /customer/creditCard:
 *   put:
 *     tags:
 *       - Customer
 *     summary: Update customer credit card
 *     description: Update customer credit card and return updated object.
 *     parameters:
 *       - in: header
 *         name: USER-KEY
 *         type: string
 *         required: true
 *         description: JWT token for authorization
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               credit_card:
 *                 type: string
 *                 description: Customer's credit card number
 *     responses:
 *       '200':
 *         description: Successful credit card update
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 customer_id:
 *                   type: integer
 *                   description: The ID of the customer
 *                 name:
 *                   type: string
 *                   description: Updated name of the customer
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: Updated email of the customer
 *                 credit_card:
 *                   type: string
 *                   description: Credit card number
 *                 address_1:
 *                   type: string
 *                   description: First line of address
 *                 address_2:
 *                   type: string
 *                   description: Second line of address
 *                 city:
 *                   type: string
 *                   description: City
 *                 region:
 *                   type: string
 *                   description: Region
 *                 postal_code:
 *                   type: string
 *                   description: Postal code
 *                 country:
 *                   type: string
 *                   description: Country
 *                 shipping_region_id:
 *                   type: integer
 *                   description: ID of the shipping region
 *                 day_phone:
 *                   type: string
 *                   description: Updated daytime phone number
 *                 eve_phone:
 *                   type: string
 *                   description: Updated evening phone number
 *                 mob_phone:
 *                   type: string
 *                   description: Updated mobile phone number
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *     security:
 *       - APIKeyHeader: []
 *     securityDefinitions:
 *        APIKeyHeader:
 *          type: apiKey
 *          in: header
 *          name: USER-KEY
 */