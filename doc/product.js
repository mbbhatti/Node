/**
 * @swagger
 * /products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get all products
 *     description: Retrieve a list of all products with optional pagination and description length trimming.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination (default is 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of products per page (default is 20)
 *       - in: query
 *         name: description_length
 *         schema:
 *           type: integer
 *         description: Maximum length of product descriptions (optional)
 *     responses:
 *       '200':
 *         description: List of products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Total number of products
 *                 rows:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
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
 *
 * /products/search:
 *   get:
 *     tags:
 *       - Products
 *     summary: Search products
 *     description: Search for products based on a query string with optional pagination and description length trimming.
 *     parameters:
 *       - in: query
 *         name: query_string
 *         schema:
 *           type: string
 *         required: true
 *         description: Search query string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination (default is 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of products per page (default is 20)
 *       - in: query
 *         name: description_length
 *         schema:
 *           type: integer
 *         description: Maximum length of product descriptions (optional)
 *     responses:
 *       '200':
 *         description: List of products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Total number of products matching the search query
 *                 rows:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
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
 *
 * /products/details/{product_id}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get product details
 *     description: Retrieve details of a product by its ID.
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product to retrieve details for
 *     responses:
 *       '200':
 *         description: Product details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
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
 *
 * /products/inCategory/{category_id}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get products by category
 *     description: Retrieve products belonging to a specific category with optional pagination and description length trimming.
 *     parameters:
 *       - in: path
 *         name: category_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the category to retrieve products for
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination (default is 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of products per page (default is 20)
 *       - in: query
 *         name: description_length
 *         schema:
 *           type: integer
 *         description: Maximum length of product descriptions (optional)
 *     responses:
 *       '200':
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Total number of products in the category
 *                 rows:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
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
 *
 * /products/inDepartment/{department_id}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get products by department
 *     description: Retrieve products belonging to a specific department with optional pagination and description length trimming.
 *     parameters:
 *       - in: path
 *         name: department_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the department to retrieve products for
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination (default is 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of products per page (default is 20)
 *       - in: query
 *         name: description_length
 *         schema:
 *           type: integer
 *         description: Maximum length of product descriptions (optional)
 *     responses:
 *       '200':
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Total number of products in the department
 *                 rows:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
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
 */

