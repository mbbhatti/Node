/**
 * @swagger
 * /order:
 *   post:
 *     tags:
 *       - Order
 *     summary: Create order
 *     description: Create an order and send confirmation email to customer.
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
 *               cart_id:
 *                 type: integer
 *                 description: ID of the cart
 *               shipping_id:
 *                 type: integer
 *                 description: ID of the shipping method
 *               tax_id:
 *                 type: integer
 *                 description: ID of the tax
 *             required:
 *               - cart_id
 *               - shipping_id
 *               - tax_id
 *     responses:
 *       '200':
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order_id:
 *                   type: integer
 *                   description: ID of the created order
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
 * securityDefinitions:
 *   APIKeyHeader:
 *     type: apiKey
 *     in: header
 *     name: USER-KEY
 */
