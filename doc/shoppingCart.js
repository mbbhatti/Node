/**
 * @swagger
 * /shoppingcart/generateUniqueId:
 *   get:
 *     tags:
 *       - Shopping Cart
 *     summary: Generate unique cart ID
 *     description: Generate a unique identifier for a shopping cart.
 *     responses:
 *       '200':
 *         description: Unique cart ID generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cart_id:
 *                   type: string
 *                   minLength: 11
 *                   maxLength: 11
 *                   description: Unique identifier for the shopping cart (11 characters)
 *       '500':
 *         description: Internal server error
 *
 * /shoppingcart/add:
 *   post:
 *     tags:
 *       - Shopping Cart
 *     summary: Add product to shopping cart
 *     description: Add a product to the shopping cart and return an array of products in the cart.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cart_id:
 *                 type: integer
 *                 description: ID of the shopping cart
 *               product_id:
 *                 type: integer
 *                 description: ID of the product to add
 *               attributes:
 *                 type: string
 *                 description: Product attributes
 *             required:
 *               - cart_id
 *               - product_id
 *               - attributes
 *     responses:
 *       '200':
 *         description: Product added to shopping cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   item_id:
 *                     type: integer
 *                     description: ID of the item in the cart
 *                   name:
 *                     type: string
 *                     description: Name of the product
 *                   attributes:
 *                     type: string
 *                     description: Attributes of the product
 *                   price:
 *                     type: string
 *                     description: Price of the product
 *                   quantity:
 *                     type: integer
 *                     description: Quantity of the product in the cart
 *                   image:
 *                     type: string
 *                     description: URL of the product image
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
 *
 * /shoppingcart/empty/{cart_id}:
 *   delete:
 *     tags:
 *       - Shopping Cart
 *     summary: Clear shopping cart
 *     description: Clear the items in the shopping cart and return an empty response.
 *     parameters:
 *       - in: path
 *         name: cart_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the shopping cart to clear
 *     responses:
 *       '200':
 *         description: Shopping cart cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Empty response
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
 *
 * /shoppingcart/removeProduct/{item_id}:
 *   delete:
 *     tags:
 *       - Shopping Cart
 *     summary: Clear shopping cart by item id
 *     description: Clear the items in the shopping cart and return an empty response by item id.
 *     parameters:
 *       - in: path
 *         name: item_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the shopping cart item to clear
 *     responses:
 *       '200':
 *         description: Shopping cart removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Empty response
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
 */
