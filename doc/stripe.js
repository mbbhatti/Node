/**
 * @swagger
 * /stripe/charge:
 *   post:
 *     tags:
 *       - Stripe
 *     summary: Process Stripe charge
 *     description: Process a payment using Stripe and return the Stripe object.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stripeToken:
 *                 type: string
 *                 description: Stripe token for payment
 *               order_id:
 *                 type: integer
 *                 description: ID of the order
 *               description:
 *                 type: string
 *                 description: Description of the charge
 *               amount:
 *                 type: integer
 *                 description: Amount to be charged
 *             required:
 *               - stripeToken
 *               - order_id
 *               - description
 *               - amount
 *     responses:
 *       '200':
 *         description: Stripe charge processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Stripe object
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
